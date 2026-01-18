---
title: 2024-10-17 Docker On Macs
slug: 2024/docker-on-macs
tags:
- '2024-10'
- '2024'
- 'docker'
- 'macbook'
- 'lima'
- 'multiarch'
---
Docker has been pushing more and more for Docker Desktop, and most of their documentation is now centered around Docker Desktop. Good for them. We all need bread on the table.<!-- truncate --> They are also very committed to keeping the Docker Engine and CLI open source. Good for us. I think it's a win-win. This post is about setting up Docker on Macs without Docker Desktop. It should integrate as if you are running Docker natively on your Mac and support multi-arch images (still lots of AMD servers out there).

Okay, so let's keep it simple without further blabbering. We are going to use [Lima](https://github.com/lima-vm/lima) to create a Linux VM with Docker and install Docker CLI on the MacBook. The CLI will connect to the Docker daemon running on the Linux VM transparently.

## Instllation
```bash
brew install lima
brew install --formula docker # docker cli
brew install docker-buildx # follow post installation instructions
```

## Create a Lima instance
Use following for the VM template.
```yaml
# ===================================================================== #
# BASIC CONFIGURATION
# ===================================================================== #
images:
  # Try to use release-yyyyMMdd image if available. Note that release-yyyyMMdd will be removed after several months.
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release-20240821/ubuntu-24.04-server-cloudimg-amd64.img"
    arch: "x86_64"
    digest: "sha256:0e25ca6ee9f08ec5d4f9910054b66ae7163c6152e81a3e67689d89bd6e4dfa69"
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release-20240821/ubuntu-24.04-server-cloudimg-arm64.img"
    arch: "aarch64"
    digest: "sha256:5ecac6447be66a164626744a87a27fd4e6c6606dc683e0a233870af63df4276a"
  # Fallback to the latest release image.
  # Hint: run `limactl prune` to invalidate the cache
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-amd64.img"
    arch: "x86_64"
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release/ubuntu-24.04-server-cloudimg-arm64.img"
    arch: "aarch64"
# CPUs
# 🟢 Builtin default: min(4, host CPU cores)
cpus: 4
# Memory size
# 🟢 Builtin default: min("4GiB", half of host memory)
memory: "12GiB"
# Disk size
# 🟢 Builtin default: "100GiB"
disk: "120GiB"
mounts:
  - location: "~/"
    writable: true
# containerd is managed by Docker, not by Lima, so the values are set to false here.
containerd:
  system: false
  user: false
provision:
  - mode: system
    # This script defines the host.docker.internal hostname when hostResolver is disabled.
    # It is also needed for lima 0.8.2 and earlier, which does not support hostResolver.hosts.
    # Names defined in /etc/hosts inside the VM are not resolved inside containers when
    # using the hostResolver; use hostResolver.hosts instead (requires lima 0.8.3 or later).
    script: |
      #!/bin/sh
      sed -i 's/host.lima.internal.*/host.lima.internal host.docker.internal/' /etc/hosts
  - mode: system
    script: |
      #!/bin/bash
      set -eux -o pipefail
      command -v docker >/dev/null 2>&1 && exit 0
      export DEBIAN_FRONTEND=noninteractive
      curl -fsSL https://get.docker.com | sh
      # NOTE: you may remove the lines below, if you prefer to use rootful docker, not rootless
      systemctl disable --now docker
      apt-get install -y uidmap dbus-user-session
  - mode: user
    script: |
      #!/bin/bash
      set -eux -o pipefail
      systemctl --user start dbus
      dockerd-rootless-setuptool.sh install
      docker context use rootless
  # Enable cpu emulation - https://docs.docker.com/build/building/multi-platform/#qemu
  - mode: system
    script: |
      #!/bin/bash
      set -eux -o pipefail
      docker run --privileged --rm tonistiigi/binfmt --install all
probes:
  - script: |
      #!/bin/bash
      set -eux -o pipefail
      if ! timeout 30s bash -c "until command -v docker >/dev/null 2>&1; do sleep 3; done"; then
        echo >&2 "docker is not installed yet"
        exit 1
      fi
      if ! timeout 30s bash -c "until pgrep rootlesskit; do sleep 3; done"; then
        echo >&2 "rootlesskit (used by rootless docker) is not running"
        exit 1
      fi
    hint: See "/var/log/cloud-init-output.log". in the guest
hostResolver:
  # hostResolver.hosts requires lima 0.8.3 or later. Names defined here will also
  # resolve inside containers, and not just inside the VM itself.
  hosts:
    host.docker.internal: host.lima.internal
timezone: Asia/Tokyo
portForwards:
  - guestSocket: "/run/user/{{.UID}}/docker.sock"
    hostSocket: "{{.Dir}}/sock/docker.sock"
message: |
  To run `docker` on the host (assumes docker-cli is installed), run the following commands:
  ------
  sudo /bin/ln -s -f {{.Dir}}/sock/docker.sock /var/run/docker.sock
  docker run hello-world
  ------
  It creates a symlink to the docker socket in the host's filesystem allowing seamless integration with docker commands.
  Optionally, run following command to enable building multi-arch images:
  ------
  docker buildx create --name container-builder --driver docker-container --bootstrap --use
  # then you can build multi-arch images like this:
  docker buildx build --platform linux/amd64,linux/arm64 -t <your-image-name> .
  ------
networks:
  # Lima can manage daemons for networks defined in $LIMA_HOME/_config/networks.yaml
  # automatically. The socket_vmnet binary must be installed into
  # secure locations only alterable by the "root" user.
  - lima: bridged
    # MAC address of the instance; lima will pick one based on the instance name,
    # so DHCP assigned ip addresses should remain constant over instance restarts.
    macAddress: ""
```

A couple of noteworthy things about our template:
- We have a provision script to install Docker in rootless mode. This script comes from the default template provided by Lima for Docker.
- Port forwarding is set to mount the Docker socket inside the VM to the host.
- Steps shown in the message create a soft link. It links the default Docker socket file expected by the Docker clients to the socket file we mounted in the last step. This will help our clients transparently talk to the Docker daemon as if it were running natively on the host without further modifications.
- I'm also using `bridged` networking. `socket_vmnet` should be installed for it to work. Check Lima docs for more info.


Alrighty, let's create the VM using above template. I'm naming the VM `docker`. Assuming you create the template file at `/tmp/lima-docker.yaml`
```bash
limactl create --name docker /tmp/lima-docker.yaml
limactl start docker
```

Follow the instructions printed by the start command to create a soft link for the Docker socket file and set up Docker buildx for multi-arch image building.

## Next steps
1. After running `limactl create`, Lima should have created a `~/.lima/docker/lima.yaml` file. If you need to make any changes to your machine/template, update that file and restart the Lima machine.
2. You should be all set for using Docker. Start using Docker as if it’s running natively.
```bash
docker run --rm hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (arm64v8)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
```

3. (Optional) This setup can build and run images targeted for different platform. For example, M series Macbooks are ARM based (previous command outputted `(arm64v8)`). But you can run and build AMD images as well.

```bash
docker run --rm --platform linux/amd64 hello-world

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
```


## References
- https://docs.docker.com/build/building/multi-platform/
- https://gist.github.com/fuzmish/df9eabf711c3f452ca19cce0621fc84e - gave the idea of using a symlink for the docker socket file
- https://lima-vm.io/docs/config/network/#vmnet-networks - for bridged networking

---
title: Github Actions for the Blog
slug: 2024/github-actions
tags:
- '2024-08'
- '2024'
- 'github action'
hide_table_of_contents: true
---
Thinking about adding github actions to build and deploy this blog instead of running them on a VM on my machine. For some reason<!-- truncate --> I couldn't get myself to install nodejs and npm on my regular workstation. Maybe I should do that as well.

But for the time being I'm going to try my luck with github actions. Just added a github workflow file and pushing this blog file to master should trigger that. So, let get triggering!

So, that worked. But only halfway. The last step `npm run deploy` failed asking for my github username or specifying using ssh key. I was hoping that it would know how to push the changes as it was already running in github action. Let's see if `Claude Opus` can help us figure this out. After multiple back and forth it suggested to use this snippet
```yaml
- name: Deploy
    run: |
    npm run deploy
    working-directory: docusaurus
    env:
    GIT_USER: github-actions
    GIT_PASS: ${{ secrets.GITHUB_TOKEN }}
```
I think it should work. I'm just not confident about the `GIT_USER` part. Should I use my github username there instead? Anyways, let's try pushing and see how it goes.

The action run was succesful but it still didn't deploy, complaining about setting git user email and stuff. So, let's try with

```yaml
- name: Deploy
  run: |
    git config --global user.email "${{ github.actor }}@users.noreply.github.com"
    git config --global user.name "${{ github.actor }}"
    npm run deploy
  working-directory: docusaurus
  env:
    GIT_USER: ${{ github.actor }}
    GIT_PASS: ${{ secrets.GITHUB_TOKEN }}
```

That was it. The blog is "on" now. All I have to do is write and push to master and github will take care of build, deploy and hosting. Good times. You can find the complete and up-to-date code in github workflows of [this repo](https://github.com/nakamorg/nakamorg.github.io). One more thing though, I'm not sure if the caching for node modules is working. Initial runs of `npm ci` took about 10 secs and the latest one with a cache hit took 6 secs - so maybe it's working? Maybe I can try doing `ls node_modules` in the github action and see or maybe there are other better options? But let's do that some other time. It's almost 19:18 and I need to get off working and start my work out.

---
title: 2025-04-29 Manage Kubernetes Resources With Crossplane
slug: 2025/manage-kubernetes-resources-with-crossplane
tags:
- '2025-04'
- '2025'
- 'crossplane'
- 'k8s native resources'
hide_table_of_contents: false
---
I'm serously invested in adopting Crossplane at work. Benefits it brings over existing terraform based infra management are - it's K8s native, infra and applications can be deployed side-by-side, <!-- truncate -->continous reconsilation unlike Terraform which is fire-and-forget unless being wrapped around in some reconsiler (actually most of the Crossplane providers I'm using are Terraform wrappers) and infra can be continiujly deployed using some CD tool like ArgoCD and there won't be issues of configuration/infra drift.

Similar to Terraform, Crossplane has providers for most resource providers (AWS, GCP, K8s etc) and they work pretty well. Though I had a simple use case in mind and this post is about that.

I wanted to create Crossplane ProviderConfigs (which are pure K8s resources) for each team as part of their bootstrapping expecience allowing them to use their own ProviderConfigs for the resources they end up creating using Crossplane - helping with RBAC, accountabiltiy and stuff.

Naturally I wanted to create these ProviderConfigs using Crossplane instead of managing these outside, but the controller managing/using these configs doesn't set the "correct" status conditions on these which Crossplane uses to mark a resurces Synced or Ready. Now, while this wasn't a huge issue, seeing the resources not synced or ready was kind of off-putting - other than that it had no other practical purpse.

```
NAME                           SYNCED   READY   STATUS
System/playground              True     False   Creating: Unready resources: playground
└─ ProviderConfig/playground   -        -
```


## Solutions
### provider-kubernetes
Use Crossplane's `provider-kubernetes` - that would have been an overkill. These `ProviderConfigs` resources are like config-maps, I didn't need any complex machinery to check and update their status. I just needed to make Crossplane happy and show them ready.

### Patch the resource status
Crossplane looks for specific status conditions to mark a resource synced or ready. Specifically it looks for

```
conditions:
- status: "True"
  type: Ready
- status: "True"
  type: Synced
```

(Crossplane provides setting these conditions types dynamically for each composition - but that's for legacy `Resources` mode only, not for the `Pipeline` mode).


So one can update the `ProviderConfig` resources to add these conditions, let's say using
```
kubectl edit providerconfig <name> --subresource=status
```

And crossplane would be happy
```
crossplane beta trace system playground
NAME                           SYNCED   READY   STATUS
System/playground              True     True    Available
└─ ProviderConfig/playground   True        True    Available
```

I'm using `function-kcl` to manage these resources and it supports settings [conditions and events](https://github.com/crossplane-contrib/function-kcl/blob/1063edc461ab692c6d3d87acc5c85475475c4b30/README.md?plain=1#L576) - so that could be used to make it more streamlined.

Looking further down the kcl function docs, there's this (`krm.kcl.dev/ready: "True"`) magic annotation to mark a [resource ready](https://github.com/crossplane-contrib/function-kcl/blob/1063edc461ab692c6d3d87acc5c85475475c4b30/README.md?plain=1#L455). Though with this approach, the function will tell Crossplane the resource is ready, so the trace command will looks like

```
crossplane beta trace system playground
NAME                           SYNCED   READY   STATUS
System/playground              True     True    Available
└─ ProviderConfig/playground   -        -
```

But you still get the top-level resource being synced and ready without making any unnecessary or potentially cnflciting status changes to the providecnfig (or whatever is your case) resource. I like this approach the best
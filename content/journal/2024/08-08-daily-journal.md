---
title: "Daily Journal"
date: 2024-08-08
tags: ["2024-08", "2024"]
toc: false
---
Today has been a rollercoaster of unexpected events. At work, I was working on a proposal to implement a mechanism to prevent normal pods<!--more--> from scheduling to our K8s clusters before all of our critical daemonsets are ready. I drafted the proposal yesterday and presented it today. It went fine as is; it was pretty simple, actually. We decided to use **startupTaints** on our Karpenter node pools for each required daemonset and then made the daemonset responsible for removing the said taint once it becomes ready.

As for personal stuff, I wanted to start a blog where I could write freely (without going into too much detail) about my daily life and routine. I've set up a Docusaurus blog previously. I spent some time checking if mdbook would be a good fit for this daily journal blog. I fired up a test **mdbook** and compared it with the Docusaurus-style blog I had. The Docusaurus style felt good to the eyes (it looked nice), so I decided to stick with Docusaurus and started a second blog on the same Docusaurus instance. If you are reading this, you know how to reach this daily blog. I call it a daily blog, but I might not write daily. As of now, though, I feel pretty motivated to write frequently, maybe a couple of times a week. :grinning:

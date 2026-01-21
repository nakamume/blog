---
title: "Birthday Preparation"
date: 2024-08-09
tags: ["2024-08", "2024", "birthday"]
toc: false
---
Looks like I am on a streak. Third post within two days. There has been a major earthquake<!--more--> in Kyushu. Fortunately, we didn't feel anything in Tokyo, and all the friends and family members are keeping safe.

Tachan's first birthday is approaching, and we are (mostly Maiko) deciding on what cakes to buy and about the decoration items as well. The primary cake has a bluish hue and a brown bear (edible) on it, and the second one is a chocolate cake (again with a brown bear on it). Tachan can't eat chocolate as of now.

Oh well, today I met (online) two colleagues from our US office. We mostly talked about how to bootstrap a system at our company. The bootstrapping structure we have is a mess as of now because we are transitioning from a legacy cluster, and until we move off them, all the changes to the bootstrapping repo need to be fully backward compatible. There were some major changes in how we handle new and legacy clusters, so it has become a major pain to sustain them together, at least for the end users - as the API we provide them for bootstrapping isn't very clean and intuitive.

While deploying this blog to GitHub Pages, I realized that my custom domain settings get overridden on every deploy. I knew Docusaurus deploy only pushes the build content to a specific branch and wasn't updating the repo's GitHub Pages settings. After much fumbling, I found that I needed to add a `CNAME` file with an entry for my custom domain to make it work. For Docusaurus, it could be achieved by creating a file under the `static` folder.

```text title="docusaurus/static/CNAME"
blog.nakam.org
```

And, about the earthquake again, the Meteorological Agency has issued a "huge earthquake warning." This is gonna be a scary big weekend.

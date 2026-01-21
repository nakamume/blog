---
title: "Started a second blog"
date: 2024-08-08
tags: ["2024-08", "2024", "journal", "daily", "multiple blogs", "rss", "custom css"]
draft: false
---
For some time, I wanted to start with a daily blog. Yes, I know I started this blog about four months ago and have only two entries as of now (including this one).<!--more--> Guess I'm mostly into wasting my time finding which blog genertors to use and starting up a blog site but not into writing. Anyways, I wanted a new blog where I could write freely, without going into much details of the things, about my daily life and routine. I've set up a docusaurus blog previously (the one you are currently reading). I spent some time checking if the **mdbook** would be a good fit for this daily journal blog. Fired up a test mdbook book and compared it with docusaurus style blog I had. Docusaurus style felt good to eyes (it looked nice) - so I decided to stick with docusaurus and started a second blog on same docusaurus instance. You can find it at [/journal](/journal) address of this site.

## Detail about the setup
This blog lives at [nakamorg.github.io](https://github.com/nakamorg/nakamorg.github.io) github repo under the top level `blogs` folder. I created a new top level `journal` folder for the secondary blog. Idea is to dump any markdown file in that folder and have it served. To make it work, I updated the plugins section in my config file
```js title="docusaurus.config.ts"
....
....

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'second-blog',
        blogTitle: 'Journal',
        blogDescription: 'Daily journal',
        routeBasePath: 'journal',
        path: '../journal',
        feedOptions: {
          type: ['rss', 'atom'],
          title: 'nakam blog',
          description: 'A daily journal from nakam blog',
          copyright: 'nakam.org',
          createFeedItems: async (params) => {
            const {blogPosts, defaultCreateFeedItems, ...rest} = params;
            return defaultCreateFeedItems({
              // keep only the 10 most recent blog posts in the feed
              blogPosts: blogPosts.filter((item, index) => index < 10),
              ...rest,
            });
          },
        },
      },
    ],
  ],

....
....
```

That was it about adding a second blog. To make it easily accessable, I added another entry to the `navBar`
```js title="docusaurus.config.ts"
  themeConfig: {
    navbar: {
      hideOnScroll: true,
      ....
      items: [
        {
          to: 'journal',
          label: 'Journal',
          position: 'left'
        },
        {
          href: '/rss.xml',
          position: 'right',
          className: 'feed-link',
          'aria-label': 'rss Feed',
        },
        {
          href: 'https://github.com/nakamorg',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    ....
  }
```

If you noticed there are navigation items for feed and github as well, more on them later. Well, that was mostly it. While writing my first journal/daily blog, I realized that it's front-matter follows a pattern. I asked ChatGPT to generate me a bash script to create the blog template. This is what the script looks like

```bash title="daily-blog-creator.sh"
#!/bin/bash
set -eu
# Get the current date in the format yyyymmdd
current_date=$(date +%Y%m%d)

# Define the file name
file_name="journal/${current_date}-daily-journal.md"

# Create the content
content="---
title: $(date +%F) Daily Journal
slug: ${current_date}-daily-journal
authors: [umesh]
tags:
- '$(date +%Y-%m)'
- '$(date +%Y)'
- journal
- daily
hide_table_of_contents: false
---
Today has been a please do something ab<!-- truncate -->out this and those.
"

echo "$content" > "$file_name"
```
Running it would create a blog entry for that day. I used the `YYYY-MM` and `YYYY` tags - to make it easier to filter all the blogs from a particular year or month of the year.

That's the end of it. After all this was done I ran the script and wrote the first daily blog, you can find it at [/journal/2024/daily-journal](/journal/2024/daily-journal).

## Other changes
I took some time today to fix some glaring issues with this blog. Like fixing the favicon and github, rss icons.
### Favicon
Used [favicon-converter](https://favicon.io/favicon-converter/) on my profile image and generated the favicon images and copied those to `static/img` folder. One glaring issue down :relieved:

### Github and Feed icons
This is how the nav bar used to look before
![old nav bar](/images/navbar-20240808.png)
The link for the rss feed of this blog and my github page looked so bad. I looked at how Docusaurus themselves have done it for their site and copied their config. So the navbar config looks like
```js title="docusaurus.config.ts"
....

      items: [
        {
          href: '/rss.xml',
          position: 'right',
          className: 'feed-link',
          'aria-label': 'rss Feed',
        },
        {
          href: 'https://github.com/nakamorg',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],

....
```
corresponding css config
```css title="src/css/custom.css"
....

.header-github-link::before {
  content: '';
  width: 24px;
  height: 24px;
  display: flex;
  background-color: var(--ifm-navbar-link-color);
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/%3E%3C/svg%3E");
  transition: background-color var(--ifm-transition-fast)
    var(--ifm-transition-timing-default);
}

.header-github-link:hover::before {
  background-color: var(--ifm-navbar-link-hover-color);
}

.feed-link::before {
  content: '';
  width: 24px;
  height: 24px;
  display: flex;
  background-color: var(--ifm-navbar-link-color);
  mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M7 18C7 18.5523 6.55228 19 6 19C5.44772 19 5 18.5523 5 18C5 17.4477 5.44772 17 6 17C6.55228 17 7 17.4477 7 18Z' stroke='%23323232' stroke-width='2'%3E%3C/path%3E%3Cpath d='M11 19C11 15.6863 8.31371 13 5 13' stroke='%23323232' stroke-width='2' stroke-linecap='round'%3E%3C/path%3E%3Cpath d='M15 19C15 13.4772 10.5228 9 5 9' stroke='%23323232' stroke-width='2' stroke-linecap='round'%3E%3C/path%3E%3Cpath d='M19 19C19 11.268 12.732 5 5 5' stroke='%23323232' stroke-width='2' stroke-linecap='round'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
  transition: background-color var(--ifm-transition-fast)
    var(--ifm-transition-timing-default);
}

.feed-link:hover::before {
  background-color: var(--ifm-navbar-link-hover-color);
}

....
```
Feel free to copy it if you need :wink:. I got the Github icon svg from the Docusaurus github repo. As for the rss icon, I downloded the svg from [www.svgrepo.com](https://www.svgrepo.com/svg/507840/rss) and then converted it to css using [yoksel.github.io/url-encoder](https://yoksel.github.io/url-encoder/).

That's all for today and this post. Ah well, one more thing. This is how the navigation bar looks after these changes (in case the current nav-bar has changed after this blog entry).
![new nav bar](/images/new-navbar-20240808.png)

Much better than before and I like it a lot as of now.
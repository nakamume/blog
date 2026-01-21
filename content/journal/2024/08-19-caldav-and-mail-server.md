---
title: "Caldav and Mail Server"
date: 2024-08-19
tags: ["2024-08", "2024", "caldav", "connector"]
toc: false
---
For the last couple of days, I have been obsessed with integrating my CalDAV and mail servers. My mails are managed by MXRoute. I took their lifetime subscription<!--more-->, so I think I'm sorted for life or at least the next 5-10 years or sooner (if I end up starting a business and then just drop my guards and go with Google Workspace and equivalents). Anyways, enough digression.

MXRoute also provides me with a CalDAV server, but that's not their strong suit, and they don't even advertise or document it. I was trying out their webmail clients and stumbled across it by chance. Long story short, I've got a hosted CalDAV and mail server. But they are not connected with each other, like what you'd expect with Gmail and Google Calendar. For example: if I add an event and invite someone, they won't receive an invitation email (unless I create the event on specialized clients: Thunderbird or the webmail client I discussed above), and similarly, if someone sends me an invitation over email, that won't be added to my calendar automatically (on iOS, I click on the invite attachment and add it to my calendar manually).

So, the ultimate goal is to have some kind of connection between these two servers that will allow me to send and receive invites over email. I spent the last couple of days searching for an existing solution, but none seemed to work. Some suggestions were to:
- Change my mail provider and use something like Fastmail, Magadu, etc. (that's not gonna fly with me - I'm already on a lifetime sub with MXRoute, and these other services charge you per user per month).
- Use a different CalDAV server. I tried Baikal - it solved half the problem of sending out invites but not the receiving part. It's written in PHP - so I don't want to spend time extending it (not familiar with PHP at all). I tried NextCloud, thinking that it would magically fix my issue and partly because all my internet searches suggested that it would - but it didn't. It solved the same thing as Baikal but had tons of other services (mail client, photos, sharing, etc.) that I didn't need.
- DavMail Gateway - it seemed like something in the right direction but was too daunting to try, and all the docs suggested that it has something to do with Outlook or MS Exchange.

Anyways, the point is that I've finally decided to try my luck writing something for my use case myself. The idea is simple:
- Read calendar events from CalDAV periodically and send invites using SMTP.
- Read emails using IMAP, look for `ical` attachments, and send them over to CalDAV.

Of course, I'll need to do some state management, like:
- Which invites have already been sent
- Which changed since they were last sent
- Which received invites have been added, and whether the added ones have been changed

And more complex features might include handling cases where I or the person I'm inviting don't want to accept an invitation or ask for adjustments. But I'll try to ignore that for the time being.

As of now, I'm very motivated. But, let's see how much motivation I can summon to actually implement it. I may or may not update this blog if I do actually end up implementing it. So, if you are interested, check out my GitHub org [nakamorg](https://github.com/nakamorg). ChatGPT suggested using `calbridge` as the project name (along with some other suggestions, of course) - so that's what it will be.

Side note: For some reason, most of my posts get the same publishing date whenever I make a new deploy of the blog (which happens for any change that I make, however minute). I need to figure out a way to prevent that.

[Update (2024-08-20)]: I think if I prefix my filename with the date in (yyyy-mm-dd), that should fix the timestamp issue on the blog. I've made those changes and am trying a deploy. If you do not see same timestamp on the posts, that means, it worked.

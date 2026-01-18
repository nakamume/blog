---
title: 2024-10-09 The Internet Today
slug: 2024/the-internet-today
tags:
- '2024-10'
- '2024'
hide_table_of_contents: false
---
I started using the internet when I was in 10th grade, around 2010. My first exposure was through feature phones of that time, which could browse the web using some built-in browser. It was very expensive (around Rs.10/MB) and very slow (a couple of KBps).<!-- truncate --> The reason for that anecdote is to say that I am by no means a veteran, but the pace at which things are moving in this space is incredible.

This technology is pretty awesome, but human greed and ego, in my opinion, are doing more harm than good (maybe that was a bit of an overstatement). It feels like the internet is not what it used to be and not what it could have been. There are too many walled gardens, unnecessary and frustrating hops, deceptive, manipulative, and sometimes outright illegal (or on the verge of that) activities being done, all in the name of "making the world a better place."

I'll try to keep this entry focused on the unnecessary and frustrating hops part. But first, let's go through some scenarios and see if we can spot the madness.

## You want to send a letter to your friend who lives in another city. What do you do?

1. You put it in a mail collection box.
2. The mailman collects it and takes it to the post office.
3. The letter is sorted and put on a vehicle.
4. The vehicle takes it to the destination city.
5. The letter is sorted again and delivered to your friend's mailbox.
6. Your friend takes it out and reads it.

:::warning
Fortunately, all these middlemen do not read your letters. But they can, without you or your friend even knowing. So always encrypt those letters if you are sending something sensitive.
:::

The internet or computer networks work in a similar fashion. You attach the destination address to your packet and send it to your router, which forwards it to its neighbor and so on until the destination is reached.

But there's a catch. The way things work today, you might be using, let's say WhatsApp, to send a message to your friend. Instead of sending it directly to your friend, it first goes to the WhatsApp server and then to your friend's phone. The WhatsApp server will store it indefinitely and can do whatever they want with that message, like reading it, deleting it, forwarding it to someone else, etc.

:::warning
On top of that, all of the other middlemen (routers) can also read all your packets. So encrypt everything; it doesn't cost much.
:::

Let's take another example.

## You want to send a letter to your neighbor. What do you do?
Maybe something like:
1. Put it in their mailbox.
2. Neighbor takes it out and reads it.

Or maybe you are more social and decide to knock on their door, hand it over to them, and ask them how they are doing. But for argument's sake, let's say you are not and you just put it in their mailbox.

Now, this seems pretty straightforward and efficient. But what happens when you do the same thing on the internet? All the steps that we saw in the previous example are repeated. Even though your neighbor is just a couple of meters away from you, your message might be traveling to a totally different continent to the central server, being stored there, and then being sent to your neighbor. And what happens if the internet cable connecting your country and the WhatsApp server is cut off (by the government or maybe by some sea creature)? Well, you guessed it, you can't send a message to your neighbor. Even though your town's, city's, and country's internet is working just fine.

Want to go through another example?

## You want to send a letter to your wife. What do you do?
Maybe you hand it over to her? Or maybe put it on the table? Or maybe put it in your home's mailbox?

Let's say you like consistency and put it in the mailbox. Your wife then takes it out and reads it.

But what happens with the internet services we use today? Well, it's the same for all the cases. Your message has to travel thousands of kilometers just to come back to your own house.

## Why am I rambling about all this?
It is to show the absurdity of internet use today. I think most of the populace doesn't know how things work to even realize the absurdity of the situation and are at the mercy of the service providers who force them to go through all the hops all the time. They force them to go through all the risks that come with it. Risks of being monitored, manipulated, misinformed, regulated, censored, getting disconnected, etc.

I remember the days when if I had to share a file with my friends, I could send it to them over Bluetooth. But today, the whole population is brainwashed into uploading the file somewhere first (maybe Google Drive, Dropbox, etc.), then sharing the link with people (over WhatsApp, FB, etc.), and then the recipient has to download it from there. People have moved from such open solutions to gated solutions like `AirDrop` (which works only with Apple devices), `Quick Share` (with Android only). Such stupidity.

## What can we do?
We used to have solutions, and they were very popular in the old days but are being pushed out by the big players. Just to name a few, we had:
1. Open protocols over Bluetooth for sharing and streaming.
2. Peer-to-peer networks and protocols - which are being actively attacked by the big players and governments today.
3. Amazing open protocols for sharing stuff: XMPP, SMTP, FTP, etc. - But nowadays, everyone is interested in pushing for their proprietary protocols and locking in users.

I think we need to move towards a more open internet. With the adoption of IPv6, where every device can get a (or maybe thousands) unique address, we need to push for more direct connections and away from the centralized servers.
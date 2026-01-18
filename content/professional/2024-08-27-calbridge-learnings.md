---
title: Learnings From Calbridge
slug: 2024/learnings-from-calbridge
tags:
- '2024-08'
- '2024'
- 'calbridge'
- 'learning'
- 'caldav'
- 'smtp'
- 'imap'
---
Development of [calbridge](https://github.com/nakamorg/calbridge) is going on with full momentum now. I've been spending hours working on it during nights.<!-- truncate --> Just kidding. I mean I've spent couple of nights working on it but then took some time off. And then wanted to write this blog before picking it up again. For the uninitiated, **calbridge** is a utility I've been working on to integrate (or bridge) my Caldav server with my mail server. More background [here](/journal/2024/caldav-and-mail), if you are interested.

Anyways, I wanted to take some time and jot down my thoughts and learnings from this project so far.

## Using LLMs
I used `Claude Opus` to bootstrap the project. It provided me with the initial structure of the project. And then for every core functionality that I needed, it provided me with the starter code. I found it to be very helpful. It got me over the massive inertia of starting something from scratch and gave a boilerplate to start with. Although, the majority of the code it provided had to be re-written, it still helped a lot - as it gave pretty good hints on what libs to use and how to approach the problem and acted as a dummy duck or someone to yell on during debugging (trust me I swore a lot and it took it like a champ).

## Auth
First thing that I came across and learned about was the `Digest Auth` and have already written a blog about that [here](/blog/2024/basic-auth-and-digest). I started with making simple `http` calls to the server to fetch my calendars and it seemed to have worked once the auth thing got fixed. But I soon found myself wanting more (like correctly parsing and handling calendar data). I was a bit hesitant to include too many dependencies to the project at first but ultimately gave up on that design goal as I wanted to have something working as soon as possible instead of spending too much time getting it perfect. Which brings us to our next topic. Packages.

:::note
It's okay to start with an "un-optimized" solution and have it working instead of spending too much energy building the perfect product in the first try. Once you have something working, you can iterate on it if you want.
:::

## Packages
I looked for packages a lot. All I wanted were thin client libs for caldav, smtp and imap. But for caldav, at least, most of the libs were either abondoned or were providing both the server and the client. Ultimately, I settled with https://github.com/emersion - it came with webdav, caldav client and server (talking about thin clients). Thank you **emersion** for providing such a high quality implementation of these protocols. **emersion** provided all the libs I needed. While the libs were lacking in documentation and some working examples, they were implementing the target protocols (caldav, imap etc) to the point and using same terminology for variable, function names etc. as in the protocl spec. So, it didn't take much effort (if you don't consider 2-3 hours of fumbling around **much**) to write something working.

:::note
And much of this time could have been saved if I had looked at github issues earlier.
:::

Next, I'll discuss about some of these issues in detail.

## golang http.request - Cannot reuse
The caldav lib I used provided a neat way of passing in a custom HTTPClient. This way I could implemet a custom `digest auth` client to authenticate with my server. A working implementation for **digest auth** need to make at least two calls to the server. First a dummy call, just to get the authorization challenge from the server and then the actual call with the authorization header set. I reused the same `http.Request` in both calls.

The second call silently failed. The returned `http.Response` was `nil` without any errors. I thought there was something wrong with the client, my digest auth implementation or the caldav server. I inserted a bunch of `Print` statements to debug it (now you know what I use for debugging). And then added some more **print** statements and realized that `Response` is always `nil`. I had no idea what might have caused it. Out of desperation, I passed the function context to my GPT and asked it why the response is nil all the time. It suggested not to re-use the previous `response` object. I told it not to be stupid. It apologized and said the the same request shouldn't be re-used. That made some sense to me and I made a clone of the previous request with `req.Clone(context.Background())` but it still didn't work though there were some error response from the server this time. Some progress, eh? Server complained that I were not asking for any data. I printed the original request and could see that I was indeed asking for some data. Then I printed the cloned request and noticed that it didn't have the `body`. Hmm, what kind of `clone` was it?

Turns out that the `req.Clone` doesn't clone the request body. Here's the comment for that method
> Clone returns a deep copy of r with its context changed to ctx. The provided ctx must be non-nil.
>
> For an outgoing client request, the context controls the entire lifetime of a request and its response: obtaining a connection, sending the request, and reading the response headers and body.

Nowhere does it mentions that it won't clone the body. It even says that it makes a deep copy. But the entire game is of the `context`. Once the context is done, it seems the Body is done for or consumed. So, I needed to make a copy of the body before sending out the request and used that copy to set the body of the cloned request. `req.GetBody()` helped in making the copy of the request.

And that was it. The server started returning my calendars after that.

:::note
That's not entirely true. During debugging, I thought that maybe I'm not sending the correct queries to the server. So I tried with bunch of different queries and settings. And then spent some extra minutes to realize that I've messed up the queries and then some more to correcting those.
:::

## SMPT - Just use an external package
I started with `net/smtp` package that is included with the standard Golang installation. There was nothing wrong with it but it seems that its development is frozen and the authors suggested using some other maintained lib. So, after writing a working implementation using this "obselete" lib, I searched for another lib and then re-wrote the thing to make it compatible with the new lib.

One thing I solidified during this experience was to provide a good interface to your users. This allows to change your implementation as you want (change libs/packages or re-write whole thing by youself) as long as you don't alter the user interface. I started with `NewSMTPClient` function to return a custom (hidden) client object and a `SendCalendarInvite(calObject caldav.CalendarObject)` method for the client. The client didn't expose its fields directly to the end user - so it was pretty easy to switch to another package for my `SendCalendarInvite` implementation without making any changes to the front-end.

## IMAP - Sweet time that we spent together
I spent about 90 minutes on a very "stupid" mistake. Here's how. So I needed to ask my mail server for all the emails from last few hours. Then I could process them to see if they had any calendar invite. `github.com/emersion/go-imap` lib along with `github.com/emersion/go-message/mail` make this whole thing a no-brainer given that you have some brain cells to correctly use these packages or you are willing to spend some time looking at protocol RFCs or maybe just search Github issues for the problems you'r facing.

Here's what happened. I managed to find the sequence numbers of the emails that I needed. But didn't check if the returned result was empty or not. Sending the empty sequence numbers to server to fetch those results returned weird errors from the server which gave no hint about the actual issue.
```go
criteria.SentSince = time.Now().Add(-4*hours)
seqNums, err := c.Search(criteria)

items := []imap.FetchItem{imap.FetchBody}
msgs := make(chan *imap.Message, len(seqNums))
seqSet := new(imap.SeqSet)
seqSet.AddNum(seqNums...)
if err := c.Fetch(seqSet, items, msgs); err != nil {
    return nil, fmt.Errorf("failed to fetch email: %v", err)
}
```

So, the first thing that needed to be done was not to query the server if you didn't have anything to query for.
```go
seqNums, err := c.Search(criteria)

if len(seqNums) == 0 {
    return []string{}, nil
}
```

Alright, that makes sense now. So I increased my search criteria to 10 hours and was pretty certain that I had several mails in that window. And that resulted in segmentation fault. Meaning I was trying to read some memory location which I had no business reading. Fortunately, unlike `c`, golang gives you some hints about the crime location. It pointed out to me the line number where I was trying to read the mail body.

Let's look at the code again (with just the necessary parts)
```go
items := []imap.FetchItem{imap.FetchBody}
msgs := make(chan *imap.Message, len(seqNums))
seqSet := new(imap.SeqSet)
seqSet.AddNum(seqNums...)
if err := c.Fetch(seqSet, items, msgs); err != nil {
    return nil, fmt.Errorf("failed to fetch email: %v", err)
}
```
`items` that I want to fetch is the email body (`imap.FetchBody` here is the string `BODY`) - as that's the thing that would have the calendar invites I'm after. But the body field of all the emails that it fetched was always `nil`. It was weird. I had explicitly specified to fetch the `BODY` and the body was nil. Then my monkey brain told me not to optimize and just fetch everything. Conveniently, there was `imap.FetchAll` and I thought it would fetch everything. But NO. Both of these options fetched everthing but the email body. After plucking another 100 hair from my head and I surrendered and looked online. Within a minute or so, I came across this github comment `https://github.com/emersion/go-imap/issues/306#issuecomment-546532174` - turned out I had to fetch `BODY.PEEK[]`. Fetch `ALL` or `BODY` do not fetch everthing or the body respectively (as one would have expected) but the headers and stuff. So, folks please read those RFCs.

:::note
Peek keeps the email unread, so one can use `BODY[]` as well if they want to mark the mail read. (Look at the smart me)
:::

So, here's the wokring code
```go
items := []imap.FetchItem{imap.FetchItem("BODY.PEEK[]")}
.. removed for brevity ..
if err := c.Fetch(seqSet, items, msgs); err != nil {
    return nil, fmt.Errorf("failed to fetch email: %v", err)
}
```

Funnily enough, when I started working on the IMAP functionlity. I asked `Claude Opus` (a gpt) to write me the code, it suggested the folowing
```go
section := &imap.BodySectionName{}
items := []imap.FetchItem{section.FetchItem()}
```

which translates to a working approach
```go
items := []imap.FetchItem{imap.FetchItem("BODY[]")}
```
But I became a smart-ass and asked why it was making it so complicated. We needed just the body and `FetchBody` provided that, so why couldn't we use that instead? The GPT, like it always does, apologized to me, praised me for being so smart, and suggested that we could indeed just use `FetchBody`. Sometimes I think it did that on purpose, maybe to hold some grudge or something /s.

## Something to end the blog with
Like I mentioned in the begining, I wanted to keep the final binary very small and might end up re-writing some of the functionalities that the packages provide by myself. As of now, I think that the webdav dependency (it provides caldav) can be easily do away with. As it just needs to make some simple http calls to the server. So that's something I've been looking towards getting rid of. But not until I have a fully working solution ready first.

:::note
I loved using these **note** sections in this blog entry. Sometimes at places where it didn't make any sense. And now this blog entry being done, maybe I can go back actually implementaing the real thing.
:::

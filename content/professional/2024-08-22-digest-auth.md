---
title: Basic Auth and Digest
slug: 2024/basic-auth-and-digest
tags:
- '2024-08'
- '2024'
- 'digest'
- 'basic auth'
---
I've started working on [calbridge](/journal/2024/caldav-and-mail) and spent some time working on the caldav client part of it.<!-- truncate --> While connecting to the caldav server, I passed in the creds as basic auth. The server repeatedly returned `401 - Unauthorized`. I might have spent roughly an hour figuring out where I might be sending the wrong username, password or the server url.

And then by luck or whatever, I stumbled across this part of the response
```xml
<?xml version="1.0" encoding="utf-8"?>
<d:error xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns">
  <s:sabredav-version>4.6.0</s:sabredav-version>
  <s:exception>Sabre\DAV\Exception\NotAuthenticated</s:exception>
  <s:message>No 'Authorization: Digest' header found. Either the client didn't send one, or the server is misconfigured</s:message>
</d:error>
```
**No 'Authorization: Digest' header found** - the poor fella was expecting the `Authorization: Digest` and I was passing in the `Authorization: Basic`.

:::tip
If you are using curl, pass the `--digest` flag and it will handle the **digest** auth flow for you. 
:::

I've heard of this auth mechanism before but never went into much details of what it is, why it is and how it is. These three questions I'll try to cover in this blog. Maybe not in much details but something to keep it interesting and informative

## What
So, it's a HTTP auth mechanism like basic auth. But unlike basic auth, where username and password are transmitted in plain-text and can be intercepted and decoded by anyone on the network (if you are using HTTP (not HTTPS)); with auth digest you never send the username and password over. Instead you use your creds to solve a puzzle that the server sents you. Now, of course, if you are not on HTTPS - an attacker on the network can easily intercept this solution to the puzzle and then impersonate you. But at least they won't have your password.

Moral of the story: Always use a secured connection (HTTPS) if you are sending over sensitive information.

## Why
I think the last section kinda answered this question. We needed it to avoid sending our passwords in plain-text over an HTTP connection.
:::info
A question for you: What do you think is the best way to create a user, in the first place, over such a connection?
:::

## How
I'll try to gloss over most of the technical details but still keep enough to satiate those of you who dig these kind of details. I'll use some Golang code to show the implementation details
1. Client asks the server for a protected resource (without sending any creds)
    ```go
    req, _ := http.NewRequest("GET", URL, nil)
    resp, _ := http.DefaultClient.Do(req)
    ```
2. Server responds with `StatusUnauthorized (401)` status code and sends the challenge in `WWW-Authenticate` header
    ```go
    if resp.StatusCode == http.StatusUnauthorized {
        challenge := resp.Header.Get("WWW-Authenticate")

        req, _ = http.NewRequest("GET", URL, nil)

        // Set the Digest authentication header
        req.Header.Set("Authorization", getDigestAuthorization(challenge, Username, Password, "GET", URL))

        // Send the request with Digest authentication
        resp, _ = http.DefaultClient.Do(req)
    }
    ```
3. In `WWW-Authenticate`, server sends couple of fields like `realm`, `nonce` and these are used together with username and password to generate a hash. This hash is what is sent back to the server in `Authorization` header
    ```go
    func getDigestAuthorization(challenge, username, password, method, uri string) string {
        // Parse the Digest challenge
        fields := parseDigestChallenge(challenge)

        realm := fields["realm"]
        nonce := fields["nonce"]

        // Generate the response hash
        ha1 := getMD5(fmt.Sprintf("%s:%s:%s", username, realm, password))
        ha2 := getMD5(fmt.Sprintf("%s:%s", method, uri))
        response := getMD5(fmt.Sprintf("%s:%s:%s", ha1, nonce, ha2))

        // Construct the Digest authorization header
        authParams := fmt.Sprintf(
            `username="%s", realm="%s", nonce="%s", uri="%s", response="%s"`,
            username, realm, nonce, uri, response
        )
        return "Digest " + authParams
    }
    ```
4. As you might have noticed, we send back the username, realm, nonce and the hash to the server but not the password. Using the username, the server looks up the password from its db and does this calculation on its side. If the hash matches to the server calculated hash then the request is authenticated otherwise not.

That was it about the digest auth. A clever way if proving you are who you say you are without sending over your password. Again it might not be necessary if you use HTTPS and might not be very secure(citations needed) but it's still much better than basic auth.

:::warning
I've removed lots of implementation details from the code snippets above. Do not copy paste this code for your implementation of digest auth. Use some existing library or follow the official RFC or spec of the protocol.
:::
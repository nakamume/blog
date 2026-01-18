---
title: "Lessons from Code Reviews"
date: 2025-01-10
tags: ["engineering", "code-review", "career"]
draft: false
---

Code reviews are one of the most valuable practices in software development, but they're also one of the most misunderstood. Here's what I've learned over a decade of reviewing code and having my code reviewed.

<!--more-->

## The Real Purpose of Code Reviews

Let's start with what code reviews are *not* about: catching bugs. Yes, reviews sometimes catch bugs, but if that's your primary goal, you're missing the bigger picture. Automated testing is far better at catching bugs than human reviewers. We're inconsistent, we get tired, and we have blind spots.

What code reviews actually excel at:

1. **Knowledge sharing.** When you review someone's code, you learn how they approached a problem. When they review yours, they learn your corner of the codebase. Over time, this builds collective ownership and reduces the "bus factor."

2. **Maintaining standards.** Code reviews are how teams develop and enforce shared conventions. Not through documentation that nobody reads, but through repeated conversations about "how we do things here."

3. **Mentorship.** For junior developers, code reviews are an apprenticeship compressed into comments. For senior developers, explaining your decisions forces you to examine them more carefully.

4. **Design feedback.** The best time to catch architectural problems is before the code is merged, not six months later when it's load-bearing.

## What I Look for as a Reviewer

After reviewing thousands of pull requests, I've developed a mental checklist. Not all of these apply to every review, but they're always in the back of my mind.

### Does it solve the right problem?

Before diving into the code, I read the PR description and linked tickets. Does this change actually address the stated goal? You'd be surprised how often the answer is "sort of" or "not quite." It's much easier to course-correct early than after someone has invested hours in an approach.

### Can I understand it?

I read through the code once without trying to evaluate it—just trying to understand what it does. If I can't follow the logic on first read, that's a red flag. Not because I'm the smartest person in the room (I'm not), but because code is read far more often than it's written. If it's confusing now, it'll be confusing later.

When I don't understand something, I ask questions. Not "this is confusing" (which sounds like criticism) but "can you help me understand why this works this way?" Sometimes the answer reveals a subtle bug. More often, it reveals that the code could use a comment or a better variable name.

### What happens when things go wrong?

Happy path code is easy. What happens when the database is slow? When the user provides unexpected input? When the third-party API returns an error? I pay special attention to error handling, not because I expect every edge case to be covered, but because I want to understand what failure looks like.

### Is it tested?

I don't have a hard rule about code coverage percentages—those metrics can be gamed and often miss the point. What I want to see is that the critical paths are tested, that edge cases are considered, and that the tests actually test something meaningful. A test that always passes is worse than no test at all.

### Does it fit?

Does this code feel like it belongs in this codebase? Does it follow existing patterns? If it introduces new patterns, is that intentional and justified? Consistency has value. Not infinite value—sometimes you need to break from convention—but enough that deviations should be deliberate.

## How I Give Feedback

The technical part of code review is straightforward. The human part is where things get tricky.

### Be specific

"This could be cleaner" is useless feedback. Clean how? What specifically would you change? If I can't articulate a concrete improvement, I don't leave the comment. Vague criticism just creates anxiety without providing direction.

### Distinguish between requirements and suggestions

Not all feedback carries the same weight. Some things are blocking: security vulnerabilities, broken functionality, violations of team standards. Other things are preferences: naming choices, minor refactors, stylistic decisions.

I've started prefixing my comments to make this clear:
- "Blocking: This SQL query is vulnerable to injection."
- "Suggestion: Consider extracting this into a helper function."
- "Nitpick: I'd probably name this `userCount` instead of `count`."

The author can push back on suggestions and ignore nitpicks. They need to address blocking items.

### Ask questions instead of making demands

"Why did you choose to do it this way?" is better than "You should do it differently." The question opens a dialogue. Maybe there's context I'm missing. Maybe they tried my suggestion and it didn't work. Or maybe the question prompts them to reconsider. Either way, we both learn something.

### Acknowledge what's good

Code review has a negativity bias built in—you're literally looking for problems. But people need to know when they're on the right track, not just when they've gone wrong. When I see something clever, elegant, or particularly well-handled, I say so. "Nice approach here" costs nothing and builds goodwill.

## Receiving Feedback

Getting your code reviewed can be uncomfortable. You've spent hours on something, you think it's pretty good, and then someone shows up with a list of everything wrong with it. Here's how I've learned to handle it.

### Assume good intent

That comment that seems harsh? The reviewer probably didn't mean it that way. Text strips out tone. What reads as criticism might have been written with genuine curiosity or helpfulness. Until proven otherwise, assume your colleagues are trying to help you ship better code.

### Don't take it personally

Your code is not you. Criticism of your code is not criticism of your worth as a person or even as an engineer. This is easier said than done—I still feel a little defensive when someone finds a bug I missed—but it gets easier with practice.

### Ask for clarification

If feedback is unclear, ask about it. "I'm not sure I understand what you're suggesting here—could you elaborate?" This isn't weakness; it's communication. Better to have a conversation than to guess wrong and waste time.

### Look for patterns

If multiple reviewers point out similar issues, or if the same feedback keeps coming up across different PRs, pay attention. That's signal. Maybe you have a blind spot around error handling, or you tend to write overly complex functions, or your test coverage is consistently thin. These patterns are growth opportunities.

## The Mechanics

A few tactical things I've learned:

**Keep PRs small.** A 50-line PR gets a thorough review. A 500-line PR gets skimmed. If you want quality feedback, make it easy to give.

**Write good PR descriptions.** Explain what you're changing and why. Link to relevant tickets or discussions. Include screenshots for UI changes. The five minutes you spend on this saves your reviewers much more.

**Respond to all comments.** Even if the response is just "Done" or "Good point, fixed." This closes the loop and shows you've read the feedback.

**Don't let PRs sit.** Stale PRs grow merge conflicts and block other work. Review promptly, respond to feedback promptly, merge when it's ready.

## The Bottom Line

Code review is a skill, both giving and receiving. It takes practice to do well. But when it works, it makes the code better, makes the team smarter, and makes the work more sustainable. That's worth the effort.

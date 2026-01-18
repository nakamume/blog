---
title: "The Complete Guide to Kotaro"
date: 2025-01-18
lastmod: 2025-01-18
description: "Everything you need to know about our beloved cat Kotaro - a comprehensive post testing all Hugo and Markdown features"
tags: ["cat", "kotaro", "pets", "guide"]
categories: ["Cats", "Family"]
keywords: ["cat care", "kotaro", "feline"]
author: "Cat Parent"
draft: false
toc: true
weight: 1
series: ["Kotaro Chronicles"]
---

This post serves as both a tribute to Kotaro and a comprehensive test of all Hugo/Markdown features. Let's dive in!

<!--more-->

## Basic Text Formatting

Here's **bold text**, *italic text*, and ***bold italic text*** combined.

You can also use __underscores for bold__ and _underscores for italic_.

~~Strikethrough~~ for when Kotaro knocks things off tables (which is never, of course).

This is `inline code` for when we discuss cat-related programming.

## Headings Hierarchy

# H1 - The Majestic Kotaro
## H2 - Daily Activities
### H3 - Morning Routine
#### H4 - Breakfast Time
##### H5 - Food Preferences
###### H6 - Specific Kibble Ratings

---

## Lists

### Unordered Lists

Kotaro's favorite activities:

- Sleeping
  - On the couch
  - In sunbeams
    - Especially afternoon sun
    - Window sills are preferred
  - On freshly laundered clothes
- Playing
  - Chasing toys
  - Attacking feet under blankets
- Eating
- Judging humans

### Ordered Lists

Kotaro's daily schedule:

1. Wake up at 5 AM
2. Demand breakfast
3. Post-breakfast nap
4. Mid-morning zoomies
5. Lunch
6. Afternoon nap (3-4 hours)
7. Evening playtime
8. Dinner
9. Night patrol
10. Sleep (repeat)

### Task Lists

- [x] Feed Kotaro
- [x] Clean litter box
- [ ] Trim claws (good luck)
- [ ] Give medication (impossible)
- [x] Provide chin scratches

### Definition Lists

Cat
: A small domesticated carnivorous mammal with soft fur, a short snout, and retractable claws.

Kotaro
: The best example of the above definition.

Zoomies
: Sudden bursts of energy resulting in chaotic running through the house at 3 AM.

---

## Links

### Basic Links

Learn more about cats at [Wikipedia](https://en.wikipedia.org/wiki/Cat).

### Reference Links

Kotaro is a [Japanese name][1] meaning "small boy" or can be written with characters meaning "tiger."

[1]: https://en.wikipedia.org/wiki/Kotaro "Kotaro name meaning"

### Autolinks

Visit https://example.com for more cat content.

Email us at <cat@example.com> for Kotaro fan mail.

### Internal Links

Check out my [professional blog]({{< ref "/professional" >}}) or go back to the [homepage]({{< ref "/" >}}).

---

## Images

### Basic Image (if you add one to static/images/)

![Kotaro sleeping](https://t4.ftcdn.net/jpg/02/31/67/63/240_F_231676345_IeM6bXyleuDsNWycIiiC7jq4alrg2FNA.jpg "Kotaro in his natural habitat")

### Image with Caption (using figure shortcode)

{{< figure src="https://t4.ftcdn.net/jpg/15/69/78/51/240_F_1569785131_eZrqJOJNO5mpe6bt1CokRh1lDRLVVXpZ.jpg" title="Kotaro Looking Majestic" caption="This is Kotaro judging your life choices" alt="A majestic cat" >}}

---

## Blockquotes

> "In ancient times cats were worshipped as gods; they have not forgotten this."
> — Terry Pratchett

Nested blockquotes:

> Kotaro's philosophy:
>
> > Sleep when tired.
> >
> > > Eat when hungry.
> > >
> > > > Ignore humans when convenient.

---

## Code Blocks

### Inline Code

Use the `meow()` function to communicate with Kotaro.

### Fenced Code Blocks

```python
# Kotaro's daily algorithm
def kotaro_day():
    while True:
        if hungry():
            meow_loudly()
            eat()
        elif tired():
            find_sunbeam()
            sleep(hours=random.randint(2, 6))
        elif bored():
            knock_things_off_table()
        else:
            judge_humans()
```

```javascript
// Cat feeding scheduler
const feedingTimes = ['06:00', '12:00', '18:00'];

feedingTimes.forEach(time => {
  schedule(time, () => {
    console.log('🐱 Feeding Kotaro...');
    kotaro.feed({ food: 'premium', amount: 'generous' });
  });
});
```

```go
package main

import "fmt"

type Cat struct {
    Name    string
    Age     int
    Mood    string
}

func (c *Cat) Meow() {
    fmt.Printf("%s says: Meow!\n", c.Name)
}

func main() {
    kotaro := Cat{Name: "Kotaro", Age: 3, Mood: "sleepy"}
    kotaro.Meow()
}
```

```bash
# Check if Kotaro has been fed
#!/bin/bash
if [ -f /tmp/kotaro_fed ]; then
    echo "Kotaro has been fed today"
else
    echo "URGENT: Feed Kotaro immediately!"
    touch /tmp/kotaro_fed
fi
```

```json
{
  "cat": {
    "name": "Kotaro",
    "breed": "Domestic Shorthair",
    "color": "orange tabby",
    "traits": ["fluffy", "judgmental", "adorable"],
    "favoriteSpots": [
      "sunny window",
      "cardboard box",
      "laptop keyboard"
    ]
  }
}
```

### Code with Line Numbers (if enabled in config)

```python {linenos=true,hl_lines=[3,5]}
def calculate_treats(mood):
    base_treats = 5
    if mood == "good":
        return base_treats * 2
    elif mood == "extra_cute":
        return base_treats * 10
    return base_treats
```

---

## Tables

### Basic Table

| Activity | Duration | Frequency |
|----------|----------|-----------|
| Sleeping | 16 hours | Daily |
| Eating | 30 mins | 3x daily |
| Playing | 1 hour | When motivated |
| Judging | 24/7 | Constant |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Breakfast | 6:00 AM | 100g |
| Lunch | 12:00 PM | 50g |
| Dinner | 6:00 PM | 100g |
| Treats | Random | Unlimited |

### Complex Table

| Mood | Signs | Response | Success Rate |
|------|-------|----------|--------------|
| Happy | Purring, slow blinks | Pet gently | 95% |
| Hungry | Loud meows, following | Feed immediately | 100% |
| Playful | Dilated pupils, pouncing | Get the feather toy | 80% |
| Angry | Flat ears, tail swishing | Back away slowly | 60% |
| Sleepy | Curled up, eyes closed | Do not disturb | N/A |

---

## Footnotes

Kotaro sleeps approximately 16 hours a day[^1], which is normal for cats[^2].

His favorite food is salmon-flavored kibble[^longnote].

[^1]: This was measured over a week of careful observation.

[^2]: Source: Every cat owner ever.

[^longnote]: This is a longer footnote with multiple paragraphs.

    Kotaro specifically prefers the "Ocean Feast" variety, though he will accept "Salmon Supreme" as an alternative.

    He absolutely refuses chicken-flavored anything.

---

## Horizontal Rules

Three different ways to create them:

---

***

___

---

## HTML Elements (if allowed)

<details>
<summary>Click to reveal Kotaro's secret</summary>

He actually *does* know his name. He just chooses to ignore it.

</details>

<mark>Highlighted text</mark> for important cat facts.

<kbd>Ctrl</kbd> + <kbd>C</kbd> to copy cat pictures.

Text with <sup>superscript</sup> and <sub>subscript</sub>.

<abbr title="Very Important Cat">VIC</abbr> status confirmed.

---

## Emojis

Kotaro's mood throughout the day: 😺 😸 😻 😽 😿 🙀 😾

Cat-related emojis: 🐱 🐈 🐈‍⬛ 🐾 🐟 🥫 🧶

---

## Math (if enabled with KaTeX/MathJax)

The formula for calculating required daily pets:

$$P = \frac{C \times M}{T}$$

Where:
- $P$ = Pets required
- $C$ = Cuteness factor (always 10 for Kotaro)
- $M$ = Meow intensity
- $T$ = Time since last pets

Inline math: The probability of Kotaro responding to his name is $p \approx 0.05$.

---

## Special Hugo Features

### Shortcodes Examples

#### Highlight Shortcode
{{< highlight python "linenos=table,hl_lines=2 4" >}}
def pet_kotaro():
    print("Petting Kotaro...")  # This is highlighted
    kotaro.purr()
    return "😻"  # This is also highlighted
{{< /highlight >}}

#### Gist Shortcode (example syntax)
<!-- {{< gist username gist_id >}} -->

#### YouTube Shortcode (example syntax)
<!-- {{< youtube video_id >}} -->

#### Tweet Shortcode (example syntax)
<!-- {{< tweet user="username" id="tweet_id" >}} -->

---

## Summary

This post has demonstrated:

1. **Text formatting** - bold, italic, strikethrough
2. **Headers** - all six levels
3. **Lists** - ordered, unordered, task lists, definition lists
4. **Links** - inline, reference, autolinks
5. **Images** - basic and figure shortcode
6. **Blockquotes** - simple and nested
7. **Code** - inline, fenced, syntax highlighted
8. **Tables** - basic and aligned
9. **Footnotes** - short and long form
10. **HTML elements** - details, mark, kbd, etc.
11. **Emojis** - various cat-related
12. **Math** - block and inline (if enabled)
13. **Hugo shortcodes** - highlight, figure, ref

---

## Appendix: Kotaro Facts

| Fact | Value |
|------|-------|
| Name | Kotaro |
| Species | *Felis catus* |
| Role | Professional sleeper, amateur hunter |
| Superpower | Making humans do his bidding |
| Weakness | The vacuum cleaner |
| Catchphrase | *"Meow"* (translation: "Feed me, peasant") |

---

*Last updated: {{ .Lastmod.Format "January 2, 2006" }}*

**Thank you for reading about the magnificent Kotaro!** 🐱

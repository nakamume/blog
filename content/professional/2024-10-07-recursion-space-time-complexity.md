---
title: Space time complexities of recursive algorithms
slug: 2024/recusive-space-time-complexities
tags:
- '2024-10'
- '2024'
- recursion
- time complexity
- daily
hide_table_of_contents: false
---
Sometimes, I have difficulties visualizing the time complexities of recursive algorithms. For iterative ones, not considering the tricky notorious ones, most of the time I can just count the number of instructions and make some sense of it, but doing so for recursive algorithms overflows my brain's stack.<!-- truncate --> I'll use this blog to jot down some ideas and approaches for doing complexity analysis on recursive algorithms.

I'll use some simple algorithms and deduce their analysis. This blog, by no means, is exhaustive and is mostly a primer and will, of course, not cover "clever" and intentionally notorious algorithms. So, let's get started with some algorithms.


## Factorial
A recursive implementation of factorial is
```python
def factorial(n):
    if n < 2:
        return 1
    return n * factorial(n - 1)
```
This basically calls itself `n` times before returning the result, and each call takes a constant time, so the complexity would be `O(n)`. Now, this was easy for my monkey brain, and I could do the pattern recognition and calculations in my head. But let's see if we can write it down systematically.

Let's take some examples:
1. $t(1)$: We immediately return, complexity is $O(1)$ or let's denote it with $c$ for constant time.
2. $t(2)$: We do $2 \times t(2 - 1)$ = Which is some constant time for multiplication + time for $t(2 - 1)$ = $c + t(1) = 2c$.
3. $t(3)$: We do $3 \times t(3 - 1)$ = Some constant time for multiplication + time for $t(3 - 1)$ = $c + t(2) = c + 2c = 3c$.

Do you see a pattern? No? Let's try again. Do you see the pattern? Still not? Okay, the pattern is:
For $n$, time complexity would be = $nc$ or $O(n)$.

## Fibonacci
Let's level up. Another simple recursive algorithm, but the complexity analysis of this one makes my head spin.
```python
def fib(n):
    if n <= 2:
        return 1
    return fib(n - 1) + fib(n - 2)
```
At first, it looks similar to the previous example, and my monkey brain tries to short-circuit it and think of it as $ \sim 2 \times \text{fib}(n - 1) $, giving a complexity of $ O(n) $ - which is wrong.

Let's see if we can deduce it as we did with the factorial.
1. $ t(1) $ or $ t(2) = c $
2. $ t(3) = t(2) + t(1) + c $ (some constant time for addition) = $ c + c + c = 3c $
3. $ t(4) = t(3) + t(2) + c = 3c + c + c = 5c $
4. $ t(5) = t(4) + t(3) + c = 5c + 3c + c = 9c $

Do you see a pattern? Not yet? Let's do another one:
$ t(6) = t(5) + t(4) + c = 9c + 5c + c = 15c $

Do you see it yet? Maybe not? And that's fine, as the pattern is not very explicit in this case because the problem is not equally divided, but the complexity is rising exponentially with some base between $ 1 $ and $ 2 $, and we can say it's $ O(2^n) $.

It's interesting to see how two seemingly similar algorithms have vastly different runtimes. BTW, if you were to write both of these algorithms iteratively, which is pretty straightforward as well, the time complexity for both would be $ O(n) $.

## Notation
We already used the $t(n)$ notation above, but we went from $t(1)$ to $t(n)$ and tried to find a pattern while doing so. We could have gone backwards as well, and it turns out that the pattern becomes more apparent while doing so, as we mostly keep talking in terms of $n$.

Let's take the previous two examples for another spin.
### Factorial
$t(n) = c + t(n - 1) = c + (c + t(n - 2)) = 2c + t(n - 2) = 2c + (c + t(n - 3)) = 3c + t(n - 3)$

Do you see the pattern? It is very evident in this case. The pattern is $k \cdot c + t(n - k)$ where $k$ is $0 \rightarrow n$. If we do $k = n$, then $t(n) = n \cdot c + t(0) = n \cdot c + c = O(n)$

### Fibonacci
$t(n) = t(n - 1) + t(n - 2) + c$

$t(n - 1)$ and $t(n - 2)$ would be similar, or at least when we talk about big-O notation, we can say $t(n - 1) \approx t(n - 2)$ in this case, which gives us:

$t(n) = 2 \cdot t(n - 1) + c = 2 \cdot (2 \cdot t(n - 2) + c) + c = 2^2 \cdot t(n - 2) + 2c + c$

$= 2^2 \cdot (2 \cdot t(n - 3) + c) + 3c = 2^3 \cdot t(n - 3) + 2^2c + 2c + c$

Here, while the constant part is pretty significant, it's less than the first variable part and thus can be ignored when using big-O. So, let's rewrite it without the constant part.

$t(n) = 2 \cdot t(n - 1) = 2 \cdot (2 \cdot t(n - 2)) = 2^2 \cdot t(n - 2) = 2^2 \cdot (2 \cdot t(n - 3)) = 2^3 \cdot t(n - 3)$

Do you see the pattern? Again, it's very explicit. The pattern is $2^k \cdot t(n - k)$ where $k$ is $0 \rightarrow n$. If we do $k = n$, then $t(n) = 2^n \cdot t(0) = (2^n) \cdot c = O(2^n)$

That was fun. Let's try this approach on a couple more algorithms.

## Tower of Hanoi
The Tower of Hanoi is a classic problem that involves three towers and you need to move the disks from the source to the target tower using the remaining tower. I won't go into the details of the problem and rules, but the recursive implementation would look something like this:

```python
# Moving n disks from t1 to t2 using t3 as auxiliary
def tower_of_hanoi(n, t1, t2, t3):
    if n == 1:
        print(f"Move disk 1 from {t1} to {t2}")
        return
    tower_of_hanoi(n - 1, t1, t3, t2)
    print(f"Move disk {n} from {t1} to {t2}")
    tower_of_hanoi(n - 1, t3, t2, t1)
```

The function `tower_of_hanoi` is called twice for each disk, except the last one, which gives us the recurrence relation:

$ t(n) = 2 \cdot t(n - 1) + c $

Now, come to think of it, this looks simpler than the fibonacci example we saw earlier.

Equation is exactly same as fibonacci. Let's not do the same drill again and conclude the complexity to be $ O(2^n) $.

## Binary Tree Algorithms
These things are looking to be easier than when I started. Let's try a couple more examples.

### Tree Traversal

Tree traversal algorithms, such as in-order, pre-order, and post-order, visit each node in a binary tree exactly once. Here's in-order traversal:

```python
def in_order_traversal(node):
    if node is not None:
        in_order_traversal(node.left)
        print(node.value)
        in_order_traversal(node.right)
```

I've always argued that we need to visit each node exactly once, so the complexity is $O(n)$. But let's not cheat like that and stick to what we've been doing so far. But, for simplicity, let's assume that the tree is balanced, i.e. each node has exactly two children. That will give us:

$ t(n) = 2 \cdot t(n / 2) + c $

Let's do the same drill as we did for the previous examples.

$ t(n) = 2 \cdot t(n / 2) + c = 2 \cdot (2 \cdot t(n / 4) + c) + c = 2^2 \cdot t(n / 4) + 2c + c = 2^2 \cdot (2 \cdot t(n / 8) + c) + 3c = 2^3 \cdot t(n / 8) + 2^2c + 2c + c $

Do you see the pattern? Actually let's get rid of the constants and simplify it.

$ t(n) = 2 \cdot t(n / 2) = 2 \cdot (2 \cdot t(n / 4)) = 2^2 \cdot t(n / (2^2)) = 2^2 \cdot (2 \cdot t(n / 8)) = 2^3 \cdot t(n / (2^3)) $

$ t(n) = 2^k \cdot t(n / (2^k)) $

If we set $ k = \log n $, we can get rid of $ t() $ on right side and get

$ t(n) = 2^{\log n} \cdot t(1) = n \cdot c = O(n) $

Wow, that was fun. Let's do one more and then call it a day.

### Binary Tree Search

Searching for a value in a balanced binary tree

```python
def search_tree(node, value):
    if node is None or node.value == value:
        return node
    if value < node.value:
        return search_tree(node.left, value)
    else:
        return search_tree(node.right, value)
```

This one is interesting. It looks like the previous one, but it's not; because we only go either left or right. The recurrence relation is:

$ t(n) = t(n / 2) + c $

$ t(n) = t(n / 2) + c = (t(n / 4) + c) + c = (t(n / 8) + c) + c + c = t(n / (2^3)) + 3*c $

Pattern is $ t(n / (2^k)) + k \cdot c $.

If we set $ k = \log n $, we can get rid of $ t() $ on right side and get

$ t(n) = t(n / (2^{\log n})) + \log n \cdot c = t(1) + \log n \cdot c = c + \log n \cdot c = O(\log n) $


## Next

Hopefully, this will help me kickstart the complexity analysis of some simple algorithms that follow straightforward patterns or have a fixed number of recursive calls at each recursion. Of course, it might not work or would be hard to generalize this for some "complex" algorithms, like the graph algorithms. There's also [Master's Theorem](https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)), which helps with these complexity analyses, but for the life of me, I can't seem to remember it and don't find it intuitive enough. But check that out if it works for you.
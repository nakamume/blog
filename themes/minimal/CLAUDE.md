# Minimal Theme

A clean, sepia-toned Hugo theme with dark mode support.

## File Structure

```
themes/minimal/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html      # Base template (head, nav, footer, SVG icons)
│   │   ├── list.html        # Section/taxonomy list pages
│   │   └── single.html      # Individual post pages
│   ├── partials/
│   │   └── post-item.html   # Reusable post list item
│   └── index.html           # Homepage
├── static/
│   ├── css/style.css        # All styles
│   └── js/main.js           # All JavaScript
├── theme.toml               # Theme metadata
└── CLAUDE.md                # This file
```

## Features

### Theme Switching
Toggle between light (sepia) and dark themes via nav button.
- Respects `prefers-color-scheme` on first visit
- Persists choice in `localStorage`
- No flash on page load (theme applied before render)

**Files:** `main.js` (toggle logic), `style.css` (CSS variables), `baseof.html` (button + icons)

### SVG Icon System
Icons defined as SVG sprite in `baseof.html`:
- `icon-link` - Header anchor links
- `icon-copy` - Copy button default
- `icon-check` - Copy success
- `icon-sun` - Dark mode indicator
- `icon-moon` - Light mode indicator

**Usage in JS:** `icon('name')` returns SVG element

### Header Anchor Links
Auto-generated for h1-h6 with `id` in `.post-content`. Chain link icon appears on hover.

### Code Copy Button
All `<pre>` blocks get a copy button. Shows checkmark on success.

### Post Summaries
Uses Hugo's `<!--more-->` divider. Shows "Read More ..." link when truncated.

## CSS Architecture

### Variables
```css
:root {
  /* Colors */
  --color-bg         /* Main background */
  --color-bg-alt     /* Alternate background */
  --color-text       /* Main text */
  --color-text-muted /* Secondary text */
  --color-accent     /* Links, accents */
  --color-border     /* Borders */
  --color-highlight  /* <mark> highlight */
  --color-code-bg    /* Code block background */
  --color-code-text  /* Code block text */

  /* Typography */
  --font-sans
  --font-mono

  /* Layout */
  --max-width: min(70%, 900px)
  --spacing: 1.5rem
}

[data-theme="dark"] { /* Dark overrides */ }
```

### Sections
1. Variables
2. Reset & Base
3. Layout (header, footer, content)
4. Theme Toggle
5. Home Page
6. Post List
7. Single Post
8. Post Content (typography)
9. Table of Contents
10. Responsive (768px breakpoint)

## Configuration

```toml
# hugo.toml
[params]
heroTitle = "Welcome"
heroTagline = "A space for my thoughts"

[[params.blogSections]]
name = "Personal"
url = "/personal/"
description = "..."

[menu]
[[menu.main]]
name = "Personal"
url = "/personal/"
weight = 1
```

## Common Tasks

### Change Colors
Edit CSS variables in `:root` and `[data-theme="dark"]`.

### Add Icon
1. Add `<symbol id="icon-name">` to sprite in `baseof.html`
2. Use: `icon('name')` in JS

### Add Blog Section
```toml
[[params.blogSections]]
name = "New Section"
url = "/new-section/"
description = "Description"
```

### Enable TOC
```yaml
# Post front matter
toc: true
```

## Browser Support

Modern browsers (ES6+). Uses:
- CSS custom properties
- CSS `min()` function
- `navigator.clipboard` API
- `Element.replaceChildren()`

## Accessibility

- Semantic HTML (`<article>`, `<aside>`, `<nav>`)
- `aria-label` on icon buttons
- Keyboard-accessible anchors
- Sufficient color contrast
- Respects `prefers-color-scheme`

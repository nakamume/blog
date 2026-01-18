# Minimal Theme - Claude Reference

A clean, sepia-toned Hugo theme for personal blogs. This document helps Claude (and developers) understand, maintain, and extend the theme.

## File Structure

```
themes/minimal/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html      # Base template (head, nav, footer, SVG icons)
│   │   ├── list.html        # Section/taxonomy list pages
│   │   └── single.html      # Individual post pages
│   ├── partials/
│   │   └── post-item.html   # Reusable post list item component
│   └── index.html           # Homepage template
├── static/
│   ├── css/style.css        # All styles
│   └── js/main.js           # All JavaScript
├── theme.toml               # Theme metadata
└── CLAUDE.md                # This file
```

## Key Features

### 1. SVG Icon System
Icons are defined inline in `baseof.html` as an SVG sprite:

```html
<svg class="svg-icons">
  <symbol id="icon-link">...</symbol>
  <symbol id="icon-copy">...</symbol>
  <symbol id="icon-check">...</symbol>
</svg>
```

**Usage in JS** (`main.js`):
```javascript
icon('link')  // Returns SVG element using #icon-link
icon('copy')  // Returns SVG element using #icon-copy
icon('check') // Returns SVG element using #icon-check
```

**To add new icons:**
1. Add `<symbol id="icon-name">` to the sprite in `baseof.html`
2. Use with `icon('name')` in JavaScript

### 2. Header Anchor Links
Automatically adds clickable chain-link icons to h1-h6 in `.post-content`. Appears on hover (desktop) or always visible at 50% opacity (mobile).

**Controlled by:** `main.js` (header anchor section) + `.header-anchor` styles in CSS

### 3. Code Copy Button
Adds a copy button to all `<pre>` blocks in posts. Shows copy icon, changes to checkmark on success.

**Controlled by:** `main.js` (code copy section) + `.copy-btn` styles in CSS

### 4. Post Summaries with `<!--more-->`
Posts use Hugo's manual summary splitting. Content before `<!--more-->` shows in listings.

**Template:** `partials/post-item.html`
```html
{{ .Page.Summary }} {{ if .Page.Truncated }} <a href="...">Read More ...</a>{{ end }}
```

### 5. Table of Contents
Enabled per-post via front matter:
```yaml
toc: true
```

**Template:** `single.html` renders `{{ .TableOfContents }}`

## CSS Architecture

### Variables (`:root`)
```css
/* Colors */
--color-bg: #f4f1ea;        /* Main background (sepia) */
--color-bg-alt: #ebe6dc;    /* Alternate background */
--color-text: #433422;       /* Main text */
--color-text-muted: #6b5d4d; /* Secondary text */
--color-accent: #8b4513;     /* Links, accents (saddle brown) */
--color-border: #d4c8b8;     /* Borders */
--color-highlight: #fff3cd;  /* <mark> highlight */
--color-code-bg: #282c34;    /* Code block background */
--color-code-text: #abb2bf;  /* Code block text */

/* Typography */
--font-sans: system font stack
--font-mono: monospace font stack

/* Layout */
--max-width: min(70%, 900px); /* Content width */
--spacing: 1.5rem;            /* Base spacing unit */
```

### CSS Sections
1. **Variables** - All CSS custom properties
2. **Reset & Base** - Box-sizing, body, links
3. **Layout** - Header, footer, content container
4. **Home Page** - Hero, blog sections grid, recent posts
5. **Post List** - `.post-item`, `.summary`
6. **Single Post** - Header, meta, tags, navigation
7. **Post Content** - All typography within articles
8. **Table of Contents** - TOC styling
9. **Responsive** - Mobile breakpoint (768px)

## Configuration (hugo.toml)

```toml
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

### Change Color Scheme
Edit CSS variables in `:root`. All colors flow from these variables.

### Add a New Icon
1. Find SVG path data (e.g., from Bootstrap Icons)
2. Add to `baseof.html`:
   ```html
   <symbol id="icon-newname" viewBox="0 0 16 16">
     <path d="..."/>
   </symbol>
   ```
3. Use in JS: `icon('newname')`

### Add a New Section to Homepage
Edit `hugo.toml`:
```toml
[[params.blogSections]]
  name = "New Section"
  url = "/new-section/"
  description = "Description here"
```

### Modify Post List Item
Edit `partials/post-item.html`. Used by both homepage and list pages.

Parameters:
- `.Page` - The page object
- `.showSection` - Boolean to show "in section" label

### Add New Post Front Matter Feature
1. Add to `single.html` template
2. Use with `{{ with .Params.newfield }}...{{ end }}`

## Responsive Behavior

**Breakpoint:** 768px

**Mobile changes:**
- `--max-width: 100%`
- `--spacing: 1rem`
- Nav stacks vertically
- Post items stack vertically
- Header anchors always visible (50% opacity)

## Dependencies

- **Hugo** (any recent version)
- **No external CSS/JS** - fully self-contained
- **No build tools** - plain CSS and JS

## Accessibility

- Semantic HTML structure
- `aria-label` on icon-only buttons
- Keyboard-accessible header anchors (`:focus` state)
- Sufficient color contrast in sepia theme
- Respects `prefers-reduced-motion` (no animations by default)

## Browser Support

Modern browsers (ES6+). Uses:
- CSS custom properties
- CSS `min()` function
- `navigator.clipboard` API
- SVG `<use>` elements

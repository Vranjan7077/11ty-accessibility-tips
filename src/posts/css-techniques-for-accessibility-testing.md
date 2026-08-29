---
title: CSS techniques for accessibility testing
description: Using CSS to visually detect accessibility issues like missing alt text, empty links, improper heading order, and missing ARIA labels during development.

topics: CSS

keywords:
    - css accessibility testing
    - debug accessibility with css
    - missing alt text css
    - heading order css
    - aria label testing
    - web accessibility
---

CSS can act as a visual linting tool during development. By using attribute selectors and pseudo-elements, you can highlight accessibility violations directly in the browser, no extensions needed. One caveat before diving in: every technique below is a debug aid meant for your local environment. The `!important` outlines and generated-content labels are loud on purpose - strip them out (or gate them behind a dev-only stylesheet, see the bookmarklet toggle near the end) before anything ships.

## Missing alt text on images

Images without `alt` attributes or with empty `alt` on non-decorative images - for the full picture on what good alt text actually looks like, see [indicate img elements that miss alt attribute](/topics/css/indicate-img-elements-that-miss-alt-attribute/):

```css
img:not([alt]) {
    outline: 5px solid red !important;
    filter: grayscale(100%) !important;
}

img[alt=""] {
    outline: 5px dashed orange !important;
}
```

Images with `alt=""` are treated as decorative. The orange outline reminds you to verify they truly are decorative.

## Empty links and buttons

Interactive elements with no text content are invisible to screen readers:

```css
a:empty,
button:empty {
    outline: 5px solid red !important;
}

a:not([href]) {
    outline: 3px dashed orange !important;
}
```

## Missing form labels

Inputs without associated labels - [accessible forms and labels](/topics/html/accessible-forms-and-labels/) covers the full labeling story, including why this CSS check alone can't catch every case:

```css
input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([aria-label]):not([aria-labelledby]) {
    outline: 5px solid red !important;
}

select:not([aria-label]):not([aria-labelledby]) {
    outline: 5px solid red !important;
}

textarea:not([aria-label]):not([aria-labelledby]) {
    outline: 5px solid red !important;
}
```

> **Note:** This is a rough heuristic. Inputs with programmatically associated `<label>` elements via `for`/`id` won't be caught by CSS alone since CSS can't detect the association.

## Missing ARIA labels on landmarks

Landmarks that need differentiation when there are multiples on a page:

```css
nav:not([aria-label]):not([aria-labelledby]) {
    outline: 3px dashed orange !important;
}

aside:not([aria-label]):not([aria-labelledby]) {
    outline: 3px dashed orange !important;
}

section:not([aria-label]):not([aria-labelledby]) {
    outline: 3px dashed orange !important;
}
```

## Focus visibility

Detect elements that suppress focus outlines:

```css
*:focus {
    outline: none !important;
}
```

If you see the above in your codebase, it's a red flag. Replace it with:

```css
*:focus-visible {
    outline: 2px solid #818cf8;
    outline-offset: 2px;
}

*:focus:not(:focus-visible) {
    outline: none;
}
```

This removes outline only for mouse clicks while keeping it for keyboard navigation.

## Touch target visualization

Highlight elements that may be too small for touch interaction - see [touch target size and spacing](/topics/css/touch-target-size-and-spacing/) for what "too small" actually means under WCAG 2.2:

```css
a,
button,
input,
select,
textarea,
[role="button"],
[role="link"],
[role="tab"] {
    position: relative;
}

a::after,
button::after,
[role="button"]::after {
    content: '';
    position: absolute;
    inset: 0;
    outline: 1px dotted rgba(255, 0, 0, 0.5);
    pointer-events: none;
}
```

## Heading hierarchy check

Headings should follow a logical order (h1 -> h2 -> h3) - [avoid skipping heading levels](/topics/accessibility/avoid-skipping-heading-levels/) explains why this matters and what actually counts as "skipping." Use CSS to display heading levels:

```css
h1::before,
h2::before,
h3::before,
h4::before,
h5::before,
h6::before {
    display: inline-block;
    padding: 0.1em 0.4em;
    margin-right: 0.5em;
    font-size: 0.7em;
    font-weight: bold;
    border-radius: 0.25em;
    vertical-align: middle;
    color: white;
}

h1::before { content: 'H1'; background: #22c55e; }
h2::before { content: 'H2'; background: #3b82f6; }
h3::before { content: 'H3'; background: #8b5cf6; }
h4::before { content: 'H4'; background: #ec4899; }
h5::before { content: 'H5'; background: #f59e0b; }
h6::before { content: 'H6'; background: #ef4444; }
```

## Showing landmark regions

Visualize the landmark structure of a page:

```css
header { outline: 2px solid #22c55e !important; }
nav { outline: 2px solid #3b82f6 !important; }
main { outline: 2px solid #8b5cf6 !important; }
aside { outline: 2px solid #ec4899 !important; }
footer { outline: 2px solid #f59e0b !important; }
section { outline: 2px dashed #94a3b8 !important; }
article { outline: 2px dashed #818cf8 !important; }

header::before { content: '<header>'; }
nav::before { content: '<nav>'; }
main::before { content: '<main>'; }
aside::before { content: '<aside>'; }
footer::before { content: '<footer>'; }

header::before,
nav::before,
main::before,
aside::before,
footer::before {
    display: block;
    font-size: 0.7rem;
    font-family: monospace;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.15em 0.5em;
    width: fit-content;
    border-radius: 0 0 0.25em 0;
}
```

## Color contrast debugging

Display contrast information using DevTools-free techniques - for the actual ratios you need to hit, see [color contrast and readability](/topics/css/color-contrast-and-readability/):

```css
body {
    filter: grayscale(100%);
}
```

If your page becomes unreadable in grayscale, you're relying too heavily on color to convey information.

### Simulating color blindness

```css
body { filter: url('#protanopia'); }
```

```html
<svg style="display: none">
    <filter id="protanopia">
        <feColorMatrix type="matrix" values="
            0.567, 0.433, 0,     0, 0
            0.558, 0.442, 0,     0, 0
            0,     0.242, 0.758, 0, 0
            0,     0,     0,     1, 0
        "/>
    </filter>
</svg>
```

## Creating a debug stylesheet

Bundle all checks into a single file you can toggle during development:

```css
/* a11y-debug.css */

img:not([alt]) {
    outline: 5px solid red !important;
}

a:empty, button:empty {
    outline: 5px solid red !important;
}

[tabindex]:not([tabindex="0"]):not([tabindex="-1"]) {
    outline: 3px solid orange !important;
}

[aria-hidden="true"]:focus-within {
    outline: 5px solid red !important;
}

[role="button"]:not(button) {
    outline: 3px dashed yellow !important;
}
```

Toggle it with a bookmarklet:

```javascript
javascript:void(function(){
    var s = document.getElementById('a11y-debug');
    if (s) { s.remove(); return; }
    s = document.createElement('link');
    s.id = 'a11y-debug';
    s.rel = 'stylesheet';
    s.href = '/a11y-debug.css';
    document.head.appendChild(s);
}())
```

## Browser DevTools

### Chrome

- Elements -> Accessibility pane -> view computed ARIA properties
- Rendering -> Emulate `prefers-reduced-motion` / `prefers-color-scheme`
- Lighthouse -> Accessibility audit

### Firefox

- Accessibility tab -> full accessibility tree
- Check for Issues -> Contrast, Keyboard, Text Labels
- Simulate -> color blindness types

## Resources

- [Diagnostic.css - Karl Groves](https://github.com/karlgroves/diagnostic.css)
- [a11y.css](https://ffoodd.github.io/a11y.css/)
- [Chrome DevTools Accessibility features](https://developer.chrome.com/docs/devtools/accessibility/)
- [Firefox Accessibility Inspector](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/)

---
title: Writing accessible CSS
description: CSS techniques for visually hidden content, focus styles, reduced motion, high contrast mode, and avoiding visual-DOM order mismatches.

topics: CSS

keywords:
    - accessible css
    - focus styles css
    - visually hidden css
    - forced colors css
    - high contrast mode css
    - web accessibility
---

It's easy to think of CSS as the layer that only affects how things look, but it just as often decides whether something works at all. A hidden focus ring, a `display: none` that quietly strips content from the accessibility tree, text set in `12px` with no way to resize it - none of that shows up in a design review, but all of it locks people out. This post covers the CSS-specific techniques that matter most: hiding content properly, keeping focus visible, sizing text so it scales, and respecting the preferences people have already told their OS about.

## Visually hidden content (screen reader only)

Sometimes you need text that is read by screen readers but not visible on screen. **Never use `display: none` or `visibility: hidden`** for this - both remove elements from the accessibility tree.

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
}

/* Allow the element to be focusable when navigated to */
.sr-only-focusable:focus,
.sr-only-focusable:active {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    clip-path: none;
    white-space: normal;
}
```

```html
<button>
    <svg aria-hidden="true"><!-- icon --></svg>
    <span class="sr-only">Close dialog</span>
</button>
```

## Focus styles

Focus indicators are **critical** for keyboard navigation. Never remove them without providing an alternative.

```css
/* Do not */
*:focus {
    outline: none;
}

/* Do - use :focus-visible for mouse-friendly, keyboard-accessible focus */
:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 3px;
    border-radius: 2px;
}

/* Optional - remove focus ring for mouse clicks */
:focus:not(:focus-visible) {
    outline: none;
}
```

> **`:focus-visible`** shows the focus ring only when the user navigates via keyboard, not mouse clicks. This is the modern best practice.

## Responsive text and readability

### Minimum text size

-   Body text should be at least **16px** (1rem). Smaller text causes readability issues for low-vision users.
-   Use `rem` units so text scales with the user's browser font size settings.

```css
html {
    font-size: 100%; /* Respects user's browser settings */
}

body {
    font-size: 1rem;    /* 16px base */
    line-height: 1.6;   /* Comfortable reading */
}

small {
    font-size: 0.875rem; /* 14px - minimum for readable text */
}
```

### Line length and spacing

-   Optimal line length is **45-75 characters** per line. Wider text is hard to track.
-   Line height of at least **1.5** for body text (WCAG 1.4.12).
-   Paragraph spacing of at least **1.5x the font size**.

```css
.content {
    max-width: 70ch; /* roughly 70 characters wide */
    line-height: 1.6;
}

.content p + p {
    margin-top: 1.5em;
}
```

## Respecting user preferences

### Reduced motion

Some users have told their operating system they get dizzy or nauseated from motion, and CSS can detect that. This deserves its own deep dive - see [reduced motion and animations](/topics/css/reduced-motion-and-animations/) for the full pattern, including how to handle auto-playing content and why `0.01ms` is used instead of `0s`.

### High contrast mode

Windows High Contrast Mode overrides most CSS colors. Use **transparent outlines** as fallbacks since they become visible in high contrast:

```css
button {
    border: 2px solid transparent; /* Visible in High Contrast Mode */
    background: #005fcc;
    color: #fff;
}

button:focus-visible {
    outline: 3px solid transparent; /* Visible in High Contrast Mode */
    box-shadow: 0 0 0 3px #005fcc;
}
```

### Forced colors

The `forced-colors` media query detects when the user has enabled a high contrast theme:

```css
@media (forced-colors: active) {
    .custom-checkbox {
        border: 2px solid ButtonText;
    }

    .custom-checkbox.checked::after {
        background: Highlight;
    }
}
```

> **System color keywords** like `ButtonText`, `Highlight`, `Canvas`, and `CanvasText` automatically map to the user's chosen high contrast colors.

## Scenarios and Edge Cases

### Content reordering with CSS

Using `order`, `flex-direction: row-reverse`, or CSS Grid placement can create a disconnect between **visual order** and **DOM order**. Screen readers and keyboard navigation follow the DOM, not the visual layout:

```css
/* Visual order: C, B, A - but keyboard tab order is still A, B, A */
.container {
    display: flex;
    flex-direction: row-reverse;
}
```

> **Rule:** Visual order and DOM order must match. If you need to reorder visually, reorder in the HTML instead.

### `content` property for meaningful text

The CSS `content` property in `::before` and `::after` is **not consistently announced by screen readers**. Never use it for meaningful content:

```css
/* Do not - some screen readers skip this */
.required::after {
    content: ' (required)';
}

/* Do - put meaningful text in the HTML */
```

```html
<label for="name">
    Name <span class="sr-only">(required)</span>
</label>
```

### `text-overflow: ellipsis` and truncated content

Truncated text hides information from everyone. Ensure the full text is available:

-   Via a `title` attribute (hover tooltip - not reliable for touch/keyboard).
-   Via `aria-label` containing the full text.
-   Via an expandable mechanism.

```html
<p class="truncated" title="Full text of this very long paragraph...">
    Full text of this very lo...
</p>
```

### Hiding decorative content from screen readers

Use `aria-hidden="true"` for purely decorative elements that would add noise:

```html
<span aria-hidden="true">Celebration</span>
<span aria-hidden="true">|</span>
<span aria-hidden="true">-></span>
```

### Resources

-   [MDN: CSS and Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript)
-   [WebAIM: CSS in Action](https://webaim.org/techniques/css/)
-   [WCAG 1.4.12 - Text Spacing](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html)
-   [A11y Project: Visually Hidden](https://www.a11yproject.com/posts/how-to-hide-content/)

Related: [color contrast and readability](/topics/css/color-contrast-and-readability/), [accessible dark mode implementation](/topics/css/accessible-dark-mode-implementation/), and [touch target size and spacing](/topics/css/touch-target-size-and-spacing/) round out the rest of the CSS-accessibility picture.

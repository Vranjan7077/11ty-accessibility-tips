---
title: Color contrast and readability
description: WCAG contrast requirements, tools for checking ratios, dark mode considerations, and handling text over images for readability.

topics: CSS

keywords:
    - color contrast accessibility
    - wcag contrast ratio
    - readable text accessibility
    - contrast checker
    - dark mode contrast
    - web accessibility
---

Contrast ratio measures how much a color stands out from what's behind it, expressed as a number from 1:1 (identical, invisible) to 21:1 (black on white). Get it wrong and text becomes unreadable for people with low vision or color blindness - and honestly, for anyone glancing at a phone screen in direct sunlight.

## WCAG contrast requirements

WCAG 2.1 defines two levels of conformance for text contrast:

| Level | Normal text (< 18pt) | Large text (>= 18pt or 14pt bold) |
| ----- | -------------------- | -------------------------------- |
| **AA** | 4.5:1 minimum | 3:1 minimum |
| **AAA** | 7:1 minimum | 4.5:1 minimum |

> **Tip:** Non-text UI elements (icons, borders, form controls) require a **3:1** contrast ratio against their background at AA level.

## Checking contrast ratios

Use CSS to define colors and verify them with a contrast checker:

```css
/* Poor contrast - ratio 2.5:1 (fails AA) */
.bad-example {
    color: #999999;
    background-color: #ffffff;
}

/* Good contrast - ratio 7.4:1 (passes AAA) */
.good-example {
    color: #333333;
    background-color: #ffffff;
}
```

### Tools for checking contrast:

-   [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Enter foreground and background colors.
-   [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Inspect an element and the color picker shows the contrast ratio inline.
-   [Stark](https://www.getstark.co/) - Design tool plugin for Figma, Sketch, and Adobe XD.
-   CSS itself can help you spot problems during development - see [CSS techniques for accessibility testing](/topics/css/css-techniques-for-accessibility-testing/) for a grayscale-filter trick that flags color-only distinctions.

## Don't rely on color alone

Color should never be the **only** way to convey information. This is critical for users with color blindness (approximately 8% of men and 0.5% of women).

```html
<!-- Do not - only color distinguishes valid from invalid -->
<input type="text" style="border-color: red;" />

<!-- Do - icon + text + color -->
<input type="text" aria-invalid="true" aria-describedby="name-error" style="border-color: red;" />
<p id="name-error">
    <span aria-hidden="true">Warning</span> Name is required.
</p>
```

### Common violations:

-   Links that are only distinguished from body text by color (add an underline).
-   Chart data series differentiated only by color (add patterns or labels).
-   Form error states shown only with a red border (add an icon and text).

## Using CSS custom properties for themeable contrast

```css
:root {
    --text-primary: #1a1a2e;
    --text-secondary: #4a4a68;
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5fa;
}

@media (prefers-contrast: more) {
    :root {
        --text-primary: #000000;
        --text-secondary: #1a1a1a;
        --bg-primary: #ffffff;
        --bg-secondary: #e0e0e0;
    }
}
```

> **`prefers-contrast: more`** is a media query that detects when the user has requested increased contrast through their OS settings. Use it to bump contrast ratios when needed.

## Text over images

Text placed on top of images often fails contrast when the image content varies:

-   **Solution 1:** Add a semi-transparent overlay behind the text.
-   **Solution 2:** Add a text shadow.
-   **Solution 3:** Place text in an opaque container.

```css
.hero-overlay {
    position: relative;
}

.hero-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
}

.hero-overlay h1 {
    position: relative;
    color: #ffffff;
}
```

## Focus indicator contrast

Focus indicators (outlines) must also meet the 3:1 contrast requirement against the **adjacent background**:

```css
/* Works on both light and dark backgrounds */
:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
}
```

> **Edge case:** If your site has both light and dark sections, a single outline color may not work everywhere. Use `outline-color: Highlight` for automatic OS-level adaptation, or programmatically adjust based on context.

## Dark mode contrast

Dark mode introduces its own contrast challenges, covered in full in [accessible dark mode implementation](/topics/css/accessible-dark-mode-implementation/):

-   **Pure white text (#fff) on pure black (#000)** can cause eye strain and visual distortion ("halation") for users with astigmatism. Use a slightly off-white (e.g., `#e0e0e0`) on a dark gray (e.g., `#1a1a2a`).
-   Always re-verify contrast ratios when switching themes - values that pass in light mode may fail in dark mode.

## Transparency and opacity

Using `opacity` or `rgba` colors can silently reduce contrast below acceptable levels:

```css
/* This might look fine, but the effective contrast could be as low as 1.5:1 */
.faded-text {
    color: rgba(0, 0, 0, 0.4);
    background: #ffffff;
}
```

Always test the **computed** color values, not just the authored ones.

## Resources

-   [WCAG 2.1 - Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
-   [WCAG 2.1 - Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
-   [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/)

---
title: Accessible dark mode implementation
description: Implementing dark mode with prefers-color-scheme while maintaining WCAG contrast ratios, respecting user preferences, and providing manual toggles.

topics: CSS

keywords:
    - accessible dark mode
    - dark mode accessibility
    - prefers-color-scheme
    - wcag contrast dark mode
    - accessible theming
    - web accessibility
---

Dark mode is more than an aesthetic choice - it's an accessibility feature. Users with light sensitivity, migraines, or visual fatigue benefit from reduced luminance. But a poorly implemented dark mode can create contrast issues that make content harder to read.

## Detecting system preference

Use `prefers-color-scheme` to match the user's OS-level preference:

```css
:root {
    --bg-primary: #ffffff;
    --bg-surface: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --border: #e2e8f0;
    --accent: #6366f1;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-primary: #0f172a;
        --bg-surface: #1e293b;
        --text-primary: #e2e8f0;
        --text-secondary: #94a3b8;
        --border: rgba(255, 255, 255, 0.1);
        --accent: #818cf8;
    }
}
```

```css
body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
```

## Manual toggle with localStorage

System preference detection alone isn't enough - provide a manual toggle:

```html
<button 
    id="theme-toggle" 
    aria-label="Switch to dark mode"
    aria-pressed="false"
>
    Moon
</button>
```

```javascript
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const currentTheme = savedTheme || systemPreference;

html.setAttribute('data-theme', currentTheme);
updateToggle(currentTheme);

toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggle(next);
});

function updateToggle(theme) {
    const isDark = theme === 'dark';
    toggle.textContent = isDark ? 'Sun' : 'Moon';
    toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    toggle.setAttribute('aria-pressed', String(isDark));
}
```

## CSS with data attribute

```css
:root,
[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-surface: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #475569;
}

[data-theme="dark"] {
    --bg-primary: #0f172a;
    --bg-surface: #1e293b;
    --text-primary: #e2e8f0;
    --text-secondary: #94a3b8;
}
```

## Preventing flash of wrong theme

Add a blocking script in `<head>` to set the theme before the page renders:

```html
<head>
    <script>
        (function() {
            const saved = localStorage.getItem('theme');
            const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', saved || system);
        })();
    </script>
</head>
```

## Contrast requirements

Both light and dark modes must meet WCAG contrast ratios - for the tools and edge cases (text over images, focus indicators) beyond what's specific to theming, see [color contrast and readability](/topics/css/color-contrast-and-readability/):

| Conformance | Text ratio | Large text ratio |
|-------------|-----------|-----------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

### Common contrast mistakes in dark mode

```css
[data-theme="dark"] {
    --text-primary: #64748b;
}
```

Gray text (#64748b) on a dark background (#0f172a) has a contrast ratio of only **3.1:1** - fails AA. Use a lighter gray like `#cbd5e0` (ratio **9.6:1**).

### Testing contrast

Use browser DevTools:
1. Inspect a text element
2. Click the color swatch in the Styles panel
3. The contrast ratio is displayed with a pass/fail indicator

## Images in dark mode

Images designed for light backgrounds can look harsh in dark mode:

```css
@media (prefers-color-scheme: dark) {
    img:not([src*=".svg"]) {
        opacity: 0.85;
        transition: opacity 0.2s ease;
    }

    img:not([src*=".svg"]):hover {
        opacity: 1;
    }
}
```

For SVG icons, use `currentColor` so they adapt automatically:

```css
.icon {
    fill: currentColor;
}
```

## Common mistakes

- **Not testing contrast in both modes** - Colors that pass in light mode often fail in dark mode.
- **Pure black backgrounds** - `#000000` is harsh. Use dark grays like `#0f172a` or `#1a202c`.
- **Pure white text** - `#ffffff` on dark backgrounds causes halation (light bleeding) for users with astigmatism. Use `#e2e8f0` instead.
- **Forgetting the `<meta name="theme-color">`** - Update it per theme so the browser chrome matches.
- **No manual override** - Some users want dark mode on a site even when their OS is in light mode.
- **Reusing the same visually-hidden or focus-ring CSS across themes without checking it** - see [writing accessible CSS](/topics/css/writing-accessible-css/) for patterns that need re-verifying whenever the palette changes.

## `color-scheme` property

Tell the browser about your supported color schemes so native controls adapt:

```css
:root {
    color-scheme: light dark;
}
```

This makes form inputs, scrollbars, and other browser-rendered elements match the active theme automatically.

## Resources

- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [MDN: color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme)

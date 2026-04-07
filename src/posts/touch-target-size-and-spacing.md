---
title: Touch target size and spacing
description: WCAG requirements for minimum touch target sizes, spacing between interactive elements, and CSS techniques for improving mobile usability.
topics: CSS
---

Small touch targets are one of the most common mobile accessibility failures. Users with motor impairments, tremors, or limited dexterity struggle to tap small buttons and links accurately.

## WCAG requirements

WCAG provides two levels of target size conformance :

| Level | Criterion | Minimum size |
|-------|-----------|--------------|
| AA | 2.5.8 Target Size (Minimum) | 24×24 CSS pixels |
| AAA | 2.5.5 Target Size (Enhanced) | 44×44 CSS pixels |

> **Recommendation :** Aim for **44×44px** minimum. This is also Apple's Human Interface Guidelines recommendation and Google's Material Design default.

## CSS techniques for larger targets

### Padding instead of dimensions

Don't set explicit width/height — use padding to grow the target naturally :

```css
.btn {
    padding: 0.75rem 1.5rem;
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
```

### Expanding link targets with pseudo-elements

Make a small text link easier to tap without changing its visual size :

```css
.nav-link {
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    inset: -8px;
}
```

This adds 8px of invisible clickable area around the link.

### Icon buttons

Icon-only buttons need explicit sizing :

```css
.icon-btn {
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    cursor: pointer;
}

.icon-btn svg {
    width: 20px;
    height: 20px;
}
```

The icon is 20px but the tap target is 44px.

## Spacing between targets

Adjacent targets that are too close cause accidental taps. WCAG 2.5.8 allows targets smaller than 24px only if they have enough spacing :

```css
.action-bar {
    display: flex;
    gap: 0.5rem;
}

.action-bar button {
    min-height: 44px;
    min-width: 44px;
}
```

### Inline links in text

Links within paragraphs are exempt from the 24px minimum, but you can help by increasing line height :

```css
.content {
    line-height: 1.7;
}

.content a {
    padding: 0.15em 0;
}
```

## Common problem areas

### Navigation menus

```css
.nav-list {
    list-style: none;
    padding: 0;
}

.nav-list a {
    display: block;
    padding: 0.75rem 1rem;
    min-height: 44px;
    display: flex;
    align-items: center;
}
```

### Form elements

Default checkbox and radio inputs are tiny. Increase their target using the label :

```html
<label class="checkbox-label">
    <input type="checkbox" />
    <span>Accept terms and conditions</span>
</label>
```

```css
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    min-height: 44px;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
}
```

### Close buttons

Close buttons on modals, alerts, and toasts are frequently too small :

```css
.close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.25rem;
}
```

## Testing target sizes

Use your browser's DevTools to verify target sizes :

1. Right-click an element → Inspect
2. Check the element's box model (content + padding)
3. Ensure the total clickable area is at least 44×44px

You can also use the CSS outline trick to visualize all clickable areas :

```css
a, button, input, select, textarea, [role="button"] {
    outline: 2px solid red !important;
}
```

## Resources

- [WCAG 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- [Apple HIG — Pointing and clicking](https://developer.apple.com/design/human-interface-guidelines/accessibility)

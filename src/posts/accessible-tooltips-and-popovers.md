---
title: Accessible tooltips and popovers
description: Building tooltips and popovers that work with keyboard navigation, screen readers, and touch devices using ARIA and the Popover API.
topics: HTML
---

Tooltips provide supplementary information when users hover or focus on an element. When built incorrectly, this information becomes invisible to keyboard and screen reader users.

## The difference between tooltips and toggletips

**Tooltip** — Appears on hover/focus, provides supplementary text, is not interactive :

```html
<button aria-describedby="save-tip">
    💾
</button>
<div role="tooltip" id="save-tip">Save document</div>
```

**Toggletip** — Appears on click, can contain interactive content (links, buttons) :

```html
<button aria-expanded="false" aria-controls="info-panel">
    ℹ️ More info
</button>
<div id="info-panel" role="region" hidden>
    <p>This feature requires a <a href="/upgrade">premium plan</a>.</p>
</div>
```

## Building an accessible tooltip

### HTML structure

```html
<span class="tooltip-trigger" tabindex="0" aria-describedby="tip-1">
    WCAG
</span>
<span role="tooltip" id="tip-1" class="tooltip">
    Web Content Accessibility Guidelines
</span>
```

### CSS

```css
.tooltip-trigger {
    position: relative;
    text-decoration: underline dotted;
    cursor: help;
}

.tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem 0.75rem;
    background: #1a202c;
    color: #fff;
    border-radius: 0.375rem;
    font-size: 0.85rem;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
}

.tooltip-trigger:hover .tooltip,
.tooltip-trigger:focus .tooltip {
    opacity: 1;
}
```

### Keyboard support

The tooltip must appear on focus, not just hover :

```css
.tooltip-trigger:focus-visible .tooltip {
    opacity: 1;
}
```

The Escape key should dismiss the tooltip without moving focus :

```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.tooltip').forEach(tip => {
            tip.style.opacity = '0';
        });
    }
});
```

## The Popover API

The Popover API provides built-in accessibility for interactive popovers :

```html
<button popovertarget="my-popover">Help</button>

<div id="my-popover" popover>
    <h3>Keyboard shortcuts</h3>
    <ul>
        <li><kbd>Ctrl+S</kbd> — Save</li>
        <li><kbd>Ctrl+Z</kbd> — Undo</li>
    </ul>
</div>
```

The Popover API automatically :
- Closes on Escape
- Closes when clicking outside
- Manages the top layer (no z-index issues)
- Works with screen readers

## ARIA attributes for tooltips

| Attribute | When to use |
|-----------|-------------|
| `role="tooltip"` | On the tooltip container |
| `aria-describedby` | On the trigger, points to the tooltip — for supplementary text |
| `aria-labelledby` | On the trigger, points to the tooltip — when the tooltip IS the label |
| `aria-expanded` | On the trigger for toggletips only |
| `aria-controls` | On the trigger, points to the toggletip content |

## Timing and persistence

Tooltips must remain visible long enough to be read :

- Show after a short delay (300–500ms) to prevent flickering
- Keep visible while the element has hover or focus
- Don't hide on a timer — let the user dismiss naturally

```css
.tooltip-trigger:hover .tooltip {
    opacity: 1;
    transition-delay: 0.3s;
}

.tooltip-trigger:not(:hover) .tooltip {
    transition-delay: 0s;
}
```

## Common mistakes

- **Hover-only tooltips** — Must also appear on keyboard focus.
- **Interactive content in tooltips** — Tooltips should contain only text. Use a toggletip or popover for links and buttons.
- **Custom title attributes** — The `title` attribute has poor screen reader support and cannot be styled. Avoid it.
- **Tooltips on disabled elements** — Disabled buttons can't receive focus. Wrap in a `<span>` with `tabindex="0"` instead.
- **Tooltips that obscure content** — Position tooltips so they don't cover adjacent elements or the trigger itself.

## Resources

- [WAI-ARIA Authoring Practices — Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [Inclusive Components — Tooltips and Toggletips](https://inclusive-components.design/tooltips-toggletips/)

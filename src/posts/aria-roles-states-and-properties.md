---
title: ARIA roles states and properties
description: Understanding WAI-ARIA roles, states, properties, and live regions for making custom widgets and dynamic content accessible.

type: guide
topics:
    - ARIA
    - HTML
technologies:
    - HTML
level: intermediate
wcag:
    - 4.1.2

keywords:
    - aria roles
    - aria states and properties
    - wai-aria
    - aria live regions
    - accessible custom widgets
    - web accessibility
---

WAI-ARIA (Accessible Rich Internet Applications) provides attributes that add semantic meaning to elements when native HTML alone is not sufficient. ARIA is essential for making custom widgets, dynamic content, and complex interactions accessible.

## The first rule of ARIA

> **"If you can use a native HTML element or attribute with the semantics and behavior you require already built in, do so instead of adding ARIA."** - [W3C ARIA in HTML](https://www.w3.org/TR/html-aria/)

```html
<!-- Do not - reinventing native semantics -->
<div role="button" tabindex="0" onclick="submit()">Submit</div>

<!-- Do - use native HTML -->
<button type="submit">Submit</button>
```

## ARIA roles

Roles define **what an element is**. They should never change after the element is rendered.

### Common widget roles:

| Role | Purpose | Native equivalent |
| ---- | ------- | ----------------- |
| `button` | Clickable action trigger | `<button>` |
| `link` | Navigation to another resource | `<a href>` |
| `checkbox` | Toggleable option | `<input type="checkbox">` |
| `tab` | Tab in a tabbed interface | None |
| `dialog` | Modal or non-modal dialog (see [accessible modals and dialogs](/topics/html/accessible-modals-and-dialogs/)) | `<dialog>` |
| `alert` | Important, time-sensitive message | None |
| `alertdialog` | Alert that requires confirmation | None |
| `progressbar` | Progress indicator | `<progress>` |

### Landmark roles:

These overlap with HTML5 landmark elements - see [HTML landmarks for accessibility](/topics/html/html-landmarks-for-accessibility/) for the full implicit-role table. Prefer the native element:

```html
<!-- Redundant - the native element already has this role -->
<nav role="navigation">...</nav>

<!-- Correct - just use the element -->
<nav>...</nav>
```

## ARIA states and properties

States and properties describe the **current condition** of an element. Unlike roles, states can change dynamically.

### Commonly used ARIA attributes:

```html
<!-- Expanded/collapsed state (accordions, menus) -->
<button aria-expanded="false" aria-controls="menu-list">Menu</button>
<ul id="menu-list" hidden>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
</ul>

<!-- Toggling aria-expanded via JavaScript -->
<script>
    const btn = document.querySelector('[aria-controls="menu-list"]');
    const menu = document.getElementById('menu-list');

    btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isExpanded));
        menu.hidden = isExpanded;
    });
</script>
```

### Key ARIA properties reference:

| Attribute | Purpose | Example |
| --------- | ------- | ------- |
| `aria-label` | Provides an accessible name | `<button aria-label="Close">x</button>` |
| `aria-labelledby` | References another element as the label | `<div aria-labelledby="section-title">` |
| `aria-describedby` | Links to a description | `<input aria-describedby="hint">` |
| `aria-hidden` | Hides from assistive tech | `<span aria-hidden="true">Search</span>` |
| `aria-live` | Announces dynamic changes | `<div aria-live="polite">` |
| `aria-expanded` | Expanded/collapsed state | `<button aria-expanded="false">` |
| `aria-controls` | Identifies the controlled element | `<button aria-controls="panel-1">` |
| `aria-current` | Current item in a set | `<a aria-current="page">Home</a>` |
| `aria-invalid` | Validation state | `<input aria-invalid="true">` |
| `aria-required` | Required field | `<input aria-required="true">` |

## Live regions for dynamic content

When content updates on screen without a page reload, screen readers will not announce it unless told to:

```html
<!-- Polite - waits for the user to finish their current task -->
<div aria-live="polite" aria-atomic="true">
    3 items added to cart.
</div>

<!-- Assertive - interrupts immediately (use sparingly) -->
<div aria-live="assertive" role="alert">
    Session expiring in 2 minutes.
</div>
```

**Important attributes:**

-   `aria-live="polite"` - Announces when convenient (most common).
-   `aria-live="assertive"` - Announces immediately, interrupting everything.
-   `aria-atomic="true"` - Reads the entire region, not just the changed text.
-   `aria-relevant="additions removals"` - Specifies which changes to announce.

## Scenarios and Edge Cases

### `aria-hidden` vs `display: none` vs `visibility: hidden`

| Method | Removed from visual layout? | Removed from accessibility tree? | Focusable? |
| ------ | --------------------------- | -------------------------------- | ---------- |
| `display: none` | Yes | Yes | No |
| `visibility: hidden` | No (takes space) | Yes | No |
| `aria-hidden="true"` | No (visible) | Yes | Yes (danger!) |

> **Danger:** If you use `aria-hidden="true"` on a container that has focusable children (links, buttons), keyboard users can focus those elements but screen readers will not announce them. Always pair `aria-hidden="true"` with `tabindex="-1"` on any focusable descendants or use the `inert` attribute.

### Over-using ARIA

Adding ARIA to elements that already have native semantics can confuse assistive technologies:

```html
<!-- Over-engineered - conflicts with native semantics -->
<a href="/about" role="link" aria-label="About page link">About</a>

<!-- Clean - native semantics are sufficient -->
<a href="/about">About</a>
```

### Tooltips and `aria-describedby`

Tooltips should be connected to their trigger and be accessible to keyboard users - [accessible tooltips and popovers](/topics/html/accessible-tooltips-and-popovers/) covers this pattern in depth, including the Popover API and the tooltip/toggletip distinction.

```html
<button aria-describedby="tooltip-save">Save</button>
<div id="tooltip-save" role="tooltip" hidden>
    Save your current progress (Ctrl+S)
</div>
```

-   Show the tooltip on `focus` and `mouseenter`, hide on `blur` and `mouseleave`.
-   Ensure `Escape` dismisses the tooltip.

### Testing ARIA implementation

-   **Chrome DevTools -> Accessibility tree** - Inspect how the browser computes the accessibility tree from your ARIA.
-   **Screen reader testing** - ARIA is interpreted differently across screen readers. Test with at least NVDA (Windows) and VoiceOver (macOS).
-   **axe DevTools** - Flags misused ARIA roles, states, and properties.

### Resources

-   [WAI-ARIA 1.2 Specification](https://www.w3.org/TR/wai-aria-1.2/)
-   [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
-   [MDN - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
-   [ARIA in HTML - W3C](https://www.w3.org/TR/html-aria/)

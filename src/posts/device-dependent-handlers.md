---
title: Device dependent event handlers

description: Replacing device-dependent event handlers with accessible alternatives to ensure keyboard, touch, and pointer compatibility.

topics: JavaScript

keywords:
    - device dependent event handlers
    - pointer and keyboard events
    - accessible event handlers
    - touch and keyboard accessibility
    - onclick accessibility
    - web accessibility
---

## What does device-independent mean?

If an interaction only fires on `mouseover` or `onclick` with no keyboard equivalent, it doesn't matter how good the rest of the page is - keyboard and switch-device users simply can't trigger it. Running an automated scan like WAVE will often surface this as "device-dependent event handler," which just means: something on the page only responds to a mouse.

The usual offender is a hover effect wired up with inline JavaScript:

```javascript
onmouseover = 'this.style.opacity=0.8;return false;';
onmouseleave = 'this.style.opacity=1;return false;';
```

The fix isn't really about inline JavaScript versus external files - a keyboard-inaccessible handler is just as broken in a `.js` file. What actually matters is whether the interaction is reachable without a mouse. For a simple hover effect like this one, the cleanest fix is to let CSS handle it, since `:hover` and `:focus` can both be targeted together:

```scss
img {
    opacity: 1;
    &:hover,
    &:focus-visible {
        opacity: 0.8;
    }
}
```

Adding `:focus-visible` alongside `:hover` is what actually makes this keyboard-accessible - `:hover` alone only ever fires for a mouse.

## Scenarios and Edge Cases

### Touch screens and hover states

On touch devices, `hover` states can cause unexpected behavior:

-   Some mobile browsers trigger `:hover` on first tap and the action on second tap, creating a confusing "double-tap to activate" pattern.

-   **Solution:** Avoid relying on hover as the only way to reveal content (e.g., tooltips, dropdown menus). Ensure all hover-revealed content is also accessible via tap/click and keyboard focus.

```scss
// Accessible hover/focus pattern
.dropdown-menu {
    display: none;

    .dropdown:hover &,
    .dropdown:focus-within & {
        display: block;
    }
}
```

### Dismissible menus and motor impairments

Users with motor impairments may overshoot a dropdown menu while moving the mouse. Design menus that:

-   **Stay open** when the mouse briefly exits the menu area (add a short delay with `setTimeout` before closing).

-   **Close with `Escape`** key for keyboard users.

-   **Use `focus-within`** so the menu remains open while any child element has focus.

```javascript
let closeTimer;
menu.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => closeMenu(), 300); // 300ms grace period
});
menu.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
});
menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});
```

### Drag-and-drop without keyboard alternatives

Drag-and-drop interfaces are inherently mouse-dependent. To make them accessible:

-   Provide **keyboard-operated controls** (e.g., "Move up" / "Move down" buttons) alongside drag handles.

-   Use `aria-grabbed` and `aria-dropeffect` to communicate drag state to assistive technologies.

-   Announce reorder changes via `aria-live` regions.

```html
<li draggable="true" aria-grabbed="false">
    <span>Item 1</span>
    <button aria-label="Move Item 1 up">Up</button>
    <button aria-label="Move Item 1 down">Down</button>
</li>
```

### Using Pointer Events as a modern alternative

The [Pointer Events API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) unifies mouse, touch, and pen input into a single API, reducing the need for separate `mouse*` and `touch*` handlers:

```javascript
element.addEventListener('pointerdown', handleInteraction);
element.addEventListener('pointerup', handleInteraction);
```

> **Note:** Pointer events do not replace the need for keyboard event handlers. Always pair pointer events with `keydown` / `keyup` handlers for full accessibility.

## Resources

- [Accessible JavaScript](https://webaim.org/techniques/javascript/eventhandlers)
- [Understanding SC 2.1.1: Keyboard - WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [Pointer Events - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

For keyboard interaction patterns beyond input-device parity, see [using keyboard for content accessibility](/topics/javascript/using-keyboard-for-content-accessibility/).

---
title: Device dependent event handlers
description: Replacing device-dependent event handlers with accessible alternatives to ensure keyboard, touch, and pointer compatibility.
topics: Javascript
---

# What does it mean ?

An event handler is present that may not be accessible.

The JavaScript events in use do not appear to be accessible to both mouse and keyboard users. To be fully accessible, critical JavaScript interaction should be device independent.

Ensure that critical functionality and content are accessible by using a device-independent event handler (which responds to both keyboard and mouse) or by using both a mouse-dependent and a keyboard-dependent event handler.

You will find this issue when you will check your webpage for accessibility using `Wave Accessibilty tool`.

To resolve this issue generally with `onmouseover` and `onmouseout` events is that we use something like this :

Example :

```javascript
onmouseover = 'this.style.opacity=0.8;return false;';
onmouseleave = 'this.style.opacity=1;return false;';
```

which can be easily achievable by css.

Example :

```scss
img {
    opacity: 1;
    &:hover {
        opacity: 0.8;
    }
}
```

> In simple words, we need to remove all the inline javascript but make sure you don't break its functionality.

<br>

### Resources :

-   [Accessible JavaScript](https://webaim.org/techniques/javascript/eventhandlers)

-   [W3C](https://www.w3.org/WAI/wcag-curric/sam70-0.htm)

<br>

## Scenarios and Edge Cases

### Touch screens and hover states

On touch devices, `hover` states can cause unexpected behavior :

-   Some mobile browsers trigger `:hover` on first tap and the action on second tap, creating a confusing "double-tap to activate" pattern.

-   **Solution :** Avoid relying on hover as the only way to reveal content (e.g., tooltips, dropdown menus). Ensure all hover-revealed content is also accessible via tap/click and keyboard focus.

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

Users with motor impairments may overshoot a dropdown menu while moving the mouse. Design menus that :

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

Drag-and-drop interfaces are inherently mouse-dependent. To make them accessible :

-   Provide **keyboard-operated controls** (e.g., "Move up" / "Move down" buttons) alongside drag handles.

-   Use `aria-grabbed` and `aria-dropeffect` to communicate drag state to assistive technologies.

-   Announce reorder changes via `aria-live` regions.

```html
<li draggable="true" aria-grabbed="false">
    <span>Item 1</span>
    <button aria-label="Move Item 1 up">↑</button>
    <button aria-label="Move Item 1 down">↓</button>
</li>
```

### Using Pointer Events as a modern alternative

The [Pointer Events API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) unifies mouse, touch, and pen input into a single API, reducing the need for separate `mouse*` and `touch*` handlers :

```javascript
element.addEventListener('pointerdown', handleInteraction);
element.addEventListener('pointerup', handleInteraction);
```

> **Note :** Pointer events do not replace the need for keyboard event handlers. Always pair pointer events with `keydown` / `keyup` handlers for full accessibility.

---
title: Using keyboard for content accessibility
description: Keyboard interaction patterns, focus trapping, focus restoration, and modern event.key usage for accessible custom widgets.
topics: Javascript
---

General keycode values used :

| Key           | Code | `event.key` value |
| ------------- | ---- | ----------------- |
| `tab`         | `9`  | `"Tab"`           |
| `enter`       | `13` | `"Enter"`         |
| `escape`      | `27` | `"Escape"`        |
| `space`       | `32` | `" "`             |
| `left arrow`  | `37` | `"ArrowLeft"`     |
| `up arrow`    | `38` | `"ArrowUp"`       |
| `right arrow` | `39` | `"ArrowRight"`    |
| `down arrow`  | `40` | `"ArrowDown"`     |

> **Note :** `keyCode` and `which` are deprecated. Use `event.key` instead for modern, readable code.

### Legacy approach (deprecated)

```javascript
var code = e.keyCode ? e.keyCode : e.which;
```

```javascript
var keyCode = e.keyCode || e.which;
```

### Modern approach (recommended)

```javascript
element.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Handle activation
    }
});
```

## Trapping focus inside modal

```javascript
$(document).ready(function () {
    $('#yourModal').on('shown.bs.modal', function () {
        $(this).focus();
    });
});
```

### Modern vanilla JS focus trap

```javascript
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }

        // Allow Escape to close the modal
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });

    // Set initial focus
    firstElement.focus();
}
```

## Scenarios and Edge Cases

### Focus restoration after closing a modal

When a modal closes, focus **must** return to the element that triggered it. Failing to do this leaves keyboard users stranded at the top of the page or in an unexpected location.

```javascript
let triggerElement = null;

function openModal(modal, trigger) {
    triggerElement = trigger;
    modal.setAttribute('aria-hidden', 'false');
    trapFocus(modal);
}

function closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    if (triggerElement) {
        triggerElement.focus(); // Restore focus to the trigger
    }
}
```

### Nested modals

-   Avoid nested modals when possible — they create complex focus management challenges.

-   If unavoidable, maintain a **stack** of trigger elements so focus is correctly restored through each level.

### Custom interactive widgets

Complex widgets like **tabs**, **accordions**, **carousels**, and **drag-and-drop** require specific keyboard patterns defined by the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) :

| Widget      | Expected keyboard behavior                                 |
| ----------- | ---------------------------------------------------------- |
| Tabs        | Arrow keys to switch tabs, `Tab` moves to the tab panel    |
| Accordion   | `Enter`/`Space` to toggle, arrow keys between headers      |
| Menu        | Arrow keys to navigate, `Enter` to select, `Escape` to close |
| Slider      | Arrow keys to adjust value, `Home`/`End` for min/max       |

### High contrast mode and focus indicators

-   Never use `outline: none` without providing an alternative focus indicator.

-   In Windows High Contrast Mode, `box-shadow` and `background-color` based focus styles become invisible. Use `outline` with a `transparent` color as a fallback :

```css
button:focus-visible {
    outline: 3px solid transparent; /* Visible in High Contrast Mode */
    box-shadow: 0 0 0 3px #4a90d9;  /* Visible normally */
}
```

### `tabindex` edge cases

-   `tabindex="0"` — Adds the element to the natural tab order. Use for custom interactive elements.

-   `tabindex="-1"` — Removes the element from tab order but allows programmatic focus via `.focus()`. Useful for modal containers and skip links targets.

-   `tabindex="1"` or higher — **Avoid this.** Positive tabindex values override natural DOM order and create unpredictable navigation.

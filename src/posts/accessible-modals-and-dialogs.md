---
title: Accessible modals and dialogs
description: Building accessible modal dialogs with proper focus trapping, keyboard support, and screen reader announcements using the dialog element.

type: pattern
topics:
    - HTML
    - Keyboard
    - Focus
technologies:
    - HTML
    - CSS
    - JavaScript
level: intermediate
wcag:
    - 2.1.1
    - 2.4.3
    - 4.1.2

keywords:
    - accessible modal
    - accessible dialog
    - dialog accessibility
    - focus trap modal
    - html dialog accessibility
    - web accessibility
---

Get a modal wrong and it fails loudly: keyboard users get stuck inside it (or worse, tab straight through to the page behind it), screen reader users lose track of what just opened, and the whole interaction breaks down. Get it right and most of this is handled for free by the platform.

## The native `<dialog>` element

Modern browsers support the `<dialog>` element which handles many accessibility concerns automatically:

```html
<dialog id="confirm-dialog" aria-labelledby="dialog-title">
    <h2 id="dialog-title">Confirm deletion</h2>
    <p>Are you sure you want to delete this item? This action cannot be undone.</p>
    <div>
        <button id="cancel-btn">Cancel</button>
        <button id="confirm-btn">Delete</button>
    </div>
</dialog>

<button id="open-btn">Delete item</button>
```

```javascript
const dialog = document.getElementById('confirm-dialog');

document.getElementById('open-btn').addEventListener('click', () => {
    dialog.showModal();
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    dialog.close();
});
```

`showModal()` automatically:
- Adds an inert backdrop
- Traps focus inside the dialog
- Allows Escape to close
- Returns focus to the trigger on close

## Focus management

### Initial focus placement

This is the same problem [focus management in SPAs](/topics/javascript/focus-management-in-spas/) solves for route changes - moving focus somewhere meaningful instead of leaving it stranded. Here, focus should move to the first interactive element, or the dialog itself if no logical first element exists:

```html
<dialog id="login-dialog" aria-labelledby="login-title">
    <h2 id="login-title">Sign in</h2>
    <label for="email">Email</label>
    <input type="email" id="email" autofocus />
    <label for="password">Password</label>
    <input type="password" id="password" />
    <button type="submit">Sign in</button>
</dialog>
```

For confirmation dialogs, focus the least destructive action:

```html
<dialog aria-labelledby="delete-title">
    <h2 id="delete-title">Delete account?</h2>
    <p>This will permanently remove all your data.</p>
    <button autofocus>Cancel</button>
    <button class="danger">Delete permanently</button>
</dialog>
```

### Returning focus

When the dialog closes, focus must return to the element that opened it:

```javascript
let triggerElement = null;

function openDialog(trigger) {
    triggerElement = trigger;
    dialog.showModal();
}

dialog.addEventListener('close', () => {
    if (triggerElement) {
        triggerElement.focus();
        triggerElement = null;
    }
});
```

## Focus trapping without `<dialog>`

If you must use a custom dialog, implement focus trapping manually:

```javascript
function trapFocus(element) {
    const focusable = element.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    });
}
```

## Making background content inert

When a modal is open, background content must be unreachable - the same `aria-hidden`/`inert` pattern shows up for off-canvas navigation in [HTML landmarks for accessibility](/topics/html/html-landmarks-for-accessibility/):

```javascript
function openModal(modal) {
    const mainContent = document.getElementById('main-content');
    mainContent.setAttribute('inert', '');
    mainContent.setAttribute('aria-hidden', 'true');
    modal.showModal();
}

function closeModal(modal) {
    const mainContent = document.getElementById('main-content');
    mainContent.removeAttribute('inert');
    mainContent.removeAttribute('aria-hidden');
    modal.close();
}
```

> **Note:** The native `<dialog>` with `showModal()` handles inertness automatically. Use `inert` only for custom implementations.

## Required ARIA attributes

```html
<div role="dialog" aria-modal="true" aria-labelledby="title" aria-describedby="desc">
    <h2 id="title">Session expiring</h2>
    <p id="desc">Your session will expire in 2 minutes. Would you like to continue?</p>
    <button>Continue session</button>
    <button>Log out</button>
</div>
```

- `role="dialog"` - Identifies the element as a dialog (not needed on `<dialog>`)
- `aria-modal="true"` - Tells assistive tech that content behind is inert
- `aria-labelledby` - Points to the dialog's heading
- `aria-describedby` - Points to the dialog's description

## Keyboard requirements

For keyboard patterns beyond what's specific to modals - roving tabindex, `tabindex` edge cases, general focus-trap logic - see [using keyboard for content accessibility](/topics/javascript/using-keyboard-for-content-accessibility/).

| Key | Action |
|-----|--------|
| Tab | Move focus to the next focusable element inside the dialog |
| Shift + Tab | Move focus to the previous focusable element |
| Escape | Close the dialog |
| Enter | Activate the focused button |

## Common mistakes

- **No Escape key support** - Users expect Escape to close any modal.
- **Focus escaping the dialog** - Tab should cycle within the dialog, never reaching background content.
- **No visible focus indicator** - Focus styles are even more critical inside modals.
- **Opening modals on page load** - Cookie banners and newsletter popups that steal focus on load are disorienting.
- **Nested modals** - Avoid opening a dialog from within another dialog.

## Resources

- [MDN: `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [WAI-ARIA Authoring Practices - Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [The `inert` attribute - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)

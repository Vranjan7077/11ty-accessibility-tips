---
title: Accessible error messages and validation
description: Implementing form validation that announces errors to screen readers using aria-live regions, aria-invalid, and proper error message association.
topics: HTML
---

Form validation errors are one of the most frustrating experiences for screen reader users. When errors appear visually but aren't announced, users submit forms repeatedly without understanding why they fail.

## Associating errors with inputs

Every error message must be programmatically linked to its input using `aria-describedby` :

```html
<label for="email">Email address</label>
<input 
    type="email" 
    id="email" 
    aria-describedby="email-error"
    aria-invalid="true"
/>
<span id="email-error" role="alert">
    Please enter a valid email address.
</span>
```

When the screen reader focuses the input, it announces : *"Email address, edit, invalid entry, Please enter a valid email address."*

## `aria-invalid`

Use `aria-invalid` to mark fields that have validation errors :

```javascript
function validateField(input, errorEl) {
    if (!input.validity.valid) {
        input.setAttribute('aria-invalid', 'true');
        errorEl.textContent = input.validationMessage;
    } else {
        input.removeAttribute('aria-invalid');
        errorEl.textContent = '';
    }
}
```

| Value | Meaning |
|-------|---------|
| `true` | The value is invalid |
| `false` | The value has been checked and is valid |
| `grammar` | A grammatical error was detected |
| `spelling` | A spelling error was detected |

## Live region announcements

Use `role="alert"` or `aria-live="assertive"` to announce errors immediately :

```html
<div role="alert" id="form-errors" aria-atomic="true"></div>
```

```javascript
function showErrors(errors) {
    const container = document.getElementById('form-errors');
    container.innerHTML = '';
    
    if (errors.length > 0) {
        const summary = document.createElement('p');
        summary.textContent = `${errors.length} error(s) found:`;
        container.appendChild(summary);

        const list = document.createElement('ul');
        errors.forEach(error => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${error.fieldId}`;
            link.textContent = error.message;
            li.appendChild(link);
            list.appendChild(li);
        });
        container.appendChild(list);
    }
}
```

## Error summary pattern

For forms with multiple errors, show a summary at the top and link each error to its field :

```html
<div role="alert" class="error-summary">
    <h2>There are 2 problems with your submission</h2>
    <ul>
        <li><a href="#name">Name is required</a></li>
        <li><a href="#email">Email format is invalid</a></li>
    </ul>
</div>

<form>
    <label for="name">Full name</label>
    <input type="text" id="name" aria-invalid="true" aria-describedby="name-error" />
    <span id="name-error" class="field-error">Name is required</span>

    <label for="email">Email</label>
    <input type="email" id="email" aria-invalid="true" aria-describedby="email-error" />
    <span id="email-error" class="field-error">Email format is invalid</span>
</form>
```

Move focus to the error summary after submission :

```javascript
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = validate(form);
    
    if (errors.length > 0) {
        showErrorSummary(errors);
        const summary = document.querySelector('.error-summary');
        summary.setAttribute('tabindex', '-1');
        summary.focus();
    }
});
```

## Inline validation timing

Validating while the user is still typing is disruptive. Follow this pattern :

1. **On submit** — Always validate all fields
2. **On blur** — Validate individual fields after the user leaves them
3. **On input (after error)** — Once a field has an error, re-validate on each keystroke to clear the error as soon as it's fixed

```javascript
input.addEventListener('blur', () => {
    validateField(input, errorEl);
});

input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') {
        validateField(input, errorEl);
    }
});
```

## Styling error states

```css
input[aria-invalid="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.field-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.field-error::before {
    content: '⚠';
}

.error-summary {
    border: 2px solid #ef4444;
    border-radius: 0.5rem;
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    background: rgba(239, 68, 68, 0.05);
}
```

> **Important :** Never use color alone to indicate errors. Combine color with icons, text, and borders so color-blind users can identify error states.

## Common mistakes

- **Only showing a red border** — Without text, screen readers have no idea what's wrong.
- **Removing error messages on focus** — Users need to read the error while fixing the field.
- **Clearing the entire form on error** — Users lose all their progress.
- **Generic error messages** — "Invalid input" doesn't help. Say what's wrong and how to fix it.
- **Missing `aria-invalid`** — Screen readers use this to announce the error state.

## Resources

- [WAI: Forms Validation](https://www.w3.org/WAI/tutorials/forms/validation/)
- [GOV.UK Design System — Error messages](https://design-system.service.gov.uk/components/error-message/)
- [MDN: aria-invalid](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-invalid)

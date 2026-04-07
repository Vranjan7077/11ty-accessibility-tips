---
title: Accessible forms and labels
description: Best practices for labeling inputs, grouping fields, handling errors, and making forms fully accessible to assistive technologies.
topics: HTML
---

Forms are one of the most critical components for accessibility. Without proper labeling and structure, users relying on assistive technologies cannot fill out registration forms, search bars, or checkout pages.

## Every input needs a label

The most common accessibility issue in forms is **missing or misassociated labels**. Every `<input>`, `<select>`, and `<textarea>` must have a programmatically associated `<label>`.

```html
<!-- Do not — placeholder is NOT a label -->
<input type="email" placeholder="Enter your email" />

<!-- Do — explicit label association -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" />
```

> **Why placeholders are not labels :** Placeholder text disappears when the user starts typing, leaving them with no reference for what the field expects. Users with cognitive disabilities and short-term memory issues are especially affected.

## Implicit vs explicit labeling

```html
<!-- Explicit — uses for/id pairing (recommended) -->
<label for="username">Username</label>
<input type="text" id="username" />

<!-- Implicit — wraps the input inside the label -->
<label>
    Username
    <input type="text" />
</label>
```

> **Tip :** Explicit labeling with `for`/`id` is more robust across assistive technologies and allows more flexible layouts.

## Grouping related fields with `<fieldset>` and `<legend>`

Radio buttons and checkboxes that belong together must be grouped so screen readers announce the group context :

```html
<fieldset>
    <legend>Preferred contact method</legend>
    <label>
        <input type="radio" name="contact" value="email" />
        Email
    </label>
    <label>
        <input type="radio" name="contact" value="phone" />
        Phone
    </label>
    <label>
        <input type="radio" name="contact" value="sms" />
        SMS
    </label>
</fieldset>
```

Without `<fieldset>` and `<legend>`, a screen reader would announce each radio button in isolation — "Email, radio button" — without the context of "Preferred contact method."

## Error messages and validation

Error messages must be programmatically linked to the field they describe. Users should not have to visually scan the page to find what went wrong.

```html
<label for="password">Password</label>
<input
    type="password"
    id="password"
    aria-describedby="password-error password-hint"
    aria-invalid="true"
/>
<p id="password-error" role="alert">Password must be at least 8 characters.</p>
<p id="password-hint">Use a mix of letters, numbers, and symbols.</p>
```

**Key attributes :**

-   `aria-invalid="true"` — Tells assistive technologies that the field has an error.
-   `aria-describedby` — Links one or more hint/error messages to the field.
-   `role="alert"` — Causes screen readers to announce the error immediately when it appears dynamically.

## Required fields

```html
<!-- Use both the required attribute and a visual indicator -->
<label for="name">
    Full name <span aria-hidden="true">*</span>
</label>
<input type="text" id="name" required aria-required="true" />
```

> **Note :** The asterisk (*) is hidden from screen readers with `aria-hidden="true"` because the `required` / `aria-required` attribute already conveys the same information. This avoids a redundant "star" announcement.

## Scenarios and Edge Cases

### Custom-styled selects and dropdowns

Native `<select>` elements are fully accessible out of the box. Custom dropdowns built with `<div>` elements are inherently inaccessible unless they implement the full [WAI-ARIA Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) :

-   `role="listbox"` on the container, `role="option"` on each item.
-   Arrow key navigation between options.
-   `aria-activedescendant` to track the focused option.
-   `Escape` to close, `Enter` to select.

> **Best practice :** Use native `<select>` unless you have a strong design reason not to. The accessibility cost of a custom dropdown is very high.

### Autocomplete and `<datalist>`

For search fields with suggestions, the native `<datalist>` element is accessible without extra effort :

```html
<label for="city">City</label>
<input type="text" id="city" list="cities" autocomplete="address-level2" />
<datalist id="cities">
    <option value="New York"></option>
    <option value="London"></option>
    <option value="Tokyo"></option>
</datalist>
```

If using a custom autocomplete widget, ensure :

-   `role="combobox"` on the input.
-   `aria-expanded` to indicate whether the suggestion list is open.
-   `aria-activedescendant` to track the highlighted suggestion.
-   `aria-live="polite"` on a region that announces the number of results.

### Multi-step forms (wizards)

-   Indicate progress with text (e.g., "Step 2 of 4") and use `aria-current="step"` on the active step indicator.
-   Preserve form state when navigating between steps — do not clear fields.
-   Move focus to the heading or first field of the new step after navigation.

### Disabled vs read-only fields

-   `disabled` fields are skipped by screen readers and keyboard navigation entirely — users may not know they exist.
-   `readonly` fields are focusable and announced but cannot be edited, which is usually a better choice for displaying pre-filled data.

```html
<!-- User won't know this exists -->
<input type="text" value="Locked value" disabled />

<!-- User can read it and knows it exists -->
<input type="text" value="Pre-filled value" readonly />
```

### Resources

-   [WebAIM: Creating Accessible Forms](https://webaim.org/techniques/forms/)
-   [MDN: Web forms — Working with user data](https://developer.mozilla.org/en-US/docs/Learn/Forms)
-   [WAI-ARIA Authoring Practices — Forms](https://www.w3.org/WAI/ARIA/apg/)

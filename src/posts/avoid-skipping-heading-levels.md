---
title: Avoid skipping heading levels
description: Why heading hierarchy matters for screen readers and how to maintain proper h1-h6 order across pages, modals, and dynamic content.
topics: Accessibility
metadata:
    image: avoid-skip-headings.png
---

It's common to use the heading elements, which ranges between `<h1>` to `<h6>`, to represent the heading of sections. The `<h1>` tag is often used in the highest section, whereas the `<h2>`, `<h3>`, ... tags are used in the lower section.

It's recommended to keep the heading elements in the order, so the users won't be confused that there's a missing heading or section while navigating on the page through the screen reading tools.

-   Use headings elements to introduce the content.

-   Use only one `h1` element per page.

```html
<!-- Do not -->
<h6>Heading level 6</h6>
<h3>Heading level 3</h3>
<h1>Main heading</h1>
<h2>Heading level 2</h2>

<!-- Do -->
<h1>Main heading</h1>
<h2>Heading level 2</h2>
<h3>Heading level 3</h3>
<h4>Heading level 4</h4>
<h5>Heading level 5</h5>
<h6>Heading level 6</h6>
```

## How to find the heading structure in a webpage ?

> Best way is to use the chrome extension known as [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en). It shows the list of headings and optional information about their level and if they break the correct hierarchical structure.

![Example of headings map](/assets/img/heading-structure-example.png)

The below example is a good way to explain the wrong heading structure used in the webpage. The content highlighted in `red color` showing that the heading was skipped and it will make the user confuse.

![Example of wrong heading strucutre](/assets/img/wrong-heading-structure.jpg)

## Scenarios and Edge Cases

### Visually smaller headings that must stay semantically correct

Sometimes a design calls for a smaller heading that visually looks like an `<h5>` but semantically should be an `<h2>`. Use CSS to change the visual size while keeping correct heading levels :

```html
<!-- Do not change the heading level to match visual size -->
<h2 class="heading--small">Section Title</h2>
```

```scss
.heading--small {
    font-size: 1rem; // Visually small, but semantically still h2
}
```

### Heading levels inside modals and dialogs

-   Modal dialogs are **visually separate** from the page, but they remain part of the same DOM. Starting a modal with `<h1>` can confuse screen reader users because the page already has an `<h1>`.

-   **Best practice :** Start modal headings at the next logical level in the parent page's hierarchy, or use `aria-labelledby` to reference the modal's heading without relying on heading levels at all.

```html
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <h2 id="modal-title">Confirm Deletion</h2>
    <p>Are you sure you want to delete this item?</p>
</div>
```

### Third-party widgets breaking heading structure

-   Embedded widgets (chat bots, social media feeds, ads) may inject their own `<h1>` or `<h2>` tags, breaking the host page's heading hierarchy.

-   **What you can do :** Audit embedded content with the HeadingMap tool. If the widget exposes configuration options, set appropriate heading levels. If it does not, document the issue and raise it with the vendor.

### Dynamic content and heading levels

-   In single-page applications (SPAs), dynamically loaded sections may introduce headings out of order.

-   After a route change, ensure the new content's heading structure follows a proper hierarchy relative to the overall page layout.

<!-- ## See also

-   [Avoid using multiple `<h1>` tags per page](/avoid-using-multiple-h1-tags-per-page) -->

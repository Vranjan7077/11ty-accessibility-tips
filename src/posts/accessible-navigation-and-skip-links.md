---
title: Accessible navigation and skip links
description: Building accessible nav structures with skip links, breadcrumbs, mega menus, and proper aria-current usage for screen readers.

topics: HTML

keywords:
    - accessible navigation
    - skip links
    - breadcrumb accessibility
    - keyboard navigation
    - aria-current navigation
    - web accessibility
---

Navigation is one of the first things a screen reader or keyboard user encounters. A well-structured, accessible navigation system makes the difference between a usable site and an unusable one.

## Skip links - bypassing repeated content

Keyboard users must tab through every link in the header and navigation before reaching the main content on every page load. A **skip link** solves this by allowing them to jump directly to the main content.

```html
<!-- As the very first element inside <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<header>
    <nav>
        <!-- Navigation links -->
    </nav>
</header>

<main id="main-content" tabindex="-1">
    <!-- Page content -->
</main>
```

```css
.skip-link {
    position: absolute;
    top: -100%;
    left: 0;
    padding: 0.75rem 1.5rem;
    background: #005fcc;
    color: #ffffff;
    font-weight: 600;
    z-index: 9999;
    transition: top 0.2s ease;
}

.skip-link:focus {
    top: 0;
}
```

> **Why `tabindex="-1"` on `<main>` ?** Without it, some browsers will scroll to the anchor but not move keyboard focus. Adding `tabindex="-1"` ensures focus actually moves to the main content area.

## Accessible `<nav>` structure

### Label multiple navigations

When a page has more than one `<nav>`, each must have a unique label:

```html
<nav aria-label="Primary">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<nav aria-label="Footer">
    <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
    </ul>
</nav>
```

### Indicate the current page

Use `aria-current="page"` to tell screen readers which link represents the currently active page:

```html
<nav aria-label="Primary">
    <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>
```

This is far more reliable than relying on visual styles like "active" classes, which provide no semantic meaning.

## Breadcrumb navigation

Breadcrumbs help users understand their position in the site hierarchy:

```html
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/products/shoes" aria-current="page">Shoes</a></li>
    </ol>
</nav>
```

```css
/* Visual separators using CSS - not announced by screen readers */
nav[aria-label="Breadcrumb"] ol {
    display: flex;
    list-style: none;
    padding: 0;
}

nav[aria-label="Breadcrumb"] li + li::before {
    content: '/';
    margin: 0 0.5rem;
    color: #666;
}
```

> **Note:** Use `<ol>` (ordered list) for breadcrumbs since the order matters. The CSS-generated separator (`/`) is invisible to screen readers, avoiding noisy "slash" announcements.

## Scenarios and Edge Cases

### Mega menus

Large navigation menus (mega menus) require careful implementation:

-   Use `aria-expanded` on the trigger button to indicate menu state.
-   Add `aria-haspopup="true"` on the trigger to indicate a submenu exists.
-   Allow `Escape` to close the menu and return focus to the trigger.
-   Use arrow keys for navigation within the menu (following the [WAI-ARIA Menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)).

```html
<nav aria-label="Primary">
    <ul role="menubar">
        <li role="none">
            <button role="menuitem" aria-haspopup="true" aria-expanded="false">
                Products
            </button>
            <ul role="menu" hidden>
                <li role="none"><a role="menuitem" href="/shoes">Shoes</a></li>
                <li role="none"><a role="menuitem" href="/bags">Bags</a></li>
            </ul>
        </li>
    </ul>
</nav>
```

### Mobile hamburger menus

-   The toggle button must use `aria-expanded` and `aria-controls`.
-   The hidden menu must have `aria-hidden="true"` when closed.
-   Focus must move into the menu when opened and return to the toggle button when closed.

```html
<button
    aria-expanded="false"
    aria-controls="mobile-menu"
    aria-label="Open navigation menu"
>
    <span class="hamburger-icon" aria-hidden="true">Menu</span>
</button>

<nav id="mobile-menu" aria-label="Mobile navigation" hidden>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>
```

### Single-page application (SPA) navigation

In SPAs, route changes don't trigger a page reload, so screen readers have no way of knowing content has changed - you have to announce it and move focus yourself. That's a big enough topic to deserve its own space: see [focus management in SPAs](/topics/javascript/focus-management-in-spas/) for the full pattern, including the framework-specific React and Angular examples.

### Pagination

Paginated lists should announce the current page and total within the navigation:

```html
<nav aria-label="Pagination">
    <ul>
        <li><a href="/page/1">1</a></li>
        <li><a href="/page/2" aria-current="page">2</a></li>
        <li><a href="/page/3">3</a></li>
    </ul>
</nav>
```

### Resources

-   [WebAIM: Skip Navigation](https://webaim.org/techniques/skipnav/)
-   [WAI-ARIA Practices - Navigation Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
-   [W3C - Navigation Landmark](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)

For how `<nav>` fits alongside the rest of the page's landmarks, see [HTML landmarks for accessibility](/topics/html/html-landmarks-for-accessibility/). For the ARIA attributes used throughout this post (`aria-expanded`, `aria-haspopup`, `aria-current`), see [ARIA roles, states, and properties](/topics/aria/aria-roles-states-and-properties/).

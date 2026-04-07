---
title: HTML Landmarks for accessibility
description: Using HTML5 landmark elements and ARIA roles to create navigable page regions for screen reader users.
topics: HTML
---

## Why we need accessibility Landmarks ?

It helps the physical impairment users who are using a screen reader and allows them to jump to a particular section of a webpage.

### Primary Landmark Elements

-   `<header>` - defines your header

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./main.css" />
    </head>
    <body>
        <header>Define your complete header including navigation etc.</header>
    </body>
</html>
```

-   `<nav>` - defines your navigation

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./main.css" />
    </head>
    <body>
        <header>
            <nav>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </nav>
        </header>
    </body>
</html>
```

-   `<footer>` - defines your footer in which we can add the copyrights

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./main.css" />
    </head>
    <body>
        <footer>Your footer content goes here...</footer>
    </body>
</html>
```

-   `<main>` - it is the main container in which we can place our content

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./main.css" />
    </head>
    <body>
        <main>
            <div>
                <h1>Heading</h1>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, dolores.</p>
            </div>
        </main>
    </body>
</html>
```

-   `<aside>`

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./main.css" />
    </head>
    <body>
        <aside>
            <h1>This is heading text in aside Tag</h1>
            <p>This is paragraph text in aside Tag</p>
        </aside>
    </body>
</html>
```

-   `<section>` - it is the container in which we can place our content and make them separate

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./main.css" />
    </head>
    <body>
        <header>
            <nav>Your navigation structure goes here...</nav>
        </header>
        <main>
            <section>
                <div>
                    <h1>Heading</h1>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, dolores.</p>
                </div>
            </section>
            <section>Second content here</section>
            <section>Third content here</section>
        </main>
        <footer>Your footer content goes here...</footer>
    </body>
</html>
```

### Primary Landmark Roles :

| Elements   | Implicit ARIA Role       |
| ---------- | ------------------------ |
| `<header>` | `role="banner"`          |
| `<nav>`    | `role="navigation"`      |
| `<main>`   | `role="main"`            |
| `<aside>`  | `role="complementary"`   |
| `<footer>` | `role="contentinfo"`     |
| `<section>`| `role="region"` (when labeled) |
| `<form>`   | `role="form"` (when labeled)   |

> **Note :** `<header>` maps to `banner` and `<footer>` maps to `contentinfo` only when they are **direct children** of `<body>`. When nested inside `<article>`, `<section>`, or other sectioning elements, they do not carry those implicit roles.

<br>

# Understanding it with the example :

As showing in the image below is the example of current page without using a landmark

![Missing landmark](/assets/img/html-landmarks-missing.jpg)

Now let's fix the issue showing in the axeDevtools - `Document should have one main landmark`. To fix this issue we have added one `role="main"` to the container of the page where our main content lies and notice that now we are not getting the error.

![Fixed missing landmark](/assets/img/html-landmarks-missing-fixed.jpg)

<br>

### Resources :

-   [Landmarks](https://a11y-101.com/development/landmarks)

-   [Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html)

-   [Page must have one main landmark](https://dequeuniversity.com/rules/axe/4.4/landmark-one-main)

-   [Why headings and landmarks are so important?](https://www.youtube.com/watch?v=vAAzdi1xuUY)

-   [Extension - landmark navgation](https://chrome.google.com/webstore/detail/landmark-navigation-via-k/ddpokpbjopmeeiiolheejjpkonlkklgp)

-   [Semantics - MDN](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)

-   [Deque University ](https://dequeuniversity.com/assets/html/jquery-summit/html5/slides/landmarks.html)

-   [Using ARIA landmarks to identify regions of a page](https://www.w3.org/WAI/GL/wiki/Using_ARIA_landmarks_to_identify_regions_of_a_page)

-   [HTML ARIA ](https://www.w3.org/TR/html-aria/#docconformance)

<br>

## Scenarios and Edge Cases

### Multiple identical landmarks on a page

When a page contains more than one instance of the same landmark (e.g., two `<nav>` elements), screen readers list them identically, making it impossible for users to distinguish between them.

**Solution :** Use `aria-label` or `aria-labelledby` to give each landmark a unique name :

```html
<nav aria-label="Main navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<nav aria-label="Footer navigation">
    <ul>
        <li><a href="/privacy">Privacy</a></li>
        <li><a href="/terms">Terms</a></li>
    </ul>
</nav>
```

### Landmarks in Single Page Applications (SPAs)

-   In SPAs, the page does not fully reload on navigation. Screen readers may not announce the new content automatically.

-   **Best practices :**

    -   Move focus to the new page's `<h1>` or `<main>` element after a route change.

    -   Use an `aria-live="polite"` region to announce the page title change.

    -   Ensure the `<title>` element is updated on each route change.

```javascript
// After route change
document.title = 'New Page Title - My App';
const mainHeading = document.querySelector('h1');
if (mainHeading) {
    mainHeading.setAttribute('tabindex', '-1');
    mainHeading.focus();
}
```

### Hidden and off-canvas landmarks

-   Off-canvas navigation (hamburger menus) must use `aria-hidden="true"` when closed so screen readers skip them.

-   When the menu opens, remove `aria-hidden` and manage focus appropriately.

-   Content behind an open modal or overlay should have `aria-hidden="true"` or `inert` applied to prevent screen reader access.

```html
<!-- Closed state -->
<nav id="mobile-nav" aria-label="Mobile navigation" aria-hidden="true">
    <!-- nav items -->
</nav>

<!-- Open state (via JavaScript) -->
<nav id="mobile-nav" aria-label="Mobile navigation" aria-hidden="false">
    <!-- nav items -->
</nav>
```

### Nested landmarks

-   Landmarks should not be unnecessarily nested. For example, placing a `<nav>` inside an `<aside>` inside a `<section>` creates a deeply nested structure that screen readers must enumerate verbosely.

-   Keep the landmark tree as flat and meaningful as possible.

### Using `<section>` as a landmark

-   `<section>` only becomes a landmark when it has an accessible name via `aria-label` or `aria-labelledby`. Without a label, it is just a generic grouping element.

```html
<!-- This IS a landmark -->
<section aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently Asked Questions</h2>
</section>

<!-- This is NOT a landmark -->
<section>
    <h2>Frequently Asked Questions</h2>
</section>
```

---
title: Indicate img elements that miss alt attribute
description: CSS techniques to highlight missing alt attributes, along with best practices for writing alt text, SVGs, and complex images.
topics: CSS
---

## What is an alt attribute ?

It specifies an alt text for an image, if the image cannot be shown.

### Tips to write a good alt text :

-   Keep it short and descriptive so that it will be easier to understand.

-   Don’t include 'image of' or 'photo of' else it will confuse the screen readers.

-   Always start the alt text content with the first letter as a capital.

-   Resources : [Accessibility: Image Alt text best practices](https://help.siteimprove.com/support/solutions/articles/80000863904) , [Alt Decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)

<br>

This code snippet gives you a red outline to any img having a missing or blank alt attribute in the webpage.

```scss
img:not([alt]),
img[alt=''] {
    outline: 8px dashed red;
}
```

### Tools to find the missing alt text in the webpage

-   [WAVE Accessibility Evaluation Tool](https://wave.webaim.org/extension/) - you can use wave tool to find the missing alt text in the webpage and fix the issue.

Example :

![No alt text](/assets/img/no-alt-text.jpg)

## Scenarios and Edge Cases

### Decorative images — when to use empty alt text

Not every image needs descriptive alt text. Purely decorative images (borders, spacers, background flourishes) should use an **empty** `alt` attribute so screen readers skip them :

```html
<!-- Decorative image — screen readers will ignore this -->
<img src="decorative-border.png" alt="" role="presentation" />
```

> **Important :** An `<img>` with no `alt` attribute at all is **not** the same as `alt=""`. Missing `alt` causes screen readers to announce the file name, which is confusing. Always include the attribute, even if empty.

### Inline SVG icons

SVG icons do not behave like `<img>` elements and need different treatment :

-   **Decorative SVGs :** Use `aria-hidden="true"` and ensure there is visible or visually-hidden text nearby.

```html
<button>
    <svg aria-hidden="true" focusable="false">
        <use href="#icon-search"></use>
    </svg>
    Search
</button>
```

-   **Informative SVGs :** Add `role="img"` and a `<title>` element with an `id`, then reference it with `aria-labelledby`.

```html
<svg role="img" aria-labelledby="chart-title">
    <title id="chart-title">Monthly revenue chart</title>
    <!-- SVG content -->
</svg>
```

> **Edge case :** Set `focusable="false"` on decorative SVGs in older versions of IE/Edge to prevent them from receiving keyboard focus.

### Complex images (charts, graphs, infographics)

For images that convey data or complex information, a short `alt` text is not enough :

-   Use `aria-describedby` to link to a longer description elsewhere on the page.

-   Or provide a visually hidden `<details>` / `<summary>` element with the full description.

```html
<figure>
    <img
        src="quarterly-sales.png"
        alt="Quarterly sales chart showing growth in Q3"
        aria-describedby="chart-description"
    />
    <figcaption id="chart-description">
        Q1: $120k, Q2: $95k, Q3: $210k (record high), Q4: $180k.
        The spike in Q3 was driven by the summer product launch.
    </figcaption>
</figure>
```

### CSS background images

CSS `background-image` is invisible to screen readers entirely. If a background image conveys meaning :

-   Add a visually hidden text alternative.

-   Or use an `<img>` tag instead so it can carry `alt` text.

```html
<div class="hero" role="img" aria-label="Mountain landscape at sunset">
    <!-- Content overlaying the background -->
</div>
```

### Lazy-loaded images

-   When using `loading="lazy"`, ensure the `alt` attribute is still present from the start — not injected later by JavaScript.

-   Some lazy-loading libraries replace `src` with `data-src` and only swap them on scroll. Screen readers may announce a broken image if `src` is empty or points to a placeholder. Always provide a valid `src` or use the native `loading="lazy"` attribute.

### Images inside `<a>` links

When an image is the **only content** inside a link, the `alt` text becomes the link's accessible name. Make sure it describes the **destination**, not the image :

```html
<!-- Do not -->
<a href="/profile"><img src="avatar.jpg" alt="Photo of a person" /></a>

<!-- Do -->
<a href="/profile"><img src="avatar.jpg" alt="View your profile" /></a>
```

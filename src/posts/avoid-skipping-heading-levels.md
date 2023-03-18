---
title: Avoid skipping heading levels
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

<!-- ## See also

-   [Avoid using multiple `<h1>` tags per page](/avoid-using-multiple-h1-tags-per-page) -->

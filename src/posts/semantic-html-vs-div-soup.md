---
title: Semantic HTML vs div soup
description: When to use semantic elements like section, article, aside, and figure instead of generic divs, and why it matters for screen readers and SEO.

topics: HTML

keywords:
    - semantic html
    - div soup accessibility
    - semantic elements
    - html accessibility
    - screen reader semantics
    - web accessibility
---

Semantic HTML communicates the purpose and structure of content to browsers, screen readers, and search engines. Using `<div>` and `<span>` for everything creates "div soup" - markup that looks structured visually but means nothing programmatically.

## Why semantics matter

Screen readers use semantic elements to build a navigable outline of the page. A user can jump between landmarks, headings, and regions without reading every word - see [HTML landmarks for accessibility](/topics/html/html-landmarks-for-accessibility/) for a deeper look at exactly what that landmark structure gives screen reader users and how each element maps to an implicit ARIA role.

Compare these two approaches:

```html
<div class="header">
    <div class="nav">
        <div class="nav-item"><a href="/">Home</a></div>
    </div>
</div>
<div class="main">
    <div class="article">
        <div class="title">Understanding Flexbox</div>
        <div class="content">...</div>
    </div>
    <div class="sidebar">...</div>
</div>
<div class="footer">...</div>
```

```html
<header>
    <nav aria-label="Main">
        <a href="/">Home</a>
    </nav>
</header>
<main>
    <article>
        <h1>Understanding Flexbox</h1>
        <p>...</p>
    </article>
    <aside aria-label="Related posts">...</aside>
</main>
<footer>...</footer>
```

The second version creates a navigable landmark structure that screen readers announce immediately.

## Element reference

### `<header>`

Page or section banner. Contains the logo, nav, and site-level controls:

```html
<header>
    <a href="/" aria-label="Home">Logo</a>
    <nav aria-label="Main navigation">...</nav>
</header>
```

An `<article>` can also have its own `<header>`:

```html
<article>
    <header>
        <h2>Building accessible forms</h2>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>
    <p>...</p>
</article>
```

### `<nav>`

A section with navigation links. Label it when there are multiple navs:

```html
<nav aria-label="Main">...</nav>
<nav aria-label="Breadcrumb">...</nav>
<nav aria-label="Pagination">...</nav>
```

### `<main>`

The primary content of the page. There must be only one per page:

```html
<body>
    <header>...</header>
    <main id="main-content">
        <!-- Primary content here -->
    </main>
    <footer>...</footer>
</body>
```

### `<article>`

Self-contained content that makes sense on its own - blog posts, news stories, comments, product cards:

```html
<article>
    <h2>Accessible color palettes</h2>
    <p>Choosing colors that meet WCAG contrast requirements...</p>
</article>
```

Articles can be nested (e.g., a blog post with comments):

```html
<article>
    <h2>My blog post</h2>
    <p>Content...</p>
    
    <section aria-label="Comments">
        <h3>Comments</h3>
        <article>
            <h4>Jane</h4>
            <p>Great post!</p>
        </article>
    </section>
</article>
```

### `<section>`

A thematic grouping of content with a heading. Use it when the content would logically appear in a document outline:

```html
<section aria-labelledby="features-heading">
    <h2 id="features-heading">Features</h2>
    <p>...</p>
</section>
```

> **Rule of thumb:** If you can't give it a meaningful heading, it probably shouldn't be a `<section>`. Use a `<div>` instead.

If headings themselves are giving you trouble - skipped levels, multiple `<h1>`s, an outline that doesn't make sense - [avoid skipping heading levels](/topics/accessibility/avoid-skipping-heading-levels/) covers that separately.

### `<aside>`

Content tangentially related to the main content - sidebars, pull quotes, related links:

```html
<aside aria-label="Related articles">
    <h2>Related articles</h2>
    <ul>
        <li><a href="/forms">Accessible forms</a></li>
        <li><a href="/aria">ARIA fundamentals</a></li>
    </ul>
</aside>
```

### `<figure>` and `<figcaption>`

Self-contained media with a caption:

```html
<figure>
    <img src="chart.png" alt="Bar chart showing screen reader market share in 2024" />
    <figcaption>
        NVDA leads at 40%, followed by JAWS at 30% and VoiceOver at 20%.
    </figcaption>
</figure>
```

Use for images, code blocks, diagrams, tables, or any content that has a caption:

```html
<figure>
    <pre><code>const x = 42;</code></pre>
    <figcaption>Declaring a variable in JavaScript</figcaption>
</figure>
```

### `<footer>`

Closing content for a page or section. Contains copyright, related links, contact info:

```html
<footer>
    <p>&copy; 2024 Your Name. All rights reserved.</p>
    <nav aria-label="Footer">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
    </nav>
</footer>
```

## When to use `<div>`

Use `<div>` for purely visual grouping that has no semantic meaning:

```html
<div class="card-grid">
    <article class="card">...</article>
    <article class="card">...</article>
</div>

<div class="flex-spacer"></div>

<div class="background-wrapper">
    <section>...</section>
</div>
```

## Common mistakes

- **`<section>` without a heading** - This creates a landmark with no label, confusing screen reader users.
- **`<nav>` for every list of links** - Only use `<nav>` for major navigation blocks. A list of social links in the footer doesn't need it.
- **Multiple `<main>` elements** - There must be exactly one `<main>` per page.
- **`<article>` for non-standalone content** - If the content doesn't make sense on its own (like a sidebar widget), use `<section>` or `<div>`.
- **Overusing landmarks** - Too many landmarks make navigation harder, not easier. A screen reader user pressing D to jump between landmarks benefits from 4-6 landmarks, not 20.

## Resources

- [MDN: Content sectioning elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning)
- [HTML5 Doctor - Let's Talk about Semantics](http://html5doctor.com/lets-talk-about-semantics/)
- [WAI: Page Structure Tutorial](https://www.w3.org/WAI/tutorials/page-structure/)

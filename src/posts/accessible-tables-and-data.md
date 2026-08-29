---
title: Accessible tables and data
description: Making data tables accessible with proper headers, scope, captions, and responsive patterns for screen reader users.

topics: HTML

keywords:
    - accessible tables
    - data table accessibility
    - table headers scope
    - responsive accessible tables
    - screen reader tables
    - web accessibility
---

Sighted users read a table by scanning across a row and up to its header - a glance does the work. A screen reader has no equivalent glance: without the right markup, it has no way to tell a user that "$410" belongs to "Q2" and "North America" at the same time, and the whole table collapses into a meaningless list of numbers.

## Basic accessible table structure

Every data table must have:

-   A `<caption>` or `aria-label` to describe its purpose.
-   `<thead>`, `<tbody>`, and optionally `<tfoot>` to group rows.
-   `<th>` elements with a `scope` attribute for header cells.

```html
<table>
    <caption>Quarterly revenue by region (in thousands USD)</caption>
    <thead>
        <tr>
            <th scope="col">Region</th>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Q3</th>
            <th scope="col">Q4</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">North America</th>
            <td>$320</td>
            <td>$410</td>
            <td>$390</td>
            <td>$450</td>
        </tr>
        <tr>
            <th scope="row">Europe</th>
            <td>$280</td>
            <td>$310</td>
            <td>$350</td>
            <td>$330</td>
        </tr>
    </tbody>
</table>
```

> **How screen readers use this:** When a user navigates to a cell like "$410", the screen reader announces "Q2, North America, $410" - combining the column and row headers. Without `scope`, the reader says just "$410", which is meaningless.

## `scope` vs `headers` attribute

-   **`scope`** - Works for simple tables with a single level of headers.
-   **`headers`** - Required for complex tables with merged cells or multi-level headers.

```html
<!-- Complex table with merged headers -->
<table>
    <caption>Sales performance</caption>
    <thead>
        <tr>
            <td rowspan="2"></td>
            <th id="h-2024" colspan="2" scope="colgroup">2024</th>
            <th id="h-2025" colspan="2" scope="colgroup">2025</th>
        </tr>
        <tr>
            <th id="h-2024-q1" scope="col">Q1</th>
            <th id="h-2024-q2" scope="col">Q2</th>
            <th id="h-2025-q1" scope="col">Q1</th>
            <th id="h-2025-q2" scope="col">Q2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th id="h-widgets" scope="row">Widgets</th>
            <td headers="h-2024 h-2024-q1 h-widgets">150</td>
            <td headers="h-2024 h-2024-q2 h-widgets">200</td>
            <td headers="h-2025 h-2025-q1 h-widgets">180</td>
            <td headers="h-2025 h-2025-q2 h-widgets">220</td>
        </tr>
    </tbody>
</table>
```

## Do not use tables for layout

This is a fundamental rule that is still violated today - the deeper reasoning behind reaching for `<aside>` and `<main>` instead of `<table>`/`<div>` is covered in [semantic HTML vs div soup](/topics/html/semantic-html-vs-div-soup/):

```html
<!-- Do not - table used for layout -->
<table>
    <tr>
        <td>Sidebar content</td>
        <td>Main content</td>
    </tr>
</table>

<!-- Do - use CSS for layout -->
<div class="layout">
    <aside>Sidebar content</aside>
    <main>Main content</main>
</div>
```

> If you absolutely must use a table for layout (legacy systems), add `role="presentation"` to strip all table semantics from screen readers.

## Responsive tables

On narrow screens, data tables are challenging - the visually-hidden CSS technique used below is explained in more depth in [writing accessible CSS](/topics/css/writing-accessible-css/). Common patterns and their accessibility implications:

### Horizontal scrolling

```css
.table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table-wrapper:focus-within {
    outline: 2px solid #005fcc;
}
```

```html
<div class="table-wrapper" tabindex="0" role="region" aria-label="Quarterly revenue table">
    <table>
        <!-- table content -->
    </table>
</div>
```

> Add `tabindex="0"` and `role="region"` with an `aria-label` on the scrollable wrapper so keyboard users can scroll and screen readers announce the scrollable area.

### Stacked cards pattern

For mobile, transform table rows into stacked cards using CSS:

```css
@media (max-width: 600px) {
    table, thead, tbody, th, td, tr {
        display: block;
    }

    thead {
        position: absolute;
        clip: rect(0 0 0 0);
    }

    td {
        padding-left: 50%;
        position: relative;
    }

    td::before {
        content: attr(data-label);
        position: absolute;
        left: 0.5rem;
        font-weight: 700;
    }
}
```

```html
<tr>
    <td data-label="Region">North America</td>
    <td data-label="Q1">$320</td>
    <td data-label="Q2">$410</td>
</tr>
```

## Scenarios and Edge Cases

### Sortable table columns

When columns are sortable, the sort state must be communicated:

```html
<th scope="col">
    <button aria-sort="ascending">
        Name
        <span aria-hidden="true">▲</span>
    </button>
</th>
```

-   `aria-sort` values: `ascending`, `descending`, `none`, `other`.
-   Announce sort changes via an `aria-live` region.

### Empty cells

Empty table cells should still contain something for screen readers to navigate:

```html
<!-- Do not leave completely empty -->
<td></td>

<!-- Better - indicate no data -->
<td> - </td>

<!-- Or use visually hidden text -->
<td><span class="sr-only">No data available</span> - </td>
```

### Tables with interactive content

Tables containing buttons, links, or form controls require extra care:

-   Each interactive element must have a unique, descriptive accessible name.
-   Ensure keyboard users can navigate both the table cells and the interactive elements within them.

```html
<td>
    <button aria-label="Edit record for North America">Edit</button>
    <button aria-label="Delete record for North America">Delete</button>
</td>
```

### Resources

-   [WebAIM: Creating Accessible Tables](https://webaim.org/techniques/tables/)
-   [MDN: Table accessibility](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced)
-   [W3C Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/)

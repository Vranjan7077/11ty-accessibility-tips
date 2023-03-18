---
title: HTML Landmarks for accessibility
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

| Elements    | Roles                  |
| ----------- | ---------------------- |
| `<header>`  | `role="banner"`        |
| `<nav>`     | `role="navigation"`    |
| `<aside>`   | `role="contentinfo"`   |
| `<sidebar>` | `role="complementary"` |
| `<footer>`  | `role="footer"`        |

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

---
title: Indicate img elements that miss alt attribute
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

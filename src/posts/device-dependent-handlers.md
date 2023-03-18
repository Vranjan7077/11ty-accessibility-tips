---
title: Device dependent event handlers
topics: Javascript
---

# What does it mean ?

An event handler is present that may not be accessible.

The JavaScript events in use do not appear to be accessible to both mouse and keyboard users. To be fully accessible, critical JavaScript interaction should be device independent.

Ensure that critical functionality and content are accessible by using a device-independent event handler (which responds to both keyboard and mouse) or by using both a mouse-dependent and a keyboard-dependent event handler.

You will find this issue when you will check your webpage for accessibility using `Wave Accessibilty tool`.

To resolve this issue generally with `onmouseover` and `onmouseout` events is that we use something like this :

Example :

```javascript
onmouseover = 'this.style.opacity=0.8;return false;';
onmouseleave = 'this.style.opacity=1;return false;';
```

which can be easily achievable by css.

Example :

```scss
img {
    opacity: 1;
    &:hover {
        opacity: 0.8;
    }
}
```

> In simple words, we need to remove all the inline javascript but make sure you don't break its functionality.

<br>

### Resources :

-   [Accessible JavaScript](https://webaim.org/techniques/javascript/eventhandlers)

-   [W3C](https://www.w3.org/WAI/wcag-curric/sam70-0.htm)

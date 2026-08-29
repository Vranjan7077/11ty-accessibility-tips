---
title: Automated Tools for Testing the accessibility

description: Free automated tools, screen readers, contrast checkers, and vision simulators for testing web accessibility against WCAG guidelines.

topics: Accessibility

keywords:
    - automated accessibility testing tools
    - axe devtools
    - wave accessibility tool
    - lighthouse accessibility
    - screen reader tools
    - web accessibility
---

Automated tools catch a real slice of accessibility issues by scanning your pages against WCAG rules, and they're worth running early and often. Just don't mistake a clean scan for a clean page - they're a starting point, not a replacement for [manual keyboard and screen reader testing](/topics/accessibility/screen-reader-testing-guide/). For a broader manual pass once the automated tools are done, the [accessibility testing checklist](/topics/accessibility/accessibility-testing-checklist/) is the next step, and if you write JavaScript tests, [accessibility testing with JavaScript](/topics/javascript/accessibility-testing-with-javascript/) covers wiring these same tools into CI.

## Automated scanning tools

- [WAVE Accessibility Evaluation Tool](https://wave.webaim.org/extension/) - WebAIM's browser extension, good for a quick visual overlay of issues on a live page.
- [axe DevTools](https://www.deque.com/axe/) - Deque's scanner, widely used and the engine behind most of the JavaScript testing libraries covered in the automated-testing-with-JavaScript post.

## Tools for specific checks

- [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en) - visualizes a page's heading outline, available for Chrome and Firefox. Useful alongside [avoid skipping heading levels](/topics/accessibility/avoid-skipping-heading-levels/).

## Color contrast checkers

- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - WebAIM's tool for checking a foreground/background pair against WCAG ratios. See [color contrast and readability](/topics/css/color-contrast-and-readability/) for what those ratios actually need to be.

## Screen readers

- [NVDA](https://www.nvaccess.org/) - free and open source, the most widely used screen reader on Windows, and the one most guides (including this site's [screen reader testing guide](/topics/accessibility/screen-reader-testing-guide/)) recommend starting with.
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - the other major Windows screen reader, commercial, with strong enterprise adoption.
- Built-in options are worth testing with too: VoiceOver ships with every Mac and iPhone, TalkBack with every Android phone, and Narrator with every Windows install - none of them require installing anything.

## Vision simulation tools

- [Funkify Disability Simulator](https://www.funkify.org/) - simulates a range of conditions including dyslexia, motor impairments, and different types of color blindness, directly in the browser.
- A contrast-vision simulator is worth having alongside this - Chrome DevTools' own Rendering panel includes a "vision deficiencies" emulator built in, under Rendering -> Emulate vision deficiencies, with no extension required.

## Scenarios and Edge Cases

### Things automated tools can miss

Automated tools typically catch only **30-40%** of accessibility issues. Here are areas where manual testing is essential:

-   **Keyboard-only navigation** - Automated tools flag missing focus styles but cannot verify that tab order is logical, that focus is never trapped unintentionally, or that all interactive elements are reachable.

-   **Meaningful reading order** - A page can pass all automated checks while the DOM order makes no sense to a screen reader.

-   **Dynamic content** - Content loaded via JavaScript (accordions, infinite scroll, single-page app route changes) may not be announced. Use `aria-live` regions and test manually with a screen reader.

-   **Context-dependent alt text** - Automated tools flag missing `alt` attributes, but they cannot judge whether the alt text you wrote actually conveys the right meaning in context.

### Reduced motion and animation accessibility

Users with vestibular disorders can experience nausea or dizziness from page animations - [reduced motion and animations](/topics/css/reduced-motion-and-animations/) covers the `prefers-reduced-motion` pattern in full. For testing it without changing your OS settings, Chrome DevTools -> Rendering -> Emulate CSS media feature `prefers-reduced-motion` does the job.

### Testing in different zoom levels

-   WCAG requires content to be usable at **200% zoom** and text-only at **400% zoom**. Automated tools do not test this.

-   Check for content overlap, truncation, and horizontal scrolling at increased zoom levels.

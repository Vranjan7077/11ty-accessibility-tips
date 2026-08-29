---
title: Accessibility testing checklist
description: A comprehensive manual testing checklist covering keyboard navigation, screen readers, visual design, forms, media, and ARIA implementation.

type: checklist
topics:
    - Accessibility
    - Testing
level: intermediate

keywords:
    - accessibility testing checklist
    - manual accessibility testing
    - wcag testing
    - screen reader testing
    - keyboard testing
    - web accessibility
---

Automated tools catch ~40% of accessibility issues - the rest still needs a human going through the page by hand. This checklist covers the manual checks needed to reach full WCAG 2.2 AA conformance, organized so you can run through it per page rather than trying to hold the whole thing in your head at once. Automated coverage in the JavaScript ecosystem is covered separately in [accessibility testing with JavaScript](/topics/javascript/accessibility-testing-with-javascript/), and a rundown of the tools themselves lives in [automated accessibility testing tools](/topics/accessibility/automated-tools-for-testing-the-accessibility/).

## Keyboard navigation

- [ ] **Tab order** - Is the tab order logical and matches the visual order?
- [ ] **All interactive elements reachable** - Can you reach every link, button, input, and control with Tab?
- [ ] **No keyboard traps** - Can you tab away from every element? (Modals should trap focus intentionally but allow Escape to close.)
- [ ] **Focus visible** - Is there a visible focus indicator on every focusable element?
- [ ] **Skip link** - Does the first Tab stop reveal a "Skip to main content" link?
- [ ] **Escape key** - Do modals, dropdowns, and popovers close on Escape?
- [ ] **Enter/Space** - Do buttons and links activate on Enter? Do checkboxes and toggles work with Space?
- [ ] **Arrow keys** - Do tabs, menus, and radio groups support arrow key navigation?

## Screen reader testing

For the actual keyboard shortcuts and gestures per screen reader, see the [screen reader testing guide](/topics/accessibility/screen-reader-testing-guide/) - this section is about what to check, that one is about how to check it.

### Page level

- [ ] **Page title** - Is it unique and descriptive?
- [ ] **Landmarks** - Does `Insert+F7` (NVDA) or `VO+U` (VoiceOver) show logical landmarks?
- [ ] **Heading hierarchy** - Do headings form a logical outline without skipped levels?
- [ ] **Language** - Is `lang` set on `<html>`? Are passages in other languages marked with `lang`?

### Content

- [ ] **Images** - Do images have meaningful alt text? Are decorative images hidden (`alt=""` or `aria-hidden`)?
- [ ] **Links** - Do link texts make sense out of context? (No "click here" or "read more".)
- [ ] **Tables** - Do data tables have `<th>` with `scope`? Do complex tables use `headers`/`id`?
- [ ] **Lists** - Are lists of items marked up as `<ul>`, `<ol>`, or `<dl>`?
- [ ] **Abbreviations** - Are abbreviations expanded on first use or wrapped in `<abbr>`?

### Dynamic content

- [ ] **Live regions** - Are notifications, errors, and status updates announced via `aria-live`?
- [ ] **Loading states** - Is `aria-busy="true"` set during loading?
- [ ] **Route changes (SPAs)** - Does focus move to the new content heading after navigation?
- [ ] **Infinite scroll** - Is there a way to reach the footer? Is new content announced?

## Forms

- [ ] **Labels** - Does every input have a visible, programmatically associated `<label>`?
- [ ] **Required fields** - Are required fields marked with `required` or `aria-required="true"`?
- [ ] **Error messages** - Are errors announced by screen readers? Are they linked to inputs via `aria-describedby`?
- [ ] **Error recovery** - Can users fix errors without losing their entered data?
- [ ] **Autocomplete** - Do appropriate inputs have the `autocomplete` attribute?
- [ ] **Grouped fields** - Are radio buttons and checkboxes grouped with `<fieldset>` and `<legend>`?
- [ ] **Validation timing** - Are errors shown on submit and on blur, not on every keystroke?

## Visual design

- [ ] **Color contrast** - Does text meet 4.5:1 (normal) and 3:1 (large text) ratios?
- [ ] **Color not sole indicator** - Is information conveyed by more than color alone? (Icons, text, patterns)
- [ ] **200% zoom** - Is all content usable at 200% browser zoom without horizontal scrolling?
- [ ] **400% text zoom** - Is text readable when scaled to 400%?
- [ ] **Reflow** - Does content reflow to a single column at 320px width?
- [ ] **Text spacing** - Is content readable when line height is 1.5x, letter spacing is 0.12em, and word spacing is 0.16em?
- [ ] **Motion** - Do animations respect `prefers-reduced-motion`?
- [ ] **Dark mode** - Does the dark theme maintain proper contrast ratios?

## Media

- [ ] **Video captions** - Do all videos have accurate captions?
- [ ] **Audio descriptions** - Do videos with important visual content have audio descriptions?
- [ ] **Transcripts** - Is a text transcript available for audio-only content?
- [ ] **Auto-play** - Does auto-playing media have a pause/stop control?
- [ ] **Flashing content** - Is there any content that flashes more than 3 times per second?

## ARIA

- [ ] **No unnecessary ARIA** - Are you using native HTML elements where possible instead of ARIA roles?
- [ ] **Valid roles** - Are all `role` values valid ARIA roles?
- [ ] **Required properties** - Do roles have their required ARIA properties? (e.g., `role="checkbox"` needs `aria-checked`)
- [ ] **State changes** - Are `aria-expanded`, `aria-selected`, `aria-pressed` updated on interaction?
- [ ] **Hidden content** - Is `aria-hidden="true"` only on content that should be invisible to screen readers?
- [ ] **No ARIA on focusable hidden elements** - Are elements with `aria-hidden="true"` also removed from tab order?

## Touch and mobile

- [ ] **Target size** - Are all interactive elements at least 24x24 CSS pixels (WCAG 2.2's AA minimum)? 44x44 is more comfortable and worth aiming for where the design allows it, but 24x24 is the bar you actually have to clear - see [touch target size and spacing](/topics/css/touch-target-size-and-spacing/) for the exceptions.
- [ ] **Target spacing** - Is there adequate spacing between adjacent targets?
- [ ] **Orientation** - Does the page work in both portrait and landscape?
- [ ] **Gestures** - Can all gesture-based actions (swipe, pinch) be done with a single pointer?
- [ ] **Viewport zoom** - Is the viewport meta tag not preventing user zoom?

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

## Testing tools reference

| Tool | Type | Best for |
|------|------|----------|
| axe DevTools | Browser extension | Quick automated scans |
| WAVE | Browser extension | Visual error overlays |
| Lighthouse | Built into Chrome | Audits with scoring |
| HeadingsMap | Browser extension | Heading hierarchy check |
| NVDA | Screen reader (Windows) | Full screen reader testing |
| VoiceOver | Screen reader (macOS/iOS) | Safari and iOS testing |
| Contrast Checker | Web tool | Manual contrast verification |
| Firefox Accessibility Inspector | Browser DevTools | Accessibility tree visualization |

## Workflow recommendation

1. **During development** - Use ESLint a11y plugin + CSS debug stylesheet
2. **Before commit** - Run axe-core in unit tests
3. **In CI/CD** - Run Playwright/Cypress accessibility tests
4. **Before release** - Manual keyboard + screen reader testing with this checklist
5. **Post-launch** - Periodic audits with WAVE and Lighthouse

## Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Deque: Accessibility Testing Guide](https://www.deque.com/web-accessibility-testing/)

---
title: Cognitive accessibility in web design
description: Practical cognitive accessibility tips for web design, including plain language, clearer feedback, predictable layouts, and lower memory load.
topics: UX
keywords:
    - cognitive accessibility
    - plain language
    - accessible UX
    - accessible content design
    - web accessibility
    - inclusive design
---

Cognitive accessibility focuses on how easy an interface is to read, understand, remember, and complete. A page can pass basic technical checks and still be exhausting if the content is dense, the steps are unclear, or the interface keeps changing its behavior.

This matters for people with dyslexia, ADHD, memory impairments, learning disabilities, brain injuries, and many other conditions. It also helps people who are tired, stressed, distracted, or trying to finish a task quickly on a phone.

## Use plain language

Prefer direct words, short sentences, and familiar terms. Avoid jargon unless your audience genuinely expects it.

```html
<!-- Do not -->
<button>Authenticate credentials</button>

<!-- Do -->
<button>Sign in</button>
```

Plain language also means being specific about what will happen next:

```html
<!-- Vague -->
<button>Continue</button>

<!-- Clear -->
<button>Continue to payment</button>
```

## Reduce memory load

Users should not have to remember information from one part of the interface to another.

-   Keep important instructions visible near the field or action that needs them.
-   Show entered values again in confirmation screens.
-   Break long tasks into smaller steps.
-   Preserve user input when validation fails or the page reloads.

```html
<label for="password">Password</label>
<input
    type="password"
    id="password"
    aria-describedby="password-help"
/>
<p id="password-help">Use at least 8 characters, including a number.</p>
```

## Make navigation and layouts predictable

Users should not have to relearn the interface from screen to screen. Consistent labels, placement, and interaction patterns make tasks easier to finish with confidence.

-   Keep primary navigation in the same place across pages.
-   Use consistent names for the same action.
-   Avoid changing interaction patterns between similar components.
-   Put headings, forms, and actions in an expected reading order.

## Chunk content into smaller sections

Large walls of text are hard to scan and harder to understand. Use headings, lists, and short paragraphs to help users process one idea at a time.

```html
<section>
    <h2>Shipping address</h2>
    <p>Enter the address where you want your order delivered.</p>
</section>

<section>
    <h2>Payment details</h2>
    <p>Choose a payment method and review your total.</p>
</section>
```

## Write helpful instructions and feedback

Error messages and status updates should explain what went wrong and how to fix it. Avoid vague feedback like "Invalid input" or "Something went wrong."

```html
<!-- Do not -->
<p role="alert">Invalid input</p>

<!-- Do -->
<p role="alert">Enter a 6-digit verification code.</p>
```

Helpful feedback is:

-   Specific
-   Near the relevant field or action
-   Written in plain language
-   Persistent long enough to be read

## Avoid unnecessary distractions

Animations, auto-rotating banners, countdowns, and flashing UI can pull attention away from the task.

-   Avoid unexpected movement near form fields or reading content.
-   Let users pause, stop, or dismiss moving content.
-   Do not auto-advance multi-step flows without warning.
-   Respect `prefers-reduced-motion` for users who need calmer interfaces.

## Give users enough time

Some users need more time to read, decide, and complete tasks. Sudden timeouts can make a form or checkout impossible to finish.

-   Avoid short session time limits where possible.
-   Warn users before time expires.
-   Offer a simple way to extend the session.
-   Do not clear progress without confirmation.

```html
<div role="status" aria-live="polite">
    Your session will expire in 2 minutes. Select "Stay signed in" to continue.
</div>
```

## Support recognition over recall

It is easier to recognize options than to remember them from scratch.

-   Use checklists instead of expecting users to remember all requirements.
-   Show examples for expected formats.
-   Use autocomplete where it genuinely helps.
-   Provide visible labels instead of placeholder-only inputs.

```html
<label for="phone">Phone number</label>
<input type="tel" id="phone" aria-describedby="phone-example" />
<p id="phone-example">Example: 98765 43210</p>
```

## Related reading

-   [Accessible forms and labels](/topics/html/accessible-forms-and-labels/)
-   [Accessible error messages and validation](/topics/html/accessible-error-messages-and-validation/)
-   [Reduced motion and animations](/topics/css/reduced-motion-and-animations/)
-   [Focus management in SPAs](/topics/javascript/focus-management-in-spas/)

## Common mistakes

-   Using vague button labels like "Submit" or "Continue" with no context
-   Hiding essential instructions until after an error occurs
-   Resetting a form after a failed submission
-   Using dense paragraphs with no headings or spacing
-   Changing the meaning of icons, buttons, or navigation between pages
-   Auto-playing carousels or overlays that interrupt reading

## Resources

-   [W3C WAI: Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/)
-   [W3C WAI: Cognitive Accessibility Guidance](https://www.w3.org/WAI/cognitive/)
-   [GOV.UK: Writing for all audiences](https://www.gov.uk/guidance/content-design/writing-for-gov-uk)
-   [NN/g: Recognition Rather Than Recall in UX](https://www.nngroup.com/articles/recognition-and-recall/)

---
title: Screen reader testing guide
description: A practical guide to testing with NVDA, VoiceOver, and TalkBack including essential keyboard shortcuts and common testing patterns.
topics: Accessibility
---

Automated testing tools catch roughly 30–40% of accessibility issues. The rest require manual testing with actual screen readers. This guide covers the three most common screen readers and how to use them for testing.

## Which screen reader to test with

| Screen reader | Platform | Browser | Market share |
|--------------|----------|---------|--------------|
| NVDA | Windows | Firefox / Chrome | ~40% |
| JAWS | Windows | Chrome / Edge | ~30% |
| VoiceOver | macOS / iOS | Safari | ~20% |
| TalkBack | Android | Chrome | ~10% |

> **Minimum :** Test with NVDA + Firefox on Windows and VoiceOver + Safari on macOS. These two cover the majority of screen reader users.

## NVDA (Windows)

### Installation

Download NVDA for free from [nvaccess.org](https://www.nvaccess.org/download/).

### Essential keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| Insert + Space | Toggle focus/browse mode |
| Insert + Down Arrow | Read from current position |
| Insert + S | Toggle speech on/off |
| H | Next heading |
| Shift + H | Previous heading |
| D | Next landmark |
| K | Next link |
| F | Next form field |
| T | Next table |
| 1–6 | Next heading at that level |
| Tab | Next focusable element |
| Enter | Activate link/button |
| Insert + F7 | Elements list (headings, links, landmarks) |

### The Elements List

Press `Insert + F7` to open the Elements List — this is the most useful testing tool. It shows :
- All headings (check hierarchy)
- All links (check descriptive text)
- All landmarks (check page structure)
- All form fields (check labels)

## VoiceOver (macOS)

### Enabling

Press `Cmd + F5` to toggle VoiceOver on/off.

### Essential keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| VO (Ctrl+Option) + Right | Move to next element |
| VO + Left | Move to previous element |
| VO + Space | Activate element |
| VO + A | Read from current position |
| VO + U | Open rotor |
| VO + Cmd + H | Next heading |
| VO + Cmd + L | Next link |
| VO + Cmd + J | Next form field |
| Tab | Next focusable element |
| Escape | Close rotor/menu |

### The Rotor

Press `VO + U` to open the Rotor. Use Left/Right arrows to switch between categories (Headings, Links, Landmarks, Form Controls). This is VoiceOver's equivalent of NVDA's Elements List.

## VoiceOver (iOS)

### Enabling

Settings → Accessibility → VoiceOver. Or triple-click the side button (if configured).

### Essential gestures

| Gesture | Action |
|---------|--------|
| Swipe right | Move to next element |
| Swipe left | Move to previous element |
| Double tap | Activate element |
| Two-finger swipe up | Read from top |
| Two-finger swipe down | Read from current position |
| Twist two fingers (rotor) | Change rotor setting |
| Swipe up/down | Move by rotor setting (headings, links, etc.) |

## TalkBack (Android)

### Enabling

Settings → Accessibility → TalkBack. Or hold both volume keys for 3 seconds.

### Essential gestures

| Gesture | Action |
|---------|--------|
| Swipe right | Next element |
| Swipe left | Previous element |
| Double tap | Activate |
| Swipe down then right | Next heading |
| Three-finger swipe | Scroll |
| Swipe up then down | Open TalkBack menu |

## What to test

### Page load

1. Is the page title announced?
2. Does the main landmark exist?
3. Can you reach the main content quickly?

### Heading structure

1. Press H repeatedly — do headings form a logical outline?
2. Are there any skipped levels (h1 → h3)?
3. Does every section have a heading?

### Links

1. Open the links list — do link texts make sense out of context?
2. Are there any "click here" or "read more" links?
3. Do links that open in a new window indicate this?

### Forms

1. Tab through all form fields — is each one announced with its label?
2. Are required fields announced as required?
3. When validation fails, is the error announced?
4. Is the error associated with its field?

### Dynamic content

1. When content updates (notifications, live feeds), is it announced?
2. Are loading states announced?
3. After navigation, does focus move to the new content?

## Setting up a testing environment

### NVDA Speech Viewer

NVDA includes a Speech Viewer that displays everything it announces in a text window. Enable it from the NVDA menu → Tools → Speech viewer. This is invaluable for sighted developers testing screen reader output.

### Browser DevTools Accessibility Panel

All major browsers have an accessibility tree inspector :
- Chrome: DevTools → Elements → Accessibility pane
- Firefox: DevTools → Accessibility tab
- Safari: Web Inspector → Audit tab

## Resources

- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [VoiceOver Getting Started Guide](https://support.apple.com/guide/voiceover)
- [Deque: Screen Reader Testing](https://www.deque.com/blog/screen-reader-testing/)
- [WebAIM Screen Reader Survey](https://webaim.org/projects/screenreadersurvey/)

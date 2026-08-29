---
title: Focus management in SPAs
description: Managing focus after route changes in single-page applications to ensure screen reader users know when content has updated.

type: guide
topics:
    - JavaScript
    - Focus
    - Keyboard
technologies:
    - JavaScript
level: intermediate
wcag:
    - 2.4.3
    - 4.1.3

keywords:
    - focus management in spas
    - spa accessibility
    - route change accessibility
    - aria live route changes
    - single page app accessibility
    - web accessibility
---

Single-page applications (SPAs) update content without full page reloads. This creates a significant accessibility problem - screen readers don't announce route changes, and keyboard focus stays on the element that triggered the navigation.

## The problem with client-side routing

When a traditional website navigates to a new page, the browser resets focus to the top of the document and screen readers announce the new page title. SPAs skip this entirely:

```html
<!-- User clicks a link -->
<a href="/about">About us</a>

<!-- SPA replaces content in-place - focus stays on the link -->
<div id="app">
    <!-- New content appears but screen reader says nothing -->
</div>
```

Users who rely on screen readers may not know navigation occurred. Keyboard users remain focused on a link that may no longer be visible.

## Moving focus after navigation

After a route change, move focus to the new content's heading or a container with the page title:

```javascript
function onRouteChange() {
    const heading = document.querySelector('h1');
    if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
    }
}
```

Setting `tabindex="-1"` makes the heading programmatically focusable without adding it to the tab order.

## Announcing route changes with live regions

An alternative approach uses an `aria-live` region to announce the new page:

```html
<div aria-live="polite" aria-atomic="true" class="sr-only" id="route-announcer"></div>
```

```javascript
function announceRouteChange(pageTitle) {
    const announcer = document.getElementById('route-announcer');
    announcer.textContent = '';
    
    requestAnimationFrame(() => {
        announcer.textContent = `Navigated to ${pageTitle}`;
    });
}
```

The empty-then-fill pattern ensures the screen reader detects the change every time.

## Framework-specific patterns

### React with React Router

```jsx
function RouteAnnouncer() {
    const location = useLocation();
    const [announcement, setAnnouncement] = useState('');

    useEffect(() => {
        const heading = document.querySelector('h1');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: false });
            setAnnouncement(`Navigated to ${heading.textContent}`);
        }
    }, [location.pathname]);

    return (
        <div aria-live="polite" aria-atomic="true" className="sr-only">
            {announcement}
        </div>
    );
}
```

### Angular

```typescript
@Injectable({ providedIn: 'root' })
export class FocusService {
    constructor(private router: Router) {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                setTimeout(() => {
                    const heading = document.querySelector('h1');
                    if (heading instanceof HTMLElement) {
                        heading.setAttribute('tabindex', '-1');
                        heading.focus();
                    }
                });
            });
    }
}
```

## Loading states

When content is loading, inform screen reader users:

```html
<div aria-busy="true" aria-live="polite">
    <p>Loading content...</p>
</div>
```

Once content loads, remove `aria-busy` and move focus:

```javascript
function onContentLoaded(container) {
    container.removeAttribute('aria-busy');
    const heading = container.querySelector('h1');
    if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
    }
}
```

## Common mistakes

- **Focusing a non-descriptive element** - Moving focus to a `<div>` instead of a heading gives no context about where the user landed.
- **Using `autofocus`** - The `autofocus` attribute only works on initial page load, not on dynamically inserted content.
- **Scrolling without focusing** - `scrollIntoView()` moves the viewport but doesn't move screen reader focus.
- **Removing `tabindex` immediately** - Wait for the `blur` event before removing `tabindex="-1"` from the heading.

## Resources

- [Managing Focus in Single Page Applications - Deque](https://www.deque.com/blog/managing-focus-in-single-page-applications/)
- [What we learned from user testing of accessible client-side routing - GDS](https://accessibility.blog.gov.uk/2019/03/25/)
- [WCAG 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html)

This pairs well with [accessible navigation and skip links](/topics/html/accessible-navigation-and-skip-links/) and [using keyboard for content accessibility](/topics/javascript/using-keyboard-for-content-accessibility/) if you haven't read those yet.

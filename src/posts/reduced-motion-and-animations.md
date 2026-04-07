---
title: Reduced motion and animations
description: Respecting user motion preferences with prefers-reduced-motion, managing auto-playing content, and designing animations that don't cause harm.
topics: CSS
---

Animations can cause serious physical discomfort for people with vestibular disorders, epilepsy, or motion sensitivity. WCAG requires that motion can be paused, stopped, or disabled.

## Who is affected

- **Vestibular disorders** — Parallax scrolling, zooming animations, and sliding transitions can cause vertigo, nausea, and migraines.
- **Epilepsy** — Flashing content faster than 3 times per second can trigger seizures (WCAG 2.3.1).
- **ADHD and cognitive disabilities** — Constant motion is distracting and makes it harder to focus on content.
- **Motion sickness** — Even subtle animations can cause discomfort during extended use.

## `prefers-reduced-motion`

Users can enable "Reduce motion" in their operating system settings. CSS can detect this :

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

> **Note :** Setting duration to `0.01ms` instead of `0s` ensures `animationend` and `transitionend` events still fire. This prevents JavaScript that relies on these events from breaking.

## Progressive enhancement approach

Instead of removing motion for those who need it, add motion only for those who want it :

```css
.card {
    opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
    .card {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .card:hover {
        transform: translateY(-4px);
    }
}
```

This way, animations are the enhancement, not the default.

## JavaScript detection

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    carousel.stopAutoPlay();
}

prefersReducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
        carousel.stopAutoPlay();
    } else {
        carousel.startAutoPlay();
    }
});
```

## Auto-playing content

WCAG 2.2.2 requires that auto-moving content can be paused, stopped, or hidden :

```html
<div class="banner" role="region" aria-label="Announcements">
    <div class="banner__content" id="banner-content">
        Special offer: 20% off all plans
    </div>
    <button aria-label="Pause announcements" id="pause-btn">⏸</button>
</div>
```

```javascript
const banner = document.getElementById('banner-content');
const pauseBtn = document.getElementById('pause-btn');
let isPaused = false;

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    banner.style.animationPlayState = isPaused ? 'paused' : 'running';
    pauseBtn.textContent = isPaused ? '▶' : '⏸';
    pauseBtn.setAttribute('aria-label', 
        isPaused ? 'Resume announcements' : 'Pause announcements'
    );
});
```

## Safe vs unsafe animations

### Safe (usually okay)

- Opacity fades
- Color transitions
- Small-scale transforms (subtle hover effects)
- Border and shadow changes

### Potentially harmful

- Parallax scrolling
- Large-scale zooming
- Full-page sliding transitions
- Spinning or rotating elements
- Background video loops

### Dangerous (WCAG 2.3.1 failure)

- Content flashing more than 3 times per second
- Large areas of flashing red
- Strobing effects

## Loading spinners

Replace spinning animations with progress indicators when reduced motion is enabled :

```css
.spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-top-color: #818cf8;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
    .spinner {
        animation: none;
        border-style: dotted;
        border-top-color: #818cf8;
        opacity: 0.8;
    }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

## Scroll-linked animations

The `scroll-timeline` CSS feature should also respect motion preferences :

```css
@media (prefers-reduced-motion: no-preference) {
    .parallax-section {
        animation: parallax linear;
        animation-timeline: scroll();
    }
}
```

## Resources

- [WCAG 2.3.1 Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html)
- [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [A List Apart — Designing With Reduced Motion](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/)

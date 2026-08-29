---
title: Accessible carousels and sliders
description: Building carousels with keyboard navigation, live region announcements, auto-rotation controls, and proper ARIA roles for screen readers.

topics: JavaScript

keywords:
    - accessible carousel
    - accessible slider
    - carousel accessibility
    - keyboard accessible carousel
    - aria carousel
    - web accessibility
---

Before writing a line of carousel code, it's worth asking whether you need one at all - the data below suggests most of the time the answer is no. If you do end up building one, it stacks three separate hard problems on top of each other: auto-playing content, non-trivial keyboard interactions, and dynamic updates a screen reader needs to be told about. Each of those is its own source of accessibility bugs on its own.

## Should you use a carousel?

Before building one, consider the evidence:

- Less than 1% of users click on carousel slides (NN Group study)
- Auto-rotating carousels are ranked as one of the most frustrating UX patterns
- The first slide gets 84% of all clicks

If you must use a carousel, make it accessible.

## Basic structure

```html
<section aria-label="Featured articles" aria-roledescription="carousel">
    <div class="carousel-controls">
        <button aria-label="Previous slide" id="prev-btn"><-</button>
        <span aria-live="polite" id="slide-status">Slide 1 of 4</span>
        <button aria-label="Next slide" id="next-btn">-></button>
    </div>

    <div class="carousel-viewport" aria-atomic="false" aria-live="off" id="carousel-live">
        <div role="group" aria-roledescription="slide" aria-label="1 of 4">
            <h3>First article title</h3>
            <p>Description of the first article.</p>
            <a href="/article-1">Read more</a>
        </div>
        <div role="group" aria-roledescription="slide" aria-label="2 of 4" hidden>
            <h3>Second article title</h3>
            <p>Description of the second article.</p>
            <a href="/article-2">Read more</a>
        </div>
    </div>
</section>
```

### Key ARIA attributes

| Attribute | Where | Purpose |
|-----------|-------|---------|
| `aria-roledescription="carousel"` | Container | Tells screen readers this is a carousel |
| `aria-roledescription="slide"` | Each slide | Identifies individual slides |
| `aria-label="1 of 4"` | Each slide | Current position |
| `aria-live="polite"` | Status text | Announces slide changes |
| `aria-live="off"` | Slide container | Prevents auto-rotation from interrupting users |

## Keyboard navigation

For keyboard patterns beyond what's specific to carousels, see [using keyboard for content accessibility](/topics/javascript/using-keyboard-for-content-accessibility/).

| Key | Action |
|-----|--------|
| Tab | Move focus into/out of the carousel |
| Left Arrow | Previous slide |
| Right Arrow | Next slide |
| Enter / Space | Activate a link within the slide |

```javascript
const carousel = document.querySelector('[aria-roledescription="carousel"]');

carousel.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            showPreviousSlide();
            e.preventDefault();
            break;
        case 'ArrowRight':
            showNextSlide();
            e.preventDefault();
            break;
    }
});
```

## Auto-rotation

If the carousel auto-rotates, provide a pause button and stop on any user interaction:

```html
<button aria-label="Stop auto-rotation" id="pause-btn">Pause</button>
```

```javascript
let autoPlayInterval;
let isPlaying = true;

function startAutoPlay() {
    autoPlayInterval = setInterval(showNextSlide, 5000);
    isPlaying = true;
    pauseBtn.textContent = 'Pause';
    pauseBtn.setAttribute('aria-label', 'Stop auto-rotation');
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    isPlaying = false;
    pauseBtn.textContent = 'Play';
    pauseBtn.setAttribute('aria-label', 'Start auto-rotation');
}

document.getElementById('pause-btn').addEventListener('click', () => {
    isPlaying ? stopAutoPlay() : startAutoPlay();
});

carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('focusin', stopAutoPlay);
```

### `prefers-reduced-motion`

Respect the user's OS motion preference - see [reduced motion and animations](/topics/css/reduced-motion-and-animations/) for the full pattern, including why auto-playing content specifically needs this and how WCAG 2.2.2 applies:

```javascript
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (reducedMotion.matches) {
    stopAutoPlay();
}

reducedMotion.addEventListener('change', (e) => {
    if (e.matches) stopAutoPlay();
});
```

## Slide transitions

```javascript
function showSlide(index) {
    const slides = document.querySelectorAll('[aria-roledescription="slide"]');
    const status = document.getElementById('slide-status');

    slides.forEach((slide, i) => {
        if (i === index) {
            slide.removeAttribute('hidden');
            slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
        } else {
            slide.setAttribute('hidden', '');
        }
    });

    status.textContent = `Slide ${index + 1} of ${slides.length}`;
}
```

## Tab-style indicators

`role="tab"` requires the full [ARIA tab pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) - roving tabindex plus arrow-key navigation between indicators. Without that keyboard behavior, using `role="tab"` makes false promises to screen reader users. Unless you're implementing the full pattern, plain buttons with `aria-current` are simpler and don't carry that requirement:

```html
<div class="carousel-indicators" aria-label="Slide controls">
    <button aria-current="true" aria-label="Slide 1">1</button>
    <button aria-current="false" aria-label="Slide 2">2</button>
    <button aria-current="false" aria-label="Slide 3">3</button>
</div>
```

```javascript
indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        showSlide(i);
        stopAutoPlay();

        indicators.forEach(b => b.setAttribute('aria-current', 'false'));
        btn.setAttribute('aria-current', 'true');
    });
});
```

## Scrolling carousels (CSS Scroll Snap)

For simpler carousels where all slides are visible and scroll horizontally:

```html
<div class="scroll-carousel" role="region" aria-label="Featured products" tabindex="0">
    <article>Product 1</article>
    <article>Product 2</article>
    <article>Product 3</article>
</div>
```

```css
.scroll-carousel {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
}

.scroll-carousel article {
    scroll-snap-align: start;
    min-width: 280px;
    flex-shrink: 0;
}

.scroll-carousel:focus-visible {
    outline: 2px solid #818cf8;
    outline-offset: 2px;
    border-radius: 0.5rem;
}
```

`tabindex="0"` makes the container focusable so keyboard users can scroll with arrow keys.

## Common mistakes

- **No pause button** - Auto-rotation without a stop mechanism fails WCAG 2.2.2.
- **Slides not announced** - Without `aria-live`, screen readers don't know content changed.
- **No keyboard support** - Arrow keys should navigate between slides.
- **Hidden slides still focusable** - Use `hidden` attribute or `display: none` to remove inactive slides from the tab order.
- **Dot indicators without labels** - Screen readers announce "button" with no context. Add `aria-label`.

## Resources

- [WAI-ARIA Authoring Practices - Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- [Smashing Magazine - Accessible Carousels](https://www.smashingmagazine.com/2023/02/guide-building-accessible-carousels/)
- [Should I Use A Carousel?](https://shouldiuseacarousel.com/)

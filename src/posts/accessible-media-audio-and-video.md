---
title: Accessible media audio and video
description: How to make video and audio content accessible with captions, transcripts, audio descriptions, and proper player controls.
topics: HTML
---

Multimedia content — videos, audio clips, podcasts, animations — can be a significant barrier if not made accessible. Users who are deaf need text alternatives for audio, users who are blind need audio descriptions for visual information, and users with cognitive disabilities may need controls to pause or slow down media.

## Video accessibility requirements

WCAG requires the following for pre-recorded video content :

| Requirement | WCAG Level |
| ----------- | ---------- |
| Captions (synchronized text for dialogue and sounds) | **A** |
| Audio descriptions (narration of visual-only information) | **A** |
| Transcript (text version of all audio and visual content) | **AA** |
| Sign language interpretation | **AAA** |

## Accessible video player markup

```html
<figure>
    <video controls preload="metadata" aria-label="Product demo video">
        <source src="demo.mp4" type="video/mp4" />
        <track
            kind="captions"
            src="demo-captions-en.vtt"
            srclang="en"
            label="English captions"
            default
        />
        <track
            kind="descriptions"
            src="demo-descriptions-en.vtt"
            srclang="en"
            label="English audio descriptions"
        />
        <p>
            Your browser does not support video.
            <a href="demo.mp4">Download the video</a>.
        </p>
    </video>
    <figcaption>
        <a href="demo-transcript.html">Read the full transcript</a>
    </figcaption>
</figure>
```

### Key attributes :

-   **`controls`** — Always include this so keyboard and screen reader users can operate the player. Auto-playing without controls is a WCAG failure.
-   **`preload="metadata"`** — Loads only the video duration and dimensions, not the full file.
-   **`<track kind="captions">`** — Captions include dialogue plus relevant sound effects ("[door slams]", "[laughter]").
-   **`<track kind="subtitles">`** — Subtitles are translations only, without sound effects. They are not the same as captions.

## Writing good captions (VTT format)

```
WEBVTT

00:00:01.000 --> 00:00:04.000
Welcome to our accessibility tutorial.

00:00:04.500 --> 00:00:07.000
[upbeat music playing]

00:00:07.500 --> 00:00:10.000
Today we'll cover how to make
your media content accessible.

00:00:10.500 --> 00:00:12.000
[keyboard clicking]
```

**Caption best practices :**

-   Include **speaker identification** when multiple people are talking : `[Sarah] Welcome to the show.`
-   Describe **relevant sounds** : `[alarm buzzing]`, `[crowd applause]`.
-   Captions should be **synchronized** — appearing and disappearing in sync with the audio.
-   Don't exceed **two lines** per caption and keep them on screen long enough to read.

## Audio-only content (podcasts, music)

For audio-only content, provide a **text transcript** :

```html
<figure>
    <audio controls aria-label="Episode 12: Web Accessibility Basics">
        <source src="episode-12.mp3" type="audio/mpeg" />
        Your browser does not support audio.
    </audio>
    <figcaption>
        <details>
            <summary>Read transcript</summary>
            <p>[Host] Welcome to episode 12...</p>
            <p>[Guest] Thanks for having me...</p>
        </details>
    </figcaption>
</figure>
```

## Scenarios and Edge Cases

### Autoplay and accessibility

-   **Never autoplay** audio or video with sound. This disrupts screen reader announcements and can disorient users.
-   If autoplay is unavoidable (e.g., hero background video), it must be **muted** and have a visible pause/stop control.

```html
<video autoplay muted loop playsinline aria-label="Decorative background animation">
    <source src="hero-bg.mp4" type="video/mp4" />
</video>
<button id="pause-video" aria-label="Pause background video">⏸ Pause</button>
```

```javascript
const video = document.querySelector('video');
const pauseBtn = document.getElementById('pause-video');

pauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        pauseBtn.textContent = '⏸ Pause';
        pauseBtn.setAttribute('aria-label', 'Pause background video');
    } else {
        video.pause();
        pauseBtn.textContent = '▶ Play';
        pauseBtn.setAttribute('aria-label', 'Play background video');
    }
});
```

### Respecting `prefers-reduced-motion`

Autoplay videos should be paused for users who prefer reduced motion :

```javascript
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (motionQuery.matches) {
    document.querySelectorAll('video[autoplay]').forEach((video) => {
        video.pause();
    });
}
```

### Custom video player controls

If building a custom video player, ensure :

-   **All controls are keyboard operable** — Play, pause, volume, seek, captions, fullscreen.
-   **Controls are announced** — Use `aria-label` on each button.
-   **Slider controls** — Volume and seek bars should use `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext`.

```html
<div role="slider"
     aria-label="Seek"
     aria-valuemin="0"
     aria-valuemax="120"
     aria-valuenow="45"
     aria-valuetext="45 seconds of 2 minutes"
     tabindex="0">
</div>
```

### Flashing content and seizure risk

-   WCAG requires that content **does not flash more than 3 times per second** (or the flash is below the general flash threshold).
-   This applies to all video content, animations, and GIFs.
-   Tools like the [Photosensitive Epilepsy Analysis Tool (PEAT)](https://trace.umd.edu/peat/) can test for dangerous flashing.

### Embedded third-party video players

-   YouTube and Vimeo embeds come with their own caption support — enable it.
-   Add a `title` attribute to `<iframe>` embeds for screen readers :

```html
<iframe
    src="https://www.youtube.com/embed/abc123"
    title="Product demo video with captions"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media"
    allowfullscreen>
</iframe>
```

### Resources

-   [W3C — Making Audio and Video Media Accessible](https://www.w3.org/WAI/media/av/)
-   [WebAIM: Captions, Transcripts, and Audio Descriptions](https://webaim.org/techniques/captions/)
-   [MDN: Video and audio content](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Video_and_audio_content)

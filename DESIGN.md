---
name: Hamid Javaheri
description: A portfolio staged as a product launch keynote, lit chapter by chapter in each project's own colour gel.
colors:
  stage-white: "#fbfaf7"
  presenter-ink: "#17161a"
  wing-grey: "#5f5d66"
  footlight-grey: "#9b98a2"
  slide-panel: "#ffffff"
  rule-line: "rgb(23 22 26 / 0.1)"
  rule-line-strong: "rgb(23 22 26 / 0.2)"
  blackout-stage: "#050506"
  blackout-ink: "#f4f3f1"
  blackout-mute: "#a3a1aa"
  blackout-faint: "#6c6a72"
  blackout-panel: "#111114"
  blackout-line: "rgb(255 255 255 / 0.1)"
  blackout-line-strong: "rgb(255 255 255 / 0.2)"
  stage-amber: "#d9862b"
  stage-amber-2: "#f2b33d"
  stage-amber-ink: "#8a4a08"
  gel-mashoor: "#c8566c"
  gel-mashoor-2: "#6fbfae"
  gel-mashoor-ink: "#9a3a50"
  gel-mashoor-ink-dark: "#f08ca0"
  gel-firstline: "#2563eb"
  gel-firstline-2: "#06b6d4"
  gel-firstline-ink: "#1d4ed8"
  gel-firstline-ink-dark: "#60a5fa"
  gel-podium: "#d9a441"
  gel-podium-2: "#c0c4cc"
  gel-podium-ink: "#8a5a08"
  gel-podium-ink-dark: "#f2c46b"
  gel-hublii: "#d8963a"
  gel-hublii-2: "#f3b46e"
  gel-hublii-ink: "#774a10"
  gel-hublii-ink-dark: "#f0cb85"
  gel-dev: "#8a6fd0"
  gel-dev-2: "#e9b949"
  gel-dev-ink: "#6f55a8"
  gel-dev-ink-dark: "#b9a5f0"
  gel-bethesda: "#e89a2a"
  gel-bethesda-2: "#4a2c1e"
  gel-bethesda-ink: "#9a5a0c"
  gel-bethesda-ink-dark: "#f5b041"
  gel-backstage-2: "#c8566c"
  hublii-cream: "#f4efe6"
  hublii-ink: "#2b2a27"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 9vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 112"
  headline-lg:
    fontFamily: "Archivo Variable, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 7vw, 5.6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo Variable, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo Variable, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 2rem)"
    fontWeight: 750
    lineHeight: 1.05
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 108"
  lede:
    fontFamily: "Archivo Variable, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.06rem, 1.45vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo Variable, Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.1em"
    fontFeature: "'tnum'"
  brand-wordmark:
    fontFamily: "Nunito Variable, Nunito, system-ui, sans-serif"
    fontSize: "clamp(5rem, 15vw, 14rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
rounded:
  focus: "6px"
  tag: "10px"
  podium-block: "12px 12px 0 0"
  slide: "30px"
  showcase: "32px"
  pill: "999px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  max: "1240px"
  stage-top: "clamp(84px, 12vh, 120px)"
  stage-bottom: "clamp(48px, 8vh, 80px)"
  split-gap: "clamp(28px, 4.5vw, 80px)"
  chip-gap: "8px"
components:
  presenter-pill:
    backgroundColor: "{colors.slide-panel}"
    textColor: "{colors.presenter-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 14px"
  link-pill:
    backgroundColor: "{colors.slide-panel}"
    textColor: "{colors.presenter-ink}"
    rounded: "{rounded.pill}"
    padding: "13px 20px"
  cta-hublii:
    backgroundColor: "{colors.gel-hublii}"
    textColor: "{colors.slide-panel}"
    rounded: "{rounded.pill}"
    padding: "15px 22px 15px 24px"
  cta-hublii-hover:
    backgroundColor: "{colors.gel-hublii-ink}"
  stack-chip:
    backgroundColor: "{colors.slide-panel}"
    textColor: "{colors.presenter-ink}"
    rounded: "{rounded.pill}"
    padding: "7px 12px"
  device-tag:
    backgroundColor: "{colors.slide-panel}"
    textColor: "{colors.presenter-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "10px 12px"
  slide-card:
    backgroundColor: "{colors.slide-panel}"
    textColor: "{colors.wing-grey}"
    rounded: "{rounded.slide}"
    padding: "clamp(24px, 3vw, 44px)"
---

# Design System: Hamid Javaheri

## Overview

**Creative North Star: "The Launch Keynote"**

The site is a product launch on a single long stage. Every project gets its moment in a pinned, scrubbed chapter, and the stage itself changes colour to announce who is on: each chapter swaps a theatrical lighting gel (a primary, a secondary and a legible ink) and the whole page cross-fades into it over 1.1s. Type is set like slide titles: heavy, wide, tightly tracked Archivo, with JetBrains Mono for anything the presenter would read off a clicker or a cue card.

There are two houses. House lights up (the default) is a bright near-white keynote slide, washed by silk: large, soft pools of the current chapter's three colours that fold into one another, drift as you scroll and swirl like liquid where the pointer stirs them. House lights down is a black stage with a feathered, volumetric follow-spot that lerps after the pointer (or focus, or a slow drift on touch), with dust motes in the beam, a slight blur on everything outside the pool, and hidden presenter cues that become readable only inside the light. Density is low: one idea per viewport, products shown in code-drawn laptops, phones and browsers, architecture shown as exploded isometric diagrams that click together on scroll.

Light, not decoration, is the colour system. Surfaces stay neutral; chroma arrives through the gel wash, the gel ink on a headline's second line, and the gel fill on whatever is currently "on".

**Key Characteristics:**
- Per-chapter stage-lighting gels on registered `--gel`, `--gel-2`, `--gel-ink` custom properties, cross-faded at 1.1s.
- Light default; dark "house lights down" mode with a canvas follow-spot, never a hard-edged circle.
- Heavy, wide, negatively tracked Archivo display set like slide titles; two-line headlines whose second line takes the gel ink.
- JetBrains Mono uppercase for presenter furniture only: chapter counter, slide numbers, cues, status lines, stack lists.
- Code-drawn device frames and exploded isometric diagrams, always labelled in plain words, and "Sample data" labels on any mocked screen.
- Scroll is the only call to action until the curtain call.

## Colors

A neutral stage lit by one coloured gel at a time; the stage never carries more than its current gel pair.

### Primary
- **Stage Amber** (`stage-amber`, with `stage-amber-2` and `stage-amber-ink`): the house gel. Lights the opening, the curtain call and the backstage chapter (which pairs it with `gel-backstage-2`). Also the default the registered `--gel` property falls back to.

### Secondary
The chapter gels. Each is a triple: the gel (wash, progress bar, active tick, numbered markers, selection, focus ring, caret), the secondary gel (the second rig light and the follow-spot's tint), and the ink (text in the gel, flipped lighter in dark mode via the `-ink-dark` token).
- **MasHoorCake Rose and Mint** (`gel-mashoor` / `gel-mashoor-2`): chapter 01.
- **FirstLine Blue and Cyan** (`gel-firstline` / `gel-firstline-2`): chapter 02, the project's own brand pair.
- **Podium Gold and Silver** (`gel-podium` / `gel-podium-2`): chapter 03.
- **hublii Golden Hour** (`gel-hublii` amber / `gel-hublii-2` sun): chapter 04, the finale, taken from hublii's own Golden hour theme (bg `#f6eadb`, ink `#3a2e26`, sky `#f6e1c6` → `#f3d2b0` → `#ebc3b3`, hills `#e7c7a4` / `#d8ae8a` / `#c4987a`). Dark mode uses hublii's Evening theme (`#1c1916`, ink `#eee6da`, amber `#e8b967`). The reveal stage is a golden-hour sky with a low sun and three hills.
- **Pawmetric Lavender and Gold** (`gel-dev` / `gel-dev-2`): chapter 05, in development.
- **Bethesda Sun and Chocolate** (`gel-bethesda` / `gel-bethesda-2`): chapter 06, encore.

### Tertiary
- **hublii Cream** (`hublii-cream`) and **hublii Ink** (`hublii-ink`): hublii's own brand surface and text, used only inside the hublii chapter (wordmark, Yumi showcase, exploded stack strokes, in-development card). They are hublii's identity, not the stage's.

### Neutral
- **Stage White** (`stage-white`): the light ground, painted on `html` so the fixed rig light shows through a transparent body.
- **Presenter Ink** (`presenter-ink`): text and strong rules in light mode.
- **Wing Grey** (`wing-grey`): ledes, secondary copy, labels.
- **Footlight Grey** (`footlight-grey`): slide numbers, inactive list steps, diagram leader lines.
- **Slide Panel** (`slide-panel`): cards, pills, tags, popovers.
- **Rule Line** / **Rule Line Strong** (`rule-line`, `rule-line-strong`): hairlines for spec lists and borders on pills.
- **Blackout** set (`blackout-stage`, `blackout-ink`, `blackout-mute`, `blackout-faint`, `blackout-panel`, `blackout-line`, `blackout-line-strong`): the same roles with house lights down.

### Named Rules
**The One Gel Rule.** Only the current chapter's gel is on stage. A chapter declares its gel once (`data-gel` on the section); everything coloured reads from `--gel`, `--gel-2`, `--gel-ink`. Never hard-code a second chapter's colour into the stage.

**The Ink Not Gel Rule.** Text in colour uses the gel ink, never the raw gel. Inks are darker in light mode and lighter in dark mode so headline second lines stay legible against either house.

**The Wash Strength Rule.** The rig wash is a fraction of the gel (`--wash` 0.34 light, 0.26 dark) mixed to transparent. Surfaces are never filled with a gel; the stage is lit, not painted.

## Typography

**Display Font:** Archivo Variable (with Helvetica Neue, Arial)
**Body Font:** Archivo Variable at normal width
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace)
**Brand Font:** Nunito Variable, reserved for the hublii wordmark and Yumi's name

**Character:** Slide-title Archivo, pushed wide (112-125% stretch) and tracked tight, carries the voice; JetBrains Mono is the presenter's clicker, small and uppercase.

### Hierarchy
- **Display** (800, wdth 112, `clamp(3rem, 9vw, 6rem)`, 0.92): the name on the opening and "Thank you." at the curtain call. Ends in a gel-coloured full stop.
- **Headline Large** (800, wdth 112, `clamp(2.6rem, 7vw, 5.6rem)`, 0.92): chapter titles that stand alone ("Encore.", "Backstage.", "Currently in development.").
- **Headline** (800, wdth 112, `clamp(2.1rem, 4.6vw, 4.4rem)`, 0.96): product-slide titles, two lines, the second in gel ink.
- **Title** (750, wdth 108, `clamp(1.4rem, 2.2vw, 2rem)`, 1.05): sub-heads and list items set as statements (goals, tour questions, feature names).
- **Lede** (400, `clamp(1.06rem, 1.45vw, 1.4rem)`, 1.5, max 36em, wing grey): the paragraph under every headline. Bold words lift to presenter ink at 600.
- **Body** (400, 17px, 1.5): base size; supporting copy runs 14.5-16px inside cards, spec lists and captions.
- **Label** (400-600, 0.72rem, 0.1em tracking, uppercase, tabular numbers): chapter counter, slide numbers ("03 / 08"), status lines, stack lists, "Sample data". Pills and run-of-show links use the same face at 10.5px; cues at 11px.
- **Spoken numbers** (900, wdth 118, gel ink, tabular): statistics are set inside a sentence at headline size and count up on scroll, never as stat tiles.

### Named Rules
**The Slide Title Rule.** Headings are heavy (750-900), wide (108-125%), and tracked between -0.03em and -0.05em, with balanced wrapping. Nothing on stage is set in a light display weight.

**The Two-Line Reveal Rule.** Product headlines are a statement and a payoff on two lines; the payoff takes `.gel` (gel ink).

**The Mono Is Furniture Rule.** Mono uppercase belongs to the presenter's equipment (counters, slide numbers, cues, status, stack lists, tags). It is never stacked above a headline as a section label.

## Layout

A sequence of full-viewport stages (`min-height: 100svh`) padded `stage-top` / `gutter` / `stage-bottom`, with content held to a 1240px `max` wrap. Key chapters are pinned stages (`height: 100svh`, overflow hidden) whose content is scrubbed by scroll over 160-240% of a viewport. Product slides use an asymmetric split (5fr copy / 7fr device, reversible), tours and encores 4fr / 7fr, diagrams 6fr / 4fr. A fixed presenter bar (three-column grid: mark, chapter counter and ticks, controls) and a 2px gel progress line sit above everything. Slide numbers sit bottom right at the gutter.

Breakpoints: chapter ticks hide below 1000px; at 900px every split collapses to one column (copy first), pinned stages stay pinned with phone layouts sized to fit one screen (compact two-column specs, chips for feature lists, only the active step of a stepped list), showreels stack vertically and the presenter bar turns solid with a blur; below 720px of height the specs inside pinned product stages hide; at 720px pill labels, presenter cues and the name in the mark hide; at 600px the run-of-show strip hides.

## Elevation & Depth

Depth is theatrical: light and darkness, not material stacking. The page is flat neutral ground lit by silk, a WebGL wash (`silk.ts`, drawn at half resolution, a third on touch) of domain-warped noise pools in three colours per gel over the stage white, calmer in the reading area and stronger at the edges; the old fixed rig of three radial gel pools remains as the no-WebGL fallback; in dark mode a canvas darkness layer is carved by a feathered beam and pool, drawn at quarter resolution and blurred so no edge survives. Shadows exist only to seat objects on the stage (devices, cards, popovers), and they are long, soft and warm in light mode, deep and black in dark mode.

### Shadow Vocabulary
- **Seat** (`box-shadow: 0 1px 2px rgb(20 16 10 / 0.06), 0 24px 60px -24px rgb(40 28 10 / 0.28)`; dark: `0 1px 2px rgb(0 0 0 / 0.5), 0 30px 70px -30px rgb(0 0 0 / 0.9)`): cards, tags, podium icons, the volume popover.
- **Hero seat** (`box-shadow: 0 2px 4px rgb(20 16 10 / 0.06), 0 50px 120px -40px rgb(40 28 10 / 0.38)`; dark: `0 2px 4px rgb(0 0 0 / 0.5), 0 60px 140px -40px rgb(0 0 0 / 0.95)`): device frames and the opening portrait.
- **Hairline ring** (`0 0 0 1px var(--line)`, often inset): paired with the seat shadow on cards and icons instead of a border.

### Named Rules
**The Feathered Light Rule.** Every light on this stage is soft: radial gradients to transparent, quarter-resolution canvas, blur. A hard-edged spotlight circle or vignette is off-world.

**The Darkness Is Opt-In Rule.** Light is the default house. The follow-spot exists only with house lights down and has a non-pointer path: it follows keyboard focus, drifts slowly on touch, and holds still under reduced motion.

## Shapes

Soft, product-like geometry. Controls are full pills (999px); presentation cards are generously rounded (30-32px); device tags 10px; podium blocks round only their top corners (12px). Numbered markers, avatars and the portrait are perfect circles; the portrait carries a 6px stage-white gap ring and a 1px gel ring. Device frames are em-scaled, so a single `font-size` sizes the whole laptop, phone or browser. Isometric diagram slabs have 1.2px rounded-join strokes in a three-tone top/left/right fill.

## Components

### Buttons
Calm, pill-shaped, lit by the gel on interaction.
- **Shape:** full pill (999px).
- **Presenter pill:** mono uppercase 10.5px, 36px tall, translucent panel (70%) with 10px backdrop blur and a strong rule border. Hover turns the border to the gel; active scales to 0.97. Collapses to a 36px icon-only circle under 720px.
- **Link pill (curtain call):** Archivo 600 at 15px, gel-ink icon, 80% panel. Hover: gel border, a 10% gel tint and a 2px lift.
- **hublii waitlist CTA:** the only filled button on the site, in hublii's primary ink `#3a2e26` with `#fcf1e4` text (inverted in Evening); hover deepens to `#2e2620`, lifts 2px and glows amber. It is hublii's brand action, not a stage style.

### Chips
- **Style:** stack chips are 13px Archivo 600 pills with a strong rule border on 70% panel; Pawmetric's mini chips use a 16% lavender fill instead of a border.
- **State:** static; chips label, they do not filter.

### Cards / Containers
- **Corner Style:** 30px (in-development slides), 32px (Yumi showcase).
- **Background:** slide panel, optionally a top-down tint of the project's brand surface.
- **Shadow Strategy:** hairline ring inset plus the Seat shadow.
- **Internal Padding:** `clamp(24px, 3vw, 44px)`.

### Inputs / Fields
- **Volume slider:** 4px track filled with the gel to the current value, 16px presenter-ink thumb with a 3px panel border. It lives in a pill popover that slides out (opacity plus 6px drop, 0.2-0.25s) on hover or focus of the sound pill, with a hover bridge.

### Navigation
- **Presenter bar:** fixed, gradient-to-transparent ground. Left: the mark, a gel dot with a slow 2.4s "recording" pulse and the name at 800 / wdth 115. Centre: a mono chapter counter ("Chapter 02 / 08 · FirstLine") and 22px tick targets, each a 2px rule that turns gel and thickens 1.8x when current. Right: the house-lights pill and the sound pill (four-bar equaliser that animates in the gel while playing).
- **Progress line:** 2px, gel to gel-2 gradient, scaled by scroll progress.
- **Run of show:** a centred mono strip of numbered chapter links under the opening lede; numbers in gel ink.

### Stepped lists
Numbered lists (tour questions, encore beats, goals) use a 22px circular mono counter. Inactive steps sit in footlight grey with an outlined counter; the current step turns presenter ink, fills its counter with the gel, and expands its body text via a 0fr to 1fr grid-row transition.

### Spec list
A definition list with hairline top and row rules: wing-grey term left, presenter-ink 600 value right, 14.5px.

### Device Frames (signature)
Em-scaled laptop (near-black lid, aluminium base), phone (rounded 4.6em body with a dynamic-island notch) and browser (light chrome with traffic-light dots and a URL pill; darkens with house lights down). Real screenshots are placed inside; code-drawn mock screens carry a mono "Sample data" label beneath.

### Exploded Isometric Diagram (signature)
SVG slabs built from an isometric helper, each with a plain-words leader label (bold 15px name, 13px detail line). On scroll the pieces drop along dashed gel-ink guides with a slight overshoot and click into place, then the labels fade in.

### Presenter Cues (signature, dark only)
Small mono uppercase notes in gel ink with a leading dot, positioned around a slide, masked so they are only readable inside the follow-spot. Hidden in light mode and under 720px; decorative and `pointer-events: none`.

### Motion grammar
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out) for UI response; `cubic-bezier(0.65, 0, 0.35, 1)` (ease-in-out) for house and gel changes; GSAP `expo.out` for arrivals.
- **Durations:** 0.2-0.3s for controls, 0.4-0.5s for list state, 0.7s for the house-lights colour change, 0.9s for the follow-spot fade, 1.1s for gel cross-fades and reveals.
- **Arrivals:** rise 36-56px with fade (intro adds a 6px blur clearing); stagger 0.08-0.12s.
- **Pinned chapters:** scrubbed timelines (scrub 0.8-1) over 160-240% of a viewport, on every screen size.
- **Scenes (`scenes.ts`):** each pinned stage, reel and flowing stage is a scene. Scrolling is always native and never intercepted; if the visitor comes to rest (160ms) partway through the transition between two scenes, a GSAP glide (0.6-1.8s, power2.inOut, autoKill on any scroll) finishes the move forward, or eases back if they stopped within the first 22%.
- **Silk:** palettes cross-fade over 1.4s on gel change; pointer speed becomes a decaying stir (swirl plus a faint bloom) around the cursor; scrolling stirs it lightly.
- **Reduced motion:** every chapter settles into its finished state; curtains and the "One more thing" line are removed; the follow-spot holds centre; scene glides are off and silk is drawn still.

## Do's and Don'ts

### Do:
- **Do** give every new chapter a `data-gel` and route all of its colour through `--gel`, `--gel-2` and `--gel-ink`, with a lighter dark-mode ink.
- **Do** set headlines at 750-900 weight, 108-125% width and -0.03em to -0.05em tracking, with the payoff line in gel ink.
- **Do** keep mono uppercase (0.72rem, 0.1em tracking) for presenter furniture: counters, slide numbers, cues, status lines and stack lists.
- **Do** show products in the em-scaled device frames, and label any mocked screen "Sample data".
- **Do** label every architecture diagram in plain words, and assemble it on scroll rather than showing it pre-built.
- **Do** keep every light feathered (radial to transparent, blurred canvas) and provide focus, touch and reduced-motion paths for the follow-spot.
- **Do** say statistics in a sentence at headline size, with the numbers in gel ink.

### Don't:
- **Don't** fall back to a grid of project cards under a hero tagline; each project is a chapter with its own stage.
- **Don't** put a mono label above a headline as a kicker; mono belongs to the presenter's equipment.
- **Don't** fill large surfaces with a gel or show two chapters' gels at once.
- **Don't** draw a hard-edged spotlight or vignette; the light has no visible rim.
- **Don't** set display type light or at normal width.
- **Don't** add filled buttons on the stage; the only filled action is hublii's waitlist CTA in its own brand colour.

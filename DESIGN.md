---
name: Japan Trip Map
description: A 16-day itinerary dyed into a tenugui and unrolled over the map.
colors:
  ai: "#1d3557"
  ai-deep: "#13243d"
  ai-wash: "#dfe5ee"
  kaki: "#a8461a"
  kaki-wash: "#f6e1d3"
  kinari: "#f7f4ec"
  kinari-2: "#ece7da"
  ink: "#17202c"
  ink-soft: "#4d5868"
  on-ai: "#f7f4ec"
  on-ai-soft: "#b9c4d6"
  on-ai-hi: "#f6c9a8"
  sea: "#d7dde3"
  route: "#1d3557"
  label: "#1d3557"
  rule: "#d9d3c4"
typography:
  display:
    fontFamily: "Kaisei Decol, Noto Serif JP, serif"
    fontSize: "clamp(23px, 6.4vw, 30px)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Zen Kaku Gothic New, Noto Sans JP, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    fontFeature: "tnum"
  body:
    fontFamily: "Zen Kaku Gothic New, Noto Sans JP, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Zen Kaku Gothic New, Noto Sans JP, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  time:
    fontFamily: "Zen Kaku Gothic New, Noto Sans JP, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    fontFeature: "tnum"
  label:
    fontFamily: "Zen Kaku Gothic New, Noto Sans JP, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.02em"
  control:
    fontFamily: "Zen Kaku Gothic New, Noto Sans JP, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    fontFeature: "tnum"
rounded:
  tick: "2px"
  sm: "8px"
  md: "10px"
  sheet: "18px"
  full: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "14px"
  gutter: "18px"
  gutter-wide: "24px"
components:
  daychip:
    backgroundColor: "{colors.ai}"
    textColor: "{colors.on-ai}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "7px 14px"
  sheet:
    backgroundColor: "{colors.kinari}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  sheet-head:
    backgroundColor: "{colors.ai}"
    textColor: "{colors.on-ai}"
    typography: "{typography.title}"
    padding: "0 18px 12px"
  next-row:
    backgroundColor: "{colors.kaki-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  button-day:
    backgroundColor: "{colors.kinari-2}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "44px"
  button-day-active:
    backgroundColor: "{colors.ai-wash}"
  note-flag:
    backgroundColor: "{colors.ai-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  pin:
    backgroundColor: "{colors.ai}"
    rounded: "{rounded.full}"
    size: "18px"
  pin-current:
    backgroundColor: "{colors.kaki}"
    rounded: "{rounded.full}"
    size: "28px"
---

# Design System: Japan Trip Map

## Overview

**Creative North Star: "The Hand-Dyed Tenugui"**

The trip is a length of katazome cotton laid over the map. Indigo (ai) is the dye: it colours the shell, meaning the day chip, the sheet's head band, the pins and the route. Everything you read sits on undyed cotton (kinari). Persimmon (kaki) is the one second dye, and it only marks time: timed items, the current stay's pin, the current day tick, the "To confirm" gaps, and focus.

The map is full-bleed and kept quiet. In light mode it sits on a pale sea grey, in dark mode on a night indigo, and the dyed shell carries all the colour. The sheet is a single bolt of cloth with a dyed head and a cotton body. It rises from the bottom on phones and hangs as a fixed side panel from 900px. Density is set for a quick check on a phone: one display title, one stay line, one persimmon "next" row, with the detail folded away below.

The theme follows the system light or dark setting, and both modes are first-class. In dark mode the cotton becomes a deep indigo night and the dyes lighten to stay legible.

**Key Characteristics:**
- Two dyes on cotton: indigo for structure, persimmon only for time.
- Each region gets its own stencil repeat, printed faintly into the indigo head band.
- A display serif (Kaisei Decol) for the day title only. Everything else is Zen Kaku Gothic New.
- Tabular numerals wherever a date, day count or time appears.
- Soft, cool-tinted shadows lift the dyed pieces off the map. The cotton itself is flat.

## Colors

Two dyes and undyed cotton, with a full dark-mode remap through the same custom properties.

### Primary
- **Ai Indigo** (`ai`): the dye. Fills the day chip, the sheet head band, the pins and the browser theme colour. The route and section labels use the same hue through their own tokens (`route`, `label`), so dark mode can lighten them independently of the band fill.
- **Deep Ai** (`ai-deep`): the darkest dye step. It is defined in both modes but nothing in the stylesheet uses it yet. It is reserved for the dye ramp.
- **Ai Wash** (`ai-wash`): indigo bled into cotton. Used for the note flags and as the pressed state of the day buttons.

### Secondary
- **Kaki Persimmon** (`kaki`): time and attention. Used for timed-item numerals, the "next" time, the current pin and its bloom ring, the current day tick, "To confirm" text, the focus outline, the text selection and the unsaved-offline dot.
- **Kaki Wash** (`kaki-wash`): the ground of the "next" row. It is the only cotton surface that carries persimmon.

### Neutral
- **Kinari Cotton** (`kinari`): the sheet body and the ring around each pin.
- **Kinari Fold** (`kinari-2`): the resting fill of the day buttons, one step darker than the cotton.
- **Sumi Ink** (`ink`) / **Soft Ink** (`ink-soft`): body text and the secondary text that sits beside it (labels, untimed items, addresses, meal names).
- **On-Ai** (`on-ai`), **On-Ai Soft** (`on-ai-soft`), **On-Ai Highlight** (`on-ai-hi`): text on indigo. Primary text, the region name and grab handle, and the current day number in the chip.
- **Sea** (`sea`): the page and map background behind the basemap tiles.
- **Thread Rule** (`rule`): the dashed section dividers, the nav top border and the idle day ticks.

Dark mode values live in the sidecar's `colorMeta.<token>.dark`. Shadows use one more token, `--shadow`, which is an RGB triplet (`18 30 50` in light, `0 0 0` in dark) applied at different alphas.

### Named Rules
**The Two Dyes Rule.** Indigo carries structure and persimmon carries time. Nothing else gets a hue, with one exception in the build: the saved-offline status dot is green (the `--ok` token, `#3f8f5b`). If an element is neither part of the shell nor about time, it stays on cotton in ink.

**The Persimmon Is a Clock Rule.** Kaki appears only on timed things, the current stay or day, "To confirm" gaps, and focus. Its text uses must meet 4.5:1 on the surface they sit on. The light-mode value does not meet this yet (see Do's and Don'ts).

## Typography

**Display Font:** Kaisei Decol 700 (with Noto Serif JP, serif)
**Body Font:** Zen Kaku Gothic New 400/700 (with Noto Sans JP, system-ui, sans-serif)

**Character:** a decorative Japanese serif for the one title on each card, set against a plain, open Japanese gothic for everything you scan. All fonts are self-hosted woff2 files, and the display face is preloaded.

### Hierarchy
- **Display** (700, clamp(23px, 6.4vw, 30px), 1.18, -0.01em, balanced wrap): the day title. Used once per card.
- **Title** (700, 15px, tabular): the date line in the indigo band. The region name sits on the same line in 400 and On-Ai Soft.
- **Time** (700, 18px, tabular, kaki): the time in the "next" row.
- **Body** (400, 16px, 1.55): the base size, the stay line and the "next" text. Bold (700) marks the stay name and the flight number (17px).
- **Body Small** (400, 15px): the timeline and meals grids. Timeline times are 700 and kaki.
- **Control** (700, 14px, tabular): the day chip and the prev/next buttons. Note flags use 14px at 400.
- **Label** (700, 13px, 0.02em, label indigo): section headings in the expanded card (Sleep, The day, Meals, Notes). The inline "Sleep"/"Flight" field label uses 13px at 400 in Soft Ink.

### Named Rules
**The One Serif Rule.** Kaisei Decol sets the day title and nothing else.

**The Tabular Time Rule.** Every date, day count and clock time uses `font-variant-numeric: tabular-nums`, so numbers do not jitter as you step through days.

## Layout

The map is a full-bleed fixed layer. Below 900px the sheet is a bottom sheet capped at 86vh, with 18px gutters. The card body is padded 14px 18px 4px and scrolls on its own. From 900px the sheet becomes a full-height right panel `min(440px, 40vw)` wide, the map stops at the panel's edge, gutters widen to 24px, the grab handle is hidden and the detail is always expanded. The day chip and offline badge float 12px from the top-left and top-right, inside the safe-area insets.

The rhythm is a small 6-8-10-12-14-16-18 set rather than a strict scale: 8px inline gaps, 12px between blocks, 16px plus 12px around each dashed section. The timeline is a two-column grid (52px time column, 8px by 12px gaps). Meals use the same pattern with an auto-width first column.

Tap targets are at least 44px: the day buttons, the tick buttons, the Maps link, and the pins through an invisible 44px halo.

## Elevation & Depth

Depth is the dyed pieces resting on the map. The cotton surfaces themselves are flat, and every shadow is tinted with the cool indigo `--shadow` triplet, never neutral black, except in dark mode where it becomes black.

### Shadow Vocabulary
- **Chip lift** (`box-shadow: 0 4px 14px rgb(var(--shadow) / .22)`): the day chip and offline badge floating over the map.
- **Pin lift** (`box-shadow: 0 2px 6px rgb(var(--shadow) / .35)`): stay pins.
- **Sheet rise** (`box-shadow: 0 -10px 30px rgb(var(--shadow) / .2)`): the bottom sheet, casting upward.
- **Panel cast** (`box-shadow: -8px 0 30px rgb(var(--shadow) / .12)`): the side panel at 900px and wider, casting left.

### Named Rules
**The Cloth Lies Flat Rule.** Nothing inside the sheet casts a shadow. Inner surfaces such as the next row, the flags and the buttons separate from the cotton by tint alone.

## Shapes

Soft but not pillowy. Corners are 10px on chips, buttons and the next row, 8px on note flags, 18px on the top corners of the bottom sheet (square as a side panel), 2px on day ticks, and full circles for pins. Section dividers are 1px dashed rules, like basting stitches. The nav rule is solid. Each region's stencil is a single-line SVG repeat drawn in cotton white at 0.16 to 0.18 stroke opacity and tiled at its natural size behind the head band. The four repeats in the build are wave (coasts, and the default), hemp (Nakasendo), peaks (Matsumoto, Hakone) and rings (Nara, Kyoto, Osaka).

## Components

### Buttons
- **Shape:** gently rounded (10px), borderless, at least 44px tall.
- **Day button:** Kinari Fold fill, Control type, 0 14px padding. The label is the neighbouring day's short date.
- **Pressed:** fills with Ai Wash (0.2s). **Disabled:** 0.35 opacity at the ends of the trip.
- **Focus (global):** a 2px kaki outline, 2px offset, 6px radius.

### Chips
- **Day chip:** indigo with On-Ai text, Control type, 7px 14px padding, Chip lift. The current day number is set in On-Ai Highlight ("Day **3** of 16").
- **Offline badge:** the same dyed chip, led by an 8px dot. The dot is kaki while maps are unsaved and green once they are saved. When saved, the badge drops to cotton with Soft Ink text at weight 400 and stops being interactive.

### Cards / Containers
- **Sheet:** a cotton body with an indigo head band carrying the region stencil. The head holds the grab handle (40 by 4px, On-Ai Soft at 0.7 opacity) and the date/region line.
- **Next row:** a Kaki Wash ground, 10px radius, 10px 12px padding, with the kaki time followed by the item text.
- **Note flag:** an Ai Wash ground, 8px radius, 8px 10px padding, 14px text.
- **Expanded detail:** sections divided by dashed rules. It unfolds downward (grid rows 0fr to 1fr plus a clip-path reveal, 0.55s).

### Navigation
- **Day ticks:** one 3px-wide rule per day inside a 12px-by-44px button. Idle ticks are Thread Rule at 12px tall. The current tick is kaki and 20px tall, and changes animate over 0.4s.
- **Day change:** the card content slides 28px from the direction of travel with a 3px blur over 0.5s, and the head's date line fades in. The map flies to the stay over 2.2s, or jumps there under reduced motion.

### Map Pins (signature)
- 18px indigo dots with a 3px cotton ring and Pin lift. The current stay grows to 28px kaki (0.5s), and when motion is allowed a kaki ring blooms outward from it (scale to 2.6, 2.6s, infinite).
- The route is a 3px round-capped line in `route`. The flight legs to and from Haneda are 2px dashed lines at 0.6 opacity.

## Do's and Don'ts

### Do:
- **Do** set every surface colour through the `:root` custom properties so the dark-mode remap applies. The map layers read `--sea` and `--route` at runtime.
- **Do** reserve kaki for time, the current stay or day, "To confirm" gaps and focus.
- **Do** give each new region a stencil repeat: a single-stroke SVG in `#f7f4ec` at 0.16 to 0.18 opacity, assigned by region name.
- **Do** keep every tap target at least 44px, using an invisible halo where the visible mark is smaller.
- **Do** put all motion except the colour fades behind `prefers-reduced-motion: no-preference`, using the `--ease` curve `cubic-bezier(.16, 1, .3, 1)`.
- **Do** use tabular numerals for every date, count and time.

### Don't:
- **Don't** add another hue beyond the saved-offline status dot. A new state is shown with indigo, persimmon, a wash of either, or ink.
- **Don't** use Kaisei Decol for anything except the day title.
- **Don't** shadow anything inside the sheet. Depth belongs to pieces floating over the map.
- **Don't** lighten kaki below `#a8461a` in light mode; it is the lightest value that clears 4.5:1 on Kinari and Kaki Wash.

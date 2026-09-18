---
name: Grok 4.7 enamel plate
description: A riveted factory vitreous-enamel status plate that stamps whether Grok 4.7 exists.
colors:
  enamel-idle: "#163328"
  enamel-live: "#c4452d"
  enamel-bone: "#f3ead4"
  enamel-bone-live: "#f8efe0"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(7rem, 28vw, 14rem)"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(1.05rem, 2.4vw, 1.45rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.18em"
  body:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.02em"
rounded:
  none: "0px"
  rivet: "50%"
spacing:
  plate: "clamp(1.75rem, 5vw, 3.5rem)"
  rivet-inset: "clamp(0.85rem, 3vw, 1.8rem)"
  rivet: "clamp(1.7rem, 3.2vw, 2.4rem)"
  stamp-gap: "0.35rem"
components:
  status-plate:
    backgroundColor: "{colors.enamel-idle}"
    textColor: "{colors.enamel-bone}"
    rounded: "{rounded.none}"
    padding: "{spacing.plate}"
  status-plate-live:
    backgroundColor: "{colors.enamel-live}"
    textColor: "{colors.enamel-bone-live}"
    rounded: "{rounded.none}"
    padding: "{spacing.plate}"
  answer-word:
    textColor: "{colors.enamel-bone}"
    typography: "{typography.display}"
  machine-stamp:
    textColor: "{colors.enamel-bone}"
    typography: "{typography.title}"
  check-line:
    textColor: "{colors.enamel-bone}"
    typography: "{typography.body}"
    width: "28ch"
---

# Design System: Grok 4.7 enamel plate

## Overview

**Creative North Star: "The Riveted Factory Enamel Plate"**

The viewport is not a page with a status widget. It is a single cold-fired factory plate, edge to edge, as if the browser chrome were the lip of a machine enclosure. Idle, the body is Brunswick vitreous enamel — dark, pitted, with a soft overhead bloom in the photograph. When Grok 4.7 is on the catalogue the same plate inhabits: the field floods vermilion, the bone lettering stays, the rivets stay. Hue is the enamel body, not a traffic light.

Density is extreme and empty. One stamp (OUI, NON, or an em dash while unknown) occupies most of the glass. Directly under it, the machine name. At the bottom edge, a quiet check line. Four photographic rivets pin the corners. There is no card, no nav, no CTA, no metric chrome. Motion is material: a 700ms enamel flood, and while the catalogue is being polled, a single rivet breathes.

Confirmed rejections: hero-metric dashboards, cards, glow on the word, CSS-only flat fills as the field, traffic-light green/red as available/unavailable, labels above the answer, stencil display, glyph rivets.

**Key Characteristics:**

- Full-bleed photographic enamel, not a contained panel
- Two fired bodies only: Brunswick idle and vermilion inhabited
- Bone condensed grotesk stamped into the plate (Big Shoulders 800 / 700)
- Four corner rivets as cropped metal photographs
- Depth from the rasters; no box-shadow vocabulary
- Square plate, circular rivets, nothing in between

## Colors

The palette is two enamel firings plus bone lettering that sits on them. Undercoat hex lives on `:root`; the visible field is the matching photograph.

### Primary
- **Brunswick Vitreous**: Rest body of the plate. Page background, plate undercoat, and the idle field photograph. Selection inverts onto this green. It is the native fire, not “error” or “offline.”

### Secondary
- **Inhabited Vermilion**: Live body when the model exists. The live field photograph covers the plate; the token tints the live check line (`color-mix` 90% live bone / 10% vermilion). It is inhabited enamel, not “success.”

### Neutral
- **Fired Bone**: Idle stamp, machine line, and default text. Focus ring is a 2px bone stroke, offset 4px. Selection background.
- **Live Bone**: Stamp color on the vermilion field — a slightly warmer, lighter bone so the lettering still reads as fired, not paper white.

### Named Rules
**The Material Not Signal Rule.** Brunswick and vermilion are fired enamel states. OUI / NON is the mark; hue is the plate’s body. Never recode green as go or red as fail.

**The Two Fires Rule.** Only two plate bodies exist. Loading, unknown, and catalogue-unreachable keep the current firing and speak through the stamp and the check line — they do not introduce a third field color.

## Typography

**Display Font:** Big Shoulders (with Arial Narrow, sans-serif)
**Body Font:** Public Sans (with ui-sans-serif, system-ui, sans-serif)

**Character:** A bone condensed industrial grotesk, heavy and tightly packed, as if pressed into enamel. The check line is a quieter grotesque — same era, not the same stamp.

### Hierarchy
- **Display** (800, `clamp(7rem, 28vw, 14rem)`, line-height 0.78, tracking −0.04em, uppercase): The answer word only — OUI, NON, or —. Below 640px the clamp tightens to `clamp(5.2rem, 32vw, 8.5rem)`.
- **Title** (700, `clamp(1.05rem, 2.4vw, 1.45rem)`, tracking 0.18em, uppercase): The machine name directly under the word (“Grok 4.7”). Same family, much smaller, opened tracking. 0.35rem gap above it.
- **Body** (500, 0.95rem, tracking 0.02em): The check line at the bottom edge. Max width 28ch, centered. Idle mix is 94% bone / 6% Brunswick; live mix is 90% live bone / 10% vermilion.

### Named Rules
**The One Stamp Rule.** Only the answer word may occupy display size. If a second large word appears, the plate has failed.

**The No Eyebrow Rule.** Nothing sits above the answer. The machine line is the named subject under the stamp, never a category kicker, never a status pill.

## Layout

The plate is the viewport: `min-height` and `height` 100svh, `overflow: hidden` on html/body, no scroll. A two-row grid (`1fr auto`) centers the stamp and pins the check line to the bottom. Horizontal and vertical inset is `clamp(1.75rem, 5vw, 3.5rem)`. Content is centered; there is no max-width container around the plate itself.

Rivets sit on an absolute inset of `clamp(0.85rem, 3vw, 1.8rem)`, one per corner, sized `clamp(1.7rem, 3.2vw, 2.4rem)`. They are outside the text grid and do not participate in flow.

The only breakpoint in the shipped CSS is `640px`, and it only rescales the answer word. Do not introduce columns, sidebars, or a tablet “card” treatment.

### Named Rules
**The Viewport Is the Plate Rule.** No surrounding chrome, no safe-area card, no split pane. New surfaces that belong to this world are also full-bleed plates, not pages that contain a plate.

## Elevation & Depth

The system has no `box-shadow`. Depth is in the enamel photographs (pitted vitreous, specular bloom) and in the rivet photographs (domed pewter, center pit). The live field is a second full-bleed raster faded in over the idle raster (`opacity` 0 → 1). Do not add inset glazes, grain overlays, or word glow — earlier CSS experiments used those; the shipped plate does not.

### Named Rules
**The Photograph Carries Depth Rule.** If a surface needs thickness, use the enamel or rivet raster. Do not invent a shadow scale to stand in for glass.

## Shapes

The plate is square-cornered (`border-radius: 0`). The only circle is the rivet: a photographic disc clipped with a radial mask (opaque to 46%, transparent by 47.5%) so the metal dome reads as a fastener, not a rounded rectangle. No pills, no squircles, no hairline frames.

### Named Rules
**The Four Rivets Rule.** Every full-bleed plate carries four circular rivets, one per corner. While the catalogue is polled, exactly one rivet (top-right) breathes — scale 1 → 1.12 and brightness 1 → 1.35 over 1.6s. The other three stay still.

## Components

This world does not ship buttons, inputs, chips, or navigation. The plate *is* the interface.

### Status plate
- **Character:** A factory enamel lid, idle or inhabited.
- **Shape:** Full viewport, square corners, photographic field covering the undercoat.
- **Idle:** Brunswick undercoat and idle raster; bone lettering.
- **Live:** Live raster at full opacity; live-bone lettering. Undercoat hex stays idle; the photograph is the body.
- **Motion:** Live raster opacity, 700ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Focus:** 2px bone outline, 4px offset (global `:focus-visible`).
- **Selection:** Bone field, Brunswick text.

### Answer word
- **Character:** The only large type; the mark.
- **Copy:** `OUI` / `NON` / `—` (unknown). Always uppercase via CSS.
- **Type:** Display ramp. No text-shadow.

### Machine stamp
- **Character:** The named subject of the plate, not a kicker.
- **Copy:** `Grok 4.7`, same condensed family, opened tracking, 0.35rem below the word.

### Check line
- **Character:** Quiet factory caption at the bottom edge.
- **Copy:** Relative French time (`Vérifié …`) or `Catalogue injoignable` (with “dernier état conservé” when a last stamp is kept). Public Sans 500, 28ch max.
- **State:** Color-mix tints toward the current enamel; it never turns traffic-light.

### Corner rivet
- **Character:** Pewter dome on enamel, photographic, masked to a disc.
- **Idle:** Static.
- **Polling:** Top-right rivet only; `breathe` animation. Decorative (`aria-hidden`).

## Do's and Don'ts

### Do:
- **Do** fill the viewport with the enamel photograph (idle or live raster) and stamp the answer in Big Shoulders 800.
- **Do** keep four photographic rivets at the corners and let exactly one breathe during a poll.
- **Do** crossfade the live field at 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Do** put the machine name under the word and the check time at the bottom edge, nothing above the stamp.
- **Do** keep last-known enamel and stamp when the catalogue fails; say the failure in the check line.

### Don't:
- **Don't** recode Brunswick/vermilion as success/fail, or add a third field color for error or loading.
- **Don't** place a kicker, eyebrow, or label above the answer word.
- **Don't** introduce cards, dashboards, nav, buttons, or marketing CTAs.
- **Don't** glow the word, drop offset shadows, or replace the photographs with CSS grain/glaze.
- **Don't** use glyph icons or geometric CSS circles as rivets, or stencil / system display as the stamp face.

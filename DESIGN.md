---
name: CollabCode
description: A quiet, warm-charcoal workspace where two people code or write together, lit only where the work and the people are.
colors:
  ink: "#0c0a09"
  surface: "#1c1917"
  surface-raised: "#292524"
  hairline: "#fafaf90f"
  text-primary: "#fafaf9"
  text-secondary: "#d6d3d1"
  text-muted: "#a8a29e"
  text-faint: "#78716c"
  lamp-amber: "#fbbf24"
  lamp-orange: "#fb923c"
  ember-rose: "#fb7185"
  signal-teal: "#2dd4bf"
  doc-paper: "#fffdf7"
  doc-ink: "#292524"
  danger: "#fb7185"
  success: "#34d399"
typography:
  display:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.05em"
  code:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  "2xl": "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "40px"
components:
  button-primary:
    backgroundColor: "{colors.lamp-amber}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.lamp-orange}"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "36px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "36px"
  button-destructive:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "36px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  input-field-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "0 44px"
    height: "44px"
  card-room:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  presence-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  toolbar-button:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    size: "32px"
  toolbar-button-active:
    backgroundColor: "#fbbf2433"
    textColor: "{colors.lamp-amber}"
  error-banner:
    backgroundColor: "#fb71851a"
    textColor: "#fecdd3"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
---

# Design System: CollabCode

## 1. Overview

**Creative North Star: "The Lamplit Desk"**

Two people sit at one desk after dark. The room around them is dim, quiet, and out of the way — nothing on the walls competes for attention. A single warm lamp lights exactly the work in front of them and the hands moving across it. Everything CollabCode looks like follows from that scene: the surface is a warm charcoal that recedes, and amber is the lamp, never the paint.

This is why the interface is calm without being cold. The near-black (`#0c0a09`) carries a trace of warmth rather than the blue-gray of a terminal, so long sessions feel like a room and not a machine. Colour appears at exactly two kinds of moments: **the people** (a collaborator's cursor, their name, their presence chip) and **the actions** (the one primary button on a screen). Everything else — panels, dividers, metadata, chrome — is a step on the stone ramp and stays quiet. When your partner's cursor appears in the editor, it should be the brightest new thing on screen, because that is the product.

The system explicitly rejects **corporate IDE chrome**: no toolbar sprawl, no gray enterprise panels, no dense workbench where every pixel is a control. A CollabCode room is a room, not a cockpit. It equally rejects **toy and gamified aesthetics**: no mascots, no badges, no confetti, no XP. The users are doing real work with a friend, and the interface treats them as adults. The one place the system is allowed to raise its voice is the marketing landing page, which is a separate room from the app and governed by its own rule below.

**Key Characteristics:**
- Warm charcoal canvas (`#0c0a09` → `#1c1917`), never blue-gray
- Amber reserved for people and primary actions; ≤10% of any app screen
- One typeface (Geist Sans) across the entire product; Geist Mono for code and IDs
- Flat by default; depth from tonal layering and hairline borders, not shadows
- Fixed rem type scale in the app; fluid clamp scales only on the landing page
- Presence is a designed element, not a status readout

## 2. Colors

A warm-charcoal ramp lit by a single amber lamp, with three companion hues that exist almost entirely to tell two people apart.

### Primary
- **Lamp Amber** (`#fbbf24`): The lamp. Primary buttons, the active state in the doc toolbar, focus rings, the brand mark, and the first collaborator's cursor. Its authority comes from scarcity — on a dashboard it should appear on the New button, the active filter pill, and nothing else.
- **Lamp Orange** (`#fb923c`): The lamp leaning warmer. The hover partner for Lamp Amber (primary buttons run `amber → orange` on hover) and the accent edge on a hovered card. Never used as a resting fill on its own.

### Secondary
- **Signal Teal** (`#2dd4bf`): The other person. Second collaborator cursor, "shared" indicators, and the counterpoint accent in the landing hero. Teal reads as clearly *not you* against amber — that contrast is the entire point.
- **Ember Rose** (`#fb7185`): Doubles as the third cursor colour and as the system's danger tone (destructive buttons, error banners, invalid field messages). Because it is load-bearing for errors, never use it decoratively in the app shell.

### Tertiary
- **Collaborator ramp** (`#fbbf24`, `#fb923c`, `#fb7185`, `#2dd4bf`, `#38bdf8`, `#a3e635`, `#f472b6`, `#34d399`): Eight fixed hues assigned deterministically by hashing a user id, so a person keeps the same colour across every session. This ramp is **not** a general palette. Its only job is identity in `collab.ts`; borrowing these hues for UI decoration destroys the signal.
- **Success Emerald** (`#34d399`): Positive terminal states only — "room created", the doc's saved indicator, passing execution status.

### Neutral
- **Ink** (`#0c0a09`): The body canvas. Warm near-black; the room with the lights low.
- **Surface** (`#1c1917`): Cards, inputs, popovers, sticky headers. One step up from the canvas.
- **Surface Raised** (`#292524`): Hover fills, pressed toolbar buttons, the top of a layered stack.
- **Hairline** (`rgba(250,250,249,0.08)`): Every border and divider in the system. Borders are whispers, not lines.
- **Text Primary** (`#fafaf9`): Headings, values, editor content. 18.6:1 on Ink.
- **Text Secondary** (`#d6d3d1`): Body copy, form labels, toolbar icons. 11.2:1 on Ink.
- **Text Muted** (`#a8a29e`): Supporting copy, card metadata, descriptions. 6.7:1 on Ink — the floor for anything a user reads.
- **Text Faint** (`#78716c`): Placeholders, disabled labels, decorative marks only. 3.6:1 — **below AA for body text**; never carry meaning here.
- **Doc Paper** (`#fffdf7`) / **Doc Ink** (`#292524`): The document canvas inverts the system. A doc is paper on a desk; it is lit, the room is not. 14.1:1.

### Named Rules

**The Lamp Rule.** Amber is light, not paint. It may occupy no more than ~10% of any app screen, and only on people (cursors, presence, avatars) or the single primary action. If a screen has two amber buttons, one of them is wrong.

**The Identity Rule.** The eight collaborator hues are reserved for identity. Never reach into that ramp for a chart, a tag, or a decorative accent — and never let colour be the only carrier of who someone is. The name label ships with the cursor, always.

**The Warm Neutral Rule.** Every neutral carries warmth (hue ~40–60, chroma ≤0.01). Blue-gray or pure-neutral gray is prohibited in the app shell; it is the tell of the corporate IDE this product rejects.

**The Contrast Floor Rule.** `text-muted` (`#a8a29e`, 6.7:1) is the darkest text permitted for anything a user reads, including placeholders. `text-faint` is for decoration and disabled states only. If you are unsure, step toward `text-primary`.

## 3. Typography

**Display Font:** Geist Sans (fallback `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Geist Sans — the same family, differentiated by weight
**Label/Mono Font:** Geist Mono (fallback `ui-monospace, monospace`)

**Character:** One neutral, slightly technical grotesque doing every job in the product, with its monospace sibling for anything the machine owns. The pairing is family-internal by design: Geist Sans and Geist Mono share skeletons, so a room ID sitting next to a room name reads as the same voice speaking in a different register. Hierarchy comes from weight and size, never from a second personality.

### Hierarchy
- **Display** (700, `3rem`/48px → `4.5rem`/72px fluid, 1.05, `-0.025em`): Landing hero only. This is the one place the fluid scale is permitted.
- **Headline** (700, `1.875rem`/30px, 1.2, `-0.02em`): Page-owning titles — "Welcome back", "Create your account", section heads on the landing page.
- **Title** (600, `1.125rem`/18px, 1.4): Card names, dialog titles, the doc name in the editor header.
- **Body** (400, `0.875rem`/14px, 1.6): The product's workhorse. Form labels, descriptions, menu items, buttons. Cap prose at 65–75ch; the auth panel's copy already sits at `max-w-md`.
- **Label** (500, `0.75rem`/12px, `0.05em`, uppercase): Section markers ("START A NEW ROOM", "YOUR ROOMS") and presence chips. Rationed — see the rule below.
- **Code** (400, `0.8125rem`/13px, 1.75): Geist Mono. Editor content, room IDs, terminal mockups, cursor name labels.

### Named Rules

**The One Family Rule.** Geist Sans carries the entire product; Geist Mono carries only what the machine owns (code, IDs, execution output). A third family is prohibited. If a heading needs more presence, add weight, not personality.

**The Fixed Scale Rule.** The app uses a fixed rem scale. `clamp()` is permitted on the landing hero and nowhere else — a fluid title that shrinks inside a sidebar looks broken, not responsive.

**The Rationed Caps Rule.** Uppercase tracked labels are load-bearing structure on the dashboard (two of them, marking the two zones) and are prohibited as decorative eyebrows above every section. One per zone, or none.

## 4. Elevation

The system is **flat by default and tonal by preference**. Depth is expressed by stepping up the neutral ramp — Ink → Surface → Surface Raised — and by hairline borders at `rgba(250,250,249,0.08)`. A resting card has no shadow; it is simply a lighter step of the same room. Shadows appear only as a *response*: a lift on hover, an amber glow under an amber button, a hard drop under something genuinely floating (a popover, the doc page). Backdrop blur is reserved for surfaces that overlap scrolling content — sticky headers, dialogs, the doc toolbar — where it is structural rather than ornamental.

### Shadow Vocabulary
- **Ambient lift** (`box-shadow: 0 20px 60px -20px rgba(251,146,60,0.35)`): Card hover only, paired with `translateY(-6px)` and an amber border. The lamp catching an edge.
- **Action glow** (`box-shadow: 0 10px 15px -3px rgba(249,115,22,0.25)`): Under primary amber buttons. Colour-matched to the element casting it; never a neutral drop shadow under a warm button.
- **Floating** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)`): Dialogs, dropdowns, the doc page against its dark desk.
- **Glass** (`background: rgba(12,10,9,0.8); backdrop-filter: blur(24px)`): Sticky headers and the doc toolbar. Permitted **only** where content scrolls beneath.

### Named Rules

**The Flat-At-Rest Rule.** Surfaces are flat until the user touches them. If a card has a shadow before hover, remove it and step the background instead.

**The Warm Shadow Rule.** Shadows under amber elements are amber. A neutral black drop under a warm button is the 2014 tell — if it looks like a Bootstrap button, the shadow is the reason.

**The Structural Blur Rule.** Backdrop blur must have something scrolling under it. Glass used for flavour on a static card is prohibited.

## 5. Components

The vocabulary is deliberately small and repeats everywhere. A user should learn one button, one field, one card, and be fluent in the whole product.

### Buttons
- **Shape:** Softly squared (`8px` / `rounded-md`); the doc toolbar's icon buttons round slightly more (`10px`) because they are near-square.
- **Primary:** Amber→orange gradient fill (`#fbbf24 → #f97316`) with **Ink text** (`#0c0a09`) — dark text on warm fill, never white. `44px` tall on auth and dialogs, `36px` in headers. Carries an action glow.
- **Hover / Focus:** Gradient lightens (`#fcd34d → #fb923c`) over 150–200ms. Focus is a `3px` amber ring at 20% opacity; the ring is never removed.
- **Outline:** `rgba(250,250,249,0.05)` fill, hairline border, secondary text. The universal Cancel / dismiss.
- **Ghost:** Transparent, muted text, surface-raised on hover. Toolbar and menu affordances only.
- **Destructive:** Solid rose (`#fb7185` at 90%), white text. Delete and Leave only.
- **Disabled:** 50% opacity, pointer events off. Loading swaps the leading icon for a spinner and the label for present-tense progress ("Signing in…", "Joining…"), never a bare spinner.

### Inputs / Fields
- **Style:** `44px` tall, Surface fill (`rgba(28,25,23,0.6)`), hairline border, `8px` radius. Leading Lucide icon at `16px` in `text-faint`, inset `12px`; the field pads to `40px` to clear it. Room IDs use Geist Mono.
- **Focus:** Border shifts to amber at 50%, plus a `3px` amber ring at 20%. No glow, no scale.
- **Error:** Rose border and a rose message beneath (`0.875rem`). Field-level messages state the rule; the form-level banner states what the server said.
- **Search pill:** The dashboard's one deliberate exception — fully rounded (`9999px`), `44px`, leading search icon, trailing clear button once it has content. Its shape marks it as global, not a form field.

### Cards / Containers
- **Corner Style:** Generous (`16px` / `rounded-2xl`) on room cards and template tiles; `12px` on dialogs; `8px` on inline surfaces.
- **Background:** A vertical wash from `rgba(28,25,23,0.7)` to `rgba(12,10,9,0.7)` — a card is a lighter patch of the same room, not a different material.
- **Border:** Hairline at rest; amber at 45% on hover.
- **Shadow Strategy:** None at rest. Ambient lift + `translateY(-6px)` on hover (see Elevation).
- **Internal Padding:** `16px` on room cards, `20px` on template tiles, `24px+` on dialogs.
- **Room card anatomy:** A `144px` code-preview thumbnail (first ~9 lines in Geist Mono at `10px`, `text-faint`, fading into the canvas) over a `36px` type-marked icon, name, and a single metadata line — `language · owner · edited`. Amber icon for code, emerald for docs. Nested cards are prohibited.

### Navigation
- **Style:** A `64px` sticky bar, `rgba(12,10,9,0.7)` with `blur(24px)`, hairline bottom. Brand mark left, context centre, identity right.
- **States:** Links are `text-secondary` at rest, amber on hover, 150ms. The avatar is a `40px` amber-gradient circle with the user's initial in Ink, scaling `1.05` on hover.
- **Mobile:** The nav collapses to a menu button; the dashboard search keeps its width and the brand wordmark drops to the mark alone.

### Presence (signature component)
The system's reason for existing, and the one place colour is allowed to be loud. Each collaborator gets a fixed hue from the eight-colour ramp, hashed from their user id so it never changes between sessions. It renders in two synchronized places:
- **Cursor:** A `2px` caret in the user's colour with a name label pinned above it — `11px`, weight 600, Ink text on the user's colour, `4px 4px 4px 0` radius (square corner points at the caret). Identical treatment in CodeMirror (`.cm-ySelectionInfo`) and TipTap (`.collaboration-carets__label`), because a cursor should not change personality between a code room and a doc.
- **Chip:** In the editor header, a pill per person — a `8px` dot in their colour, their name, `(you)` for self. Surface fill, hairline border, `12px` text.

### Dialogs
Radix-backed, `440–480px` wide, `rgba(12,10,9,0.95)` with `blur(24px)`, `12px` radius. Header pairs a `44px` gradient-tiled icon (amber for code, emerald for doc, orange-rose for join) with a title and one line of description. Body is a `20px`-gapped stack; the form-level error banner sits directly above the first field. Footer is right-aligned: Outline Cancel, then Primary action.

### Empty & Error States
- **Empty:** A `64px` tinted circle with a type icon, a title, one line of guidance, and — when there's an obvious next step — the primary action inline. "No rooms yet" teaches; "nothing here" does not.
- **Error:** Rose-tinted banner (`rgba(251,113,133,0.1)`, hairline rose border, `14px` rose-100 text) with a leading alert icon, carrying the server's actual message. Full-surface failures get the same treatment centred, plus a **Try again** button.

## 6. Do's and Don'ts

### Do:
- **Do** keep amber under ~10% of any app screen, on people and the single primary action only (The Lamp Rule).
- **Do** use Ink (`#0c0a09`) text on amber fills. Dark-on-warm is the system's signature; white-on-amber fails contrast and looks generic.
- **Do** step the neutral ramp (Ink → Surface → Surface Raised) to create depth, and leave surfaces flat until hover.
- **Do** colour-match shadows to the element casting them — amber glow under amber buttons.
- **Do** ship a name label with every collaborator cursor. Colour is never the only carrier of identity.
- **Do** hold body text at `text-muted` (`#a8a29e`, 6.7:1) or lighter, placeholders included.
- **Do** give every interactive element all seven states: default, hover, focus-visible, active, disabled, loading, error.
- **Do** pair loading spinners with present-tense labels ("Creating…", "Joining…").
- **Do** put the server's real message in error banners. "Invalid email or password" beats "Something went wrong".
- **Do** keep transitions at 150–250ms with ease-out curves, and give every animation a `prefers-reduced-motion` alternative.
- **Do** use `clamp()` on the landing hero and a fixed rem scale everywhere else.

### Don't:
- **Don't** build **corporate IDE chrome** — toolbar sprawl, gray enterprise panels, dense workbench controls. A CollabCode room is a room, not a cockpit. *(PRODUCT.md anti-reference.)*
- **Don't** introduce **toy or gamified aesthetics** — mascots, badges, confetti, XP bars. The users are doing real work. *(PRODUCT.md anti-reference.)*
- **Don't** use blue-gray or pure-neutral gray in the app shell. Every neutral carries warmth. The editor's legacy `gray-900 → black` gradient, blue badges, and green Run button are **known drift** and should be migrated to this system.
- **Don't** borrow the eight collaborator hues for charts, tags, or decoration. That ramp means *identity*.
- **Don't** use rose for anything decorative in the app; it is load-bearing for danger.
- **Don't** ship `background-clip: text` gradient headings. The landing page's `.lp-gradient-text` is **acknowledged debt** — it is prohibited in new work, in the app entirely, and should be replaced with a solid `text-primary` heading.
- **Don't** use glassmorphism decoratively. Backdrop blur requires content scrolling beneath it.
- **Don't** nest cards inside cards. Ever.
- **Don't** use `border-left`/`border-right` greater than 1px as a coloured accent stripe. The doc editor's `blockquote` is the single deliberate exception, and it is a typographic convention, not a UI accent.
- **Don't** use `text-faint` (`#78716c`) for anything a user must read — it fails AA at 3.6:1.
- **Don't** put uppercase tracked eyebrows above every section. Two on the dashboard mark two real zones; a third is decoration.
- **Don't** let the landing page's effects (`lp-aurora`, `lp-marquee`, `lp-float`, `lp-shine`, `lp-typeline`) cross into the app. **The Two Rooms Rule:** the marketing page may perform, the product may not.
- **Don't** use display fonts, decorative motion, or invented affordances in product UI. Reach for the boring, familiar control.

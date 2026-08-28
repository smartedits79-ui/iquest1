# Design

Recorded from the built site, not from intention. Where this file and the code
disagree, the code is right and this file is stale.

## The world

Deep enamel navy, lit from above in amber. The ground is taken directly from the
client's own brand presentation board — a dark, faintly woven navy — so the site
sits inside an identity that already existed rather than inventing a new one.

Three materials, and nothing else:

1. **Enamel navy ground** — a woven diagonal texture at very low contrast, plus a
   chalk-dust grain overlay, both fixed to the viewport so the page reads as one
   continuous surface rather than a stack of panels.
2. **Amber → ember**, straight from the logo. This is the only warm colour.
3. **Teal**, from the atoms in the logo. Used sparingly and never for text —
   drifting particles, board tags, small marks. It exists to stop the page from
   collapsing into one hue.

There is no white surface anywhere, by brief.

## Tokens

All defined in `:root` in `assets/css/style.css`.

| Role | Token | Value |
| --- | --- | --- |
| Deepest ground | `--ink` | `#080E16` |
| Page ground | `--ground` | `#0E1825` |
| Raised ground | `--ground-2` | `#111E2C` |
| Surface | `--surface` / `--surface-2` / `--surface-3` | `#16232F` / `#1C2C3B` / `#23364A` |
| Primary text | `--chalk` | `#EAF1F7` |
| Body text | `--chalk-2` | `#AEC0D1` |
| Meta text | `--chalk-3` | `#8497AC` |
| Accent | `--amber` / `--orange` / `--ember` | `#F9A11B` / `#F2622A` / `#DC3F16` |
| Counter | `--atom` | `#2CC3D6` |
| Hairline | `--line` / `--line-2` | `rgba(174,192,209,.14)` / `.26` |

Secondary text is tinted from the ground's own hue, never grey. Measured contrast
on the built page runs **5.3:1 to 14.8:1** — every value clears 4.5:1.

### Colour strategy

**Committed.** One saturated family (amber → ember) carries the accent load; the
navy carries everything else. Teal is a spice, not a third role.

### The glow law

Only **Call** and **WhatsApp** are permitted to glow. `--glow` and the WhatsApp
green shadow appear on those two actions and the sticky rail — nowhere else. Every
other raised element uses `--shadow-1` / `--shadow-2`, which are neutral and carry
a real offset plus blur. This is what makes the eye go to the phone number, and it
only works while nothing else competes. **Do not add glow to a new component.**

## Type

- **Display and logotype:** Outfit — 800 for headings, 900 for the wordmark.
- **Text and UI:** Archivo — 400/500/600/700, with `font-variant-numeric: tabular-nums`
  globally so times, phone numbers and counters do not shift.

Headings sit at `letter-spacing: -.035em` with `text-wrap: balance`. The display
ceiling is 74px (h1) / 70px (the 5.0 score) — under the 96px cap. Body measure is
roughly 60–68ch.

The wordmark's amber gradient is the one piece of gradient text on the site. It is
a reproduction of the client's existing logo, and the detector rule is suppressed
for that file on those grounds alone — **no heading, metric or label may use it.**

## Motion — the governing law

**Magnetic attraction.** The logo has a horseshoe magnet in it; the whole page
behaves like one field. This is one authored idea applied consistently, not a
collection of hover effects:

- Hero particles are pulled toward the pointer within a 190px radius, with field
  lines drawn between near neighbours.
- Buttons, chips and board tags lean toward the cursor (fine pointers only).
- Sections are *pulled* into place — translate plus a clearing blur — never faded.
- Headline words arrive one at a time with a slight overshoot (`--pull-hard`),
  which is a filing snapping to a pole and settling. It is used nowhere else.

Easing is `--pull: cubic-bezier(.16,1,.3,1)` — exponential ease-out — everywhere
except that one headline case.

### Motion rules that must hold

- Everything is disabled under `prefers-reduced-motion: reduce`, including the
  canvas, the ticker and the count-up.
- The canvas is capped (26 / 42 / 62 particles by width), paused when scrolled out
  of view, and paused when the tab is hidden.
- **Content is never dependent on motion.** Reveals have three failsafes — a sweep
  on load, a sweep on visibility change, and an unconditional reveal at 4s — because
  a throttled IntersectionObserver must never strand text at opacity 0.
- **Numbers degrade to the truth.** The real figures are in the HTML; the script
  zeroes them only once it knows it can animate, and snaps to the true value if
  rAF is starved.

## Composition

Sections do not repeat one shape. Each has a different structure so the scroll has
pace: a split hero, a five-cell hairline band, a sticky-aside walk down a drawn
spine, a governed timetable, two asymmetric people plates, a score paired with a
list, a three-cell info stack beside a map, and a form beside its own reasons.

- One spacing rhythm, `--s1`…`--s8`, with more space above a heading than below.
- Section heads open with a hand-drawn chalk rule that draws itself in. **There are
  no kickers or eyebrow labels anywhere on this site, and none should be added.**
- Cards are used only where a card is the right object (people, the form). The
  programme list is a table-like grid, not a card mesh.

## Components

| Component | Notes |
| --- | --- |
| `.btn` | Pill. `--call` and `--wa` are the only lit variants. Sheen sweeps on hover. |
| `.status` | Live open/closed, computed in `Asia/Kolkata` — never the visitor's zone. Repeats in header and hero and stays in sync. |
| `.plan` | Chips govern rows: selecting one lights its row and dims the rest. Lit state is a background lift, an amber inset hairline, and an amber stage label — **not** a side stripe. |
| `.steps` | Ordered walk; the spine fills via `transform: scaleY()` on scroll. |
| `.rail` | Sticky WhatsApp + Call, revealed past 60% of the hero. Collapses to icons under 640px. |
| `.form` | Composes a `mailto:` and offers the identical message over WhatsApp. Inline validation clears on input. |

## Browser surfaces

Themed, not left to the browser: selection, scrollbar track and thumb, caret
colour, focus ring (`2px --amber`, 3px offset), placeholder colour, link underline
offset and thickness, and tabular numerals.

## Responsive

Breakpoints at 1080 (columns collapse, hero mark moves above the copy), 900 (nav
becomes a drawer), 640 (band goes two-up, rail goes icon-only, buttons go full
width) and 400. Verified at 375×812 and desktop: no horizontal overflow at either.
Tap targets are ≥42px on every link and control.

## What this design must never do

- Add a testimonial, a result percentage, a topper claim or a fee figure. None were
  supplied. See `PRODUCT.md` → Evidence on Hand.
- Put anything between a visitor and the phone number.
- Introduce a white or cream surface.
- Let a second element glow.

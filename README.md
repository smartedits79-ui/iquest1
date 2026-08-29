# iQuest Learning Center — Yamuna Nagar

Marketing site for a tuition centre teaching Classes 1–10 in Yamuna Nagar, Haryana.
Established 2008. Tagline: *"Since 2008, Yamuna Nagar's answer."*

Plain static HTML, CSS and JavaScript. **No build step, no dependencies, no framework.**
Total payload is about 157 KB.

---

## Where enquiries go

The enquiry form and the footer link both point at:

```
iquesttutorials@gmail.com
```

The form does not send mail by itself. It validates the fields, then opens the visitor's
own email app with the whole message already written, addressed to the inbox above. There
is a WhatsApp button beside it that sends the identical message to +91 98967 16957.

To change the address later, edit it in **two** places and keep them in step:

| File | What to change |
| --- | --- |
| `assets/js/main.js` | `CONFIG.email` near the top of the file |
| `index.html` | the footer link `mailto:...` in the "Reach us" column |

**Worth knowing:** on a phone with no mail app configured, a `mailto:` link does nothing
visible. The form tells the visitor this and points them at WhatsApp underneath. If you
find enquiries are thin, the fix is a real form service (Web3Forms or Formspree, both free)
that posts straight to your inbox with no email app involved.

---

## Deploy

### Option A — GitHub → Vercel (recommended)

1. Create a new repository on GitHub and upload these files.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. When asked for a framework, choose **Other**. Leave the build command and output
   directory empty — `vercel.json` already handles it.
4. Deploy.

Every push to the repo then redeploys automatically.

### Option B — Vercel CLI

```bash
npx vercel login
npx vercel --prod
```

Answer **Other** for framework, `./` for the directory, and **no** to modifying build settings.

`vercel.json` already sets security headers and cache control. `.vercelignore` keeps
`server.js` and the docs out of the deployment.

---

## Local preview

```bash
node server.js
```

Then open <http://localhost:4331>.

---

## Editing the content you will actually want to change

| What | Where |
| --- | --- |
| Phone / WhatsApp numbers | `assets/js/main.js` → `CONFIG`, **and** the `tel:` and `wa.me` links in `index.html` |
| Opening hours and the live badge | `assets/js/main.js` → `CONFIG.hours`, **and** the `.hours` table in `index.html` |
| Timetables | `index.html` → the four `<table class="tt">` blocks |
| Instagram reels | `index.html` → the `#reels` section, one `<div class="reel">` per clip |
| Period times | `assets/js/main.js` → `CONFIG.periods`, **and** the `<thead>` of each timetable |
| Classes, subjects, boards | `index.html` → the `.plan__row` blocks |
| Founder bios and degrees | `index.html` → the `.person` blocks |
| Colours | `assets/css/style.css` → the `:root` block at the top |
| Logo | `assets/img/logo.png` — replace the file, keep the name |
| Address | `index.html` → `<address>`, the map `iframe`, the Directions link, and the JSON-LD in `<head>` |

### Hours live in three places — keep them in step

1. `CONFIG.hours` in `assets/js/main.js` drives the **Open now / Opens at 3:30 PM** badge.
2. The `.hours` table in `index.html` is what visitors read.
3. `openingHoursSpecification` in the JSON-LD block feeds Google.

All time logic runs in **Asia/Kolkata**, never the visitor's timezone. A parent checking
from Dubai still sees your real hours.

Currently set to **Monday–Saturday, 3:30–8:00 PM, closed Sunday**.

---

## Adding an Instagram reel

In Instagram, open the reel → **Share → Copy link**. You get something like:

```
https://www.instagram.com/reel/DbIPSW1ioQd/?igsh=...
```

Take the code between `/reel/` and the next slash — here, `DbIPSW1ioQd` — and paste a new
block into the `#reels` section of `index.html`, above the "More on Instagram" card:

```html
<div class="reel">
  <iframe src="https://www.instagram.com/reel/PASTE_CODE_HERE/embed/" loading="lazy"
          title="iQuest Learning Center reel" scrolling="no"
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
</div>
```

To remove a reel, delete its block. The grid reflows on its own. Reels only load when a
visitor scrolls to them, and there is no Instagram tracking script on the page.

---

## Still unconfirmed

Two facts on this site were inferred from the timetable documents rather than stated:

- **Sunday is marked closed.** None of the four timetables had a Sunday column. If you do
  run Sunday batches, add `0` back to `CONFIG.hours.openDays` and restore the Sunday row
  in the hours table.
- **Classes 1–6 timetables** are not on the site. The timetable section tells parents to
  call for those. Add them as another `<table class="tt">` when you have them.

---

## What the JavaScript does

Everything degrades. No content on this page depends on a script running.

- **Live status** — "Open now · closes 8:00 PM", recalculated every 30 seconds in centre time.
- **Live timetable** — highlights today's row and the period running *right now*, in amber.
- **Boot screen** — the logo intro. It is dismissed by a CSS animation on a fixed timer, so
  a failed script can never leave it covering the page.
- **Reveal on scroll** — with three failsafes, so text can never be stranded invisible if
  the observer is throttled (background tab, old browser).
- **Counters** — the true figures are in the HTML; the script only zeroes them once it knows
  it can animate, and snaps to the real number if the frame loop is starved.
- **Enquiry form** — validates, then composes a `mailto:`, with a WhatsApp button that sends
  the identical message.
- All motion is disabled under `prefers-reduced-motion`.

---

## Design notes

- **Ground:** deep enamel navy, taken from the brand's own presentation board. No white anywhere.
- **Accent:** the logo's amber → ember. Teal, from the atoms in the logo, is the counter-colour.
- **Motion law:** magnetic attraction, from the magnet in the logo. Particles chase the pointer,
  buttons lean toward it, the hero mark tilts in 3D, sections are pulled into place.
- **The glow law:** only **Call** and **WhatsApp** carry a lit treatment. Nothing else competes.
- **Type:** Outfit (display) and Archivo (text), from Google Fonts.
- Contrast measured across the built page: **4.75 : 1 to 15.7 : 1**. All tap targets ≥ 40 px.
  No horizontal scroll at 375 px.

---

## Facts on the page, and where they came from

Everything stated on the site is sourced. Nothing was invented.

| Claim | Source |
| --- | --- |
| Established 2008 · 5.0 from 24 ratings | Justdial listing |
| 8 classrooms · one teacher per subject · practice-based · structured notes · revision batches | Instagram [@i_quest_learning_center](https://www.instagram.com/i_quest_learning_center/) |
| Class 7–10 timetables, period times, subjects, Punjabi, Mon–Sat | The centre's own signed timetable documents |
| Classes 1–10, competitive prep, CBSE / ICSE / IGCSE / IB, online for Classes 8–10 | Confirmed by the client |
| Address, phone numbers, hours | Justdial + client |
| Founder names, roles and degrees | Client |

There are deliberately **no student testimonials, no result percentages, no topper claims and
no fee figures**. None were supplied, and none should be added without something real behind them.

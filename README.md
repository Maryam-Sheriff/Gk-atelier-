# GK Atelier by Ghada Khalil — website

*Handmade Creations for Meaningful Moments.*

A bilingual (English / Arabic) website for GK Atelier, a handmade studio in
Egypt serving customers in Egypt and the Gulf. It showcases Ghada's work and
turns interest into **WhatsApp conversations**. There is deliberately no
checkout, payment, account or stock system: every journey ends with the
customer reviewing a prefilled message and sending it to Ghada themselves.

- **Live site:** https://maryam-sheriff.github.io/Gk-atelier-/ (GitHub Pages)
- **For Ghada / content editors:** see [EDITING-GUIDE.md](EDITING-GUIDE.md)
- **Before going live:** see [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md)

## Quick start

```bash
npm install
npm run dev        # build + preview at http://localhost:4173
npm run check      # check the content files and list what's left before launch
npm test           # unit + build tests
npm run test:e2e   # browser tests (Playwright, phone + desktop)
npm run build:release   # production build — refuses to run until launch-ready
```

Requires Node 20.9+. The output is a plain static site in `dist/`.

## What's included

| Page | URL (Arabic · English) |
| --- | --- |
| Home | `/` · `/en/` |
| Collections | `/collections/` · `/en/collections/` |
| Collection (×9) | `/collections/wedding-bridal/` … |
| Product (one per file in `content/products/`) | `/products/<slug>/` |
| About Ghada | `/about/` |
| Custom projects & professional orders (form → WhatsApp) | `/custom-orders/` |
| Contact | `/contact/` |
| Privacy notice | `/privacy/` |
| Not found (both languages) | `/404.html` |

Every page exists in both languages. **Arabic is the default**: it lives at
the main address with a right-to-left layout, Arabic typefaces (Amiri for
headings, IBM Plex Sans Arabic for text) and its own titles, descriptions and
WhatsApp messages. English lives under `/en/`. The default is one setting
(`site.default_language` in `content/settings.yml`), and `x-default`
`hreflang` follows it. A globe language switch is always visible at the top
of every page, including on phones.

### WhatsApp ordering

- One number in `content/settings.yml` drives every button
  (`https://wa.me/<number>?text=<encoded message>`). The build validates the
  format and explains mistakes (local `0…` format, `200…` for Egypt, and so on).
- **Product pages:** "Enquire on WhatsApp" prefills the product name and its
  full page link. On phones, a slim bar appears once the main button scrolls
  away.
- **Collections:** "Ask about this collection" names the collection.
- **Custom projects and professional orders:** the form asks whether the
  visitor is an individual or a business, then validates in the visitor's
  language and opens WhatsApp with one of two messages written out (a custom
  project, or a professional order with the business name, quantity and
  date). A confirmation shows the exact message and a fallback link. It says plainly that this is an enquiry, not an
  order. Nothing is sent or stored by the website, and reference photos are
  attached in WhatsApp, never uploaded here.
- Links open in a new tab, so visitors keep their place, and nothing is ever
  sent without the visitor pressing send.
- **No number configured:** buttons open a "WhatsApp isn't connected yet"
  notice that shows the message they *would* send. No placeholder number is
  ever linked.

### Preview vs. release

The build knows what is still missing (number, domain, logo, Arabic review,
sample products). Until all of it is in place:

- every build (and `npm run check`) lists the open items in the terminal;
  the pages themselves carry no banner,
- every page carries `noindex`, `robots.txt` disallows crawling, and no sitemap
  is produced,
- `npm run build:release` exits with the list instead of building.

Once complete, the same build produces the indexable site with `sitemap.xml`
(with `hreflang` alternates) and an allowing `robots.txt`.

### Honest content

The brief asks for nothing to be invented, so the site ships with:

- **The supplied logo, untouched.** The header uses its name lines ("GK
  ATELIER / BY GHADA KHALIL"), the menu the GK monogram, and the homepage and
  footer the monogram with the name; all are straight crops of the supplied
  transparent PNG, never redrawn, recoloured or stretched. The browser icon
  and the link-preview image are made from the same file.
- **Ghada's own story.** The biography, the four highlights (over 30 years of
  art teaching, work with designers and wedding and eveningwear ateliers,
  knowledge of fabrics and embellishment, a supervised artisan team), the
  WhatsApp number and the positioning all come from Ghada's brief. No awards,
  clients or collaborations are named.
- **No invented photographs.** Until there is a portrait of Ghada, the
  homepage shows her words as a quotation and the About page opens with her
  work. Any empty photo slot shows a clearly labelled "Photograph coming
  soon" panel that can't be mistaken for a product.
- **Real pieces described only from their photographs.** Twenty-eight of
  Ghada's pieces across nine collections (bridal and wedding creations,
  embroidery and couture details, fabric flowers and appliqués, macramé, the
  Ramadan collection, baby sets, paintings, crochet, personalized gifts) use
  her photos, re-saved without their metadata, with names, descriptions and
  alt text in both languages. The pieces carry no prices, sizes, materials,
  timings or availability until Ghada confirms them, so each product page
  invites an enquiry instead.
- **Sample listings switched off.** The eight `sample-*` files that
  demonstrated the product page before real pieces existed are disabled with
  `show_sample_products: false`. If switched back on, they are labelled
  "Sample listing", excluded from search and structured data, and block a
  release build.
- **No testimonials, address or opening hours.** The only phone number is
  Ghada's WhatsApp number.
- **Structured data only where accurate:** `Organization` (with logo,
  social links and WhatsApp only once supplied), `BreadcrumbList`, and
  `Product` + `Offer` only for real pieces with an exact price (never for
  "from" prices or samples). No reviews or ratings.

## Content model

Everything editable is YAML in `content/` (documented inline):

```
content/
  settings.yml          WhatsApp number, site URL, default language, logo, social links, launch switches
  photos.yml            homepage hero, Ghada's portrait, "glimpse" gallery, About photos
  collections.yml       the 7 collections (name, short text, intro, cover photo, icon)
  products/*.yml        one file per product; _TEMPLATE.yml documents every field
  copy/en.yml, ar.yml   every interface and page text, plus WhatsApp message templates
images/                 original photos and the logo (resized automatically)
```

Product fields: `id`, `slug`, `collection`, `featured`, `name`, `description`,
`images[]` (with bilingual `alt`), and optional `price` (`amount`,
`currency`, `from`), `materials`, `techniques`, `dimensions`, `colours`,
`sizes`, `customization`, `production_time` and `availability`
(`made-to-order` | `available` | `unavailable`). Missing optional fields are
simply left out, and the page invites the customer to ask instead.

The loader validates everything (unknown fields, duplicate slugs and IDs,
missing photos, bad prices, broken YAML) and reports file-specific, plain
English messages. Missing Arabic falls back to English, marked `lang="en"`,
with a warning.

## How it's built

A small static generator with no framework and two runtime dependencies:
`js-yaml` and `sharp`.

```
src/
  build.mjs             orchestrates the build (CLI + programmatic `build()`)
  check.mjs             `npm run check`
  lib/                  content loading & validation, i18n, WhatsApp links,
                        image pipeline, fonts/asset hashing, escaping HTML templates
  components/           layout (head, header, footer), cards, media, icons
  pages/                one module per page type
  assets/css/site.css   the design system (mobile-first, logical properties for RTL)
  assets/js/site.js     progressive enhancement (~4 KB gzipped), no dependencies
scripts/serve.mjs       local static server
tests/unit/             node:test — WhatsApp encoding, validation, full builds
tests/e2e/              Playwright — customer journeys, axe accessibility, overflow
```

- **Templating:** tagged templates that escape every interpolated value by
  default.
- **Images:** originals are auto-rotated, stripped of metadata (including GPS),
  and resized to 480–2000 px WebP with a JPEG fallback. Output has `srcset`,
  `sizes`, `width`/`height` (no layout shift), lazy loading, and
  `fetchpriority="high"` for the first image. A 1200 × 630 crop is made for
  social previews. Results are cached in `.cache/`.
- **Fonts:** self-hosted (Cormorant Garamond, Jost, Amiri, IBM Plex Sans
  Arabic via Fontsource), subset by script with `unicode-range`, two preloads
  per language, `font-display: swap`. No third-party requests.
- **Assets:** content-hashed file names for long-term caching.
- **Language:** each page links to its counterpart. An explicit language choice
  is remembered (`localStorage`), so a returning visitor who chose English and
  opens an Arabic link from outside the site is sent to the English version
  (and the other way round). Browsing within the site never redirects.
- **Without JavaScript** every page and link still works. Navigation shows as a
  simple list, and the enquiry form falls back to opening the WhatsApp chat.

### Design system

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#FBF9F6` | page background, footer |
| Stone | `#F3EEE7` | alternate sections |
| Sand | `#E9E1D6` | behind photos while they load, placeholders |
| Ink | `#1C1814` | text, primary buttons, the dark bands (16.8 : 1 on paper) |
| Soft ink | `#4B433C` | body copy |
| Muted | `#6D645C` | secondary text (5.5 : 1 on paper, 5 : 1 on stone) |
| Gold | `#B0905C` | hairlines and accents only |
| Gold (text) | `#7B6139` | small gold labels (5.5 : 1 on paper) |

The look follows the couture houses: warm white and ink, generous space,
and very little ornament, so the photographs and the gold of the logo carry
the colour. Fine hairlines divide content instead of boxes and icons.
Headings are set in light Cormorant Garamond (Amiri in Arabic), labels in
small tracked capitals (Jost; IBM Plex Sans Arabic in Arabic), and numbers
in lining figures. The homepage opens with the logo alone on the first
screen; the spotlighted collection and "Made for your vision" are split
screens with the photograph running to the edge, and the collections
cascade two, three and four across. Motion is slow and quiet: the logo
rises in and catches a soft sheen, sections settle into place as they
scroll into view, photos open slightly on hover, and all of it is switched
off for visitors who prefer reduced motion.

## Testing

`npm test` runs 41 unit and build tests, including full preview and
configured builds with a link checker over every page. The tests read the
expected pieces, collections and photos from the content files, so adding,
removing or reordering products never breaks them.

`npm run test:e2e` builds two sites, the shipped content (preview) and a fully
configured fixture (test-only number `201000000000` and `example.com`), and
runs on an emulated Pixel 7 and desktop Chrome:

- browse → collection → product → WhatsApp (exact prefilled message and link)
- Arabic as the default at `/`, the always-visible language switch, RTL,
  and the remembered preference
- custom order validation, error summary focus, the WhatsApp message, the
  confirmation panel, and Arabic messages
- preview behaviour with no number (setup notice, no `wa.me` links)
- gallery, enlarged view, mobile menu (focus, Escape, `inert`), sticky order
  bar, skip link
- axe (WCAG 2.1 A/AA + best practice) on every key page in both languages
- no horizontal scrolling on any page at 320, 375, 768 and 1280 px
- tap targets of at least 40 px on phones

WhatsApp requests are intercepted in tests, so nothing leaves the machine.

## Deploying

The site is published with **GitHub Pages** at
https://maryam-sheriff.github.io/Gk-atelier-/.

- `.github/workflows/deploy.yml` builds the site and publishes `dist/` on
  every push to `main` (and on demand from the **Actions** tab). Each commit,
  such as a product added on GitHub, is live within a few minutes.
- The build checks the content files first. If one has a mistake, the
  workflow fails with a plain message and the previous version stays online.
- Because the site lives in a sub-folder (`/Gk-atelier-/`), `site.url` in
  `content/settings.yml` holds the full Pages address, and every link,
  photo and font is built under that folder.
- Until the launch checklist is complete, the published site is the
  **preview**: it is hidden from search engines (the pages carry no banner).
  Once the number and the Arabic review are in, the same workflow publishes
  the full, indexable site with nothing else to change.
- `.github/workflows/test.yml` runs the unit and browser tests on pull
  requests and on changes to the code (not on content-only edits).

**One-time setup:** in the repository's **Settings → Pages**, under
**Build and deployment**, set **Source** to **GitHub Actions**. Until then
GitHub also publishes the bare repository (just the README, so every inner
page is a 404) after each push; the publish workflow waits for that build to
finish and then publishes the real site over it.

### Custom domain

To use a domain such as `www.gkatelier.com` instead:

1. Buy the domain, then in **Settings → Pages → Custom domain** enter it
   and follow GitHub's instructions for the DNS records.
2. Change `site.url` in `content/settings.yml` to the new address (no
   sub-folder), for example `https://www.gkatelier.com`. The next build
   moves every link to the root of the new domain.

The site is plain static files, so it can also be hosted on Netlify or
Cloudflare Pages (build command `npm run build`, publish directory `dist`).

## Browser support

Current Safari (iOS 15.5+), Chrome, Edge, Firefox and Samsung Internet,
including the Instagram and Facebook in-app browsers. Uses `<dialog>`, `inert`,
CSS logical properties and `aspect-ratio`.

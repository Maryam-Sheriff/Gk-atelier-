# Launch checklist

The website is complete and working, but it ships as a **preview**. It
contains no invented contact details, products, prices or biography: the
number, biography and positioning come from Ghada's own brief.

While anything in the first section is missing, the site tells search
engines not to index it (the pages themselves show no banner), and
`npm run build:release` refuses to build. `npm run check` lists what is left
at any time.

## Required before launch (the site checks these itself)

- [x] **WhatsApp number:** +20 10 6711 2862 (`whatsapp.number` in
      `content/settings.yml`). Test it once live: on a phone *and* on a
      computer, open a product page, press **Enquire on WhatsApp**, and check
      that the chat opens with Ghada and the message names the product and
      links back to it. Do the same with the project form, once as an
      individual and once as a business.
- [x] **Website address:** https://gkatelier.online, served by GitHub Pages
      (`site.url` in `content/settings.yml`; DNS and settings in README.md →
      Custom domain).
- [x] **Logo:** added (`images/brand/`), with the header wordmark, menu
      monogram, homepage and footer versions, browser icon and sharing image
      cut from it.
- [x] **Real products:** twenty-eight pieces in nine collections are on the site and the sample
      listings are switched off. Keep adding pieces (see EDITING-GUIDE.md), and
      add prices, sizes and timings to each piece once Ghada confirms them.
- [ ] **Arabic review:** a fluent Arabic speaker, ideally someone familiar with
      both Egyptian and Gulf customers, reads all of `content/copy/ar.yml`, the
      Arabic in `content/collections.yml` and every product, then sets
      `launch.arabic_reviewed: true`. The Arabic was drafted to be natural
      Modern Standard Arabic addressed to customers in the respectful plural,
      but it has not been reviewed by a native speaker yet.

## Confirm with Ghada

- [ ] **Customers' names in photos:** several product photos show real
      couples' and babies' names and dates. Ghada should be sure those
      customers are happy for their pieces to appear on the website, or
      replace those photos with ones showing sample names.
- [ ] **Product names and collections:** each piece is named and described
      from its photo only. Ghada should check the names (the katb el-ketab
      pieces are now called handkerchiefs — مناديل كتب الكتاب — and the
      bodysuit is part of a baby set) and the collection each piece sits in.
      The jewelled black dress is under Embroidery & Couture Details.
- [ ] **Bridal gown photo:** unlike the others, it carries no GK Atelier
      logo. Confirm that it shows Ghada's own work (or say which part of it
      is hers, such as the embroidery) before launch.
- [ ] **What the atelier offers:** "Made for your vision" (`home.vision_items`)
      and the two audiences on the Custom Projects page (`custom.audiences`)
      follow the brief. Remove anything Ghada doesn't want to offer.
- [ ] **About page:** the biography is Ghada's own text from the brief, shown
      as supplied. The four highlights and the list of crafts are drawn from
      it. Ghada should be happy with both.
- [ ] **Privacy notice:** it says enquiries are reviewed by Ghada or her team,
      used only to reply and arrange orders, that customer photos are never
      published without permission, and that messages are deleted on request. Ghada must be comfortable committing to that. Update
      `privacy.updated_on` if the text changes.
- [ ] **Where we work:** the Contact page says the atelier is based in Egypt
      and serves Egypt and the Gulf, with delivery arranged per order. Adjust
      if needed.

## Strongly recommended

- [ ] A portrait of Ghada (`content/photos.yml` → `ghada`), ideally at
      work, and photos of the workspace, materials and the artisan team
      (`process`). Until then the homepage shows Ghada's quote instead of a
      portrait, and the About page opens with her work.
- [ ] Optional: close-ups of stitching, knots and tools for the "glimpse"
      gallery, which currently uses six product photos.
- [ ] Before Ramadan ends, change or empty `homepage.featured_collection` in
      `content/settings.yml` to spotlight another collection.
- [ ] Instagram (and any other) account links in `content/settings.yml`.
- [ ] Optional: an SVG version of the logo from the designer, for an even
      sharper header.

## Going live

- [ ] `npm run check` lists nothing left before launch. The next push to
      `main` then publishes the full site automatically (README.md →
      Deploying).
- [ ] Open the live site from Instagram's in-app browser and from WhatsApp
      and test a product enquiry and a custom order enquiry end to end.
- [ ] Paste the site link into a WhatsApp chat to check the preview card.
- [ ] Add the site to Google Search Console and submit its sitemap
      (https://gkatelier.online/sitemap.xml).
- [ ] Put the website link in the Instagram bio.

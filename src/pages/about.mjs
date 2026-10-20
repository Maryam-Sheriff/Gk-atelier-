import { html } from '../lib/html.mjs';
import { pick } from '../lib/i18n.mjs';
import { craftIcon } from '../components/icons.mjs';
import { picture } from '../components/media.mjs';
import { breadcrumbs, button, sectionHeading, text, whatsappButton, whatsappNote } from '../components/ui.mjs';

const EXPERTISE_ICONS = ['easel', 'dressform', 'needle', 'team'];

export function aboutPage(ctx) {
  const { t, content } = ctx;
  const { photos, collections, products } = content;
  const ghadaName = ctx.lang === 'ar' ? 'غادة خليل' : 'Ghada Khalil';
  const bio = t('about.bio');
  // Until there is a portrait, the page opens with Ghada's work instead.
  const work = products.filter((p) => p.featured && p.images[0]).slice(0, 3);
  const process = photos.process.filter((item) => item.image);

  const body = html`
<section class="page-hero page-hero--about">
  <div class="container">
    ${breadcrumbs(ctx, [{ href: ctx.url('/'), label: t('nav.home') }, { label: t('nav.about') }])}
    <div class="page-hero__grid">
      <div class="page-hero__text">
        <p class="eyebrow">${t('about.eyebrow')}</p>
        <h1 class="page-title">${t('about.heading')}</h1>
        <p class="lead">${t('about.lead')}</p>
        <p class="hero__credential">
          <span class="hero__credential-value">${t('home.credential_value')}</span>
          <span class="hero__credential-text">${t('home.credential_text')}</span>
        </p>
      </div>
      ${photos.ghada
        ? html`<div class="page-hero__media portrait">
            ${picture(ctx, photos.ghada, { eager: true, sizes: '(min-width: 960px) 40vw, 100vw', alt: ghadaName })}
          </div>`
        : html`<figure class="about-work">
            <ul class="about-work__list about-work__list--${work.length}">
              ${work.map(
                (p, i) => html`<li class="about-work__item">
                  <a href="${ctx.url(`/products/${p.slug}/`)}">${picture(ctx, p.images[0], { eager: i === 0, sizes: '(min-width: 960px) 20vw, 33vw', alt: pick(p.name, ctx.lang) })}</a>
                </li>`,
              )}
            </ul>
            <figcaption>${t('about.work_caption')}</figcaption>
          </figure>`}
    </div>
  </div>
</section>

<section class="section bio" aria-labelledby="bio-title">
  <div class="container bio__grid">
    <div class="bio__aside">
      <h2 class="bio__title" id="bio-title">${t('about.story_title')}</h2>
      ${ctx.brand.mark ? html`<img class="bio__mark" src="${ctx.brand.mark.url}" width="${ctx.brand.mark.width}" height="${ctx.brand.mark.height}" alt="">` : ''}
    </div>
    <div class="bio__text prose prose--editorial">
      ${bio.slice(0, 3).map((p) => html`<p>${p}</p>`)}
      <blockquote class="pull-quote"><p>${t('about.quote')}</p></blockquote>
      ${bio.slice(3).map((p) => html`<p>${p}</p>`)}
      <p class="bio__signoff">${t('about.signoff')}</p>
    </div>
  </div>
</section>

<section class="section section--linen" aria-labelledby="highlights-title">
  <div class="container">
    ${sectionHeading({ eyebrow: t('home.expertise_eyebrow'), title: t('about.highlights_title'), id: 'highlights-title', align: 'center' })}
    <ul class="expertise__list">
      ${t('home.expertise').map(
        (item, i) => html`<li class="expertise__item">
          <span class="expertise__icon">${craftIcon(EXPERTISE_ICONS[i % EXPERTISE_ICONS.length])}</span>
          <p class="expertise__kicker">${item.kicker}</p>
          <h3 class="expertise__title">${item.title}</h3>
          <p class="expertise__text">${item.text}</p>
        </li>`,
      )}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="crafts-title">
  <div class="container crafts-block">
    ${sectionHeading({ eyebrow: t('about.crafts_eyebrow'), title: t('about.crafts_title'), intro: t('about.crafts_text'), id: 'crafts-title', align: 'center' })}
    <ul class="label-list">
      ${t('about.crafts').map((craft) => html`<li class="woven-label">${craft}</li>`)}
    </ul>
  </div>
</section>

<section class="section section--tight" aria-labelledby="work-title">
  <div class="container">
    ${sectionHeading({ eyebrow: t('about.work_eyebrow'), title: t('about.work_title'), id: 'work-title', align: 'center' })}
    <ul class="mosaic">
      ${collections.filter((c) => c.image).slice(0, 6).map(
        (c) => html`<li class="mosaic__item">
          <a href="${ctx.url(`/collections/${c.slug}/`)}">
            ${picture(ctx, c.image, { sizes: '(min-width: 960px) 30vw, 50vw', alt: pick(c.name, ctx.lang) })}
            <span class="mosaic__caption">${text(c.name, ctx.lang)}</span>
          </a>
        </li>`,
      )}
    </ul>
  </div>
</section>

${process.length
  ? html`<section class="section section--tight" aria-labelledby="process-title">
  <div class="container">
    ${sectionHeading({ title: t('about.process_title'), intro: t('about.process_text'), id: 'process-title' })}
    <div class="process">
      ${process.map(
        (item) => html`<figure class="process__item">
          ${picture(ctx, item.image, { sizes: '(min-width: 900px) 33vw, 100vw', alt: pick(item.caption, ctx.lang) })}
          ${pick(item.caption, ctx.lang) ? html`<figcaption>${text(item.caption, ctx.lang)}</figcaption>` : ''}
        </figure>`,
      )}
    </div>
  </div>
</section>`
  : ''}

<section class="final-cta" aria-labelledby="about-cta">
  <div class="container final-cta__inner">
    <h2 class="final-cta__title" id="about-cta">${t('about.cta_title')}</h2>
    <p class="final-cta__text">${t('about.cta_text')}</p>
    <div class="final-cta__actions">
      ${whatsappButton(ctx, t('whatsapp.messages.project'), { label: t('home.final_button'), variant: 'light' })}
      ${button(ctx.url('/custom-orders/'), t('home.vision_button'), { variant: 'ghost-light' })}
    </div>
    ${whatsappNote(ctx)}
  </div>
</section>`;

  return {
    name: 'about',
    route: '/about/',
    section: 'about',
    title: `${t('about.title')} | ${t('meta.title_suffix')}`,
    description: t('about.description'),
    shareImage: photos.ghada ? ctx.shareImage(photos.ghada.src) : ctx.defaultShareImage,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: t('about.heading'),
        url: ctx.absoluteUrl(ctx.url('/about/')),
        inLanguage: ctx.lang,
        mainEntity: { '@type': 'Person', name: 'Ghada Khalil', worksFor: { '@type': 'Organization', name: 'GK Atelier' } },
      },
    ],
    body,
  };
}

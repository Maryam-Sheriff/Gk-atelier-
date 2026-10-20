import { html } from '../lib/html.mjs';
import { pick } from '../lib/i18n.mjs';
import { craftIcon, icon } from '../components/icons.mjs';
import { picture } from '../components/media.mjs';
import {
  button,
  collectionCard,
  paragraphs,
  productCard,
  sectionHeading,
  steps,
  text,
  textLink,
  whatsappButton,
  whatsappNote,
} from '../components/ui.mjs';

const GLIMPSE_ICONS = ['hoop', 'knot', 'yarn', 'brush', 'rings', 'gift'];
const EXPERTISE_ICONS = ['easel', 'dressform', 'needle', 'team'];

function hero(ctx) {
  const { t, content } = ctx;
  const { photos } = content;
  const actions = html`<div class="hero__actions">
        ${button(ctx.url('/collections/'), t('home.hero_primary'))}
        ${whatsappButton(ctx, t('whatsapp.messages.project'), { label: t('home.hero_secondary'), variant: 'secondary' })}
      </div>`;
  const title = html`<h1 class="hero__title">${t('home.hero_title_start')} <em>${t('home.hero_title_accent')}</em></h1>`;

  // Until a hero photograph is chosen, the logo leads the page instead of an
  // empty photo frame.
  if (!photos.hero && ctx.brand.lockup) {
    return html`<section class="hero hero--brand">
  <div class="container hero__brand">
    <div class="hero__logo">
      ${picture(ctx, ctx.brand.lockup, { eager: true, sizes: '(min-width: 700px) 420px, 72vw', alt: t('meta.site_name') })}
    </div>
    ${title}
    <p class="hero__text">${t('home.hero_text')}</p>
    ${actions}
  </div>
</section>`;
  }

  return html`<section class="hero">
  <div class="container hero__grid">
    <div class="hero__content">
      <p class="eyebrow">${t('home.hero_eyebrow')}</p>
      ${title}
      <p class="hero__text">${t('home.hero_text')}</p>
      ${actions}
      <p class="hero__credential">
        <span class="hero__credential-value">${t('home.credential_value')}</span>
        <span class="hero__credential-text">${t('home.credential_text')}</span>
      </p>
    </div>
    <div class="hero__media">
      <div class="hero__arch">
        ${picture(ctx, photos.hero, {
          eager: true,
          sizes: '(min-width: 960px) 40vw, 92vw',
          alt: t('home.hero_title_start'),
          placeholder: { icon: 'hoop' },
        })}
      </div>
      ${photos.heroDetail
        ? html`<div class="hero__detail">
            ${picture(ctx, photos.heroDetail, { eager: true, sizes: '(min-width: 960px) 16vw, 38vw' })}
          </div>`
        : ''}
      ${ctx.brand.mark
        ? html`<span class="hero__seal" aria-hidden="true"><img src="${ctx.brand.mark.url}" width="${ctx.brand.mark.width}" height="${ctx.brand.mark.height}" alt=""></span>`
        : ''}
    </div>
  </div>
</section>`;
}

function expertise(ctx) {
  const { t } = ctx;
  return html`<section class="section expertise" aria-labelledby="expertise-title">
  <div class="container">
    ${sectionHeading({ eyebrow: t('home.expertise_eyebrow'), title: t('home.expertise_title'), intro: t('home.expertise_text'), id: 'expertise-title', align: 'center' })}
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
</section>`;
}

/** A collection chosen in settings.yml (Ramadan, for example) gets its own band. */
function spotlight(ctx) {
  const { t, settings } = ctx;
  const collection = settings.featuredCollection && ctx.collection(settings.featuredCollection);
  if (!collection || !collection.products.length) return '';
  const name = pick(collection.name, ctx.lang);
  const route = `/collections/${collection.slug}/`;
  const pieces = collection.products.slice(0, 3);
  return html`<section class="spotlight" aria-labelledby="spotlight-title">
  <div class="container spotlight__grid">
    <div class="spotlight__text">
      <span class="spotlight__ornament">${craftIcon(collection.icon)}</span>
      <p class="eyebrow eyebrow--light">${t('home.spotlight_eyebrow')}</p>
      <h2 class="spotlight__title" id="spotlight-title">${text(collection.name, ctx.lang)}</h2>
      <p class="spotlight__intro">${text(collection.intro, ctx.lang)}</p>
      <div class="spotlight__actions">
        ${button(ctx.url(route), t('home.spotlight_link'), { variant: 'light', arrow: true })}
        ${whatsappButton(ctx, t('whatsapp.messages.collection', { collection: name }), { label: t('whatsapp.ask_collection'), variant: 'ghost-light' })}
      </div>
    </div>
    <ul class="spotlight__pieces spotlight__pieces--${pieces.length}">
      ${pieces.map(
        (p) => html`<li class="spotlight__piece">
          <a href="${ctx.url(`/products/${p.slug}/`)}">
            ${picture(ctx, p.images[0], { sizes: '(min-width: 960px) 22vw, 45vw', alt: pick(p.name, ctx.lang) })}
            <span class="spotlight__caption">${text(p.name, ctx.lang)}</span>
          </a>
        </li>`,
      )}
    </ul>
  </div>
</section>`;
}

function vision(ctx) {
  const { t, content } = ctx;
  return html`<section class="section vision" aria-labelledby="vision-title">
  <div class="container vision__grid">
    <div class="vision__media">
      ${picture(ctx, content.photos.custom, {
        sizes: '(min-width: 960px) 42vw, 100vw',
        alt: t('home.vision_title'),
        placeholder: { icon: 'hoop' },
      })}
    </div>
    <div class="vision__content">
      ${sectionHeading({ eyebrow: t('home.vision_eyebrow'), title: t('home.vision_title'), id: 'vision-title' })}
      <p class="vision__text">${t('home.vision_text')}</p>
      <ul class="stitch-list">
        ${t('home.vision_items').map((item) => html`<li>${item}</li>`)}
      </ul>
      <div class="vision__audiences">
        ${t('home.vision_audiences').map(
          (a) => html`<div class="vision__audience">
            <h3 class="vision__audience-title">${a.title}</h3>
            <p>${a.text}</p>
          </div>`,
        )}
      </div>
      ${button(ctx.url('/custom-orders/'), t('home.vision_button'), { arrow: true })}
    </div>
  </div>
</section>`;
}

function meetGhada(ctx) {
  const { t, content } = ctx;
  const portrait = content.photos.ghada;
  return html`<section class="section artisan" aria-labelledby="ghada-title">
  <div class="container artisan__grid">
    <div class="artisan__media">
      ${portrait
        ? html`<div class="artisan__portrait">${picture(ctx, portrait, { sizes: '(min-width: 960px) 36vw, 100vw', alt: ctx.lang === 'ar' ? 'غادة خليل' : 'Ghada Khalil' })}</div>`
        : html`<figure class="artisan__quote">
            ${ctx.brand.mark ? html`<img class="artisan__mark" src="${ctx.brand.mark.url}" width="${ctx.brand.mark.width}" height="${ctx.brand.mark.height}" alt="">` : ''}
            <blockquote><p>${t('home.ghada_quote')}</p></blockquote>
            <figcaption>${t('home.ghada_signature')}</figcaption>
          </figure>`}
    </div>
    <div class="artisan__content">
      ${sectionHeading({ eyebrow: t('home.ghada_eyebrow'), title: t('home.ghada_title'), id: 'ghada-title' })}
      <div class="prose">${paragraphs(t('home.ghada_text'))}</div>
      ${textLink(ctx.url('/about/'), t('home.ghada_link'))}
    </div>
  </div>
</section>`;
}

export function homePage(ctx) {
  const { t, content } = ctx;
  const { photos, collections, products } = content;
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const glimpse = photos.glimpse.length ? photos.glimpse : GLIMPSE_ICONS.map(() => ({ image: null }));

  const body = html`
${hero(ctx)}

${expertise(ctx)}

<section class="section section--linen" aria-labelledby="collections-title">
  <div class="container">
    ${sectionHeading({ eyebrow: t('home.collections_eyebrow'), title: t('home.collections_title'), intro: t('home.collections_text'), id: 'collections-title', align: 'center' })}
    <div class="collection-grid collection-grid--home">
      ${collections.map((c, i) => collectionCard(ctx, c, { index: i + 1 }))}
    </div>
    <p class="section-more">${button(ctx.url('/collections/'), t('home.all_collections'), { variant: 'secondary', arrow: true })}</p>
  </div>
</section>

${spotlight(ctx)}

${featured.length
  ? html`<section class="section" aria-labelledby="featured-title">
  <div class="container">
    ${sectionHeading({ eyebrow: t('home.featured_eyebrow'), title: t('home.featured_title'), id: 'featured-title', align: 'center' })}
    <div class="product-grid">
      ${featured.map((p) => productCard(ctx, p))}
    </div>
  </div>
</section>`
  : ''}

${vision(ctx)}

<section class="section section--linen" aria-labelledby="glimpse-title">
  <div class="container">
    ${sectionHeading({ eyebrow: t('home.glimpse_eyebrow'), title: t('home.glimpse_title'), intro: t('home.glimpse_text'), id: 'glimpse-title', align: 'center' })}
    <div class="glimpse">
      ${glimpse.map(
        (item, i) => html`<figure class="glimpse__item glimpse__item--${i + 1}">
          ${picture(ctx, item.image, {
            sizes: '(min-width: 900px) 33vw, 50vw',
            alt: t('home.glimpse_eyebrow'),
            placeholder: { icon: GLIMPSE_ICONS[i % GLIMPSE_ICONS.length] },
          })}
        </figure>`,
      )}
    </div>
  </div>
</section>

${meetGhada(ctx)}

<section class="section section--beige" aria-labelledby="steps-title">
  <div class="container">
    ${sectionHeading({ eyebrow: t('home.steps_eyebrow'), title: t('home.steps_title'), id: 'steps-title', align: 'center' })}
    ${steps(ctx)}
  </div>
</section>

<section class="final-cta" aria-labelledby="final-title">
  <div class="container final-cta__inner">
    <span class="final-cta__ornament" aria-hidden="true">${icon('whatsapp')}</span>
    <h2 class="final-cta__title" id="final-title">${t('home.final_title')}</h2>
    <p class="final-cta__text">${t('home.final_text')}</p>
    ${whatsappButton(ctx, t('whatsapp.messages.project'), { label: t('home.final_button'), variant: 'light', size: 'large' })}
    ${whatsappNote(ctx)}
  </div>
</section>`;

  const siteName = t('meta.site_name');
  const homeUrl = ctx.absoluteUrl(ctx.url('/'));
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${ctx.absoluteUrl(ctx.urlFor(ctx.defaultLang, '/'))}#organization`,
    name: ctx.copyFor('en', 'meta.site_name'),
    alternateName: 'GK Atelier',
    url: homeUrl,
    description: t('home.description'),
    founder: { '@type': 'Person', name: 'Ghada Khalil' },
    areaServed: ['Egypt', 'Gulf region'],
  };
  if (ctx.brand.logo) organization.logo = ctx.absoluteUrl(ctx.image(ctx.brand.logo.src).fallback);
  const sameAs = Object.values(ctx.settings.social);
  if (sameAs.length) organization.sameAs = sameAs;
  const contact = ctx.whatsapp(t('whatsapp.messages.general'));
  if (contact) organization.contactPoint = { '@type': 'ContactPoint', contactType: 'customer service', url: contact };

  return {
    name: 'home',
    route: '/',
    section: 'home',
    title: `${siteName} | ${t('home.title')}`,
    description: t('home.description'),
    shareImage: ctx.defaultShareImage,
    whatsappMessage: t('whatsapp.messages.project'),
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: siteName, url: homeUrl, inLanguage: ctx.lang },
      organization,
    ],
    body,
  };
}

import { attrs, html, raw } from '../lib/html.mjs';
import { LANGS, pick } from '../lib/i18n.mjs';
import { formatWhatsAppNumber } from '../lib/whatsapp.mjs';
import { icon } from './icons.mjs';
import { picture } from './media.mjs';
import { text, whatsappButton } from './ui.mjs';

// The main menu. The spotlighted collection (Ramadan, for example) is
// added after Collections when one is set in settings.yml.
const NAV = [
  { key: 'collections', route: '/collections/' },
  { key: 'custom', route: '/custom-orders/' },
  { key: 'about', route: '/about/' },
  { key: 'contact', route: '/contact/' },
];

function navItems(ctx) {
  const items = NAV.map((item) => ({ ...item, label: ctx.t(`nav.${item.key}`) }));
  const spotlight = ctx.settings.featuredCollection && ctx.collection(ctx.settings.featuredCollection);
  if (spotlight) {
    items.splice(1, 0, { key: `collection:${spotlight.slug}`, route: `/collections/${spotlight.slug}/`, label: pick(spotlight.name, ctx.lang) });
  }
  return items;
}

const SOCIAL_LABELS = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', pinterest: 'Pinterest' };

function jsonLd(data) {
  // `<` is escaped so text inside the JSON can never close the script tag.
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

function head(ctx, page) {
  const { t, lang, assets, brand } = ctx;
  const other = LANGS[lang].other;
  const canonical = ctx.absoluteUrl(ctx.url(page.route));
  const alternates = page.alternates === false ? [] : [
    { hreflang: 'en', href: ctx.absoluteUrl(ctx.urlFor('en', page.route)) },
    { hreflang: 'ar', href: ctx.absoluteUrl(ctx.urlFor('ar', page.route)) },
    { hreflang: 'x-default', href: ctx.absoluteUrl(ctx.urlFor(ctx.defaultLang, page.route)) },
  ];
  const share = page.shareImage ?? ctx.defaultShareImage;
  const fonts = assets.fontPreloads[lang];
  const otherUrl = ctx.urlFor(other, page.switchRoute ?? page.route);
  // Before anything renders: mark JS as available, and send returning
  // visitors who chose the other language to the same page in that language
  // (only when they arrive from outside the site, so browsing never loops).
  const redirect = page.langRedirect === false
    ? ''
    : `try{var p=localStorage.getItem('gk-lang'),r=document.referrer;if(p&&p!==d.lang&&!(r&&r.indexOf(location.origin)===0)){location.replace(${JSON.stringify(otherUrl)})}}catch(e){}`;
  const boot = `(function(){var d=document.documentElement;d.className=d.className.replace('no-js','js');${redirect}})();`;

  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
${ctx.indexable && page.index !== false ? '' : html`<meta name="robots" content="noindex, nofollow">\n`}<link rel="canonical" href="${canonical}">
${alternates.map((a) => html`<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">\n`)}<meta name="theme-color" content="#F8F4EE">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${t('meta.site_name')}">
<meta property="og:title" content="${page.socialTitle ?? page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${t('meta.locale')}">
<meta property="og:locale:alternate" content="${ctx.copyFor(other, 'meta.locale')}">
${share ? html`<meta property="og:image" content="${ctx.absoluteUrl(share.url)}">
<meta property="og:image:width" content="${share.width}">
<meta property="og:image:height" content="${share.height}">
<meta name="twitter:card" content="summary_large_image">
` : html`<meta name="twitter:card" content="summary">
`}${brand.icon ? html`<link rel="icon" href="${brand.icon.favicon}" sizes="32x32">
${brand.icon.svg ? html`<link rel="icon" href="${brand.icon.svg}" type="image/svg+xml">\n` : ''}<link rel="apple-touch-icon" href="${brand.icon.apple}">
` : html`<link rel="icon" href="data:,">
`}${fonts.map((href) => html`<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${assets.css}">
<script>${raw(boot)}</script>
<script src="${assets.js}" defer></script>
${(page.jsonLd ?? []).map(jsonLd)}
</head>`;
}

function brandMark(ctx, { className = 'brand' } = {}) {
  const { brand, t } = ctx;
  const logo = brand.wordmark ?? brand.mark;
  if (logo) {
    return html`<a class="${className}" href="${ctx.url('/')}">
      <img class="${brand.wordmark ? 'brand__wordmark' : 'brand__logo'}" src="${logo.url}" width="${logo.width}" height="${logo.height}" alt="${t('meta.site_name')}">
    </a>`;
  }
  // Until the supplied logo file is added, show the name as plain text rather
  // than an imitation of the GK monogram.
  return html`<a class="${className} brand--text" href="${ctx.url('/')}">
    <span class="brand__name" lang="en" dir="ltr">GK Atelier</span>
    <span class="brand__by">${t('meta.brand_by')}</span>
  </a>`;
}

function languageSwitch(ctx, page, className = 'lang-switch') {
  const other = LANGS[ctx.lang].other;
  return html`<a${attrs({
    class: className,
    href: ctx.urlFor(other, page.switchRoute ?? page.route),
    hreflang: other,
    'data-lang-switch': other,
    title: ctx.t('nav.switch_hint'),
  })}>${icon('globe')}<span lang="${other}">${ctx.t('nav.switch_label')}</span></a>`;
}

function phoneLink(ctx, className) {
  const number = ctx.settings.whatsapp;
  if (!number) return '';
  return html`<a class="${className}" href="https://wa.me/${number}" target="_blank" rel="noopener" dir="ltr">${icon('whatsapp')}<span>${formatWhatsAppNumber(number)}</span></a>`;
}

function header(ctx, page) {
  const { t, content } = ctx;
  const generalMessage = t('whatsapp.messages.general');
  const items = navItems(ctx);
  // One "current" item: the spotlighted collection when on its page, otherwise the section.
  const active = page.navKey && items.some((i) => i.key === page.navKey) ? page.navKey : page.section;
  const current = (item) => (item.key === active ? 'page' : null);
  return html`<header class="site-header" data-header>
  <div class="container masthead">
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-label-open="${t('nav.menu')}" data-label-close="${t('nav.close_menu')}">
      ${icon('menu')}<span class="nav-toggle__label">${t('nav.menu')}</span>
    </button>
    ${brandMark(ctx, { className: 'brand masthead__brand' })}
    <div class="site-header__actions">
      ${languageSwitch(ctx, page)}
      ${whatsappButton(ctx, generalMessage, { label: 'WhatsApp', variant: 'link', className: 'header-wa' })}
    </div>
  </div>
  <nav class="site-nav" id="site-nav" aria-label="${t('nav.label')}">
    <div class="site-nav__panel">
      <div class="site-nav__head">
        ${ctx.brand.mark ? html`<img class="site-nav__mark" src="${ctx.brand.mark.url}" width="${ctx.brand.mark.width}" height="${ctx.brand.mark.height}" alt="">` : ''}
        <button class="site-nav__close" type="button" data-nav-close aria-label="${t('nav.close_menu')}">${icon('close')}</button>
      </div>
      <ul class="site-nav__list">
        <li class="site-nav__item site-nav__item--home"><a class="site-nav__link" href="${ctx.url('/')}"${page.section === 'home' ? html` aria-current="page"` : ''}>${t('nav.home')}</a></li>
        ${items.map(
          (item) => html`<li class="site-nav__item"><a${attrs({
            class: 'site-nav__link',
            href: ctx.url(item.route),
            'aria-current': current(item),
          })}>${item.label}</a></li>`,
        )}
      </ul>
      <div class="site-nav__collections">
        <p class="site-nav__heading">${t('nav.all_collections')}</p>
        <ul>
          ${content.collections.map((c) => html`<li><a href="${ctx.url(`/collections/${c.slug}/`)}">${text(c.name, ctx.lang)}</a></li>`)}
        </ul>
      </div>
      <div class="site-nav__extra">
        ${whatsappButton(ctx, generalMessage, { label: t('whatsapp.order'), variant: 'primary', className: 'btn--block' })}
        ${phoneLink(ctx, 'site-nav__phone')}
        ${languageSwitch(ctx, page, 'lang-switch lang-switch--menu')}
      </div>
    </div>
  </nav>
</header>`;
}

function footer(ctx, page, floating = '') {
  const { t, settings, brand, content } = ctx;
  const year = new Date().getFullYear();
  const social = Object.entries(settings.social);
  return html`<footer class="site-footer">
  <div class="container site-footer__brand">
    ${brand.lockup
      ? html`<a class="brand-lockup" href="${ctx.url('/')}">${picture(ctx, brand.lockup, { sizes: '200px', alt: t('meta.site_name') })}</a>`
      : brandMark(ctx, { className: 'brand brand--footer' })}
    <p class="site-footer__tagline">${t('footer.tagline')}</p>
  </div>
  <div class="container site-footer__grid">
    <nav class="site-footer__nav" aria-labelledby="footer-collections">
      <h2 class="site-footer__heading" id="footer-collections">${t('nav.all_collections')}</h2>
      <ul>
        ${content.collections.map((c) => html`<li><a href="${ctx.url(`/collections/${c.slug}/`)}">${text(c.name, ctx.lang)}</a></li>`)}
      </ul>
    </nav>
    <nav class="site-footer__nav site-footer__nav--atelier" aria-labelledby="footer-explore">
      <h2 class="site-footer__heading" id="footer-explore">${t('footer.explore')}</h2>
      <ul>
        <li><a href="${ctx.url('/')}">${t('nav.home')}</a></li>
        ${NAV.map((item) => html`<li><a href="${ctx.url(item.route)}">${t(`nav.${item.key}`)}</a></li>`)}
        <li><a href="${ctx.url('/privacy/')}">${t('footer.privacy')}</a></li>
      </ul>
    </nav>
    <div class="site-footer__connect">
      <h2 class="site-footer__heading">${t('footer.connect')}</h2>
      <p class="site-footer__text">${t('footer.connect_text')}</p>
      ${whatsappButton(ctx, t('whatsapp.messages.general'), { label: t('whatsapp.order'), variant: 'secondary' })}
      ${phoneLink(ctx, 'site-footer__phone')}
      ${social.length
        ? html`<ul class="social-links">
            ${social.map(
              ([network, href]) => html`<li><a href="${href}" target="_blank" rel="noopener" aria-label="${SOCIAL_LABELS[network] ?? network}">${icon(network in SOCIAL_LABELS ? network : 'arrow')}</a></li>`,
            )}
          </ul>`
        : ''}
      ${languageSwitch(ctx, page, 'lang-switch lang-switch--footer')}
    </div>
  </div>
  <div class="container site-footer__bottom">
    <p>${t('footer.service')} · ${t('footer.note')}</p>
    <p><span>${t('footer.copyright', { year })}</span> · <a href="${ctx.url('/privacy/')}">${t('footer.privacy')}</a></p>
  </div>
  ${floating}
</footer>`;
}

function setupDialog(ctx) {
  if (ctx.settings.whatsapp) return '';
  const { t } = ctx;
  return html`<dialog class="dialog" id="whatsapp-setup" aria-labelledby="whatsapp-setup-title">
  <form method="dialog" class="dialog__inner">
    <h2 class="dialog__title" id="whatsapp-setup-title">${t('whatsapp.unconfigured.title')}</h2>
    <p>${t('whatsapp.unconfigured.body')}</p>
    <p class="dialog__message" data-wa-setup-message></p>
    <button class="btn btn--secondary" type="submit">${t('whatsapp.unconfigured.close')}</button>
  </form>
</dialog>`;
}

export function documentPage(ctx, page) {
  const { lang, t } = ctx;
  const floating = page.floatingWhatsApp !== false
    ? whatsappButton(ctx, page.whatsappMessage ?? t('whatsapp.messages.general'), {
        label: t('whatsapp.floating_label'),
        variant: 'float',
        extra: { 'data-float': '' },
      })
    : '';
  return `<!doctype html>
${html`<html lang="${lang}" dir="${LANGS[lang].dir}" class="no-js">
${head(ctx, page)}
<body class="page-${page.name}${page.floatingWhatsApp !== false ? ' has-float' : ''}">
<a class="skip-link" href="#main">${t('nav.skip')}</a>
${header(ctx, page)}
<main id="main" tabindex="-1">
${page.body}
</main>
${footer(ctx, page, floating)}
${page.after ?? ''}
${setupDialog(ctx)}
</body>
</html>`}
`;
}

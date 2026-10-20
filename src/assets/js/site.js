/* GK Atelier — small progressive enhancements. Every page works without it. */
(function () {
  'use strict';

  var html = document.documentElement;
  var isRtl = html.dir === 'rtl';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }
  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /* Previews without a domain: put this page's real address into WhatsApp messages. */
  (function fillOrigin() {
    var origin = location.origin;
    $$('a[href*="__ORIGIN__"]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('href').split('__ORIGIN__').join(encodeURIComponent(origin)));
    });
    $$('[data-wa-message*="__ORIGIN__"]').forEach(function (el) {
      el.setAttribute('data-wa-message', el.getAttribute('data-wa-message').split('__ORIGIN__').join(origin));
    });
  })();

  /* Remember an explicit language choice for the next visit. */
  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-lang-switch]');
    if (!link) return;
    try {
      localStorage.setItem('gk-lang', link.getAttribute('data-lang-switch'));
    } catch (e) {
      /* Private browsing: the links still switch language. */
    }
  });

  /* Mobile menu: a full-screen panel with its own close button. */
  (function menu() {
    var toggle = $('.nav-toggle');
    var nav = $('#site-nav');
    if (!toggle || !nav) return;
    var label = $('.nav-toggle__label', toggle);
    var close = $('[data-nav-close]', nav);
    var outside = [$('main'), $('.site-footer'), $('.btn--float'), $('.topbar'), $('.masthead')].filter(Boolean);
    var desktop = window.matchMedia('(min-width: 960px)');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      label.textContent = toggle.getAttribute(open ? 'data-label-close' : 'data-label-open');
      document.body.classList.toggle('nav-open', open);
      outside.forEach(function (el) {
        el.inert = open;
      });
      if (open) {
        var first = $('.site-nav__link', nav);
        if (first) first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    if (close) {
      close.addEventListener('click', function () {
        setOpen(false);
        toggle.focus();
      });
    }
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
    desktop.addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  })();

  /* The header gains a soft shadow once the page scrolls under it. */
  (function headerShadow() {
    var header = $('[data-header]');
    if (!header) return;
    var queued = false;
    function update() {
      queued = false;
      document.body.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  })();

  /* Preview only: explain that WhatsApp isn't connected yet and show the message. */
  var setupDialog = $('#whatsapp-setup');
  function openSetup(message) {
    if (!setupDialog) return;
    $('[data-wa-setup-message]', setupDialog).textContent = message || '';
    setupDialog.showModal();
  }
  if (setupDialog) {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-wa-setup]');
      if (!link) return;
      event.preventDefault();
      openSetup(link.getAttribute('data-wa-message'));
    });
    setupDialog.addEventListener('click', function (event) {
      if (event.target === setupDialog) setupDialog.close();
    });
  }

  /* Product pages: a slim "Order via WhatsApp" bar once the main button has
     scrolled above the screen. A scroll check (rather than an observer) also
     catches fast flings that jump straight past the button. */
  (function stickyCta() {
    var cta = $('[data-product-cta]');
    var bar = $('[data-sticky-cta]');
    if (!cta || !bar) return;
    var queued = false;
    function update() {
      queued = false;
      var show = cta.getBoundingClientRect().bottom < 0;
      if (show === bar.classList.contains('is-visible')) return;
      bar.classList.toggle('is-visible', show);
      bar.inert = !show;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!queued) {
          queued = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  })();

  /* Product photo gallery. */
  $$('[data-gallery]').forEach(function (gallery) {
    var slides = $$('[data-gallery-slide]', gallery);
    var thumbs = $$('[data-gallery-thumb]', gallery);
    if (slides.length < 2) return;

    function setCurrent(index) {
      thumbs.forEach(function (thumb, i) {
        if (i === index) thumb.setAttribute('aria-current', 'true');
        else thumb.removeAttribute('aria-current');
      });
    }
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        slides[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
        setCurrent(i);
      });
    });
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setCurrent(slides.indexOf(entry.target));
          });
        },
        { root: $('[data-gallery-track]', gallery), threshold: 0.6 },
      );
      slides.forEach(function (slide) {
        observer.observe(slide);
      });
    }
  });

  /* Enlarged photo view. */
  (function lightbox() {
    var dialog = $('[data-lightbox]');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    var images = JSON.parse($('[data-lightbox-images]', dialog).textContent);
    var img = $('[data-lightbox-image]', dialog);
    var count = $('[data-lightbox-count]', dialog);
    var index = 0;

    function show(i) {
      index = (i + images.length) % images.length;
      img.src = images[index].src;
      img.alt = images[index].alt;
      count.textContent = images.length > 1 ? index + 1 + ' / ' + images.length : '';
    }
    $$('[data-gallery-zoom]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        show(Number(link.getAttribute('data-gallery-zoom')));
        dialog.showModal();
      });
    });
    var prev = $('[data-lightbox-prev]', dialog);
    var next = $('[data-lightbox-next]', dialog);
    if (prev) prev.addEventListener('click', function () { show(index - 1); });
    if (next) next.addEventListener('click', function () { show(index + 1); });
    $('[data-lightbox-close]', dialog).addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('keydown', function (event) {
      if (images.length < 2) return;
      if (event.key === 'ArrowRight') show(index + (isRtl ? -1 : 1));
      if (event.key === 'ArrowLeft') show(index + (isRtl ? 1 : -1));
    });
  })();

  /* Project enquiry: validate, then hand the details to WhatsApp. */
  (function enquiry() {
    var form = $('[data-enquiry-form]');
    var configEl = $('#enquiry-config');
    if (!form || !configEl) return;
    var config = JSON.parse(configEl.textContent);
    var summary = $('[data-error-summary]', form);
    var errorList = $('[data-error-list]', form);
    var success = $('[data-enquiry-success]');
    var preview = $('[data-message-preview]');
    var successLink = $('[data-success-link]');
    var fields = form.elements;
    var businessField = $('[data-field="business"]', form);
    var locale = config.lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB';
    var checked = ['customer', 'name', 'contact', 'business', 'type', 'description', 'date'];

    form.noValidate = true;
    form.classList.add('is-enhanced');

    var now = new Date();
    var today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    fields.date.min = today;

    // Collection pages link here with ?type=<collection> to preselect it.
    var requested = new URLSearchParams(location.search).get('type');
    if (requested && $$('option', fields.type).some(function (o) { return o.value === requested; })) {
      fields.type.value = requested;
    }

    function value(name) {
      return (fields[name].value || '').trim();
    }
    function customer() {
      var picked = $('input[name="customer"]:checked', form);
      return picked ? picked.value : '';
    }

    // The business name is only asked for professional orders.
    function updateCustomer() {
      var business = customer() === 'business';
      businessField.hidden = !business;
      fields.business.required = business;
    }
    $$('input[name="customer"]', form).forEach(function (radio) {
      radio.addEventListener('change', updateCustomer);
    });
    updateCustomer();

    function check() {
      var errors = [];
      if (!customer()) errors.push(['customer', config.errors.customer]);
      if (!value('name')) errors.push(['name', config.errors.name]);
      if (value('contact').length < 5) errors.push(['contact', config.errors.contact]);
      if (customer() === 'business' && !value('business')) errors.push(['business', config.errors.business]);
      if (!value('type')) errors.push(['type', config.errors.type]);
      if (value('description').length < 10) errors.push(['description', config.errors.description]);
      if (value('date') && value('date') < today) errors.push(['date', config.errors.date]);
      return errors;
    }

    function input(name) {
      return name === 'customer' ? $('input[name="customer"]', form) : fields[name];
    }

    function setFieldError(name, message) {
      var error = $('[data-error-for="' + name + '"]', form);
      var targets = name === 'customer' ? $$('input[name="customer"]', form) : [fields[name]];
      targets.forEach(function (el) {
        if (message) el.setAttribute('aria-invalid', 'true');
        else el.removeAttribute('aria-invalid');
      });
      error.textContent = message || '';
      error.hidden = !message;
    }

    function showErrors(errors) {
      checked.forEach(function (name) {
        setFieldError(name, null);
      });
      errorList.textContent = '';
      errors.forEach(function (pair) {
        setFieldError(pair[0], pair[1]);
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#f-' + pair[0];
        a.textContent = pair[1];
        a.addEventListener('click', function (event) {
          event.preventDefault();
          input(pair[0]).focus();
        });
        li.appendChild(a);
        errorList.appendChild(li);
      });
      summary.hidden = errors.length === 0;
      if (errors.length) summary.focus();
    }

    // Once a field has been flagged, re-check it as the customer corrects it.
    function recheck(event) {
      var name = event.target.name;
      if (!name || checked.indexOf(name) < 0 || event.target.getAttribute('aria-invalid') !== 'true') return;
      var stillWrong = check().filter(function (pair) { return pair[0] === name; })[0];
      setFieldError(name, stillWrong ? stillWrong[1] : null);
    }
    form.addEventListener('input', recheck);
    form.addEventListener('change', recheck);

    function formatDate(iso) {
      var parts = iso.split('-').map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Individuals and professional orders each have their own message.
    function message() {
      var template = config.templates[customer()] || config.templates.individual;
      var labels = template.labels;
      var lines = [template.intro, ''];
      function add(label, text) {
        if (text) lines.push(label + ': ' + text);
      }
      add(labels.name, value('name'));
      add(labels.contact, value('contact'));
      if (customer() === 'business') add(labels.business, value('business'));
      add(labels.type, fields.type.options[fields.type.selectedIndex].text);
      add(labels.description, value('description'));
      add(labels.quantity, value('quantity'));
      if (value('date')) add(labels.date, formatDate(value('date')));
      add(labels.details, value('details'));
      lines.push('', template.outro);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var errors = check();
      showErrors(errors);
      if (errors.length) return;

      var text = message();
      if (!config.number) {
        openSetup(text);
        return;
      }
      var url = 'https://wa.me/' + config.number + '?text=' + encodeURIComponent(text);
      var opened = window.open(url, '_blank');
      if (opened) opened.opener = null;

      preview.textContent = text;
      successLink.href = url;
      form.hidden = true;
      success.hidden = false;
      success.focus();
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });

    $('[data-edit-enquiry]').addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      fields.name.focus();
    });
  })();
})();

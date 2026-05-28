/* e3 mobile patch — OPE-1713
   - Hamburger drawer (single-level) replacing hidden nav links < 600px
   - Sticky bottom CTA bar on mobile (all pages)
   - Per-page CTA logic: tel + Reserve, context-aware target
   - Tasteful entry animation, hide near footer
   Idempotent — guard prevents double-injection. */
(function () {
  'use strict';
  if (document.getElementById('e3-mobile-patch')) return;

  // Phone roster (only 3 confirmed; rest hide tel button).
  var PHONES = {
    'tampa-bay-fl':  '+17278272383',
    'newnan-ga':     '+12052348682',
    'alpharetta-ga': '+16784882168'
  };

  var CSS = ''
    + '#e3-mb-cta{position:fixed;left:0;right:0;bottom:-100px;height:64px;background:#0a0a0a;border-top:1px solid rgba(255,255,255,.10);'
    + 'display:none;align-items:center;justify-content:stretch;gap:8px;padding:10px 12px;z-index:9998;'
    + 'transition:bottom .25s ease;box-shadow:0 -8px 24px rgba(0,0,0,.40);box-sizing:border-box}'
    + '#e3-mb-cta.show{bottom:0}'
    + '#e3-mb-cta.hide{bottom:-100px}'
    + '#e3-mb-cta a{flex:1;display:flex;align-items:center;justify-content:center;height:44px;border-radius:8px;'
    + 'font-family:Oswald,sans-serif;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;'
    + 'text-decoration:none!important;transition:transform .12s ease,background .15s ease}'
    + '#e3-mb-cta a:active{transform:scale(.97)}'
    + '#e3-mb-cta .e3-mb-tel{background:transparent;color:#fff!important;border:1px solid rgba(255,255,255,.30)}'
    + '#e3-mb-cta .e3-mb-tel:hover{background:rgba(255,255,255,.06)}'
    + '#e3-mb-cta .e3-mb-cta-prim{background:#fff;color:#1f2a44!important}'
    + '#e3-mb-cta .e3-mb-cta-prim:hover{background:#f1f3f8}'
    + '#e3-mb-cta svg{margin-right:6px;flex-shrink:0}'
    /* Hamburger button on nav */
    + '.e3-nav-v3-burger{display:none;width:44px;height:44px;background:transparent;border:0;cursor:pointer;'
    + 'padding:0;margin-left:auto;align-items:center;justify-content:center;color:#fff}'
    + '.e3-nav-v3-burger svg{display:block;width:24px;height:24px}'
    /* Drawer */
    + '#e3-mb-drawer{position:fixed;inset:0;background:rgba(10,10,10,.96);z-index:10000;display:flex;'
    + 'flex-direction:column;padding:80px 32px 32px;opacity:0;pointer-events:none;transition:opacity .2s ease}'
    + '#e3-mb-drawer.open{opacity:1;pointer-events:auto}'
    + '#e3-mb-drawer .e3-mb-close{position:absolute;top:18px;right:18px;width:44px;height:44px;background:transparent;'
    + 'border:0;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}'
    + '#e3-mb-drawer .e3-mb-close svg{width:24px;height:24px}'
    + '#e3-mb-drawer a{display:block;padding:18px 0;border-bottom:1px solid rgba(255,255,255,.08);'
    + 'color:#fff!important;font-family:Oswald,sans-serif;font-size:22px;font-weight:700;letter-spacing:-.01em;'
    + 'text-decoration:none!important;transition:opacity .15s}'
    + '#e3-mb-drawer a:hover{opacity:.75}'
    + '#e3-mb-drawer a.cta{margin-top:auto;background:#fff;color:#1f2a44!important;padding:16px;border-radius:10px;'
    + 'text-align:center;letter-spacing:.14em;text-transform:uppercase;font-size:14px;border:0}'
    /* Body padding bottom when CTA visible */
    + 'body.e3-mb-cta-shown{padding-bottom:64px!important}'
    /* Activate at ≤ 760px */
    + '@media(max-width:760px){'
    + '.e3-nav-v3-burger{display:flex}'
    + '.e3-nav-v3-links,.e3-nav-v3-cta{display:none!important}'
    + '#e3-mb-cta{display:flex}'
    + '}'
    /* Breakpoint tweaks for content */
    + '@media(max-width:760px){'
    + '.e3p-h1,.e3m-h2,.e3-h1{font-size:clamp(28px,8vw,42px)!important;line-height:1.05!important}'
    + '.e3p-lede{font-size:16px!important}'
    + '.e3m-tg{grid-template-columns:1fr!important;gap:18px!important}'
    + '.e3m-tiers,.e3p-section,.e3m-join{padding:56px 0!important}'
    + '.e3m-tiers-in,.e3p-in,.e3m-join-in{padding:0 20px!important}'
    + '.e3m-card{padding:24px 20px 22px!important}'
    + '.e3m-card-feat{transform:none!important}'
    + '.e3m-join-in{grid-template-columns:1fr!important;gap:32px!important}'
    + '.e3m-form{padding:24px!important}'
    + '}'
    /* Extra tight on 320-380 */
    + '@media(max-width:380px){'
    + '#e3-mb-cta a{font-size:11px;letter-spacing:.10em}'
    + '#e3-mb-cta{padding:8px 8px;gap:6px}'
    + '.e3-nav-v3{padding:0 12px!important}'
    + '.e3-nav-v3-logo{font-size:20px!important}'
    + '}'
    /* Tablet sweep */
    + '@media(min-width:761px) and (max-width:1024px){'
    + '.e3m-tg{grid-template-columns:repeat(2,1fr)!important}'
    + '.e3m-join-in{gap:40px!important}'
    + '}';

  // Per-page CTA configuration
  function getCtaConfig() {
    var path = location.pathname.replace(/\/+$/, '').toLowerCase();
    var detail = path.match(/^\/locations\/([a-z0-9-]+)$/);
    if (detail) {
      var slug = detail[1];
      var phone = PHONES[slug] || '';
      return {
        telHref:  phone ? 'tel:' + phone : '',
        primHref: '#inquiry',  // anchor to per-location inquiry form
        primText: 'Reserve',
        primOnClick: function (e) {
          var f = document.getElementById('inquiry') ||
                  document.querySelector('[data-form-id="inquiry"]') ||
                  document.querySelector('form');
          if (f) { e.preventDefault(); f.scrollIntoView({behavior:'smooth', block:'start'}); }
        }
      };
    }
    if (path === '/membership' || path === '/membership/') {
      return { telHref:'', primHref:'#e3m-join', primText:'Join Now', primOnClick: function(e){
        var f = document.getElementById('e3m-join') || document.querySelector('.e3m-join');
        if (f) { e.preventDefault(); f.scrollIntoView({behavior:'smooth'}); }
      }};
    }
    if (path === '/locations' || path === '/locations/') {
      return { telHref:'', primHref:'/membership', primText:'See Membership' };
    }
    // home + /affiliate + /story + default
    return { telHref:'', primHref:'/locations', primText:'Find Your Location' };
  }

  // SVG icon helper
  function phoneIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" '
      + 'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'
      + '</svg>';
  }
  function burgerIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
      + 'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
      + '<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/></svg>';
  }
  function closeIcon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
      + 'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
      + '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="6"/></svg>';
  }

  function buildCtaBar() {
    var cfg = getCtaConfig();
    var bar = document.createElement('div');
    bar.id = 'e3-mb-cta';

    var primPathOnly = cfg.primHref.split('#')[0];
    var currentPath = location.pathname.replace(/\/+$/, '');
    if (primPathOnly && primPathOnly === currentPath && !cfg.primHref.startsWith('#')) {
      // already there; no CTA on this page would be confusing — fallback to scrollTop
      cfg.primHref = '#';
      cfg.primOnClick = function(e){ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); };
      cfg.primText = 'Back to Top';
    }

    var html = '';
    if (cfg.telHref) {
      html += '<a class="e3-mb-tel" href="' + cfg.telHref + '">' + phoneIcon() + 'Call</a>';
    }
    html += '<a class="e3-mb-cta-prim" href="' + cfg.primHref + '">' + cfg.primText + '</a>';
    bar.innerHTML = html;

    if (cfg.primOnClick) {
      var primA = bar.querySelector('.e3-mb-cta-prim');
      if (primA) primA.addEventListener('click', cfg.primOnClick);
    }

    document.body.appendChild(bar);
    document.body.classList.add('e3-mb-cta-shown');

    // Show after scrolling past 320px; hide near footer (last 120px)
    var lastY = 0;
    function update() {
      var y = window.scrollY || window.pageYOffset || 0;
      var doc = document.documentElement;
      var max = (doc.scrollHeight || doc.offsetHeight) - window.innerHeight;
      var nearBottom = (max - y) < 120;
      if (y > 320 && !nearBottom) {
        bar.classList.add('show');
        bar.classList.remove('hide');
      } else {
        bar.classList.remove('show');
        if (y > 320) bar.classList.add('hide');
      }
      lastY = y;
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function buildHamburger() {
    var nav = document.querySelector('.e3-nav-v3 .e3-nav-v3-in') || document.querySelector('.e3-nav-v3');
    if (!nav) return; // nav not yet built — retry on next tick
    if (nav.querySelector('.e3-nav-v3-burger')) return;

    var btn = document.createElement('button');
    btn.className = 'e3-nav-v3-burger';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = burgerIcon();
    nav.appendChild(btn);

    var drawer = document.createElement('div');
    drawer.id = 'e3-mb-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.innerHTML = ''
      + '<button class="e3-mb-close" aria-label="Close menu">' + closeIcon() + '</button>'
      + '<a href="/">Home</a>'
      + '<a href="/locations">Locations</a>'
      + '<a href="/membership">Membership</a>'
      + '<a href="/affiliate">Affiliate</a>'
      + '<a href="/story">Our Story</a>'
      + '<a class="cta" href="/locations">Find Your Location</a>';
    document.body.appendChild(drawer);

    btn.addEventListener('click', function () {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    drawer.querySelector('.e3-mb-close').addEventListener('click', function () {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  function inject() {
    if (document.getElementById('e3-mobile-patch')) return;
    var s = document.createElement('style');
    s.id = 'e3-mobile-patch';
    s.textContent = CSS;
    document.head.appendChild(s);

    // Build hamburger now if nav exists; otherwise observe
    if (!buildHamburger()) {
      var mo = new MutationObserver(function () {
        if (document.querySelector('.e3-nav-v3')) {
          buildHamburger();
          mo.disconnect();
        }
      });
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
      // Stop observing after 6s no matter what
      setTimeout(function () { try { mo.disconnect(); } catch(_){} }, 6000);
    }

    buildCtaBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

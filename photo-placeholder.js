/* e3 photo-placeholder system — OPE-1717
   When a CMS image field is null OR an <img> fails to load, replace it
   with a branded "e3storage [City]" SVG placeholder. Pure JS + inline
   SVG, no external assets, no FOUC.

   Triggers:
   - Any <img> inside .e3-location-card, .e3-detail-hero, .e3-operator-photo,
     or that has data-e3-placeholder="..."
   - Empty src, missing src, src ends in #empty, or src 404s

   The placeholder is keyed by city — pulled from data-e3-city, or from
   the URL slug on /locations/{slug}, or from the document title.

   Idempotent — replaces once per element. */
(function () {
  'use strict';
  if (window.__e3PhotoPlaceholderBound) return;
  window.__e3PhotoPlaceholderBound = true;

  /* Brand colors — match the rest of the site */
  var NAVY = '#1f2a44';
  var NAVY_DARK = '#1c2540';
  var WHITE = '#fff';

  /* Map slug → display city (uppercase first letter of each word). Drawn
     from the same roster as the JSON-LD bundle. */
  var CITY_MAP = {
    'mckinney-tx': 'McKinney',
    'grapevine-tx': 'Grapevine',
    'temple-tx': 'Temple',
    'greenville-sc': 'Greenville',
    'charlotte-nc': 'Charlotte',
    'tampa-bay-fl': 'Tampa Bay',
    'orlando-fl': 'Orlando',
    'tucker-ga': 'Tucker',
    'newnan-ga': 'Newnan',
    'chamblee-ga': 'Chamblee',
    'alpharetta-ga': 'Alpharetta'
  };

  /** Try to identify a city label for a placeholder element. */
  function cityFor(el) {
    // 1. explicit override
    var explicit = el.getAttribute && el.getAttribute('data-e3-city');
    if (explicit) return explicit;
    // 2. closest ancestor with data-e3-city
    var anc = el.closest && el.closest('[data-e3-city]');
    if (anc) return anc.getAttribute('data-e3-city');
    // 3. derived from URL on detail page
    var m = location.pathname.replace(/\/+$/, '').toLowerCase().match(/^\/locations\/([a-z0-9-]+)$/);
    if (m && CITY_MAP[m[1]]) return CITY_MAP[m[1]];
    // 4. nothing
    return '';
  }

  /** Build the inline SVG markup. width/height are aspect-ratio
      hints — viewBox + preserveAspectRatio handle the actual sizing. */
  function placeholderSvg(label, opts) {
    opts = opts || {};
    var w = opts.w || 1600;
    var h = opts.h || 900;
    var labelSafe = String(label || '').replace(/[<>&"']/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c];
    });
    var hasCity = !!labelSafe;
    var brandText = hasCity ? 'e3storage' : 'e3storage';
    var subText = hasCity ? labelSafe : '';
    var subSize = subText.length > 12 ? 72 : 96;

    return ''
      + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" '
      + 'preserveAspectRatio="xMidYMid slice" role="img" aria-label="e3storage ' + labelSafe + '">'
      + '  <defs>'
      + '    <linearGradient id="e3pp-g" x1="0" y1="0" x2="0" y2="1">'
      + '      <stop offset="0" stop-color="' + NAVY + '"/>'
      + '      <stop offset="1" stop-color="' + NAVY_DARK + '"/>'
      + '    </linearGradient>'
      + '    <pattern id="e3pp-stripes" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">'
      + '      <rect width="60" height="60" fill="url(#e3pp-g)"/>'
      + '      <line x1="0" y1="0" x2="0" y2="60" stroke="' + WHITE + '" stroke-opacity=".035" stroke-width="2"/>'
      + '    </pattern>'
      + '  </defs>'
      + '  <rect width="100%" height="100%" fill="url(#e3pp-stripes)"/>'
      // Top-right small mark
      + '  <text x="' + (w - 48) + '" y="64" text-anchor="end" '
      + '    font-family="Oswald, sans-serif" font-size="22" font-weight="700" '
      + '    letter-spacing="6" fill="' + WHITE + '" fill-opacity=".40">' + 'STORE  RESTORE  RELAX' + '</text>'
      // Centered brand mark
      + '  <g transform="translate(' + (w / 2) + ' ' + (h / 2) + ')">'
      + '    <text x="0" y="-12" text-anchor="middle" '
      + '      font-family="Oswald, sans-serif" font-size="148" font-weight="800" '
      + '      letter-spacing="-3" fill="' + WHITE + '">' + brandText + '</text>'
      + (subText
        ? '    <text x="0" y="' + (subSize + 32) + '" text-anchor="middle" '
          + '      font-family="Oswald, sans-serif" font-size="' + subSize + '" font-weight="600" '
          + '      letter-spacing="8" fill="' + WHITE + '" fill-opacity=".75" '
          + '      text-transform="uppercase" style="text-transform:uppercase">' + subText + '</text>'
        : '')
      + '  </g>'
      // Bottom badge
      + '  <rect x="' + (w / 2 - 80) + '" y="' + (h - 110) + '" width="160" height="4" fill="' + WHITE + '" fill-opacity=".60"/>'
      + '</svg>';
  }

  /** Turn an SVG string into a base64 data URI. */
  function dataUri(svg) {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }

  /** Decide if an <img> needs replacement (no src, placeholder src, or 404'd). */
  function needsReplacement(img) {
    if (img.__e3PpDone) return false;
    if (img.dataset.e3PlaceholderForce === 'true') return true;
    var src = img.getAttribute('src') || '';
    if (!src) return true;
    if (src.endsWith('#empty')) return true;
    if (src.indexOf('about:blank') === 0) return true;
    // naturalWidth=0 + complete=true ⇒ load failed
    if (img.complete && img.naturalWidth === 0) return true;
    return false;
  }

  function applyPlaceholder(img) {
    if (img.__e3PpDone) return;
    img.__e3PpDone = true;
    var w = img.getAttribute('width') ? parseInt(img.getAttribute('width'), 10) : 1600;
    var h = img.getAttribute('height') ? parseInt(img.getAttribute('height'), 10) : 900;
    if (!Number.isFinite(w) || w <= 0) w = 1600;
    if (!Number.isFinite(h) || h <= 0) h = 900;
    var label = cityFor(img);
    var svg = placeholderSvg(label, { w: w, h: h });
    img.setAttribute('src', dataUri(svg));
    img.setAttribute('alt', img.alt || ('e3storage ' + (label || 'photo placeholder')));
    img.classList.add('e3-placeholder');
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
  }

  /** Selector that matches CMS image elements likely to need fallback.
      Webflow uses w-dyn-bind-empty when a CMS image binding has no value. */
  var TARGET_SELECTORS = [
    'img.w-dyn-bind-empty',                  // Webflow CMS empty binding
    'img[data-e3-placeholder="true"]',       // manual opt-in
    '.e3-location-card img',                 // home + /locations card images
    '.e3-detail-hero img',                   // detail-page hero
    '.e3-operator-photo img'                 // operator section image
  ];

  function scan() {
    var imgs = document.querySelectorAll(TARGET_SELECTORS.join(','));
    imgs.forEach(function (img) {
      if (needsReplacement(img)) applyPlaceholder(img);
      // Re-check after delayed loads via error handler
      if (!img.__e3PpErrorBound) {
        img.__e3PpErrorBound = true;
        img.addEventListener('error', function () { applyPlaceholder(img); }, { once: true });
      }
    });
  }

  function init() {
    scan();
    // Re-scan when DOM mutates (CMS-driven content can render late)
    var mo = new MutationObserver(scan);
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (_) {} }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

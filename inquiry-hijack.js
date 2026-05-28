/* e3 inquiry-form hijack — OPE-1712
   Intercepts Webflow form submits on selected forms, splits "name" into
   first_name/last_name, infers source + location_id from URL context,
   POSTs to /api/inquiry, and swaps the form for an inline success/error
   message — no Webflow webhook touch.
   Idempotent — guard prevents re-binding. */
(function () {
  'use strict';
  if (window.__e3InquiryHijackBound) return;
  window.__e3InquiryHijackBound = true;

  var ENDPOINT = 'https://e3-storage-platform.vercel.app/api/inquiry';

  // Forms we want to hijack — exact-match by id (don't touch search /
  // newsletter forms). Add to this list as new lead forms ship.
  var TARGET_IDS = ['e3m-join-form'];

  /** Default location used when the form doesn't ask for one. Use the pilot
      operator's location once it's flagged in config; for now Alpharetta is
      the established "since 2010" headquarters. */
  var FALLBACK_LOCATION = 'alpharetta-ga';

  function getSourceFromPath() {
    var p = location.pathname.replace(/\/+$/, '').toLowerCase();
    if (p === '/membership') return 'membership';
    if (p === '/affiliate') return 'affiliate';
    if (p.indexOf('/locations/') === 0 && p !== '/locations') return 'location';
    if (p === '/' || p === '') return 'home';
    return 'webflow';
  }

  /** Pull the slug from /locations/{slug}, else null. */
  function locationFromPath() {
    var m = location.pathname.replace(/\/+$/, '').toLowerCase().match(/^\/locations\/([a-z0-9-]+)$/);
    return m ? m[1] : null;
  }

  /** Split "Ada Lovelace" → ["Ada", "Lovelace"]. Single-token defaults last
      name to "—" so Zod min(1) is satisfied; operator can correct from log. */
  function splitName(full) {
    var s = String(full || '').trim();
    if (!s) return { first: '', last: '' };
    var parts = s.split(/\s+/);
    if (parts.length === 1) return { first: parts[0], last: '—' };
    return { first: parts[0], last: parts.slice(1).join(' ') };
  }

  /** Build the success block that replaces the form. */
  function buildSuccess(inquiryId) {
    var d = document.createElement('div');
    d.className = 'e3-inquiry-success';
    d.setAttribute('role', 'status');
    d.style.cssText = 'padding:32px 28px;border-radius:12px;background:#0f172a;color:#fff;text-align:center;line-height:1.5';
    d.innerHTML =
      '<div style="font-family:Oswald,sans-serif;font-size:22px;font-weight:700;letter-spacing:-.01em;margin-bottom:10px">Got it. Talk soon.</div>' +
      '<div style="font-size:14px;color:rgba(255,255,255,.78);max-width:420px;margin:0 auto">' +
      'The operator on the ground will reach out the same business day. ' +
      '<span style="opacity:.6">Ref #' + (inquiryId || '—') + '</span></div>';
    return d;
  }

  /** Build an inline error block (does not replace the form). */
  function showError(form, msg) {
    var existing = form.querySelector('.e3-inquiry-error');
    if (existing) existing.remove();
    var d = document.createElement('div');
    d.className = 'e3-inquiry-error';
    d.style.cssText = 'margin-top:12px;padding:10px 14px;border-radius:8px;background:#fff1f1;color:#7f1d1d;font-size:13px;border:1px solid #fecaca';
    d.textContent = msg || 'Something went wrong. Please try again.';
    form.appendChild(d);
  }

  function hijack(form) {
    if (form.__e3HijackBound) return;
    form.__e3HijackBound = true;

    // Strip Webflow's native handler to avoid double-fire.
    form.removeAttribute('action');
    form.setAttribute('novalidate', 'novalidate');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var fd = new FormData(form);
      // Membership form uses single "name" → split.
      var raw = {};
      fd.forEach(function (v, k) { raw[k] = v; });

      // Map fields. Membership form: name, email, location, vehicle.
      var nm = splitName(raw.name);
      var payload = {
        first_name: raw.first_name || nm.first,
        last_name:  raw.last_name  || nm.last,
        email:      raw.email      || '',
        phone:      raw.phone || undefined,
        location_id:
          raw.location_id ||
          raw.location ||
          locationFromPath() ||
          FALLBACK_LOCATION,
        vehicle_type: raw.vehicle_type || raw.vehicle || undefined,
        source: raw.source || getSourceFromPath(),
      };

      // Strip undefined / empty so Zod optional fields don't fail
      Object.keys(payload).forEach(function (k) {
        if (payload[k] === undefined || payload[k] === '') delete payload[k];
      });

      // Disable form during request
      var inputs = form.querySelectorAll('input, select, textarea, button');
      inputs.forEach(function (i) { i.disabled = true; });

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) { return res.json().then(function (j) { return { status: res.status, body: j }; }); })
        .then(function (r) {
          if (r.body && r.body.ok) {
            var success = buildSuccess(r.body.inquiry_id);
            form.parentNode.replaceChild(success, form);
          } else {
            inputs.forEach(function (i) { i.disabled = false; });
            showError(form, (r.body && r.body.error) || 'Submission failed. Please check your fields and try again.');
          }
        })
        .catch(function () {
          inputs.forEach(function (i) { i.disabled = false; });
          showError(form, 'Network error. Check your connection and try again.');
        });
    });
  }

  function bindNow() {
    TARGET_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.tagName === 'FORM') hijack(el);
    });
  }

  // Run on DOM ready + observe for late-injected forms (membership bundle
  // builds its form in DOMContentLoaded too, so we may race; observe to be safe).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindNow);
  } else {
    bindNow();
  }
  var mo = new MutationObserver(function () {
    bindNow();
    // Stop once all targets are bound
    var allBound = TARGET_IDS.every(function (id) {
      var el = document.getElementById(id);
      return !el || el.__e3HijackBound;
    });
    if (allBound) try { mo.disconnect(); } catch (_) {}
  });
  mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
  setTimeout(function () { try { mo.disconnect(); } catch (_) {} }, 8000);
})();

/* PREAMBLE: Block hideRoutes redirect for /affiliate and /story.
   Must run before footer inline script. Restored after a few seconds. */
(function(){
  var p=location.pathname.replace(/\/+$/,'').toLowerCase();
  if(p!=='/affiliate'&&p!=='/story')return;
  var origIndexOf=Array.prototype.indexOf;
  Array.prototype.indexOf=function(s){
    if(s==='/affiliate'||s==='/story')return -1;
    return origIndexOf.apply(this,arguments);
  };
  function restore(){Array.prototype.indexOf=origIndexOf;}
  setTimeout(restore,3000);
})();

/* e3 standalone pages bundle — /affiliate + /story
   Injects premium content matching home/locations/membership aesthetic.
   Mounts CSS once, then dispatches per-path content. Idempotent. */
(function () {
  'use strict';

  /* === Shared CSS for both pages === */
  var css =
    'body.e3-affiliate, body.e3-story { padding-top: 72px !important; }' +
    'body.e3-affiliate > h1, body.e3-affiliate > h2, body.e3-affiliate > p, body.e3-affiliate > ul, body.e3-affiliate > div:first-of-type:not([class]):not(.cw-overlay), body.e3-story > h1, body.e3-story > h2, body.e3-story > p, body.e3-story > ul, body.e3-story > div:first-of-type:not([class]):not(.cw-overlay) { display: none !important; }' +
    'body.e3-affiliate > .e3p-section, body.e3-story > .e3p-section { grid-column: 1 / -1 !important; width: 100% !important; max-width: none !important; display: block; }' +
    /* sections */
    '.e3p-section { padding: 80px 0; }' +
    '.e3p-section.dark { background: #0a0a0a; color: #fff; }' +
    '.e3p-section.light { background: #f8f9fc; }' +
    '.e3p-section.white { background: #fff; }' +
    '.e3p-section.hero { padding: 96px 0 80px; background: #0a0a0a; color: #fff; }' +
    '.e3p-in { max-width: 1240px; margin: 0 auto; padding: 0 32px; }' +
    '.e3p-in-narrow { max-width: 880px; margin: 0 auto; padding: 0 32px; }' +
    '.e3p-eyebrow { display: inline-block; background: #1f2a44; color: #fff; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: 600; letter-spacing: .2em; margin-bottom: 22px; }' +
    '.e3p-eyebrow.light { background: rgba(255,255,255,.10); }' +
    '.e3p-h1 { font-family: "Oswald", sans-serif; font-size: clamp(40px, 5.5vw, 68px); font-weight: 800; letter-spacing: -.02em; line-height: 1.05; margin: 0 0 18px; }' +
    '.e3p-h2 { font-family: "Oswald", sans-serif; font-size: clamp(28px, 3.2vw, 44px); font-weight: 800; letter-spacing: -.02em; color: #1f2a44; margin: 0 0 14px; line-height: 1.1; }' +
    '.e3p-h2.light { color: #fff; }' +
    '.e3p-h3 { font-size: 22px; font-weight: 700; color: #1f2a44; margin: 0 0 10px; line-height: 1.2; }' +
    '.e3p-h3.light { color: #fff; }' +
    '.e3p-lede { font-size: 19px; color: #4a5568; max-width: 780px; line-height: 1.55; margin: 0 0 28px; }' +
    '.e3p-lede.light { color: rgba(255,255,255,.85); }' +
    '.e3p-p { font-size: 16px; color: #4a5568; line-height: 1.65; margin: 0 0 14px; }' +
    '.e3p-p.light { color: rgba(255,255,255,.78); }' +
    '.e3p-btn { display: inline-block; background: #fff; color: #1f2a44 !important; padding: 14px 24px; border-radius: 8px; font-weight: 700; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; text-decoration: none !important; transition: background .15s; }' +
    '.e3p-btn:hover { background: #f1f3f8; }' +
    '.e3p-btn.dark { background: #1f2a44; color: #fff !important; }' +
    '.e3p-btn.dark:hover { background: #1c2540; }' +
    '.e3p-head-center { text-align: center; margin-bottom: 48px; }' +
    /* 2-col compare for "the model" */
    '.e3p-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }' +
    '.e3p-compare-col { background: #fff; border: 1px solid #e5e7ee; border-radius: 14px; padding: 32px; }' +
    '.e3p-compare-col.dark { background: #1f2a44; border-color: #1f2a44; color: #fff; }' +
    '.e3p-compare-col.dark .e3p-h3 { color: #fff; }' +
    '.e3p-compare-col ul { list-style: none; padding: 0; margin: 14px 0 0; }' +
    '.e3p-compare-col li { padding: 8px 0 8px 26px; position: relative; font-size: 15px; line-height: 1.45; color: #2d3748; }' +
    '.e3p-compare-col.dark li { color: rgba(255,255,255,.92); }' +
    '.e3p-compare-col li:before { content: "✓"; position: absolute; left: 0; top: 8px; color: #1f2a44; font-weight: 800; }' +
    '.e3p-compare-col.dark li:before { color: #fff; }' +
    /* what-you-get grid (6 cards) */
    '.e3p-grid6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }' +
    '.e3p-card { background: #fff; border: 1px solid #e5e7ee; border-radius: 14px; padding: 28px; box-shadow: 0 1px 6px rgba(15,23,42,.04); transition: transform .2s ease, box-shadow .2s ease; }' +
    '.e3p-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(15,23,42,.10); }' +
    '.e3p-card-icon { font-size: 26px; margin-bottom: 12px; display: block; }' +
    /* owner stories cards */
    '.e3p-stories { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }' +
    '.e3p-story-card { background: #fff; border: 1px solid #e5e7ee; border-radius: 14px; padding: 32px; box-shadow: 0 2px 10px rgba(15,23,42,.05); }' +
    '.e3p-story-quote { font-family: "Oswald", sans-serif; font-size: 19px; font-weight: 600; color: #1f2a44; line-height: 1.35; margin: 0 0 18px; letter-spacing: -.01em; }' +
    '.e3p-story-attr { font-size: 13px; color: #6b7280; font-weight: 600; letter-spacing: .04em; }' +
    '.e3p-story-attr strong { color: #1f2a44; font-weight: 800; }' +
    /* timeline */
    '.e3p-timeline { position: relative; padding-left: 32px; }' +
    '.e3p-timeline:before { content: ""; position: absolute; left: 8px; top: 8px; bottom: 8px; width: 2px; background: #d4d8e0; }' +
    '.e3p-tl-item { position: relative; margin-bottom: 36px; }' +
    '.e3p-tl-item:before { content: ""; position: absolute; left: -32px; top: 6px; width: 18px; height: 18px; background: #1f2a44; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 2px #1f2a44; }' +
    '.e3p-tl-year { font-family: "Oswald", sans-serif; font-size: 22px; font-weight: 800; color: #1f2a44; letter-spacing: -.01em; margin: 0 0 6px; }' +
    '.e3p-tl-body { font-size: 15px; color: #4a5568; line-height: 1.55; margin: 0; }' +
    /* CTA band */
    '.e3p-cta { background: #1f2a44; color: #fff; padding: 80px 0; text-align: center; }' +
    '.e3p-cta .e3p-h2 { color: #fff; max-width: 720px; margin: 0 auto 14px; }' +
    '.e3p-cta .e3p-lede { color: rgba(255,255,255,.85); margin: 0 auto 26px; }' +
    /* Responsive */
    '@media (max-width: 900px) {' +
    '  .e3p-compare, .e3p-grid6, .e3p-stories { grid-template-columns: 1fr; gap: 18px; }' +
    '}';

  function mountCSS() {
    if (document.getElementById('e3p-style')) return;
    var s = document.createElement('style');
    s.id = 'e3p-style';
    s.textContent = css;
    document.head.appendChild(s);
  }
  mountCSS();

  function buildAffiliate() {
    if (document.body.classList.contains('e3p-built')) return;
    document.body.classList.add('e3-affiliate', 'e3p-built');

    var sections = '' +
      // 1. HERO
      '<section class="e3p-section hero"><div class="e3p-in">' +
      '<div class="e3p-eyebrow light">BECOME AN AFFILIATE</div>' +
      '<h1 class="e3p-h1">Bring e3 to your city.</h1>' +
      '<p class="e3p-lede light">We started in a single Alpharetta garage in 2010. Now there are 11 e3 clubhouses across the Southeast. Each one is owner-operated. The next one could be yours.</p>' +
      '<a class="e3p-btn" href="#apply">Start the conversation</a>' +
      '</div></section>' +

      // 2. THE MODEL
      '<section class="e3p-section light"><div class="e3p-in">' +
      '<div class="e3p-head-center"><div class="e3p-eyebrow">THE MODEL</div><h2 class="e3p-h2">Owner-operator, brand-supported.</h2><p class="e3p-lede" style="margin-left:auto;margin-right:auto">e3 isn\'t a franchise in the cookie-cutter sense. You bring the building and the local relationships. We bring the brand, the software, and 15+ years of clubhouse operations.</p></div>' +
      '<div class="e3p-compare">' +
        '<div class="e3p-compare-col dark">' +
          '<h3 class="e3p-h3">You bring</h3>' +
          '<ul>' +
            '<li>The building (climate-controllable, secure, ~15-50k sq ft)</li>' +
            '<li>Local market knowledge and community relationships</li>' +
            '<li>Day-to-day operations and member service</li>' +
            '<li>Capital for build-out and working capital</li>' +
            '<li>Passion for the cars, bikes, and the people</li>' +
          '</ul>' +
        '</div>' +
        '<div class="e3p-compare-col">' +
          '<h3 class="e3p-h3">e3 brings</h3>' +
          '<ul>' +
            '<li>National e3 brand and marketing site</li>' +
            '<li>Operations playbook from 11 live locations</li>' +
            '<li>Member CRM, contracts, billing, access control</li>' +
            '<li>Site selection support and build-out guidance</li>' +
            '<li>Network of operators to call when you need backup</li>' +
            '<li>Cross-location member privileges and events</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '</div></section>' +

      // 3. OWNER STORIES
      '<section class="e3p-section white"><div class="e3p-in">' +
      '<div class="e3p-head-center"><div class="e3p-eyebrow">WHO RUNS e3</div><h2 class="e3p-h2">Owner-operators, every clubhouse.</h2></div>' +
      '<div class="e3p-stories">' +
        '<div class="e3p-story-card"><p class="e3p-story-quote">"We bought a building in Alpharetta in 2010 because we needed a place for our own collection. Then friends asked. Then strangers asked. e3 is the answer to that original question, fifteen years later."</p><p class="e3p-story-attr"><strong>Mike & Tina Taylor</strong><br>e3 Alpharetta · founders, est. 2010</p></div>' +
        '<div class="e3p-story-card"><p class="e3p-story-quote">"Outlaw Garage was already our community. Joining e3 gave us the playbook and the brand without losing what made us local. Members get more — we keep what made it work."</p><p class="e3p-story-attr"><strong>Taylor & Tamarah Hull</strong><br>Outlaw Garage, powered by e3 · Newnan, GA</p></div>' +
        '<div class="e3p-story-card"><p class="e3p-story-quote">"I knew the building. I didn\'t know the back-office. The e3 operations team handed me a CRM, a billing system, and a manual. We were taking applications week one."</p><p class="e3p-story-attr"><strong>Ray Moser</strong><br>e3storage Tampa Bay</p></div>' +
      '</div>' +
      '</div></section>' +

      // 4. WHAT YOU GET
      '<section class="e3p-section light"><div class="e3p-in">' +
      '<div class="e3p-head-center"><div class="e3p-eyebrow">WHAT\'S INCLUDED</div><h2 class="e3p-h2">Six pillars, day one.</h2></div>' +
      '<div class="e3p-grid6">' +
        '<div class="e3p-card"><span class="e3p-card-icon">🏷️</span><h3 class="e3p-h3">e3 brand</h3><p class="e3p-p">National e3 wordmark, regional sub-brands welcome (Outrun Garage, Outlaw Garage). Recognized in five states.</p></div>' +
        '<div class="e3p-card"><span class="e3p-card-icon">💻</span><h3 class="e3p-h3">Software stack</h3><p class="e3p-p">Member CRM, access control, e-signed agreements, monthly billing, calendaring, the operator dashboard.</p></div>' +
        '<div class="e3p-card"><span class="e3p-card-icon">📖</span><h3 class="e3p-h3">Ops playbook</h3><p class="e3p-p">Onboarding flow, cleaning cadence, lift inspection, security checklist, event templates — everything that\'s already running at the other 10 clubs.</p></div>' +
        '<div class="e3p-card"><span class="e3p-card-icon">👥</span><h3 class="e3p-h3">Member CRM</h3><p class="e3p-p">Every member, every vehicle, every contract. Search, segment, export. Plug into HubSpot if you want CRM on top.</p></div>' +
        '<div class="e3p-card"><span class="e3p-card-icon">🌐</span><h3 class="e3p-h3">Your page on e3storage.com</h3><p class="e3p-p">Premium location detail page, lead capture wired to your phone, SEO schema for local discovery.</p></div>' +
        '<div class="e3p-card"><span class="e3p-card-icon">📞</span><h3 class="e3p-h3">Operator network</h3><p class="e3p-p">A Slack room with ten other people who\'ve already solved the problem you\'re about to hit. Quarterly in-person at one of the clubs.</p></div>' +
      '</div>' +
      '</div></section>' +

      // 5. APPLY CTA
      '<section class="e3p-section e3p-cta" id="apply"><div class="e3p-in">' +
      '<div class="e3p-eyebrow light">START THE CONVERSATION</div>' +
      '<h2 class="e3p-h2 light">Ready to bring e3 to your city?</h2>' +
      '<p class="e3p-lede light">Tell us about your market, your building, and your timeline. A founder follows up — not a call center.</p>' +
      '<a class="e3p-btn" href="mailto:affiliate@e3storage.com?subject=Affiliate%20application%20%E2%80%94%20bring%20e3%20to%20my%20city">Email affiliate@e3storage.com</a>' +
      '</div></section>';

    var foot = document.querySelector('.e3-footer-rebuild, footer');
    var frag = document.createDocumentFragment();
    var wrap = document.createElement('div');
    wrap.innerHTML = sections;
    while (wrap.firstChild) frag.appendChild(wrap.firstChild);
    if (foot && foot.parentNode) foot.parentNode.insertBefore(frag, foot);
    else document.body.appendChild(frag);
  }

  function buildStory() {
    if (document.body.classList.contains('e3p-built')) return;
    document.body.classList.add('e3-story', 'e3p-built');

    var sections = '' +
      // 1. HERO
      '<section class="e3p-section hero"><div class="e3p-in">' +
      '<div class="e3p-eyebrow light">OUR STORY</div>' +
      '<h1 class="e3p-h1">Built in a garage. Still run like one.</h1>' +
      '<p class="e3p-lede light">e3 didn\'t come out of a boardroom. It came out of Mike and Tina Taylor\'s 13,000 square foot Alpharetta building in 2010, and a question every motoring enthusiast eventually asks: where do I put this thing?</p>' +
      '</div></section>' +

      // 2. THE FOUNDING
      '<section class="e3p-section white"><div class="e3p-in-narrow">' +
      '<div class="e3p-eyebrow">THE FOUNDING</div>' +
      '<h2 class="e3p-h2">Alpharetta, 2010.</h2>' +
      '<p class="e3p-p">Mike Taylor was a road-racer with a small collection that didn\'t fit at home. He bought a building. Tina ran the front office. They had room to spare, so they offered a couple of bays to friends — and the friends brought friends.</p>' +
      '<p class="e3p-p">By year three, the Alpharetta clubhouse had a waitlist, a coffee setup, a member-built workbench in the back, and a name: e3. The "e" was for enthusiast. The "3" was the three things every member came for — to store, to restore, to relax.</p>' +
      '<p class="e3p-p">It took eleven years for a second location to open. Once it did, the model spread fast.</p>' +
      '</div></section>' +

      // 3. TIMELINE
      '<section class="e3p-section light"><div class="e3p-in">' +
      '<div class="e3p-head-center"><div class="e3p-eyebrow">THE GROWTH</div><h2 class="e3p-h2">Eleven clubhouses. Five states.</h2></div>' +
      '<div class="e3p-in-narrow"><div class="e3p-timeline">' +
        '<div class="e3p-tl-item"><h3 class="e3p-tl-year">2010 — Alpharetta, GA</h3><p class="e3p-tl-body">The original e3. 13,000 sq ft. Mike & Tina Taylor still run it.</p></div>' +
        '<div class="e3p-tl-item"><h3 class="e3p-tl-year">2021 — Tucker, GA</h3><p class="e3p-tl-body">First expansion. Operated by Mark Davis and Benson Young, four miles outside the Perimeter off Highway 78.</p></div>' +
        '<div class="e3p-tl-item"><h3 class="e3p-tl-year">2022 — Tampa Bay, FL</h3><p class="e3p-tl-body">First Florida clubhouse. Ray Moser brings the e3 model to the Gulf coast.</p></div>' +
        '<div class="e3p-tl-item"><h3 class="e3p-tl-year">2023 — Newnan, GA · Outlaw Garage</h3><p class="e3p-tl-body">First sub-brand affiliate. Taylor and Tamarah Hull keep the Outlaw Garage name; the e3 platform powers the back office.</p></div>' +
        '<div class="e3p-tl-item"><h3 class="e3p-tl-year">2025 — Chamblee, Charlotte, Greenville, Orlando</h3><p class="e3p-tl-body">Four clubhouses in twelve months. The model is repeatable.</p></div>' +
        '<div class="e3p-tl-item"><h3 class="e3p-tl-year">2026 — Texas trio + a brewery</h3><p class="e3p-tl-body">Temple, Grapevine, and McKinney bring e3 to Texas. McKinney moves into the historic 1910 Cotton Mill — the former Tupps Brewery — turning a National Register building into a clubhouse.</p></div>' +
      '</div></div>' +
      '</div></section>' +

      // 4. MISSION
      '<section class="e3p-section white"><div class="e3p-in-narrow">' +
      '<div class="e3p-eyebrow">WHAT WE BELIEVE</div>' +
      '<h2 class="e3p-h2">Storage shouldn\'t be self-service. It should be a clubhouse.</h2>' +
      '<p class="e3p-p">A garage you can\'t hear yourself work in isn\'t a garage. A storage facility where you don\'t know the operator isn\'t storage — it\'s a parking lot with a roof. We built e3 because there was a gap between "park your car somewhere" and "have a place for the car, the project, the friends, and the time."</p>' +
      '<p class="e3p-p">Every e3 is owner-operated. The person who unlocks the door knows your name and what you\'re driving. That isn\'t a feature; it\'s the whole point.</p>' +
      '</div></section>' +

      // 5. CTA
      '<section class="e3p-section e3p-cta"><div class="e3p-in">' +
      '<div class="e3p-eyebrow light">JOIN US</div>' +
      '<h2 class="e3p-h2 light">Eleven clubhouses are waiting.</h2>' +
      '<p class="e3p-lede light">Find the one closest to you. Or start the conversation about opening the twelfth.</p>' +
      '<a class="e3p-btn" href="/locations" style="margin-right:12px">Find your local e3</a>' +
      '<a class="e3p-btn dark" href="/affiliate" style="background:#fff;color:#1f2a44!important">Become an affiliate</a>' +
      '</div></section>';

    var foot = document.querySelector('.e3-footer-rebuild, footer');
    var frag = document.createDocumentFragment();
    var wrap = document.createElement('div');
    wrap.innerHTML = sections;
    while (wrap.firstChild) frag.appendChild(wrap.firstChild);
    if (foot && foot.parentNode) foot.parentNode.insertBefore(frag, foot);
    else document.body.appendChild(frag);
  }

  function init() {
    var p = location.pathname.replace(/\/+$/, '').toLowerCase();
    if (p === '/affiliate') buildAffiliate();
    else if (p === '/story') buildStory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* === OPE-1713 MOBILE PATCH (concatenated to avoid Webflow 50K head limit) === */
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

/* === OPE-1712 INQUIRY FORM HIJACK (concatenated to avoid Webflow 50K head limit) === */
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

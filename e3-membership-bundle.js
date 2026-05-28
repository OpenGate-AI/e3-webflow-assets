/* e3 membership polish bundle */
(function(){
  var css = "/* e3 /membership v1 \u2014 CSS for tier comparison + sign-up CTA */\n\n/* Kill orphan \"Membership\" H1 + any top-level Webflow template residue on /membership */\nbody.e3-membership > h1,\nbody.e3-membership > h2:not(.e3m-h2),\nbody.e3-membership > p:not(.e3m-sub),\nbody.e3-membership > div:not([class*=\"e3\"]):not(.cw-overlay):not(.w-webflow-badge):empty,\nbody.e3-membership > section:not([class*=\"e3\"]) { display: none !important; }\n\nbody.e3-membership > div:first-of-type:not([class*=\"e3\"]):not(.cw-overlay) { display: none !important; }\n\n/* Full-bleed sections */\nbody.e3-membership > .e3m-tiers,\nbody.e3-membership > .e3m-join {\n  grid-column: 1 / -1 !important;\n  width: 100% !important;\n  max-width: none !important;\n  display: block;\n}\n\n/* Tiers section */\n.e3m-tiers {\n  background: #f8f9fc;\n  padding: 80px 0 88px;\n}\n.e3m-tiers-in {\n  max-width: 1240px;\n  margin: 0 auto;\n  padding: 0 32px;\n}\n.e3m-head {\n  text-align: center;\n  margin-bottom: 48px;\n}\n.e3m-eyebrow {\n  display: inline-block;\n  background: #1f2a44;\n  color: #fff;\n  padding: 8px 16px;\n  border-radius: 4px;\n  font-size: 12px;\n  font-weight: 600;\n  letter-spacing: .2em;\n  margin-bottom: 18px;\n}\n.e3m-eyebrow-light {\n  background: rgba(255,255,255,.10);\n  color: #fff;\n}\n.e3m-h2 {\n  font-family: 'Oswald', sans-serif;\n  font-size: clamp(28px, 3.2vw, 44px);\n  font-weight: 800;\n  letter-spacing: -.02em;\n  color: #1f2a44;\n  margin: 0 0 12px;\n  line-height: 1.1;\n}\n.e3m-h2-light { color: #fff; }\n.e3m-sub {\n  font-size: 17px;\n  color: #4a5568;\n  max-width: 680px;\n  margin: 0 auto;\n  line-height: 1.5;\n}\n.e3m-sub-light { color: rgba(255,255,255,.85); }\n\n/* Tier grid */\n.e3m-tg {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 24px;\n  align-items: stretch;\n}\n.e3m-card {\n  background: #fff;\n  border: 1px solid #e5e7ee;\n  border-radius: 16px;\n  padding: 32px 28px 28px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 2px 14px rgba(15,23,42,.06);\n  position: relative;\n  transition: transform .2s ease, box-shadow .2s ease;\n}\n.e3m-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 14px 36px rgba(15,23,42,.12);\n}\n.e3m-card-feat {\n  background: #1f2a44;\n  border-color: #1f2a44;\n  color: #fff;\n  transform: scale(1.03);\n  box-shadow: 0 18px 40px rgba(31,42,68,.22);\n}\n.e3m-card-feat:hover { transform: scale(1.03) translateY(-3px); }\n.e3m-card-badge {\n  position: absolute;\n  top: -12px;\n  left: 50%;\n  transform: translateX(-50%);\n  background: #fff;\n  color: #1f2a44;\n  font-size: 10px;\n  font-weight: 800;\n  letter-spacing: .18em;\n  padding: 6px 14px;\n  border-radius: 999px;\n  border: 1px solid rgba(255,255,255,.4);\n  box-shadow: 0 2px 8px rgba(15,23,42,.18);\n}\n.e3m-card-eyebrow {\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: .18em;\n  color: #6b7280;\n  margin-bottom: 8px;\n}\n.e3m-card-feat .e3m-card-eyebrow { color: rgba(255,255,255,.70); }\n.e3m-card-name {\n  font-family: 'Oswald', sans-serif;\n  font-size: 32px;\n  font-weight: 800;\n  letter-spacing: -.01em;\n  color: #1f2a44;\n  margin-bottom: 6px;\n  line-height: 1;\n}\n.e3m-card-feat .e3m-card-name { color: #fff; }\n.e3m-card-price {\n  font-size: 14px;\n  color: #6b7280;\n  margin-bottom: 22px;\n  padding-bottom: 22px;\n  border-bottom: 1px solid #e5e7ee;\n}\n.e3m-card-feat .e3m-card-price {\n  color: rgba(255,255,255,.75);\n  border-bottom-color: rgba(255,255,255,.18);\n}\n.e3m-feats {\n  list-style: none;\n  padding: 0;\n  margin: 0 0 24px;\n  flex: 1;\n}\n.e3m-feats li {\n  font-size: 14px;\n  color: #2d3748;\n  padding: 8px 0 8px 26px;\n  position: relative;\n  line-height: 1.4;\n}\n.e3m-feats li:before {\n  content: \"\u2713\";\n  position: absolute;\n  left: 0;\n  top: 8px;\n  color: #1f2a44;\n  font-weight: 800;\n}\n.e3m-card-feat .e3m-feats li { color: rgba(255,255,255,.92); }\n.e3m-card-feat .e3m-feats li:before { color: #fff; }\n.e3m-cta-btn {\n  display: block;\n  text-align: center;\n  background: #1f2a44;\n  color: #fff !important;\n  border: 1px solid #1f2a44;\n  font-size: 13px;\n  font-weight: 700;\n  letter-spacing: .14em;\n  text-transform: uppercase;\n  padding: 14px 20px;\n  border-radius: 8px;\n  text-decoration: none !important;\n  transition: background .15s;\n}\n.e3m-cta-btn:hover { background: #1c2540; }\n.e3m-cta-ghost {\n  background: #fff;\n  color: #1f2a44 !important;\n  border-color: #d4d8e0;\n}\n.e3m-cta-ghost:hover { background: #f1f3f8; }\n.e3m-card-feat .e3m-cta-btn {\n  background: #fff;\n  color: #1f2a44 !important;\n  border-color: #fff;\n}\n.e3m-card-feat .e3m-cta-btn:hover { background: #f0f3f8; }\n.e3m-fineprint {\n  text-align: center;\n  font-size: 13px;\n  color: #6b7280;\n  margin-top: 32px;\n  font-style: italic;\n}\n\n/* Join CTA section */\n.e3m-join {\n  background: #0a0a0a;\n  padding: 88px 0;\n  color: #fff;\n}\n.e3m-join-in {\n  max-width: 1240px;\n  margin: 0 auto;\n  padding: 0 32px;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 64px;\n  align-items: start;\n}\n.e3m-join-l { padding-right: 16px; }\n.e3m-join-l .e3m-h2 { color: #fff; max-width: none; margin-left: 0; }\n.e3m-join-l .e3m-sub { color: rgba(255,255,255,.80); max-width: none; margin-left: 0; }\n.e3m-perks {\n  list-style: none;\n  padding: 0;\n  margin: 24px 0 0;\n}\n.e3m-perks li {\n  font-size: 15px;\n  color: rgba(255,255,255,.85);\n  padding: 8px 0 8px 28px;\n  position: relative;\n}\n.e3m-perks li:before {\n  content: \"\u2192\";\n  position: absolute;\n  left: 0;\n  color: #fff;\n  font-weight: 700;\n}\n\n/* Form */\n.e3m-form {\n  background: #fff;\n  border-radius: 16px;\n  padding: 32px;\n  box-shadow: 0 20px 50px rgba(0,0,0,.35);\n}\n.e3m-row { margin-bottom: 14px; }\n.e3m-form label {\n  display: block;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: .14em;\n  color: #6b7280;\n  text-transform: uppercase;\n  margin-bottom: 6px;\n}\n.e3m-form input,\n.e3m-form select {\n  width: 100%;\n  padding: 12px 14px;\n  border: 1px solid #d4d8e0;\n  border-radius: 8px;\n  font-size: 15px;\n  font-family: inherit;\n  color: #1f2a44;\n  background: #fff;\n  font-weight: 500;\n  letter-spacing: 0;\n  text-transform: none;\n  box-sizing: border-box;\n}\n.e3m-form input:focus,\n.e3m-form select:focus {\n  outline: none;\n  border-color: #1f2a44;\n  box-shadow: 0 0 0 3px rgba(31,42,68,.10);\n}\n.e3m-submit {\n  width: 100%;\n  background: #1f2a44;\n  color: #fff;\n  border: 0;\n  font-size: 14px;\n  font-weight: 700;\n  letter-spacing: .14em;\n  text-transform: uppercase;\n  padding: 16px 20px;\n  border-radius: 8px;\n  cursor: pointer;\n  margin-top: 8px;\n  transition: background .15s;\n}\n.e3m-submit:hover { background: #1c2540; }\n.e3m-form-fineprint {\n  font-size: 12px;\n  color: #6b7280;\n  text-align: center;\n  margin-top: 14px;\n}\n\n@media (max-width: 900px) {\n  .e3m-tg { grid-template-columns: 1fr; gap: 20px; }\n  .e3m-card-feat { transform: none; }\n  .e3m-card-feat:hover { transform: translateY(-3px); }\n  .e3m-join-in { grid-template-columns: 1fr; gap: 40px; }\n}";
  var s = document.createElement('style');
  s.id = 'e3m-style';
  s.textContent = css;
  document.head.appendChild(s);
})();
/* e3 /membership v1 — premium tier comparison + sign-up CTA injection.
   Runs on /membership only. Adds body.e3-membership, kills orphan H1,
   injects two new sections before the footer. */
(function(){
  'use strict';
  if (location.pathname.replace(/\/+$/,'').toLowerCase() !== '/membership') return;
  if (document.body.classList.contains('e3m-built')) return;
  document.body.classList.add('e3-membership','e3m-built');

  /* === 1. Build tiers section === */
  var tiers = document.createElement('section');
  tiers.className = 'e3m-tiers';
  tiers.innerHTML =
    '<div class="e3m-tiers-in">' +
      '<div class="e3m-head">' +
        '<div class="e3m-eyebrow">MEMBERSHIP TIERS</div>' +
        '<h2 class="e3m-h2">Pick the home that fits your build.</h2>' +
        '<p class="e3m-sub">Every tier includes climate-controlled storage, 24/7 keycard access, surveillance, and DIY bay reservations. Step up for priority and perks.</p>' +
      '</div>' +
      '<div class="e3m-tg">' +
        '<div class="e3m-card">' +
          '<div class="e3m-card-eyebrow">DAILY DRIVER</div>' +
          '<div class="e3m-card-name">Standard</div>' +
          '<div class="e3m-card-price">Inquire for local pricing</div>' +
          '<ul class="e3m-feats">' +
            '<li>Climate-controlled bay (60×80°F)</li>' +
            '<li>24/7 keycard + surveillance</li>' +
            '<li>DIY bay reservations</li>' +
            '<li>Members-only lounge</li>' +
            '<li>Local cars-and-coffee events</li>' +
          '</ul>' +
          '<a class="e3m-cta-btn e3m-cta-ghost" href="#join">Request invite</a>' +
        '</div>' +
        '<div class="e3m-card e3m-card-feat">' +
          '<div class="e3m-card-badge">MOST POPULAR</div>' +
          '<div class="e3m-card-eyebrow">WEEKEND BUILD</div>' +
          '<div class="e3m-card-name">Premier</div>' +
          '<div class="e3m-card-price">Inquire for local pricing</div>' +
          '<ul class="e3m-feats">' +
            '<li>Everything in Standard</li>' +
            '<li>Priority lift &amp; bay reservations</li>' +
            '<li>Premium bay placement</li>' +
            '<li>4 guest passes per quarter</li>' +
            '<li>White-glove drop-off &amp; pickup</li>' +
            '<li>Track-day caravan invitations</li>' +
          '</ul>' +
          '<a class="e3m-cta-btn" href="#join">Request invite</a>' +
        '</div>' +
        '<div class="e3m-card">' +
          '<div class="e3m-card-eyebrow">CHARTER COLLECTOR</div>' +
          '<div class="e3m-card-name">Founder</div>' +
          '<div class="e3m-card-price">Inquire for local pricing</div>' +
          '<ul class="e3m-feats">' +
            '<li>Everything in Premier</li>' +
            '<li>Reserved bay — never waitlisted</li>' +
            '<li>Charter member recognition</li>' +
            '<li>Affiliate revenue share opportunity</li>' +
            '<li>VIP private events &amp; previews</li>' +
            '<li>Concierge service requests</li>' +
          '</ul>' +
          '<a class="e3m-cta-btn e3m-cta-ghost" href="#join">Request invite</a>' +
        '</div>' +
      '</div>' +
      '<div class="e3m-fineprint">Pricing and exact perks vary by location. Each operator runs their own clubhouse — your local club captain confirms availability and final terms.</div>' +
    '</div>';

  /* === 2. Build sign-up CTA section === */
  var join = document.createElement('section');
  join.className = 'e3m-join';
  join.id = 'join';
  join.innerHTML =
    '<div class="e3m-join-in">' +
      '<div class="e3m-join-l">' +
        '<div class="e3m-eyebrow e3m-eyebrow-light">JOIN THE CLUB</div>' +
        '<h2 class="e3m-h2 e3m-h2-light">Tell us your zip code. We\'ll route you to your local club captain.</h2>' +
        '<p class="e3m-sub e3m-sub-light">Each e3 clubhouse is operated by a local enthusiast. You won\'t get a call center. You\'ll get a member.</p>' +
        '<ul class="e3m-perks">' +
          '<li>Tour your local clubhouse</li>' +
          '<li>Meet the operator</li>' +
          '<li>Get pricing for your build</li>' +
          '<li>Reserve a bay if available</li>' +
        '</ul>' +
      '</div>' +
      '<div class="e3m-join-r">' +
        '<form class="e3m-form" id="e3m-join-form" action="https://e3storage.com/contact" method="get">' +
          '<div class="e3m-row"><label>Name<input type="text" name="name" required placeholder="Your name"></label></div>' +
          '<div class="e3m-row"><label>Email<input type="email" name="email" required placeholder="you@email.com"></label></div>' +
          '<div class="e3m-row"><label>Preferred location' +
            '<select name="location" required>' +
              '<option value="">Choose your closest club…</option>' +
              '<option value="alpharetta-ga">Alpharetta, GA</option>' +
              '<option value="chamblee-ga">Chamblee, GA</option>' +
              '<option value="newnan-ga">Newnan, GA</option>' +
              '<option value="tucker-ga">Tucker, GA</option>' +
              '<option value="orlando-fl">Orlando, FL</option>' +
              '<option value="tampa-bay-fl">Tampa Bay, FL</option>' +
              '<option value="charlotte-nc">Charlotte, NC</option>' +
              '<option value="greenville-sc">Greenville, SC</option>' +
              '<option value="temple-tx">Temple, TX</option>' +
              '<option value="grapevine-tx">Grapevine, TX</option>' +
              '<option value="mckinney-tx">McKinney, TX</option>' +
            '</select>' +
          '</label></div>' +
          '<div class="e3m-row"><label>What you store<select name="vehicle">' +
              '<option value="daily">Daily driver</option>' +
              '<option value="weekend">Weekend / track car</option>' +
              '<option value="collector">Collector / classic</option>' +
              '<option value="multi">Multiple vehicles</option>' +
              '<option value="bike">Motorcycle</option>' +
            '</select></label></div>' +
          '<button type="submit" class="e3m-submit">Request a tour</button>' +
          '<div class="e3m-form-fineprint">No spam. Your local operator follows up within one business day.</div>' +
        '</form>' +
      '</div>' +
    '</div>';

  /* === 3. Inject before footer === */
  var foot = document.querySelector('.e3-footer-rebuild, footer');
  if (foot && foot.parentNode) {
    foot.parentNode.insertBefore(tiers, foot);
    foot.parentNode.insertBefore(join, foot);
  } else {
    document.body.appendChild(tiers);
    document.body.appendChild(join);
  }
})();

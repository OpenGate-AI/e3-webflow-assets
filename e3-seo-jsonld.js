/* e3 SEO JSON-LD injector for /locations/{slug}
   Injects <script type="application/ld+json"> with LocalBusiness + SelfStorage
   schema into <head> on every location detail page. Beats GoA (zero structured
   data). Idempotent — guard prevents duplicate insertion. */
(function () {
  'use strict';

  // Slug → location metadata. Source: config/locations.ts + E3/location-enrichment.json.
  // Address fields with PLACEHOLDER_INFERRED in source are omitted here (do not
  // fabricate per CLAUDE.md); city/state/zip + 24-7 hours + lat/lng can be
  // emitted safely from confirmed corridor data.
  var LOC = {
    'mckinney-tx':    { name: 'e3 McKinney Motor Club',         city: 'McKinney',         state: 'TX', zip: '75069', phone: '',               operator: 'Jason McCall',                lat: 33.1976, lng: -96.6153 },
    'grapevine-tx':   { name: 'e3storage Grapevine',            city: 'Grapevine',        state: 'TX', zip: '',       phone: '',               operator: 'Nate Gonzalez',               lat: 32.9343, lng: -97.0781 },
    'temple-tx':      { name: 'e3storage Temple',               city: 'Temple',           state: 'TX', zip: '76501', phone: '',               operator: 'Leland Griffith',             lat: 31.0982, lng: -97.3428 },
    'greenville-sc':  { name: 'e3storage Outrun Garage',        city: 'Greenville',       state: 'SC', zip: '',       phone: '',               operator: 'Casey & Andrea',              lat: 34.7894, lng: -82.4137 },
    'charlotte-nc':   { name: 'e3storage Charlotte',            city: 'Charlotte',        state: 'NC', zip: '28208', phone: '',               operator: 'Now accepting members',       lat: 35.2271, lng: -80.8431 },
    'tampa-bay-fl':   { name: 'e3storage Tampa Bay',            city: 'Largo',            state: 'FL', zip: '33777', phone: '+17278272383',   operator: 'Ray Moser',                   lat: 27.8853, lng: -82.7873 },
    'orlando-fl':     { name: 'e3storage Orlando',              city: 'Altamonte Springs',state: 'FL', zip: '',       phone: '',               operator: 'Aaron Nash',                  lat: 28.6611, lng: -81.3656 },
    'tucker-ga':      { name: 'e3storage Tucker',               city: 'Tucker',           state: 'GA', zip: '',       phone: '',               operator: 'Mark Davis & Benson Young',   lat: 33.8543, lng: -84.2171 },
    'newnan-ga':      { name: 'Outlaw Garage, powered by e3',   city: 'Newnan',           state: 'GA', zip: '30265', phone: '+12052348682',   operator: 'Taylor & Tamarah Hull',       lat: 33.3807, lng: -84.7997 },
    'chamblee-ga':    { name: 'e3storage Chamblee',             city: 'Chamblee',         state: 'GA', zip: '',       phone: '',               operator: 'Now accepting members',       lat: 33.8920, lng: -84.2982 },
    'alpharetta-ga':  { name: 'e3storage Alpharetta',           city: 'Alpharetta',       state: 'GA', zip: '30004', phone: '+16784882168',   operator: 'Mike & Tina Taylor',          lat: 34.0754, lng: -84.2941 }
  };

  function inject() {
    // Only run on location detail pages
    if (document.getElementById('e3-jsonld')) return;
    var path = location.pathname.replace(/\/+$/, '').toLowerCase();
    var m = path.match(/^\/locations\/([a-z0-9-]+)$/);
    if (!m) return;
    var slug = m[1];
    var data = LOC[slug];
    if (!data) return;

    // Read description from <meta name="description">
    var metaDesc = document.querySelector('meta[name="description"]');
    var description = metaDesc ? metaDesc.getAttribute('content') : 'Climate-controlled vehicle storage, 24/7 access, DIY bays, and a clubhouse for motoring enthusiasts.';

    var ld = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'SelfStorage'],
      '@id': 'https://e3storage.com/locations/' + slug,
      name: data.name,
      url: location.origin + '/locations/' + slug,
      description: description,
      image: 'https://e3-demo.webflow.io' + location.pathname + '#hero',
      telephone: data.phone || undefined,
      openingHours: 'Mo-Su 00:00-23:59',
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      }],
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city,
        addressRegion: data.state,
        postalCode: data.zip || undefined,
        addressCountry: 'US'
      },
      geo: data.lat && data.lng ? {
        '@type': 'GeoCoordinates',
        latitude: data.lat,
        longitude: data.lng
      } : undefined,
      areaServed: {
        '@type': 'City',
        name: data.city,
        containedInPlace: { '@type': 'State', name: data.state }
      },
      parentOrganization: {
        '@type': 'Organization',
        name: 'e3storage',
        url: 'https://e3storage.com',
        logo: 'https://e3-demo.webflow.io/og-default.png',
        sameAs: ['https://www.facebook.com/e3storage', 'https://www.instagram.com/e3storage']
      },
      knowsAbout: ['Climate-controlled vehicle storage', 'Classic car storage', 'RV storage', 'Boat storage', 'Track day storage', 'DIY automotive bays'],
      priceRange: '$$$'
    };

    // Strip undefined keys (some validators reject null/undefined)
    function clean(obj) {
      if (Array.isArray(obj)) return obj.map(clean).filter(function (x) { return x !== undefined && x !== null; });
      if (obj && typeof obj === 'object') {
        var out = {};
        Object.keys(obj).forEach(function (k) {
          var v = clean(obj[k]);
          if (v !== undefined && v !== null && v !== '') out[k] = v;
        });
        return out;
      }
      return obj;
    }

    var script = document.createElement('script');
    script.id = 'e3-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(clean(ld));
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

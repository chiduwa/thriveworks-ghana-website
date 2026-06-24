/* ── ThriveWorks Ghana — Cookie Consent Banner logic ────────────── */
(function () {
  var STORAGE_KEY = 'twg_cookie_consent';
  var CONSENT_VERSION = '1';

  function getStoredConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function storeConsent(granted) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        granted: granted,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {}
  }

  function applyConsent(granted) {
    var state = granted ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  function hideBanner() {
    var el = document.getElementById('cookie-consent-banner');
    if (el) el.remove();
  }

  function showBanner() {
    hideBanner();
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p class="cc-text">We use cookies to understand how visitors use this site and to support our outreach. ' +
      'You can accept or reject non-essential cookies — your choice won’t affect your ability to use the site.</p>' +
      '<div class="cc-actions">' +
        '<button type="button" class="cc-btn cc-btn-reject" id="cc-reject">Reject</button>' +
        '<button type="button" class="cc-btn cc-btn-accept" id="cc-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cc-accept').addEventListener('click', function () {
      applyConsent(true);
      storeConsent(true);
      hideBanner();
    });
    document.getElementById('cc-reject').addEventListener('click', function () {
      applyConsent(false);
      storeConsent(false);
      hideBanner();
    });
  }

  function init() {
    var stored = getStoredConsent();
    if (stored) {
      applyConsent(stored.granted);
      return;
    }
    showBanner();
  }

  window.reopenCookieBanner = showBanner;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

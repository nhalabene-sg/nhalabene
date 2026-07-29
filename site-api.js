/**
 * Nhalabene Site Web — client API (Apps Script + Sheets)
 *
 * L’URL API se configure dans : assets/config.js
 *   → window.NH_CONFIG.API_URL = 'https://script.google.com/macros/s/.../exec'
 */
(function (global) {
  'use strict';

  // URL API : collée en haut de index.html → window.NH_CONFIG.API_URL
  var API_URL = (global.NH_CONFIG && global.NH_CONFIG.API_URL) || '';
  if (!API_URL || API_URL.indexOf('COLLER_URL') !== -1) {
    API_URL = '';
  }

  var STORAGE_SID = 'nhalabene-sid';
  var STORAGE_HIT = 'nhalabene-hit-at';

  function apiConfigured() {
    return !!(API_URL && API_URL.indexOf('http') === 0);
  }

  function sessionId() {
    try {
      var sid = localStorage.getItem(STORAGE_SID);
      if (sid) return sid;
      sid = 'S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(STORAGE_SID, sid);
      return sid;
    } catch (e) {
      return 'S' + Date.now().toString(36);
    }
  }

  function utm() {
    var q = {};
    try {
      var sp = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
        if (sp.get(k)) q[k] = sp.get(k);
      });
    } catch (e) {}
    return q;
  }

  function basePayload() {
    var u = utm();
    return {
      sessionId: sessionId(),
      lang: (global.NH && global.NH.lang) || document.documentElement.lang || 'pt',
      page: location.pathname + location.hash,
      path: location.href,
      referrer: document.referrer || '',
      ua: navigator.userAgent || '',
      screen: (screen.width || 0) + 'x' + (screen.height || 0),
      tz: (Intl.DateTimeFormat().resolvedOptions().timeZone) || '',
      utm_source: u.utm_source || '',
      utm_medium: u.utm_medium || '',
      utm_campaign: u.utm_campaign || ''
    };
  }

  function jsonp(action, data) {
    return new Promise(function (resolve, reject) {
      if (!apiConfigured()) {
        reject(new Error('API non configurée'));
        return;
      }
      var cb = '_nhCb' + Date.now() + Math.floor(Math.random() * 1e5);
      var params = Object.assign({ action: action, callback: cb }, data || {});
      var qs = Object.keys(params).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k] == null ? '' : params[k]);
      }).join('&');
      var script = document.createElement('script');
      var timer = setTimeout(function () {
        cleanup();
        reject(new Error('Timeout API'));
      }, 20000);
      function cleanup() {
        clearTimeout(timer);
        try { delete global[cb]; } catch (e) { global[cb] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }
      global[cb] = function (res) {
        cleanup();
        resolve(res);
      };
      script.onerror = function () {
        cleanup();
        reject(new Error('Erreur réseau API'));
      };
      script.src = API_URL + (API_URL.indexOf('?') >= 0 ? '&' : '?') + qs;
      document.head.appendChild(script);
    });
  }

  function track(extra) {
    var payload = Object.assign(basePayload(), { type: 'pageview' }, extra || {});
    try {
      var last = Number(sessionStorage.getItem(STORAGE_HIT) || 0);
      if (Date.now() - last < 2000 && !(extra && extra.force)) {
        return Promise.resolve({ success: true, skipped: true });
      }
      sessionStorage.setItem(STORAGE_HIT, String(Date.now()));
    } catch (e) {}
    if (!apiConfigured()) return Promise.resolve({ success: false, skipped: true });
    return jsonp('track', payload).catch(function (err) {
      console.warn('[Nhalabene analytics]', err.message);
      return { success: false, error: err.message };
    });
  }

  function event(name, label, value, extra) {
    if (!apiConfigured()) return Promise.resolve({ success: false, skipped: true });
    var payload = Object.assign(basePayload(), {
      event: name,
      label: label || '',
      value: value == null ? '' : String(value)
    }, extra || {});
    return jsonp('event', payload).catch(function (err) {
      console.warn('[Nhalabene event]', err.message);
      return { success: false, error: err.message };
    });
  }

  function sendContact(fields) {
    if (!apiConfigured()) {
      return Promise.reject(new Error('API_NOT_CONFIGURED'));
    }
    var payload = Object.assign(basePayload(), {
      action: 'contact',
      name: fields.name,
      hotel: fields.hotel,
      email: fields.email,
      phone: fields.phone || '',
      subject: fields.subject || '',
      subjectLabel: fields.subjectLabel || '',
      message: fields.message,
      consent: fields.consent ? '1' : '0',
      website: fields.honeypot || '',
      source: 'site-web-form'
    });

    return new Promise(function (resolve, reject) {
      var iframe = document.createElement('iframe');
      iframe.name = 'nh_post_' + Date.now();
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      var form = document.createElement('form');
      form.method = 'POST';
      form.action = API_URL;
      form.target = iframe.name;
      form.style.display = 'none';

      Object.keys(payload).forEach(function (k) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = payload[k] == null ? '' : String(payload[k]);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      var done = false;
      function finish(ok, data) {
        if (done) return;
        done = true;
        setTimeout(function () {
          try { document.body.removeChild(form); } catch (e) {}
          try { document.body.removeChild(iframe); } catch (e) {}
        }, 800);
        if (ok) resolve(data || { success: true });
        else reject(data || new Error('POST failed'));
      }

      iframe.onload = function () {
        finish(true, { success: true, via: 'post' });
      };
      iframe.onerror = function () {
        jsonp('contact', payload).then(function (r) {
          finish(!!(r && r.success), r || { success: false });
        }).catch(function (err) {
          finish(false, err);
        });
      };

      try {
        form.submit();
        setTimeout(function () {
          if (done) return;
          jsonp('contact', payload).then(function (r) {
            finish(!!(r && r.success), r);
          }).catch(function () {
            finish(true, { success: true, via: 'post-timeout-ok' });
          });
        }, 2500);
      } catch (err) {
        jsonp('contact', payload).then(resolve).catch(reject);
      }
    });
  }

  function bindCtaTracking() {
    document.querySelectorAll('a[href="#contact"]').forEach(function (a) {
      a.addEventListener('click', function () {
        var isDemo = (a.getAttribute('data-i18n') || '').indexOf('cta1') >= 0 ||
          /demo|demonstr/i.test(a.textContent || '');
        event(isDemo ? 'cta_demo' : 'cta_contact', a.textContent || '', location.hash);
      });
    });
    document.querySelectorAll('a[href="#applications"]').forEach(function (a) {
      a.addEventListener('click', function () {
        event('cta_apps', a.textContent || '', '#applications');
      });
    });
  }

  function observeSections() {
    var seen = {};
    var ids = ['offre', 'applications', 'marketing', 'demarche', 'contact', 'pour-qui', 'faq', 'preuve'];
    if (!('IntersectionObserver' in global)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        if (!id || seen[id]) return;
        seen[id] = true;
        event('section_view', id, id, { section: id, page: '/#' + id });
      });
    }, { threshold: 0.35 });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  function onLangChange(newLang) {
    event('lang_change', newLang, newLang);
  }

  function heartbeat() {
    var start = Date.now();
    global.addEventListener('beforeunload', function () {
      var sec = Math.round((Date.now() - start) / 1000);
      if (sec < 3 || !apiConfigured()) return;
      try {
        var p = basePayload();
        p.action = 'track';
        p.type = 'exit';
        p.duration = sec;
        p.callback = 'nhExit';
        var qs = Object.keys(p).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(p[k] == null ? '' : p[k]);
        }).join('&');
        var img = new Image();
        img.src = API_URL + (API_URL.indexOf('?') >= 0 ? '&' : '?') + qs;
      } catch (e) {}
    });
  }

  global.NH_API = {
    URL: API_URL,
    configured: apiConfigured,
    sessionId: sessionId,
    track: track,
    event: event,
    sendContact: sendContact,
    onLangChange: onLangChange,
    init: function () {
      global.NH = global.NH || {};
      track({ force: true });
      bindCtaTracking();
      observeSections();
      heartbeat();
    }
  };
})(window);

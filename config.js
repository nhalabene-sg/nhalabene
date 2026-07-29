/**
 * Config complémentaire (email, WhatsApp…).
 * L’URL API se colle en haut de index.html :
 *   window.NH_CONFIG.API_URL = 'https://script.google.com/macros/s/XXXX/exec';
 *
 * Vous pouvez aussi la coller ici à la place (même effet) :
 */
window.NH_CONFIG = window.NH_CONFIG || {};

// Si vous préférez coller l’URL ici plutôt que dans index.html :
// window.NH_CONFIG.API_URL = 'https://script.google.com/macros/s/XXXX/exec';

if (!window.NH_CONFIG.API_URL) {
  window.NH_CONFIG.API_URL = '';
}

window.NH_CONFIG.SITE_NAME = window.NH_CONFIG.SITE_NAME || 'Nhalabene';
window.NH_CONFIG.CONTACT_EMAIL = window.NH_CONFIG.CONTACT_EMAIL || 'nhalabene@gmail.com';
window.NH_CONFIG.WHATSAPP = window.NH_CONFIG.WHATSAPP || '351920433761';

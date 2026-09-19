import { commerceConfig } from './config';

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];

  if (commerceConfig.metaPixelId) {
    const f = window.fbq = window.fbq || function(){ f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
    if (!window._fbq) window._fbq = f;
    f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
    const script = document.createElement('script');
    script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
    window.fbq('init', commerceConfig.metaPixelId);
    window.fbq('track', 'PageView');
  }

  if (commerceConfig.ga4Id) {
    const script = document.createElement('script');
    script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${commerceConfig.ga4Id}`;
    document.head.appendChild(script);
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', commerceConfig.ga4Id);
  }
}

export function trackEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });

  if (typeof window.gtag === 'function') window.gtag('event', name, payload);
  if (typeof window.fbq === 'function') {
    const metaMap = { view_product: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'Purchase' };
    const metaEvent = metaMap[name];
    if (metaEvent) window.fbq('track', metaEvent, payload);
  }
}

export function moneyToNumber(value) {
  if (typeof value === 'number') return value;
  const digits = String(value || '').replace(/[^0-9]/g, '');
  return Number(digits || 0);
}

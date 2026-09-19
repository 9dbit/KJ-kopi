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

function normalizeTikTokPayload(payload = {}) {
  const contentIds = Array.isArray(payload.content_ids) ? payload.content_ids.map(String) : [];
  const quantity = Number(payload.quantity || 1);
  const unitPrice = Number(payload.price ?? (quantity > 0 ? Number(payload.value || 0) / quantity : payload.value) ?? 0);
  const contents = Array.isArray(payload.contents)
    ? payload.contents.map((item) => ({
        content_id: String(item.content_id || item.id || ''),
        content_type: item.content_type || 'product',
        content_name: item.content_name,
        quantity: Number(item.quantity || 1),
        price: Number(item.price ?? item.item_price ?? 0),
      })).filter((item) => item.content_id)
    : contentIds.map((id) => ({
        content_id: id,
        content_type: payload.content_type || 'product',
        content_name: payload.content_name,
        quantity,
        price: unitPrice,
      }));

  return {
    contents,
    content_type: payload.content_type || 'product',
    content_name: payload.content_name,
    value: Number(payload.value || 0),
    currency: payload.currency || 'IDR',
  };
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

  if (window.ttq && typeof window.ttq.track === 'function') {
    const tiktokMap = { view_product: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'Purchase' };
    const tiktokEvent = tiktokMap[name];
    if (tiktokEvent) window.ttq.track(tiktokEvent, normalizeTikTokPayload(payload));
  }
}

export function moneyToNumber(value) {
  if (typeof value === 'number') return value;
  const digits = String(value || '').replace(/[^0-9]/g, '');
  return Number(digits || 0);
}

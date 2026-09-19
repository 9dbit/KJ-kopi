export function trackEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });

  if (typeof window.fbq === 'function') {
    const metaMap = {
      view_product: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
    };
    const metaEvent = metaMap[name];
    if (metaEvent) window.fbq('track', metaEvent, payload);
  }
}

export function moneyToNumber(value) {
  if (typeof value === 'number') return value;
  const digits = String(value || '').replace(/[^0-9]/g, '');
  return Number(digits || 0);
}

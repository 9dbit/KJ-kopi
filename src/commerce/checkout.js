import { commerceConfig } from './config';

export function buildCheckoutUrl(cart = []) {
  if (!commerceConfig.checkoutUrl) return '';
  const payload = cart.map((item) => ({
    id: item.id,
    sku: item.sku || '',
    quantity: item.qty,
  }));
  const url = new URL(commerceConfig.checkoutUrl);
  url.searchParams.set('kj_cart', btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
  return url.toString();
}

export function goToCheckout(cart) {
  const url = buildCheckoutUrl(cart);
  if (!url) return false;
  window.location.assign(url);
  return true;
}

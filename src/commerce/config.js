export const commerceConfig = {
  storeUrl: (import.meta.env.VITE_WC_STORE_URL || '').replace(/\/$/, ''),
  checkoutUrl: (import.meta.env.VITE_WC_CHECKOUT_URL || '').replace(/\/$/, ''),
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  ga4Id: import.meta.env.VITE_GA4_ID || '',
};

export function hasLiveCommerce() {
  return Boolean(commerceConfig.storeUrl && commerceConfig.checkoutUrl);
}

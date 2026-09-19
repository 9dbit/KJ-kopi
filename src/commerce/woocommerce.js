const FALLBACK_PRODUCTS = [
  { id: 'original', name: 'Jago Original', note: 'Kopi ginseng signature', weight: '10 sachet', price: 'Rp89.000', priceValue: 89000 },
  { id: 'strong', name: 'Jago Strong', note: 'Roast lebih bold', weight: '10 sachet', price: 'Rp99.000', priceValue: 99000 },
  { id: 'reserve', name: 'Jago Reserve', note: 'Blend premium pilihan', weight: '10 sachet', price: 'Rp119.000', priceValue: 119000 },
];

const storeUrl = (import.meta.env.VITE_WC_STORE_URL || '').replace(/\/$/, '');

export async function getProducts() {
  if (!storeUrl) return FALLBACK_PRODUCTS;
  try {
    const response = await fetch(`${storeUrl}/wp-json/wc/store/v1/products?per_page=12`);
    if (!response.ok) throw new Error(`WooCommerce responded ${response.status}`);
    const data = await response.json();
    return data.map((product) => ({
      id: product.id,
      name: product.name,
      note: product.short_description?.replace(/<[^>]+>/g, '').trim() || 'Kopi Kang Jago',
      weight: product.attributes?.find((a) => /berat|weight/i.test(a.name))?.terms?.[0]?.name || 'Ready stock',
      price: product.prices?.price
        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: product.prices.currency_code || 'IDR', maximumFractionDigits: 0 }).format(Number(product.prices.price) / 10 ** Number(product.prices.currency_minor_unit || 0))
        : 'Lihat harga',
      permalink: product.permalink,
      image: product.images?.[0]?.src,
    }));
  } catch (error) {
    console.warn('WooCommerce Store API unavailable, using local catalog.', error);
    return FALLBACK_PRODUCTS;
  }
}

export { FALLBACK_PRODUCTS };

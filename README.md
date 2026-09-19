# Kopi Kang Jago

Premium company profile + headless-commerce storefront foundation for Kopi Kang Jago.

## Stack
- React + Vite frontend
- Railway deployment
- WooCommerce-ready commerce integration
- Meta Catalog sync through Meta for WooCommerce on the WordPress/WooCommerce side

## Local
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
npm start
```

## Planned commerce architecture
1. WordPress + WooCommerce manages products, pricing, inventory, promotions, orders, and product content.
2. This frontend reads published catalog data from WooCommerce Store API / REST API.
3. Meta for WooCommerce syncs the WooCommerce product catalog with Meta Commerce Manager.
4. Checkout can begin as WooCommerce-hosted checkout, then evolve to a deeper headless checkout once payment, shipping, tax, and customer flows are finalized.

## Product-claim note
Health/performance claims are intentionally conservative in this frontend. Final public claims should follow the actual formulation, supporting evidence, label approval, BPOM requirements, and advertising-platform policies.

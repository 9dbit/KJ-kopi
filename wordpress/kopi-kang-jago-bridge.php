<?php
/**
 * Plugin Name: Kopi Kang Jago Commerce Bridge
 * Description: Receives a cart payload from the Railway storefront, hydrates the WooCommerce cart, and completes commerce pixel attribution.
 * Version: 0.2.0
 */

if (!defined('ABSPATH')) exit;

define('KJ_TIKTOK_PIXEL_ID', 'DAN763RC77U1ARFV6VR0');

add_action('template_redirect', function () {
    if (!function_exists('WC') || !is_checkout() || empty($_GET['kj_cart'])) return;

    $raw = sanitize_text_field(wp_unslash($_GET['kj_cart']));
    $decoded = base64_decode($raw, true);
    if ($decoded === false) return;

    $items = json_decode($decoded, true);
    if (!is_array($items) || count($items) > 20) return;

    $validated = [];
    foreach ($items as $item) {
        $product_id = isset($item['id']) ? absint($item['id']) : 0;
        $quantity = isset($item['quantity']) ? max(1, min(20, absint($item['quantity']))) : 1;
        if (!$product_id) continue;

        $product = wc_get_product($product_id);
        if (!$product || !$product->is_purchasable() || !$product->is_in_stock()) continue;
        $validated[] = [$product_id, $quantity];
    }

    if (!$validated) return;

    WC()->cart->empty_cart();
    foreach ($validated as [$product_id, $quantity]) {
        WC()->cart->add_to_cart($product_id, $quantity);
    }

    wp_safe_redirect(wc_get_checkout_url());
    exit;
});

// Load the same TikTok Pixel on WooCommerce checkout/order-received pages so the
// final Purchase event is attributed after the customer leaves the Railway SPA.
add_action('wp_head', function () {
    if (!function_exists('is_checkout') || !is_checkout()) return;
    ?>
    <!-- TikTok Pixel Code Start: Kopi Kang Jago -->
    <script>
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
      ttq.load('<?php echo esc_js(KJ_TIKTOK_PIXEL_ID); ?>');
      ttq.page();
    }(window, document, 'ttq');
    </script>
    <!-- TikTok Pixel Code End: Kopi Kang Jago -->
    <?php
}, 5);

add_action('woocommerce_thankyou', function ($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    if (!$order) return;

    $contents = [];
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        if (!$product) continue;
        $content_id = $product->get_sku() ?: (string) $product->get_id();
        $qty = max(1, (int) $item->get_quantity());
        $line_total = (float) $item->get_total();
        $contents[] = [
            'content_id' => (string) $content_id,
            'content_type' => 'product',
            'content_name' => $item->get_name(),
            'quantity' => $qty,
            'price' => $qty > 0 ? $line_total / $qty : $line_total,
        ];
    }

    $payload = [
        'contents' => $contents,
        'content_type' => 'product',
        'value' => (float) $order->get_total(),
        'currency' => $order->get_currency(),
    ];
    ?>
    <script>
    (function () {
      var orderId = <?php echo wp_json_encode((string) $order_id); ?>;
      var key = 'kj_tiktok_purchase_' + orderId;
      try {
        if (window.localStorage && localStorage.getItem(key)) return;
      } catch (e) {}

      var payload = <?php echo wp_json_encode($payload); ?>;
      var fire = function () {
        if (window.ttq && typeof window.ttq.track === 'function') {
          window.ttq.track('Purchase', payload);
          try { if (window.localStorage) localStorage.setItem(key, '1'); } catch (e) {}
          return true;
        }
        return false;
      };

      if (!fire()) {
        var attempts = 0;
        var timer = setInterval(function () {
          attempts += 1;
          if (fire() || attempts >= 20) clearInterval(timer);
        }, 250);
      }
    })();
    </script>
    <?php
}, 20);

<?php
/**
 * Plugin Name: Kopi Kang Jago Commerce Bridge
 * Description: Receives a cart payload from the Railway storefront and hydrates the WooCommerce cart before checkout.
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) exit;

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

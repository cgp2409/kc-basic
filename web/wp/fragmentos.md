# Fragmentos de código activos en WordPress (plugin Code Snippets)

## #7 · Wompi: mostrar el nombre en el checkout
El plugin Wompi (`build/checkout.js`) lee su título de `my_custom_gateway_data`, que nunca se registra, y la opción salía en blanco en el checkout de bloques.

```php
add_action('woocommerce_blocks_checkout_enqueue_data', function () {
    if (!class_exists('\\Automattic\\WooCommerce\\Blocks\\Package')) { return; }
    $registry = \Automattic\WooCommerce\Blocks\Package::container()->get(\Automattic\WooCommerce\Blocks\Assets\AssetDataRegistry::class);
    if (!$registry->exists('my_custom_gateway_data')) {
        $registry->add('my_custom_gateway_data', array(
            'title'    => 'Tarjeta, PSE, Bancolombia o Nequi',
            'supports' => array('products'),
        ));
    }
});
```

## #8 · Pagos: cada pasarela solo en su moneda
PayPal no acepta COP (error `CURRENCY_NOT_SUPPORTED`); Wompi solo cobra en COP.

```php
add_filter('woocommerce_available_payment_gateways', function ($gateways) {
    if (is_admin() && !wp_doing_ajax() && !(defined('REST_REQUEST') && REST_REQUEST)) { return $gateways; }
    $currency = get_woocommerce_currency();
    foreach (array_keys($gateways) as $id) {
        $es_paypal = strpos($id, 'ppcp') === 0;
        if ($currency === 'COP' && $es_paypal) { unset($gateways[$id]); }
        if ($currency !== 'COP' && $id === 'wompi') { unset($gateways[$id]); }
    }
    return $gateways;
}, 100);
```

## Ajustes relacionados (no son código)
- PayPal Payments → Styling: botones desactivados en Carrito, Express Checkout, Minicarrito y Página de producto.
- Orden de pagos: Wompi primero.
- Correos: remitente `pedidos@kcdigitalmagic.com`; aviso de "Nuevo pedido" a cgp2409@gmail.com.

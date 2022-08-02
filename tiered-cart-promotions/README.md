1. [About Voucherify Example](#voucherify-example)
2. [Demo](#demo)
3. [Get support](#support)


# Tiered cart promotions with Voucherify <a id="voucherify-example"></a>

This sample shows how we can reward our customers by adding rewards for more money spent. We can achieve that solution thanks [validate promotion](https://docs.voucherify.io/reference/validate-promotions-1) endpoint. At the end we should use [redeem stackable](https://docs.voucherify.io/reference/redeem-stacked-discounts) endpoint like in the other examples. The stacking mechanism allows you to combine up to 5 promo codes or cart-level promotions with a single request.

Validating and accepting promo codes in your checkout from scratch might be tricky — calculating discounted prices, error message handling, and localization are just a few things to think about when building a simple promo code redemption flow.

This is where the [Voucherify promotion engine](https://docs.voucherify.io/docs) kicks in. Together with our [Promo UI Kit](https://www.figma.com/community/file/1100356622702326488) you can quickly build the best promotion experience for your customers.

This example introduce an online coffee shop and many vouchers in your dashboard are about it.

## Demo <a id="demo"></a>

Live demo on:<br>
[<img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/heroku_logo_icon_169035.png" width="100px"/>](https://voucherify-examples.herokuapp.com/tiered-cart-promotions/)

![](https://github.com/voucherify-samples/voucher-code-redemption/blob/main/free_shipping.gif)

The demo is running with a [Sandbox project](https://docs.voucherify.io/docs/testing). Sandbox comes with test campaign "Reward promotion" you can apply in your example or you can add your own [reward campaign](https://support.voucherify.io/article/519-create-cart-level-promotions).

```In this example applying coupons is not possible.```

This sample calls two endpoints:

* [Validate promotion](https://docs.voucherify.io/reference/validate-promotions-1) - check if any [promotion tier](https://docs.voucherify.io/docs/promotion-tier) exists.
* [Redeem rewards](https://docs.voucherify.io/reference/redeem-voucher) — runs validation and then marks the rewards as used. After clicking the redemption button you should see the message "Rewards redeemed" - that means your redemption process was successfull.

## Get support <a id="support"></a>

If you found a bug or want to suggest a new sample, please file an issue.

If you have questions, comments, or need help with code, we’re here to help:
* on [Slack](https://www.voucherify.io/community)
* by [email](https://www.voucherify.io/contact-support)

For more tutorials and full API reference, visit our [Developer Hub](https://docs.voucherify.io).

## Authors
[@patricioo1](https://github.com/patricioo1)

1. [About Voucherify Example](#voucherify-example)
2. [Demo](#demo)
3. [Get support](#support)


# Tiered cart promotions with Voucherify <a id="voucherify-example"></a>

This sample shows how to reward customers by adding rewards for more money spent. We can achieve that solution thanks to [Validate-Promotion-Tier](https://docs.voucherify.io/reference/validate-promotions-1) and [Redeem-Promotion endpoints](https://docs.voucherify.io/reference/redeem-stacked-discounts).

Validating and accepting promo codes in your checkout from scratch might be tricky — calculating discounted prices, error message handling, and localization are just a few things to think about when building a simple promo code redemption flow.

This is where the [Voucherify promotion engine](https://docs.voucherify.io/docs) kicks in. Together with our [Promo UI Kit](https://www.figma.com/community/file/1100356622702326488) you can quickly build the best promotion experience for your customers.

This example is built on top of an online coffee shop with many voucher codes and campaigns available.

## Demo <a id="demo"></a>

Live demo on:<br>
[<img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/heroku_logo_icon_169035.png" width="100px"/>](https://voucherify-examples.herokuapp.com/tiered-cart-promotions/)<br>
[<img src="https://user-images.githubusercontent.com/77458595/182553794-59bf31fe-91b9-4ebe-b468-d466b0bb73b2.svg" width="100px" />](https://replit.com/@Voucherify/Voucherify-Examples?v=1#README.md)
![](https://github.com/voucherify-samples/voucher-code-redemption/blob/main/free_shipping.gif)

The demo is running with a [Sandbox project](https://docs.voucherify.io/docs/testing). Sandbox comes with test a campaign "Rewards promotion" - ```will be added soon with the creation of an account on Voucherify``` which you will be able to use in your example. At this moment you can add your own [reward campaign](https://support.voucherify.io/article/519-create-cart-level-promotions). If you want your campaign to work with this example you have to give the same campaign name and properties of promotion tiers like below.

<img width="1189" alt="Screenshot 2022-08-03 at 14 52 39" src="https://user-images.githubusercontent.com/77458595/182775604-db10d656-f9f8-410f-ad74-6aa746ba4727.png">

```In this example applying coupons is not possible.```

This sample calls two endpoints:

* [Validate promotion](https://docs.voucherify.io/reference/validate-promotions-1) - check if any [promotion tier](https://docs.voucherify.io/docs/promotion-tier) exists.
* [Redeem rewards](https://docs.voucherify.io/reference/redeem-stacked-discounts) — runs validation and then marks the rewards as used. After clicking the redemption button you should see the message "Rewards redeemed" - that means your redemption process was successful.

## Get support <a id="support"></a>

If you found a bug or want to suggest a new sample, please file an issue.

If you have questions, comments, or need help with code, we’re here to help:
* on [Slack](https://www.voucherify.io/community)
* by [email](https://www.voucherify.io/contact-support)

For more tutorials and full API reference, visit our [Developer Hub](https://docs.voucherify.io).

## Authors
[@patricioo1](https://github.com/patricioo1)

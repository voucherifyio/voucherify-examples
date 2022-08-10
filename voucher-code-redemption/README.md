1. [About Voucherify Example](#voucherify-example)
3. [Demo](#demo)
6. [Get support](#support)


# Redeem promo codes with Voucherify <a id="voucherify-example"></a>


This sample shows how to integrate with the [Redeem-Voucher endpoint](https://docs.voucherify.io/reference/redeem-voucher). Validating and accepting promo codes at checkout might be tricky — calculating order total, error message handling, and localization are just a few things to think about when building a simple promo code redemption flow.

This is where the [Voucherify promotion engine](https://docs.voucherify.io/docs) kicks in. Together with our [Promo UI Kit](https://www.figma.com/community/file/1100356622702326488) you can quickly build the best promotion experience for your customers.

This example is built on top of an online coffee shop with many voucher codes and campaigns available.

## Demo <a id="demo"></a>

Live demo on:<br>
[<img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/heroku_logo_icon_169035.png" width="100px"/>](https://voucherify-examples.herokuapp.com/voucher-code-redemption/)<br>
[<img src="https://user-images.githubusercontent.com/77458595/182553794-59bf31fe-91b9-4ebe-b468-d466b0bb73b2.svg" width="100px" />](https://replit.com/@Voucherify/Voucherify-Examples?v=1#README.md)

![](https://j.gifs.com/A6xMgp.gif)

The demo is running with a [Sandbox project](https://docs.voucherify.io/docs/testing). Sandbox comes with several test vouchers you can apply in the checkout, e.g.:

``FREE-SHIPPING`` - You find it in your [Vouchers](https://docs.voucherify.io/docs/vouchers-1) dashboard but if there is not Free Shipping Voucher you have to create code with free shipping on [Sandbox](https://docs.voucherify.io/docs/free-shipping-discount)

``BLCKFRDY`` ``50%OFF`` and many other vouchers you find in your [Sandbox](https://docs.voucherify.io/docs/free-shipping-discount) > Vouchers.

Some codes have [validation rules](https://docs.voucherify.io/docs/validation-rules) or different [discount effects](https://docs.voucherify.io/docs/discount-effects) so do not use them or you will not be charged a discount.

The promo code box accepts Amount and Percentage [discount types](https://docs.voucherify.io/docs/vouchers-1#discount-coupons), more coming soon. 

This sample calls two endpoints:

* [Validate voucher code](https://docs.voucherify.io/reference/validate-voucher) — checks the code against [validation rules](https://docs.voucherify.io/docs/validation-rules) and returns calculated discounts.
* [Redeem voucher code](https://docs.voucherify.io/reference/redeem-voucher) — runs validation and then marks the voucher as used. After click redemption button you should see message "Voucher redemeed" - that means your redemption process was successfull.

## Get support <a id="support"></a>

If you found a bug or want to suggest a new sample, please file an issue.

If you have questions, comments, or need help with code, we’re here to help:
* on [Slack](https://www.voucherify.io/community)
* by [email](https://www.voucherify.io/contact-support)

For more tutorials and full API reference, visit our [Developer Hub](https://docs.voucherify.io).

## Authors
[@patricioo1](https://github.com/patricioo1)

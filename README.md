* [About Voucherify](#about)
* [Voucherify Examples](#voucherify-examples)
* [Quickstart](#quickstart)
* [How to run Voucherify samples locally?](#voucherify-locally)
* [Get support](#support)

# Welcome to Voucherify! <a id="about"></a>

Voucherify is an API-centric promotion engine for digital teams. It empowers marketers to quickly launch and efficiently manage promotions personalized with customer and session data, including coupons, gift cards, in-cart promotions, giveaways, referral, and loyalty programs.

## Voucherify Examples <a id="voucherify-examples"></a>
Voucherify Examples are examples of integration and use of the Voucherify product.<br>

``These samples are built with Node.js and our`` [JS SDK](https://github.com/voucherifyio/voucherify-js-sdk) ``on the server side and HTML + Vanilla JavaScript on the front (with React version coming soon).``

* [Voucher code redemption](https://github.com/voucherify-samples/voucherify-examples/tree/main/voucher-code-redemption)
* [Stacking promotions](https://github.com/voucherify-samples/voucherify-examples/tree/main/stacking-promotions)
* [Tiered cart promotions](https://github.com/voucherifyio/voucherify-examples/tree/main/tiered-cart-promotions)

Check out all our examples in one place!

[<img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/heroku_logo_icon_169035.png" width="100px"/>](https://voucherify-examples.herokuapp.com/)<br>
[<img src="https://user-images.githubusercontent.com/77458595/182553794-59bf31fe-91b9-4ebe-b468-d466b0bb73b2.svg" width="100px" />](https://replit.com/@Voucherify/Voucherify-Examples?v=1#README.md)

## Quickstart <a id="quickstart"></a>
Before you run these examples locally, let's check how to start with Voucherify API and dashboard by redeeming your first coupon code by going to [Quickstart](https://docs.voucherify.io/docs/quickstart). This information will help you understand basic Voucherify concepts.

## How to run Voucherify samples locally? <a id="voucherify-locally"></a>

Follow the steps below to run locally.

1. Clone repository.

```
git clone https://github.com/voucherifyio/voucherify-examples.git
```
2. Create your [Voucherify account](http://app.voucherify.io/#/signup) (free tier, no credit card required).

3. Go to the Sandbox project’s settings and get your Application ID and Secret Key, see [Authentication](https://docs.voucherify.io/docs/authentication).

4. Rename .env.example to .env and paste your API keys:
```
VOUCHERIFY_APP_ID=<replace-with-your-application-id>
VOUCHERIFY_SECRET_KEY=<replace-with-your-secret-key>
```
5. Install dependencies.
```
npm install / yarn install
```
6. Start the Node server by entering one of the commands in the terminal.
```
npm run start / npm run dev || yarn start / yarn run dev 
```
7. Go to [http://localhost:3000](http://localhost:3000/) in your browser.

## Get support <a id="support"></a>

If you found a bug or want to suggest a new sample, please file an issue.

If you have questions, comments, or need help with code, we’re here to help:
* on [Slack](https://www.voucherify.io/community)
* by [email](https://www.voucherify.io/contact-support)

For more tutorials and full API reference, visit our [Developer Hub](https://docs.voucherify.io).

## Authors
[@patryksmolarz]([https://github.com/patricioo1](https://github.com/patryksmolarz))

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

## Creating a "Reward Promotion" campaign<a id="creating-campaign"></a>

The application should automatically add the missing campaign "Reward Promotion", but if there is an error, you can add it manually.

### First of all, it is required to add missing ```validation_rules```:
- Change X-App-Id to your Application ID.
- Change X-App-Token to your Secret Key.
- Keep the returned validation_rule id after executing each request. It will be required for the main request.

```
curl --location --request POST 'https://api.voucherify.io/v1/validation-rules' \
--header 'X-App-Id: xxx' \
--header 'X-App-Token: xxx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "id": null,
  "name": "Business Validation Rule - Reward Promotion Tier 1",
  "rules": {
    "1": {
      "name": "order.amount",
      "property": null,
      "conditions": {
        "$more_than": [
          10000
        ]
      }
    },
    "2": {
      "name": "order.amount",
      "property": null,
      "conditions": {
        "$is": [
          10000
        ]
      }
    },
    "logic": "(1 or 2)"
  },
  "error": null,
  "applicable_to": {
    "included": [],
    "excluded": [],
    "included_all": false
  },
  "type": "advanced",
  "context_type": "campaign.promotion"
}'
```

```
curl --location --request POST 'https://api.voucherify.io/v1/validation-rules' \
--header 'X-App-Id: xxx' \
--header 'X-App-Token: xxx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "id": null,
  "name": "Business Validation Rule - Reward Promotion Tier 2",
  "rules": {
    "1": {
      "name": "order.amount",
      "property": null,
      "conditions": {
        "$more_than": [
          25000
        ]
      }
    },
    "2": {
      "name": "order.amount",
      "property": null,
      "conditions": {
        "$is": [
          25000
        ]
      }
    },
    "logic": "(1 or 2)"
  },
  "error": null,
  "applicable_to": {
    "included": [],
    "excluded": [],
    "included_all": false
  },
  "type": "advanced",
  "context_type": "campaign.promotion.discount.apply_to_order"
}'
```

```
curl --location --request POST 'https://api.voucherify.io/v1/validation-rules' \
--header 'X-App-Id: xxx' \
--header 'X-App-Token: xxx' \
--header 'Content-Type: application/json' \
--data-raw '{
 "id": null,
  "name": "Business Validation Rule - Reward Promotion Tier 3",
  "rules": {
    "1": {
      "name": "order.amount",
      "property": null,
      "conditions": {
        "$more_than": [
          50000
        ]
      }
    },
    "2": {
      "name": "order.amount",
      "property": null,
      "conditions": {
        "$is": [
          50000
        ]
      }
    },
    "logic": "(1 or 2)"
  },
  "error": null,
  "applicable_to": {
    "included": [],
    "excluded": [],
    "included_all": false
  },
  "type": "advanced",
  "context_type": "campaign.promotion.discount.apply_to_order"
}'
```

### Secondly, add the missing ```Reward Promotion``` campaign:
- Change X-App-Id to your Application ID.
- Change X-App-Token to your Secret Key.
- Replace the ```/id/``` in each ```tier``` with previously saved ```id``` of the validation_rules

```
curl --location --request POST 'https://api.voucherify.io/v1/campaigns' \
--header 'X-App-Id: xxx' \
--header 'X-App-Token: xxx' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Reward Promotion",
  "start_date": null,
  "expiration_date": null,
  "campaign_type": "PROMOTION",
  "type": "STATIC",
  "metadata": {},
  "use_voucher_metadata_schema": false,
  "promotion": {
    "tiers": [
      {
        "id": null,
        "name": "Reward Promotion Tier 1",
        "banner": "Add products worth $100+ to get Free Shipping",
        "action": {
          "discount": {
            "type": "UNIT",
            "amount_off": null,
            "unit_off": 1,
            "unit_type": "prod_5h1pp1ng",
            "effect": "ADD_MISSING_ITEMS"
          }
        },
        "metadata": {},
        "hierarchy": 1,
        "__id": "16ee1b96-0baf-4431-84a7-7dd4a7ffd46f",
        "active": true,
        "start_date": null,
        "expiration_date": null,
        "validation_rules": [
          "/id/"
        ]
      },
      {
        "id": null,
        "name": "Reward Promotion Tier 2",
        "banner": "Add products worth $250+ for 3% discount",
        "action": {
          "discount": {
            "type": "PERCENT",
            "amount_off": null,
            "percent_off": 3,
            "effect": "APPLY_TO_ORDER"
          }
        },
        "metadata": {},
        "hierarchy": 2,
        "__id": "d3a1e546-90bc-4549-b5f2-6b6962a53b9f",
        "active": true,
        "start_date": null,
        "expiration_date": null,
        "validation_rules": [
          "/id/"
        ]
      },
      {
        "id": null,
        "name": "Reward Promotion Tier 3",
        "banner": "Add products worth $500+ for 6% discount",
        "action": {
          "discount": {
            "type": "PERCENT",
            "amount_off": null,
            "percent_off": 6,
            "effect": "APPLY_TO_ORDER"
          }
        },
        "metadata": {},
        "hierarchy": 3,
        "__id": "a1b2c70c-3206-4c7d-84b2-614e4c43d07d",
        "active": true,
        "start_date": null,
        "expiration_date": null,
        "validation_rules": [
          "/id/"
        ]
      }
    ]
  }
}'
```

Finally, check if your campaign has been created on your Voucherify account.

## Get support <a id="support"></a>

If you found a bug or want to suggest a new sample, please file an issue.

If you have questions, comments, or need help with code, we’re here to help:
* on [Slack](https://www.voucherify.io/community)
* by [email](https://www.voucherify.io/contact-support)

For more tutorials and full API reference, visit our [Developer Hub](https://docs.voucherify.io).

## Authors
[@patricioo1](https://github.com/patricioo1)

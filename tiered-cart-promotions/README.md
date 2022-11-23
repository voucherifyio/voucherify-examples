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

## A "Reward Promotion" campaign<a id="creating-campaign"></a>
The demo is running with a [Sandbox project](https://docs.voucherify.io/docs/testing). Sandbox comes with test a campaign "Reward promotion" - ```will be added soon with the creation of an account on Voucherify``` which you will be able to use in your example. At this moment the campaign is created automatically when the application starts, by using ```add-missing-campaign.js``` script.

<img width="1189" alt="Screenshot 2022-08-03 at 14 52 39" src="https://user-images.githubusercontent.com/77458595/182775604-db10d656-f9f8-410f-ad74-6aa746ba4727.png">

In case you want to add it manually, instead of using ```-add-missing-campaign.js``` script, below are the steps.

##### First of all, it is required to add missing ```validation_rules```:
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

##### Secondly, add the missing ```Reward Promotion``` campaign:
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

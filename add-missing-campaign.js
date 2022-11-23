export const addMissingCampaign = async (client) => {

    const createRewardPromotionObject = (firstValidationRule, secondValidationRule, thirdValidationRule) => {
        return {
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
                            firstValidationRule ? firstValidationRule : null
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
                            secondValidationRule ? secondValidationRule : null
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
                            thirdValidationRule ? thirdValidationRule : null
                        ]
                    }
                ]
            }
        }
    }

    const firstValidationRule = {
        "id": null,
        "name": "Validation Rule - Reward Promotion Tier 1",
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
    }

    const secondValidationRule = {
        "id": null,
        "name": "Validation Rule - Reward Promotion Tier 2",
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
    }

    const thirdValidationRule = {
        "id": null,
        "name": "Validation Rule - Reward Promotion Tier 3",
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
    }

    const addValidationRulesAndCampaign = async () => {
        const validationRules = await Promise.all([
            client.validationRules.create(firstValidationRule),
            client.validationRules.create(secondValidationRule),
            client.validationRules.create(thirdValidationRule),
        ])
        const rewardPromotion = createRewardPromotionObject(validationRules[0].id, validationRules[1].id, validationRules[2].id);
        const response = await client.campaigns.create(rewardPromotion);
        console.log("The Reward Campaign was successfully created.");
    }
    await addValidationRulesAndCampaign();
}




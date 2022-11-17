import path from "path";
import { fileURLToPath } from "url";
import asyncHandler from "express-async-handler";
import express from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customer = {
    "source_id": "test_customer_id_1"
};

export const addEndpointsTieredCartPromotions = (app, client) => {
    app.use("/tiered-cart-promotions", express.static(path.join(__dirname, "./public")));
    app.use("/images", express.static(path.join(__dirname, "./public/images")));

    app.get("/tiered-cart-promotions/default-items", (req, res) => {
        return res.status(200).send(defaultItems);
    });

    app.post("/tiered-cart-promotions/validate-promotion", asyncHandler(async (req, res) => {
        const products = req.body.items;
        const items = mapInputIntoKnownProducts(products);
        const { promotions } = await client.promotions.validate({ customer: customer, order: { amount: calculateCartTotalAmount(items), items: items } });
        const rewardPromotion = promotions.filter(campaign => campaign.name.startsWith("Reward Promotion"));
        return res.status(200).send(rewardPromotion);
    }));  

    app.post("/tiered-cart-promotions/redeem-stackable", asyncHandler(async (req, res) => {
        const products = req.body.items;
        const rewards = req.body.rewards;
        const items = mapInputIntoKnownProducts(products);
        const redeemStackableParams = {
            order: {
                amount: calculateCartTotalAmount(items)
            },
            redeemables: filterRewardsToRedeem(rewards)
        };

        const { redemptions } = await client.redemptions.redeemStackable(redeemStackableParams);
        if (!redemptions.length) {
            return res.status(400).send({
                status : "error",
                message: "Redeem rewards is not possible"
            });
        }

        return res.status(200).send({
            status : "success",
            message: "Rewards redeemed"
        });
    }));
};

const filterRewardsToRedeem = rewards => {
    return rewards.map(reward => {
        return {
            id    : reward.id,
            object: reward.object
        };
    });
};

const mapInputIntoKnownProducts = requestedCart => {
    return requestedCart.map(requestedItem => {
        const item = defaultItems.find(item => requestedItem?.id && item.id === requestedItem.id);
        if (!item) {
            return false;
        }
        return { ...item, quantity: requestedItem.quantity || 0 };
    }).filter(item => !!item && item.quantity);
};

const calculateCartTotalAmount = items => items.reduce((sum, item) => sum + (item.price * item.quantity) * 100, 0).toFixed(2);

const defaultItems = [
    {
        productName       : "Johan & Nystrom Caravan",
        productDescription: "20 oz bag",
        quantity          : 0,
        price             : "80.99",
        src               : "./images/johan2.jpeg",
        id                : 1
    },
    {
        productName       : "Illy Arabica",
        productDescription: "Bestseller 18 oz bag",
        quantity          : 0,
        price             : "21.02",
        src               : "./images/illy_arabica.jpeg",
        id                : 2
    },
    {
        productName       : "Hard Beans Etiopia",
        productDescription: "6 oz bag",
        quantity          : 0,
        price             : "3.88",
        src               : "./images/hardbean.jpeg",
        id                : 3
    },
    {
        productName       : "Johan & Nystrom Bourbon",
        productDescription: "20 oz bag",
        quantity          : 0,
        price             : "41.98",
        src               : "./images/johan2.jpeg",
        id                : 4
    },
];
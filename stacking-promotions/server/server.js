import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import asyncHandler from "express-async-handler";
import express from "express";

export const accessToStackingPromotionsApp = app => {
    app.use("/stacking-promotions", express.static(path.join(__dirname, "../client")));
};

const customer = {
    "source_id": "test_customer_id_1"
};

const promotionStackableObj = {
    order: {
        amount: null,
    },
    customer   : customer,
    redeemables: []
};

export const attachEndpointsStackingPromotions = (app, client) => {
    app.get("/default-items", (req, res) => {
        return res.status(200).send(defaultItems);
    });

    app.post("/validate-promotion", asyncHandler(async (req, res) => {
        const products = req.body.items;
        const items = mapInputIntoKnownProducts(products);

        const { promotions } = await client.promotions.validate({
            customer: customer,
            order   : { amount: calculateCartTotalAmount(items) } });
        const hotPromotion = promotions.filter(voucher => voucher.name.startsWith("Hot Promotion"));

        return res.status(200).send(hotPromotion);
    }));

    app.post("/validate-stackable", asyncHandler(async (req, res) => {
        const vouchersArray = req.body.vouchersArray;
        const products = req.body.items;
        const items = mapInputIntoKnownProducts(products);
        if (!vouchersArray) {
            return res.send({
                message: "Voucher code is required"
            });
        }
        promotionStackableObj.order.amount = calculateCartTotalAmount(items);
        promotionStackableObj.redeemables = vouchersArray;
        promotionStackableObj.redeemables = removeDuplicatedPromoObjects(promotionStackableObj.redeemables);

        try {
            const { redeemables, order } = await client.validations.validateStackable(promotionStackableObj);
            const [ voucher ] = redeemables.filter(voucher => voucher.status === "INAPPLICABLE");

            if (voucher?.result?.error) {
                return res.status(404).send({
                    status : "error",
                    message: voucher.result.error.details
                });
            }
            return res.status(200).send({
                amount     : order.amount,
                allDiscount: order.total_applied_discount_amount,
                redeemables
            });
        } catch {
            return res.status(400).send({
                status : "error",
                message: "Validate is not possible or you have used 5 possible promotions"
            });
        }
    }));

    app.post("/redeem-stackable", asyncHandler(async (req, res) => {
        const vouchersArray = req.body.vouchersArray;
        const products = req.body.items;
        const items = mapInputIntoKnownProducts(products);

        promotionStackableObj.order.amount = calculateCartTotalAmount(items);
        promotionStackableObj.redeemables = vouchersArray;

        try {
            await client.redemptions.redeemStackable(promotionStackableObj);
            return res.status(200).send({
                status : "success",
                message: "Voucher redeemed",
            });
        } catch {
            return res.status(400).send({
                status : "error",
                message: "Voucher redeem is not possible"
            });
        }
    }));
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

const removeDuplicatedPromoObjects = array => {
    return array.filter((value, index, self) => index === self.findIndex(t => (t.id === value.id)));
};

const defaultItems = [
    {
        productName       : "Johan & Nystrom Caravan",
        productDescription: "20 oz bag",
        quantity          : 0,
        price             : "26.99",
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
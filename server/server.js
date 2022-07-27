import "dotenv/config";
import pkg from "@voucherify/sdk";
const { VoucherifyServerSide } = pkg;
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import bodyParser from "body-parser";
import asyncHandler from "express-async-handler";
const app = express();
import { accessToStackingPromotionsApp, attachEndpoints } from "../stacking-promotions/server/server.js";
import { validateVoucher, redeemVoucher, accessToVoucherCodeRedemptionApp, getDefaultItemsFromVoucherCodeRedemption } from "../voucher-code-redemption/server/server.js";

export const client = VoucherifyServerSide({
    applicationId: `${process.env.VOUCHERIFY_APP_ID}`,
    secretKey    : `${process.env.VOUCHERIFY_SECRET_KEY}`,
    // apiUrl: 'https://<region>.api.voucherify.io'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client")));

app.use((req, res, next) => {
    res.append("Access-Control-Allow-Origin", [ "*" ]);
    res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.append("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const checkCredentials = async () => {
    try {
        await client.vouchers.list();
    } catch (error) {
        if (error.code === 401) {
            const msg = "Your API credentials are incorrect, please check your applicationId and secretKey or visit `https://docs.voucherify.io/docs/authentication` to complete your app configuration.";
            throw new Error(msg);
        }
        throw new Error(error);
    }
};
checkCredentials();

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Hot beans app listening on port ${port}`);
});

accessToStackingPromotionsApp(app, express);
attachEndpoints(app, client);

accessToVoucherCodeRedemptionApp();
getDefaultItemsFromVoucherCodeRedemption();
validateVoucher();
redeemVoucher();

export { express, path, asyncHandler, app };
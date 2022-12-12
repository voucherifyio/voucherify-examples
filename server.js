import express from "express";
import { addStackingPromotionRoutes } from "./stacking-promotions/server.js";
import { addEndpointsVoucherCodeRedemption } from "./voucher-code-redemption/server.js";
import { addEndpointsTieredCartPromotions } from "./tiered-cart-promotions/server.js";
import { fileURLToPath } from "url";
import "dotenv/config";
import pkg from "@voucherify/sdk";
import path from "path";
import bodyParser from "body-parser";
const { VoucherifyServerSide } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

export const client = VoucherifyServerSide({
    applicationId: `${process.env.VOUCHERIFY_APP_ID}`,
    secretKey    : `${process.env.VOUCHERIFY_SECRET_KEY}`,
    // apiUrl: 'https://<region>.api.voucherify.io'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./welcome-screen")));

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

const checkCampaign = async () => {
    try {
        await client.campaigns.get("Reward Promotion");
    } catch (error) {
        if (error.code === 404) {
                const msg = "The 'Reward Promotion' campaign not found. \r\nPlease run the command 'node ./add-missing-campaign.js' in the terminal to create the missing campaign. \r\nWhen you receive a message that the campaign has been successfully created you can run the main script again. \r\nYou can get additional support here: https://github.com/voucherifyio/voucherify-examples/tree/main#get-support- \r\n";
                console.error(msg);
        }
    }
};

checkCredentials();
checkCampaign();

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Hot beans app listening on port ${port}`);
});

addStackingPromotionRoutes(app, client);
addEndpointsVoucherCodeRedemption(app, client);
addEndpointsTieredCartPromotions(app, client);
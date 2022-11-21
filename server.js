import express from "express";
import { addStackingPromotionRoutes } from "./stacking-promotions/server.js";
import { addEndpointsVoucherCodeRedemption } from "./voucher-code-redemption/server.js";
import { addEndpointsTieredCartPromotions } from "./tiered-cart-promotions/server.js";
import { fileURLToPath } from "url";
import "dotenv/config";
import pkg from "@voucherify/sdk";
import path from "path";
import bodyParser from "body-parser";
import { createMissingCampaign } from "./missing-campaign.js";
const { VoucherifyServerSide } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

export const client = VoucherifyServerSide({
  applicationId: `${process.env.VOUCHERIFY_APP_ID}`,
  secretKey: `${process.env.VOUCHERIFY_SECRET_KEY}`,
  // apiUrl: 'https://<region>.api.voucherify.io'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./welcome-screen")));

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
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

/*
Important!
The 'Reward Promotion' campaign is required for this project to work properly.
 if it doesn't exist you will see an error in the console.
Visit https://github.com/voucherifyio/voucherify-examples/tree/main/tiered-cart-promotions#creating-a-reward-promotion-campaign 
for getting instructions on how to create the missing campaign.
*/


const checkCampaign = async () => {
  try {
    await client.campaigns.get("Reward Promotion");
  } catch (error) {
    if (error.code === 404) {
      try {
        createMissingCampaign(client);
        console.log("The Reward Campaign was successfully created.");
      }
      catch (error) {
        const msg = "The 'Reward Promotion' campaign not found. This campaign is required for 'tiered-cart-promotion' to work properly. \r\nPlease create a 'Reward Promotion' campaign first. \r\nYou can check the details by visiting: https://github.com/voucherifyio/voucherify-examples/tree/main/tiered-cart-promotions#creating-a-reward-promotion-campaign";
        throw new Error(msg);
      }
    }
  }
}

checkCredentials();
checkCampaign();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Hot beans app listening on port ${port}`);
});

addStackingPromotionRoutes(app, client);
addEndpointsVoucherCodeRedemption(app, client);
addEndpointsTieredCartPromotions(app, client);
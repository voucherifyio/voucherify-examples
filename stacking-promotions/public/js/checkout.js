import {
    queryRedeemVoucherButton,
    renderVoucherPropertiesFromStorage,
    renderProducts,
    getCartAndVoucherFromSessionStorage,
    filterAndReduceProducts
} from "./lib.js";

const redeemVoucherButton = queryRedeemVoucherButton();

const state = {
    products         : [],
    voucherProperties: {}
};

getCartAndVoucherFromSessionStorage().then(data => {
    state.products = data.products;
    state.voucherProperties = data.voucherProperties;
    renderProducts(state.products);
    renderVoucherPropertiesFromStorage(state.voucherProperties, state.products);
});

const redeemVoucher = async (voucherProperties, products) => {
    try {
        const { items } = filterAndReduceProducts(products);
        const response = await fetch("/stacking-promotions/redeem-stackable", {
            method : "POST",
            headers: {
                "Accept"      : "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ vouchersArray: voucherProperties.redeemables, items }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            throw new Error(data.message);
        }
        if (data.status !== "success") {
            throw new Error("Redeem voucher is not possible");
        }
        redeemVoucherButton.innerHTML = `${data.message}`;
        window.sessionStorage.clear();
        return data;
    } catch (error) {
        redeemVoucherButton.innerHTML = `${error.message}`;
    }
};

redeemVoucherButton.addEventListener("click", e => {
    e.preventDefault();
    redeemVoucher(state.voucherProperties, state.products);
});
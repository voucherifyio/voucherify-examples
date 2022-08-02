import {
    queryRedeemVoucherButton,
    renderRewardsFromStorage,
    renderProducts,
    getCartAndVoucherFromSessionStorage,
    filterAndReduceProducts
} from "./lib.js";

const redeemVoucherButton = queryRedeemVoucherButton();

const state = {
    products: [],
    rewards : []
};

getCartAndVoucherFromSessionStorage().then(data => {
    state.products = data.products;
    state.rewards = data.rewards;
    renderProducts(state.products);
    renderRewardsFromStorage(state.rewards, state.products);
});

const redeemVoucher = async (rewards, products) => {
    try {
        const { items } = filterAndReduceProducts(products);
        const response = await fetch("/tiered-cart-promotions/redeem-stackable", {
            method : "POST",
            headers: {
                "Accept"      : "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rewards, items }),
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
    redeemVoucher(state.rewards, state.products);
});
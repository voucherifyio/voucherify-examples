import {
    getCartAndVoucherFromSessionStorage,
    getCartPreviewRender,
    queryCheckoutButton,
    displayErrorMessage,
    filterAndReduceProducts,
    getOrderSummaryRender,
    saveCartAndVoucherInSessionStorage,
    getRewardsRender
} from "./lib.js";

const state = {
    products: [],
    rewards: []
};

const checkoutButton = queryCheckoutButton();

getCartAndVoucherFromSessionStorage().then(data => {
    state.products = data.products;
    state.rewards = data.rewards;
    renderCartPreview(state.products);
    renderOrderSummary(state.products, state.rewards);
    renderRewardsPanel(state.rewards);
});

const onIncrement = async (index, render) => {
    state.products[index].quantity++;
    try {
        const { rewards } = await validatePromotion(state.products);
        state.rewards = rewards;
    } catch (error) {
        displayErrorMessage(error.message);
    }
    render(state.products);
    renderOrderSummary(state.products, state.rewards);
    renderRewardsPanel(state.rewards);
};
const onDecrement = async (index, render) => {
    if (state.products[index].quantity <= 0) { return; }
    state.products[index].quantity--;
    try {
        const { rewards } = await validatePromotion(state.products);
        state.rewards = rewards;
    } catch (error) {
        displayErrorMessage(error.message);
    }
    render(state.products);
    renderOrderSummary(state.products, state.rewards);
    renderRewardsPanel(state.rewards);
};
const renderCartPreview = getCartPreviewRender({ onIncrement, onDecrement });
const renderRewardsPanel = getRewardsRender();
const renderOrderSummary = getOrderSummaryRender();

const validatePromotion = async products => {
    state.rewards = [];
    const { items } = filterAndReduceProducts(products);
    const response = await fetch("/tiered-cart-promotions/validate-promotion", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ items })
    });
    const data = await response.json();
    if (response.status !== 200) {
        throw new Error("Validate rewards is not possible");
    }
    return {
        rewards: data.map(reward => {
            return {
                banner: reward.banner,
                hierarchy: reward.hierarchy,
                discount: reward.order.total_applied_discount_amount,
                object: reward.object,
                id: reward.id
            };
        })
    };
};

checkoutButton.addEventListener("click", e => {
    if (!state.rewards.length || state.products.reduce((a, b) => a + b.quantity, 0) <= 0) {
        e.preventDefault();
        alert("Please add items to basket");
        return false;
    }
    saveCartAndVoucherInSessionStorage(state.products, state.rewards);
    window.location.href = "/tiered-cart-promotions/checkout.html";
});
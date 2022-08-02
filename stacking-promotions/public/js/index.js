import {
    getCartAndVoucherFromSessionStorage,
    getCartPreviewRender,
    queryCheckoutButton,
    displayErrorMessage,
    filterAndReduceProducts,
    getOrderSummaryRender,
    saveCartAndVoucherInSessionStorage,
    validateInput,
    filterPromotionTierFromVouchers,
    updateVoucherPropertiesState
} from "./lib.js";

const checkoutButton = queryCheckoutButton();

const state = {
    products         : [],
    voucherProperties: {}
};

getCartAndVoucherFromSessionStorage().then(data => {
    state.products = data.products;
    state.voucherProperties = data.voucherProperties;
    renderCartPreview(state.products);
    renderOrderSummary(state.products, state.voucherProperties);
});

const onIncrement = async (index, render) => {
    state.products[index].quantity++;
    await validateAndRenderSummaryAndProductCards(state.voucherProperties, state.products, render);
};
const onDecrement = async (index, render) => {
    if (state.products[index].quantity <= 0) { return; }
    state.products[index].quantity--;
    await validateAndRenderSummaryAndProductCards(state.voucherProperties, state.products, render);
};
const renderCartPreview = getCartPreviewRender({ onIncrement, onDecrement });

const onVoucherCodeSubmit = async (voucher, render) => {
    try {
        validateInput(state.products, voucher);
        await checkPromotionTier(state.products);
        const { redeemables, amount } = await validateAndUpdateVoucherProperties(state.voucherProperties, state.products);
        updateVoucherPropertiesState(state.voucherProperties, amount, redeemables);
        render(state.products, state.voucherProperties);
    } catch (error) {
        displayErrorMessage(error.message, voucher);
    }
};
const renderOrderSummary = getOrderSummaryRender({ onVoucherCodeSubmit });

const validateAndRenderSummaryAndProductCards = async (voucherProperties, products, render) => {
    await checkPromotionTier(products);
    try {
        const { redeemables, amount } = await validateAndUpdateVoucherProperties(voucherProperties, products);
        updateVoucherPropertiesState(voucherProperties, amount, redeemables);
    } catch (error) {
        displayErrorMessage(error.message);
    }
    render(products);
    renderOrderSummary(products, voucherProperties);
};

const checkPromotionTier = async products => {
    state.voucherProperties.redeemables = filterPromotionTierFromVouchers(state.voucherProperties);
    const { items } = filterAndReduceProducts(products);
    const response = await fetch("/stacking-promotions/validate-promotion", {
        method : "POST",
        headers: {
            "Accept"      : "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ items })
    });
    const data = await response.json();
    if (data.length) {
        const { object, id, discount } = await data[0];
        state.voucherProperties.redeemables.unshift({ object: object, id: id, discount: discount.amount_off });
    }
    return data;
};

const validateAndUpdateVoucherProperties = async (voucherProperties, products) => {
    if (!voucherProperties.redeemables.length) {
        return;
    }
    const { items } = filterAndReduceProducts(products);
    const response = await fetch("/stacking-promotions/validate-stackable", {
        method : "POST",
        headers: {
            "Accept"      : "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ vouchersArray: voucherProperties.redeemables, items }),
    });
    const data = await response.json();
    if (response.status !== 200) {
        state.voucherProperties.redeemables.pop();
        throw new Error(data.message);
    }
    return {
        redeemables: data.redeemables,
        amount     : data.amount
    };
};

checkoutButton.addEventListener("click", e => {
    if (!state.voucherProperties.redeemables.length || state.products.reduce((a, b) => a + b.quantity, 0) <= 0) {
        e.preventDefault();
        alert("Please validate voucher code or add items to basket");
        return false;
    }
    saveCartAndVoucherInSessionStorage(state.products, state.voucherProperties);
    window.location.href = "/stacking-promotions/checkout.html";
});
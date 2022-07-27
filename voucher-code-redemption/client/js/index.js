import {
    getCartAndVoucherFromSessionStorage,
    getCartPreviewRender,
    checkoutButton,
    displayErrorMessage,
    filterAndReduceProducts,
    getOrderSummaryRender,
    saveCartAndVoucherInSessioStorage
} from "./lib.js";

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
    if (state.voucherProperties.code) {
        try {
            await validateAndUpdateVoucherProperties(state.voucherProperties.code, state.products);
        } catch (error) {
            displayErrorMessage(error.message);
        }
    }
    render(state.products);
    renderOrderSummary(state.products, state.voucherProperties);
};
const onDecrement = async (index, render) => {
    if (state.products[index].quantity <= 0) { return; }
    state.products[index].quantity--;
    if (state.voucherProperties.code) {
        try {
            await validateAndUpdateVoucherProperties(state.voucherProperties.code, state.products);
        } catch (error) {
            displayErrorMessage(error.message);
        }
    }
    render(state.products);
    renderOrderSummary(state.products, state.voucherProperties);
};
const renderCartPreview = getCartPreviewRender({ onIncrement, onDecrement });

const onVoucherCodeSubmit = async (voucherValue, render) => {
    try {
        await validateAndUpdateVoucherProperties(voucherValue, state.products);
        render(state.products, state.voucherProperties);
    } catch (error) {
        displayErrorMessage(error.message, voucherValue);
    }
};
const renderOrderSummary = getOrderSummaryRender({ onVoucherCodeSubmit });

const validateAndUpdateVoucherProperties = async (code, products) => {
    if (!code) {
        throw new Error("Please enter voucher code");
    }
    if (products.reduce((a, b) => a + b.quantity, 0) <= 0) {
        throw new Error("No items in basket");
    }
    const { items } = filterAndReduceProducts(products);
    const response = await fetch("/validate-voucher", {
        method : "POST",
        headers: {
            "Accept"      : "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, items }),
    });
    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(data.message);
    }
    if (data.status !== "success") {
        throw new Error("We could not validate coupon");
    }

    const isFreeShipping = data.type === "UNIT" && data?.product?.name === "Shipping";

    if (!([ "AMOUNT", "PERCENT" ].includes(data.type) || isFreeShipping)) {
        throw new Error("Implemented discounts: AMOUNT, PERCENT and FREE SHIPPING (the variation of UNIT type discount)");
    }

    state.voucherProperties.isFreeShippingDiscount = isFreeShipping;
    state.voucherProperties.amount = isFreeShipping ? 0 : data.amount;
    state.voucherProperties.code = data.code;

    return data;
};

checkoutButton.addEventListener("click", e => {
    if (!state.voucherProperties.code || state.products.reduce((a, b) => a + b.quantity, 0) <= 0) {
        e.preventDefault();
        alert("Please validate voucher code or add items to basket");
        return false;
    }
    saveCartAndVoucherInSessioStorage(state.products, state.voucherProperties);
    window.location.href = "/voucher-code-redemption/checkout.html";
});
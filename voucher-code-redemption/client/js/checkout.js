import {
    redeemVoucherButton,
    renderVoucherPropertiesFromStorage,
    renderProductsFromStorage,
    getCartAndVoucherFromSessionStorage,
    filterAndReduceProducts
} from "./lib.js";

let products = [];
let voucherProperties = [];

getCartAndVoucherFromSessionStorage().then(data => {
    products = data.products;
    voucherProperties = data.voucherProperties;
    renderProductsFromStorage(products);
    renderVoucherPropertiesFromStorage(voucherProperties, products);
});

const fetchRedeemVoucher = async (code, products, name, email) => {
    try {
        const { items } = filterAndReduceProducts(products);
        const response = await fetch("/redeem-voucher", {
            method : "POST",
            headers: {
                "Accept"      : "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, items, name, email }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            throw new Error(data.message);
        }
        if (data.status !== "success") {
            throw new Error("Redeem voucher is not possible");
        }
        redeemVoucherButton.innerHTML = `${data.message}`;
        return data;
    } catch (error) {
        redeemVoucherButton.innerHTML = `${error.message}`;
    }
};

redeemVoucherButton.addEventListener("click", e => {
    e.preventDefault();
    const voucherCode = voucherProperties.code;
    const fullName = document.getElementById("fullname").value;
    const email = document.getElementById("ephone").value;
    fetchRedeemVoucher(voucherCode, products, fullName, email);
    window.sessionStorage.clear();
});
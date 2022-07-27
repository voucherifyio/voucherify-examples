export const checkoutButton = document.getElementById("checkout-button");
export const redeemVoucherButton = document.querySelector(".nav-buttons button");

export const getCartPreviewRender = ({ onIncrement, onDecrement }) => {
    const render = cartItems => {
        const htmlElement = document.getElementById("cart-summary-list");
        const listRowHtmlElement = document.getElementById("cart-summary-row-template");
        htmlElement.replaceChildren(...cartItems
            .map(
                (item, index) => {
                    const row = listRowHtmlElement.cloneNode(true).content.children[0];
                    row.setAttribute("key", item.id);
                    row.querySelector("img").setAttribute("src", item.src);
                    row.querySelector("input").setAttribute("value", item.quantity);
                    row.querySelector(".name-and-description span:nth-child(1)").innerHTML = item.productName;
                    row.querySelector(".name-and-description span:nth-child(2)").innerHTML = item.productDescription;
                    row.querySelector(".price").innerHTML = item.price;

                    row.querySelector(".increment").addEventListener("click", () => {
                        if (typeof onIncrement === "function") {
                            onIncrement(index, render);
                        }
                    });

                    row.querySelector(".decrement").addEventListener("click", () => {
                        if (typeof onDecrement === "function") {
                            onDecrement(index, render);
                        }
                    });
                    return row;
                }
            ));
    };
    return render;
};

export const getOrderSummaryRender = ({ onVoucherCodeSubmit }) => {
    const render = (items, voucherProperties) => {
        const htmlElement = document.getElementById("total-order-holder");
        const holderOrderHtmlElement = document.getElementById("total-order-holder-template");
        const template = holderOrderHtmlElement.cloneNode(true).content;
        const promotions = voucherProperties?.amount ? voucherProperties.amount / 100 : 0;
        const summedUpPrices = sumProductPrices(items);
        const grandTotal = summedUpPrices - promotions;
        if (voucherProperties?.code) {
            template.getElementById("promotion-holder").innerHTML = `<h5>${voucherProperties.code}</h5>
            <div>${voucherProperties.isFreeShippingDiscount ? "<span>Free shipping</span><span>20$</span>" : `$${promotions.toFixed(2)}`}</div>`;
        }
        template.getElementById("subtotal").innerHTML = `$${summedUpPrices}`;
        template.getElementById("grand-total").innerHTML = `$${grandTotal <= 0 ? "0.00" : grandTotal.toFixed(2)}`;
        template.getElementById("all-discounts").innerHTML = promotions ? `$${promotions.toFixed(2)}` : "n/a";
        const voucherValue = template.getElementById("voucher-code");
        template.getElementById("voucher-code-form").addEventListener("submit", event => {
            event.preventDefault();
            if (typeof onVoucherCodeSubmit === "function") {
                onVoucherCodeSubmit(voucherValue.value.trim(), render);
            }
        });

        htmlElement.replaceChildren(template);
        return template;
    };
    return render;
};

export const renderProductsFromStorage = products => {
    const htmlElement = document.querySelector(".summed-products");
    const summedProductsHtmlElement = document.querySelector(".summed-products-template");
    htmlElement.replaceChildren(...products.filter(item => item.quantity).map((item, index) => {
        const summedProductsTemplate = summedProductsHtmlElement.cloneNode(true).content.children[0];
        summedProductsTemplate.setAttribute("key", index);
        summedProductsTemplate.querySelector("img").setAttribute("src", item.src);
        summedProductsTemplate.querySelector("h6").innerHTML = `${item.productName}`;
        summedProductsTemplate.querySelector("p").innerHTML = `Quantity ${item.quantity}`;
        summedProductsTemplate.querySelector("span").innerHTML = `${item.price}`;
        return summedProductsTemplate;
    }));
};

export const renderVoucherPropertiesFromStorage = (voucherProperties, products) => {
    const htmlElement = document.querySelector(".discounts");
    const discountsHtmlElement = document.querySelector(".discounts-template");
    const discountsTemplate = discountsHtmlElement.cloneNode(true).content;
    const subtotal = sumProductPrices(products);
    const discountValue = discountsTemplate.querySelector(".discount-value span").innerHTML = `$${voucherProperties.amount / 100 || 0}`;
    discountsTemplate.querySelector(".all-discounts span").innerHTML = voucherProperties.isFreeShippingDiscount ? "Free shipping" : `$${voucherProperties.amount / 100}`;
    discountsTemplate.querySelector(".subtotal span").innerHTML = `$${subtotal}`;
    discountsTemplate.querySelector(".coupon").innerHTML = `<span class="coupon-value">${voucherProperties.code}</span>`;
    const shipping = discountsTemplate.querySelector(".shipping span").innerHTML = `${!voucherProperties.amount ? "$0" : "$20"}`;
    discountsTemplate.querySelector(".grand-total span").innerHTML = `$${(+shipping.replace("$", "") + +subtotal - discountValue.replace("$", "")).toFixed(2)}`;
    htmlElement.replaceChildren(discountsTemplate);
    return discountsTemplate;
};

export const displayErrorMessage = (message, voucherValue) => {
    if (!voucherValue) {
        document.querySelector(".voucher-form-error p").innerHTML = `${message}`;
        return false;
    }
    document.querySelector(".error-holder").innerHTML = `<h5 id="error-message">${message}</h5>`;
    document.getElementById("voucher-code-form").addEventListener("submit", event => {
        event.preventDefault();
    });
    return false;
};

export const sumProductPrices = items => {
    return items
        .map(item => {
            return parseFloat(item.price) * parseInt(item.quantity);
        })
        .reduce((partialSum, a) => partialSum + a, 0)
        .toFixed(2);
};

export const filterAndReduceProducts = products => {
    const items = products.filter(item => item.quantity !== 0).map(product => ({ id: product.id, quantity: product.quantity }));
    return { items };
};

export const getDefaultItemsNameAndPrice = async () => {
    const response = await fetch("/get-default-items", {
        method : "GET",
        headers: {
            "Accept"      : "application/json",
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
};

export const getCartAndVoucherFromSessionStorage = async () => {
    const productsFromSessionStorage = JSON.parse(sessionStorage.getItem("products") || "[]");
    const voucherPropertiesFromSessionStorage = JSON.parse(sessionStorage.getItem("voucherProperties") || "{}");
    const data = await getDefaultItemsNameAndPrice();
    return {
        products         : productsFromSessionStorage.length ? productsFromSessionStorage : data,
        voucherProperties: voucherPropertiesFromSessionStorage.code ? voucherPropertiesFromSessionStorage : {
            amount                : "",
            code                  : "",
            isFreeShippingDiscount: false
        }
    };
};

export const saveCartAndVoucherInSessioStorage = (items, voucherProperties) => {
    window.sessionStorage.setItem("products", JSON.stringify(items));
    window.sessionStorage.setItem("voucherProperties", JSON.stringify(voucherProperties));
};
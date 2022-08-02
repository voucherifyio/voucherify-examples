export const queryCheckoutButton = () => {
    return document.getElementById("checkout-button");
};

export const queryRedeemVoucherButton = () => {
    return document.querySelector(".nav-buttons button");
};

export const getCartPreviewRender = ({ onIncrement, onDecrement }) => {
    const render = cartItems => {
        const cartSummaryList = document.getElementById("cart-summary-list");
        const cartSummaryRowTemplate = document.getElementById("cart-summary-row-template");
        cartSummaryList.replaceChildren(...cartItems
            .map(
                (item, index) => {
                    const row = cartSummaryRowTemplate.cloneNode(true).content.children[0];
                    row.setAttribute("key", item.id);
                    row.querySelector("img").setAttribute("src", item.src);
                    row.querySelector("input").setAttribute("value", item.quantity);
                    row.querySelector(".name-and-description span:nth-child(1)").innerHTML = item.productName;
                    row.querySelector(".name-and-description span:nth-child(2)").innerHTML = item.productDescription;
                    row.querySelector(".price").innerHTML = item.price;

                    const incrementButton = row.querySelector(".increment");
                    incrementButton.addEventListener("click", () => {
                        if (typeof onIncrement === "function") {
                            onIncrement(index, render);
                            incrementButton.disabled = true;
                        }
                    });

                    const decrementButton = row.querySelector(".decrement");
                    decrementButton.addEventListener("click", () => {
                        if (typeof onDecrement === "function") {
                            onDecrement(index, render);
                            decrementButton.disabled = true;
                        }
                    });
                    return row;
                }
            ));
    };
    return render;
};

export const getOrderSummaryRender = () => {
    const render = (items, rewards) => {
        const htmlElement = document.getElementById("total-order-holder");
        const holderOrderHtmlElement = document.getElementById("total-order-holder-template");
        const template = holderOrderHtmlElement.cloneNode(true).content;
        const totalAmount = sumProductPrices(items);
        const totalDiscountAmount = rewards.reduce((sum, voucher) => sum + voucher.discount, 0) / 100 || 0;
        const finalPrice = totalAmount - totalDiscountAmount;
        rewards?.map(reward => {
            template.querySelector(".promotions-holder").innerHTML += `<div class="promotion-holder" index=${reward.hierarchy}><h5>Reward Tier ${reward.hierarchy}</h5>
            <div>$${(reward.discount / 100).toFixed(2)}</div></div>`;
        });
        template.getElementById("subtotal").innerHTML = `$${totalAmount}`;
        template.getElementById("grand-total").innerHTML = `$${finalPrice <= 0 ? "0.00" : finalPrice.toFixed(2)}`;
        template.getElementById("all-discounts").innerHTML = totalDiscountAmount ? `$${totalDiscountAmount.toFixed(2)}` : "n/a";
        template.getElementById("voucher-code-form").addEventListener("submit", event => {
            event.preventDefault();
        });
        htmlElement.replaceChildren(template);
        return template;
    };
    return render;
};

export const getRewardsRender = () => {
    const renderRewards = rewards => {
        const rewardsHtmlElement = document.getElementById("reward-wrapper");
        const rewardsTemplate = document.getElementById("reward-wrapper-template");
        const rewardItem = rewardsTemplate.cloneNode(true).content;
        const progressTier = rewardItem.querySelector(".progress-tier");
        const rect = document.querySelectorAll(".progress-bar-numbers span")[rewards[0]?.hierarchy]?.getBoundingClientRect().left;
        progressTier.style.width = `${((rect - 20).toFixed(1))}px`;
        rewardItem.querySelector(".reward-banner").innerHTML = rewards[0]?.hierarchy !== 3 ? rewards[0]?.banner || "Spend $100 more to get FREE SHIPPING" : "Congratulations, you achieved all rewards!";
        rewardsHtmlElement.replaceChildren(rewardItem);
        return rewardItem;
    };
    return renderRewards;
};

export const renderProducts = products => {
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

export const renderRewardsFromStorage = (rewards, products) => {
    const htmlElement = document.querySelector(".discounts");
    const discountsHtmlElement = document.querySelector(".discounts-template");
    const discountsTemplate = discountsHtmlElement.cloneNode(true).content;
    const summedDiscountPrice = rewards?.reduce((sum, voucher) => sum + voucher.discount, 0) / 100;
    const subtotal = sumProductPrices(products);
    const discountValue = discountsTemplate.querySelector(".discount-value span").innerHTML = `$${summedDiscountPrice || 0}`;
    discountsTemplate.querySelector(".all-discounts span").innerHTML = `$${summedDiscountPrice || 0}`;
    discountsTemplate.querySelector(".subtotal span").innerHTML = `$${subtotal}`;
    rewards?.map(reward => {
        discountsTemplate.querySelector(".coupons").innerHTML += `<h5 class="coupon"><span class="coupon-value">Reward Tier ${reward.hierarchy}</span></h5>`;
    });
    const shipping = discountsTemplate.querySelector(".shipping span").innerHTML = "$8.99";
    discountsTemplate.querySelector(".grand-total span").innerHTML = `$${(+shipping.replace("$", "") + +subtotal - discountValue.replace("$", "")).toFixed(2)}`;
    htmlElement.replaceChildren(discountsTemplate);
    return discountsTemplate;
};

export const displayErrorMessage = (message, voucherValue) => {
    if (!voucherValue) {
        document.querySelector(".voucher-form-error p").innerHTML = `${message}`;
        return false;
    }
    document.querySelector(".voucher-form-error p").innerHTML = "";
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
    const response = await fetch("/tiered-cart-promotions/default-items", {
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
    const productsFromSessionStorage = JSON.parse(sessionStorage.getItem("tcp-products") || "[]");
    const rewardsFromSessionStorage = JSON.parse(sessionStorage.getItem("tcp-rewards") || "[]");
    const data = await getDefaultItemsNameAndPrice();
    return {
        products: productsFromSessionStorage.length ? productsFromSessionStorage : data,
        rewards : rewardsFromSessionStorage.length ? rewardsFromSessionStorage : []
    };
};

export const saveCartAndVoucherInSessionStorage = (items, rewards) => {
    window.sessionStorage.setItem("tcp-products", JSON.stringify(items));
    window.sessionStorage.setItem("tcp-rewards", JSON.stringify(rewards));
};

const token = localStorage.getItem("token");

const cartList = document.getElementById("cartList");
const subtotalEl = document.getElementById("subtotal");
const taxesEl = document.getElementById("taxes");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");

const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
        const item = header.parentElement;
        item.classList.toggle("active");
    });
});

function formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
}

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`http://localhost:5242/api/cart/remove/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("failed to remove item");
        }

        const cart = await response.json();
        renderCart(cart);
    } catch (error) {
        console.error(error);
    }
}

async function updateQuantity(productId, quantity) {
    try {
        const response = await fetch("http://localhost:5242/api/cart/update", {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                productId,
                quantity
            })
        });

        if (!response.ok) {
            throw new Error("failed to update quantity");
        }

        const cart = await response.json();
        renderCart(cart);
    } catch (error) {
        console.error(error);
    }
}

function renderCart(cart) {
    if (!cart.items || cart.items.length === 0) {
        cartList.innerHTML = `<p class="empty-cart">your cart is empty.</p>`;
        subtotalEl.textContent = "$0.00";
        taxesEl.textContent = "$0.00";
        shippingEl.textContent = "$0.00";
        totalEl.textContent = "$0.00";
        return;
    }

    cartList.innerHTML = cart.items.map(item => `
        <article class="cart-item">
            <div class="cart-item-image">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.brand || "retro store"}</p>
                <p>${item.subCategory || "item"}</p>
                <p>qty: ${item.quantity}</p>

                <div class="cart-item-actions">
                    <button type="button" onclick="updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                    <button type="button" onclick="updateQuantity(${item.productId}, ${item.quantity - 1})">−</button>
                    <button type="button" onclick="removeFromCart(${item.productId})">remove</button>
                </div>
            </div>

            <div class="cart-item-price">${formatPrice(item.lineTotal)}</div>
        </article>
    `).join("");

    subtotalEl.textContent = formatPrice(cart.subtotal);
    taxesEl.textContent = formatPrice(cart.taxes);
    shippingEl.textContent = formatPrice(cart.shipping);
    totalEl.textContent = formatPrice(cart.total);
}

async function loadCart() {
    try {
        const response = await fetch("http://localhost:5242/api/cart", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("failed to load cart");
        }

        const cart = await response.json();
        renderCart(cart);
    } catch (error) {
        console.error(error);
    }
}

async function submitCheckout() {
    const emailAddress = document.querySelector('input[type="email"]').value;
    const phoneNumber = document.querySelectorAll('.field-group input')[1].value;

    const cardholderName = document.querySelectorAll('.accordion-body .field-group input')[0]?.value || "";
    const cardNumber = document.querySelectorAll('.accordion-body .field-group input')[1]?.value || "";
    const expiry = document.querySelectorAll('.accordion-body .split-fields input')[0]?.value || "";
    const cvv = document.querySelectorAll('.accordion-body .split-fields input')[1]?.value || "";

    const fullName = document.querySelectorAll('.accordion-body .field-group input')[2]?.value || "";
    const address = document.querySelectorAll('.accordion-body .field-group input')[3]?.value || "";
    const city = document.querySelectorAll('.accordion-body .split-fields input')[2]?.value || "";
    const postalCode = document.querySelectorAll('.accordion-body .split-fields input')[3]?.value || "";

    const billingAddress = document.querySelectorAll('.accordion-body .field-group input')[4]?.value || "";

    try {
        const response = await fetch("http://localhost:5242/api/cart/checkout", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                emailAddress,
                phoneNumber,
                cardholderName,
                cardNumber,
                expiry,
                cvv,
                fullName,
                address,
                city,
                postalCode,
                billingAddress
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "checkout failed");
            return;
        }

        alert("checkout information submitted");
        loadCart();
    } catch (error) {
        console.error(error);
        alert("could not submit checkout");
    }
}

document.querySelector(".continue-btn").addEventListener("click", submitCheckout);

if (!token) {
    cartList.innerHTML = `<p class="empty-cart">please sign in first.</p>`;
} else {
    loadCart();
}
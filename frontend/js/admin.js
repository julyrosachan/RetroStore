const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "admin") {
    window.location.href = "./auth.html";
}

const apiHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

const productForm = document.getElementById("productForm");
const resetBtn = document.getElementById("resetBtn");
const productsList = document.getElementById("productsList");
const ordersList = document.getElementById("ordersList");

const productIdInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageUrlInput = document.getElementById("imageUrl");
const imagesInput = document.getElementById("images");
const categoryInput = document.getElementById("category");
const subCategoryInput = document.getElementById("subCategory");
const brandInput = document.getElementById("brand");
const conditionInput = document.getElementById("condition");
const descriptionInput = document.getElementById("description");

const adminTabs = document.querySelectorAll(".admin-tab");
const adminSections = document.querySelectorAll(".admin-section");
const logoutBtn = document.getElementById("logoutBtn");

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function switchTab(tabName) {
    adminTabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === tabName);
    });

    adminSections.forEach(section => {
        section.classList.toggle("active", section.id === `${tabName}Section`);
    });
}

adminTabs.forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "./auth.html";
});

function resetForm() {
    productForm.reset();
    productIdInput.value = "";
}

resetBtn.addEventListener("click", resetForm);

async function loadProducts() {
    try {
        const response = await fetch("http://localhost:5242/api/admin/products", {
            headers: apiHeaders
        });

        const products = await response.json();

        if (!response.ok) {
            showToast(products.message || "could not load products");
            return;
        }

        renderProducts(products);
    } catch (error) {
        console.error(error);
        showToast("could not load products");
    }
}

function renderProducts(products) {
    if (!products.length) {
        productsList.innerHTML = `<p>no products yet.</p>`;
        return;
    }

    productsList.innerHTML = products.map(product => `
        <article class="product-row">
            <img src="${product.imageUrl}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
                <p>${product.category} / ${product.subCategory}</p>
                <p>${product.brand} / ${product.condition}</p>
            </div>
            <div class="product-actions">
                <button class="small-btn" onclick="editProduct(${product.id})">edit</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">delete</button>
            </div>
        </article>
    `).join("");
}

window.editProduct = async function (id) {
    try {
        const response = await fetch("http://localhost:5242/api/admin/products", {
            headers: apiHeaders
        });

        const products = await response.json();
        const product = products.find(p => p.id === id);

        if (!product) return;

        productIdInput.value = product.id;
        nameInput.value = product.name;
        priceInput.value = product.price;
        imageUrlInput.value = product.imageUrl;
        imagesInput.value = product.images ? product.images.join(", ") : "";
        categoryInput.value = product.category;
        subCategoryInput.value = product.subCategory;
        brandInput.value = product.brand;
        conditionInput.value = product.condition;
        descriptionInput.value = product.description;

        showToast("product loaded for editing");
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        console.error(error);
        showToast("could not load product");
    }
};

window.deleteProduct = async function (id) {
    try {
        const response = await fetch(`http://localhost:5242/api/admin/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "could not delete product");
            return;
        }

        showToast("product deleted");
        loadProducts();
    } catch (error) {
        console.error(error);
        showToast("could not delete product");
    }
};

productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = productIdInput.value.trim();
    const images = imagesInput.value
        .split(",")
        .map(i => i.trim())
        .filter(Boolean);

    const payload = {
        name: nameInput.value,
        price: Number(priceInput.value),
        imageUrl: imageUrlInput.value,
        images: images.length ? images : [imageUrlInput.value],
        category: categoryInput.value,
        subCategory: subCategoryInput.value,
        brand: brandInput.value,
        condition: conditionInput.value,
        description: descriptionInput.value
    };

    try {
        const response = await fetch(
            id
                ? `http://localhost:5242/api/admin/products/${id}`
                : "http://localhost:5242/api/admin/products",
            {
                method: id ? "PUT" : "POST",
                headers: apiHeaders,
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "could not save product");
            return;
        }

        showToast(id ? "product updated" : "product added");
        resetForm();
        loadProducts();
    } catch (error) {
        console.error(error);
        showToast("could not save product");
    }
});

async function loadOrders() {
    try {
        const response = await fetch("http://localhost:5242/api/admin/orders", {
            headers: apiHeaders
        });

        const orders = await response.json();

        if (!response.ok) {
            showToast(orders.message || "could not load orders");
            return;
        }

        renderOrders(orders);
    } catch (error) {
        console.error(error);
        showToast("could not load orders");
    }
}

function renderOrders(orders) {
    if (!orders.length) {
        ordersList.innerHTML = `<p>no orders yet.</p>`;
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <article class="order-card">
            <div class="order-top">
                <div>
                    <h4>order #${order.id}</h4>
                    <p>${order.customerName} / ${order.emailAddress}</p>
                    <p>${order.address}, ${order.city}, ${order.postalCode}</p>
                    <p>total: $${Number(order.total).toFixed(2)}</p>
                </div>

                <div class="order-status">
                    <select onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="pending" ${order.status === "pending" ? "selected" : ""}>pending</option>
                        <option value="paid" ${order.status === "paid" ? "selected" : ""}>paid</option>
                        <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>shipped</option>
                        <option value="completed" ${order.status === "completed" ? "selected" : ""}>completed</option>
                    </select>
                </div>
            </div>

            <ul class="order-items">
                ${order.items.map(item => `
                    <li>${item.name} × ${item.quantity} — $${Number(item.lineTotal).toFixed(2)}</li>
                `).join("")}
            </ul>
        </article>
    `).join("");
}

window.updateOrderStatus = async function (id, status) {
    try {
        const response = await fetch(`http://localhost:5242/api/admin/orders/${id}/status`, {
            method: "PUT",
            headers: apiHeaders,
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "could not update order");
            return;
        }

        showToast("order status updated");
        loadOrders();
    } catch (error) {
        console.error(error);
        showToast("could not update order");
    }
};

loadProducts();
loadOrders();
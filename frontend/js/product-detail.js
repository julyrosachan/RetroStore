const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const detailBrand = document.getElementById("detailBrand");
const detailCondition = document.getElementById("detailCondition");
const detailCategory = document.getElementById("detailCategory");
const detailDescription = document.getElementById("detailDescription");
const detailSubCategory = document.getElementById("detailSubCategory");
const detailBrandText = document.getElementById("detailBrandText");
const detailConditionText = document.getElementById("detailConditionText");
const breadcrumbCategory = document.getElementById("breadcrumbCategory");
const mainProductImage = document.getElementById("mainProductImage");
const thumbRow = document.getElementById("thumbRow");
const addCartBtn = document.querySelector(".add-cart-btn");

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function renderProduct(product) {
    detailName.textContent = product.name;
    detailPrice.textContent = `$${product.price}`;
    detailBrand.textContent = product.brand;
    detailCondition.textContent = product.condition;
    detailCategory.textContent = product.category;
    detailDescription.textContent = product.description || "no description available.";
    detailSubCategory.textContent = product.subCategory;
    detailBrandText.textContent = product.brand;
    detailConditionText.textContent = product.condition;
    breadcrumbCategory.textContent = product.category;

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.imageUrl];

    mainProductImage.src = images[0];
    mainProductImage.alt = product.name;

    thumbRow.innerHTML = images.map((image, index) => `
        <div class="thumb-item ${index === 0 ? "active-thumb" : ""}">
            <img src="${image}" alt="${product.name}">
        </div>
    `).join("");

    const thumbs = document.querySelectorAll(".thumb-item");

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            mainProductImage.src = images[index];
            mainProductImage.alt = product.name;

            thumbs.forEach(item => item.classList.remove("active-thumb"));
            thumb.classList.add("active-thumb");
        });
    });
}

async function loadProduct() {
    try {
        if (!productId) {
            throw new Error("missing product id");
        }

        const response = await fetch(`http://localhost:5242/api/products/${productId}`);

        if (!response.ok) {
            throw new Error("product not found");
        }

        const product = await response.json();
        renderProduct(product);
    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<p style='padding:40px;'>product not found.</p>";
    }
}

async function addToCart() {
    try {
        if (!token) {
            showToast("please sign in first");
            return;
        }

        if (!productId) {
            showToast("product not found");
            return;
        }

        const response = await fetch("http://localhost:5242/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: Number(productId),
                quantity: 1
            })
        });

        const responseText = await response.text();
        let data;

        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch {
            data = { message: responseText };
        }

        if (!response.ok) {
            console.log("cart add error:", data);
            showToast(data.message || "could not add to cart");
            return;
        }

        showToast("added to cart");
    } catch (error) {
        console.error(error);
        showToast("could not add to cart");
    }
}

if (addCartBtn) {
    addCartBtn.addEventListener("click", addToCart);
}

loadProduct();
console.log("category.js loaded");

const tabs = document.querySelectorAll('.tab');
const title = document.querySelector('.title');
const productGrid = document.getElementById('productGrid');

const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

const brandFilter = document.getElementById('brandFilter');
const conditionFilter = document.getElementById('conditionFilter');

const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');

const filterHeaders = document.querySelectorAll('.filter-header');

const navTrigger = document.querySelector(".navTrigger");
const mainListDiv = document.querySelector("#mainListDiv");
const nav = document.querySelector(".nav");

const searchInput = document.getElementById("navSearchInput");

if (navTrigger && mainListDiv) {
    navTrigger.addEventListener("click", () => {
        navTrigger.classList.toggle("active");
        mainListDiv.classList.toggle("show_list");
        document.body.classList.toggle("menu-open");
    });
}

window.addEventListener("scroll", () => {
    if (nav && window.scrollY > 30) {
        nav.classList.add("affix");
    } else if (nav) {
        nav.classList.remove("affix");
    }
});

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const profileLink = document.getElementById("profileLink");
const profileName = document.getElementById("profileName");

if (profileLink && profileName) {
    if (token && user) {
        profileName.textContent = user.name || "my account";
        profileLink.href = user.role === "admin" ? "./admin.html" : "./profile.html";
    } else {
        profileName.textContent = "sign in";
        profileLink.href = "./auth.html";
    }
}

const params = new URLSearchParams(window.location.search);
const initialCategory = params.get("category");

let activeTab = 'all';
let allProducts = [];

function createCard(product) {
    return `
        <article class="card" data-category="${product.category}" onclick="goToDetail(${product.id})">
            <div class="thumb">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price}</p>
        </article>
    `;
}

function goToDetail(id) {
    window.location.href = `./product-detail.html?id=${id}`;
}

function renderProducts(products) {
    productGrid.innerHTML = products.map(createCard).join('');
}

function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector))
        .filter(input => input.checked)
        .map(input => input.value);
}

function buildDynamicFilters() {
    const brands = [...new Set(allProducts.map(product => product.brand).filter(Boolean))].sort();
    const conditions = [...new Set(allProducts.map(product => product.condition).filter(Boolean))].sort();

    brandFilter.innerHTML = brands.map(brand => `
        <label>
            <input type="checkbox" value="${brand}" class="brand-checkbox" />
            ${brand}
        </label>
    `).join('');

    conditionFilter.innerHTML = conditions.map(condition => `
        <label>
            <input type="checkbox" value="${condition}" class="condition-checkbox" />
            ${condition}
        </label>
    `).join('');

    document.querySelectorAll('.brand-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    document.querySelectorAll('.condition-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const checkedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const checkedBrands = getCheckedValues('.brand-checkbox');
    const checkedConditions = getCheckedValues('.condition-checkbox');

    const minPrice = minPriceInput.value ? Number(minPriceInput.value) : null;
    const maxPrice = maxPriceInput.value ? Number(maxPriceInput.value) : null;

    const searchValue = searchInput?.value.toLowerCase().trim();

    let filtered = [...allProducts];

    if (activeTab !== 'all') {
        filtered = filtered.filter(product => product.category === activeTab);
    }

    if (checkedCategories.length > 0) {
        filtered = filtered.filter(product => checkedCategories.includes(product.category));
    }

    if (checkedBrands.length > 0) {
        filtered = filtered.filter(product => checkedBrands.includes(product.brand));
    }

    if (checkedConditions.length > 0) {
        filtered = filtered.filter(product => checkedConditions.includes(product.condition));
    }

    if (minPrice !== null) {
        filtered = filtered.filter(product => Number(product.price) >= minPrice);
    }

    if (maxPrice !== null) {
        filtered = filtered.filter(product => Number(product.price) <= maxPrice);
    }

    if (searchValue) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchValue) ||
            product.brand?.toLowerCase().includes(searchValue) ||
            product.category?.toLowerCase().includes(searchValue) ||
            product.subCategory?.toLowerCase().includes(searchValue)
        );
    }

    renderProducts(filtered);

    if (searchValue) {
        title.textContent = `search: "${searchValue}"`;
    } else if (activeTab === 'all') {
        if (checkedCategories.length === 1) {
            title.textContent = checkedCategories[0];
        } else if (
            checkedCategories.length > 1 ||
            checkedBrands.length > 0 ||
            checkedConditions.length > 0 ||
            minPrice !== null ||
            maxPrice !== null
        ) {
            title.textContent = 'filtered gear';
        } else {
            title.textContent = 'all gear';
        }
    } else {
        title.textContent = activeTab;
    }
}

async function loadProducts() {
    try {
        console.log("loading products...");

        const response = await fetch('http://localhost:5242/api/products');
        console.log("response status:", response.status);

        if (!response.ok) {
            throw new Error('products could not be loaded');
        }

        allProducts = await response.json();
        console.log("products loaded:", allProducts);

        buildDynamicFilters();

        if (initialCategory) {
            activeTab = initialCategory;

            tabs.forEach(tab => {
                tab.classList.remove("active");
                if (tab.dataset.category === initialCategory) {
                    tab.classList.add("active");
                }
            });

            categoryCheckboxes.forEach(cb => {
                cb.checked = cb.value === initialCategory;
            });
        } else {
            document.querySelector('.tab[data-category="all"]')?.classList.add("active");
        }

        applyFilters();
    } catch (error) {
        productGrid.innerHTML = `<p class="muted">failed to load products.</p>`;
        console.error("load error:", error);
    }
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');

        activeTab = tab.dataset.category;

        if (activeTab === 'all') {
            categoryCheckboxes.forEach(cb => cb.checked = false);
        } else {
            categoryCheckboxes.forEach(cb => {
                cb.checked = cb.value === activeTab;
            });
        }

        applyFilters();
    });
});

categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        const checkedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        tabs.forEach(item => item.classList.remove('active'));

        if (checkedCategories.length === 1) {
            activeTab = checkedCategories[0];
            document.querySelector(`.tab[data-category="${activeTab}"]`)?.classList.add('active');
        } else {
            activeTab = 'all';
            document.querySelector(`.tab[data-category="all"]`)?.classList.add('active');
        }

        applyFilters();
    });
});

minPriceInput.addEventListener('input', applyFilters);
maxPriceInput.addEventListener('input', applyFilters);

filterHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const targetId = header.dataset.target;
        const target = document.getElementById(targetId);
        const symbol = header.querySelector('.toggle-symbol');

        target.classList.toggle('collapsed');
        symbol.textContent = target.classList.contains('collapsed') ? '+' : '−';
    });
});


if (searchInput) {
    searchInput.addEventListener("input", () => {
        applyFilters();
    });
}


loadProducts();
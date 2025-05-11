
/**
 * SEMBAKO MODERN - PRODUK.JS
 * File JavaScript untuk halaman produk
 * Fitur: Menampilkan produk, filter kategori, pencarian, keranjang belanja, dan stok
 */

// ==================== DATA PRODUK ====================
const allProducts = [
    {
        id: 1,
        name: "Beras Premium 5kg",
        price: 58500,
        discount: 65000,
        image: "images/beras.jpg",
        rating: 4.5,
        category: "Beras",
        description: "Beras premium kualitas terbaik",
        stock: 10
    },
    {
        id: 2,
        name: "Minyak Goreng 2L",
        price: 30400,
        discount: 32000,
        image: "images/minyak.jpg",
        rating: 4,
        category: "Minyak",
        description: "Minyak goreng",
        stock: 15
    },
    {
        id: 3,
        name: "Gula Pasir 1kg",
        price: 15000,
        image: "images/gula.jpg",
        rating: 5,
        category: "Sembako Dasar",
        description: "Gula pasir kristal putih",
        stock: 20
    },
    {
        id: 4,
        name: "Telur Ayam 1kg",
        price: 28000,
        image: "images/product-telur.jpg",
        rating: 4.5,
        category: "Sembako Dasar",
        description: "Telur ayam segar",
        stock: 30
    },
    {
        id: 5,
        name: "Tepung Terigu 1kg",
        price: 12000,
        image: "images/product-terigu.jpg",
        rating: 4,
        category: "Beras & Padi-padian",
        description: "Tepung terigu protein sedang",
        stock: 25
    },
    {
        id: 6,
        name: "Kecap Manis 300ml",
        price: 15000,
        image: "images/product-kecap.jpg",
        rating: 4.5,
        category: "Bumbu Dapur",
        description: "Kecap manis kental",
        stock: 18
    },
    {
        id: 7,
        name: "Mie Instan Ayam Bawang",
        price: 3200,
        image: "images/product-mie.jpg",
        rating: 4.5,
        category: "Makanan Instan",
        description: "Mie instan rasa ayam bawang",
        stock: 100
    },
    {
        id: 8,
        name: "Kopi Sachet 10x20gr",
        price: 9800,
        image: "images/product-kopi.jpg",
        rating: 4,
        category: "Minuman",
        description: "Kopi instan hitam pekat",
        stock: 50
    },
    {
        id: 9,
        name: "Sabun Mandi Batang",
        price: 3000,
        image: "images/product-sabun.jpg",
        rating: 4.3,
        category: "Kebutuhan Rumah Tangga",
        description: "Sabun batang wangi segar",
        stock: 80
    },
    {
        id: 10,
        name: "Susu Bubuk Sachet 40gr",
        price: 5000,
        image: "images/product-susu.jpg",
        rating: 4.6,
        category: "Minuman",
        description: "Susu bubuk manis untuk anak dan dewasa",
        stock: 60
    },
    {
        id: 11,
        name: "Air Mineral 600ml",
        price: 3500,
        image: "images/product-air.jpg",
        rating: 5,
        category: "Minuman",
        description: "Air mineral segar dalam botol",
        stock: 200
    }
];

// ==================== VARIABEL GLOBAL ====================
let cart = [];
let total = 0;
let currentProducts = [...allProducts];

// ==================== FUNGSI UTAMA ====================
function init() {
    loadProducts();
    setupCategoryFilters();
    setupSearch();
    setupCart();
    setupMobileMenu();
    checkURLSearchParams();
    console.log("Aplikasi produk siap digunakan!");
}

function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    currentProducts = category === 'all' ? [...allProducts] : allProducts.filter(product => product.category === category);
    productsGrid.innerHTML = '';

    if (currentProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Produk tidak ditemukan</p>';
        return;
    }

    currentProducts.forEach(product => {
        productsGrid.appendChild(createProductElement(product));
    });
}

function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    const discountBadge = product.discount 
        ? `<div class="discount">-${calculateDiscountPercent(product)}%</div>` 
        : '';

    const priceHTML = product.discount
        ? `<h4>Rp${product.discount.toLocaleString('id-ID')}</h4>
           <h3>Rp${product.price.toLocaleString('id-ID')}</h3>`
        : `<h3>Rp${product.price.toLocaleString('id-ID')}</h3>`;

    const disabledClass = product.stock <= 0 ? 'disabled' : '';

    productDiv.innerHTML = `
        <div class="product-header">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${discountBadge}
        </div>
        <div class="product-footer">
            <h3>${product.name}</h3>
            <div class="rating">${renderRatingStars(product.rating)}</div>
            <div class="product-price">${priceHTML}</div>
            <p class="product-desc">${product.description}</p>
            <p class="product-stock">Stok: ${product.stock > 0 ? product.stock : 'Habis'}</p>
        </div>
        <ul>
            <li><a href="#"><i class="far fa-eye"></i></a></li>
            <li><a href="#"><i class="far fa-heart"></i></a></li>
            <li><a href="#" class="add-to-cart ${disabledClass}" 
                   data-id="${product.id}"
                   data-product="${product.name}" 
                   data-price="${product.price}">
                <i class="fas fa-shopping-cart"></i>
            </a></li>
        </ul>
    `;
    return productDiv;
}

// ==================== FITUR FILTER & PENCARIAN ====================
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadProducts(this.dataset.category);
        });
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search-form input');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.search-form').classList.toggle('active');
    });

    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchProducts(searchInput.value);
        }
    });
}

function checkURLSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        document.querySelector('.search-form input').value = searchQuery;
        searchProducts(searchQuery);
    }
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    currentProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    loadProducts();
}

// ==================== FITUR KERANJANG BELANJA ====================
function setupCart() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.closest('.add-to-cart');
            if (button.classList.contains('disabled')) return;
            addToCart(button.dataset.id, button.dataset.product, parseInt(button.dataset.price));
        }
    });

    document.getElementById('orderForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitOrder();
    });
}

function addToCart(id, productName, price) {
    const product = allProducts.find(p => p.id == id);
    if (!product || product.stock <= 0) {
        showNotification('Stok habis untuk produk ini', 'error');
        return;
    }
    product.stock -= 1;
    cart.push({ product: productName, price });
    total += price;
    updateCartDisplay();
    updateOrderForm();
    loadProducts();
    showNotification(`${productName} ditambahkan ke keranjang`);
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;
}

function updateOrderForm() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    if (orderItems && orderTotal) {
        orderItems.value = cart.map(item =>
            `- ${item.product} (Rp${item.price.toLocaleString('id-ID')})`
        ).join('\n');
        orderTotal.value = `Rp${total.toLocaleString('id-ID')}`;
    }
}

function submitOrder() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    if (!name || !phone || !address || cart.length === 0) {
        showNotification('Harap lengkapi semua field dan tambahkan produk', 'error');
        return;
    }

    const message = `Halo SembakoModern, saya ingin memesan:\n\n${document.getElementById('orderItems').value}\nTotal: ${document.getElementById('orderTotal').value}\n\nNama: ${name}\nNo. HP: ${phone}\nAlamat: ${address}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
}

// ==================== FUNGSI PENDUKUNG ====================
function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) starsHTML += '<i class="fas fa-star"></i>';
        else if (i === fullStars + 1 && hasHalfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
        else starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

function calculateDiscountPercent(product) {
    return Math.round((product.discount - product.price) / product.discount * 100);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => notification.remove(), 3000);
    }, 10);
}

function setupMobileMenu() {
    document.querySelector('.menu-btn')?.addEventListener('click', function() {
        document.querySelector('.navbar').classList.toggle('active');
        this.classList.toggle('fa-times');
    });
}

// ==================== INISIALISASI APLIKASI ====================
document.addEventListener('DOMContentLoaded', init);

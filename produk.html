/**
 * SEMBAKO MODERN - PRODUK.JS
 * File JavaScript untuk halaman produk
 * Fitur: Menampilkan produk, filter kategori, pencarian, keranjang belanja
 */

// ==================== DATA PRODUK ====================
const allProducts = [
    {
        id: 1,
        name: "Beras Premium 5kg",
        price: 58500,
        discount: 65000,
        image: "images/product-beras.png",
        rating: 4.5,
        category: "Beras & Padi-padian",
        description: "Beras premium kualitas terbaik"
    },
    {
        id: 2,
        name: "Minyak Goreng 2L",
        price: 30400,
        discount: 32000,
        image: "images/product-minyak.png",
        rating: 4,
        category: "Minyak & Lemak",
        description: "Minyak goreng sawit murni"
    },
    {
        id: 3,
        name: "Gula Pasir 1kg",
        price: 15000,
        image: "images/product-gula.png",
        rating: 5,
        category: "Sembako Dasar",
        description: "Gula pasir kristal putih"
    },
    {
        id: 4,
        name: "Telur Ayam 1kg",
        price: 28000,
        image: "images/product-telur.png",
        rating: 4.5,
        category: "Sembako Dasar",
        description: "Telur ayam segar"
    },
    {
        id: 5,
        name: "Tepung Terigu 1kg",
        price: 12000,
        image: "images/product-terigu.png",
        rating: 4,
        category: "Beras & Padi-padian",
        description: "Tepung terigu protein sedang"
    },
    {
        id: 6,
        name: "Kecap Manis 300ml",
        price: 15000,
        image: "images/product-kecap.png",
        rating: 4.5,
        category: "Bumbu Dapur",
        description: "Kecap manis kental"
    }
];

// ==================== VARIABEL GLOBAL ====================
let cart = [];
let total = 0;
let currentProducts = [...allProducts];

// ==================== FUNGSI UTAMA ====================

/**
 * Inisialisasi semua fungsi saat halaman dimuat
 */
function init() {
    loadProducts();
    setupCategoryFilters();
    setupSearch();
    setupCart();
    setupMobileMenu();
    checkURLSearchParams();
    
    console.log("Aplikasi produk siap digunakan!");
}

/**
 * Memuat produk ke dalam grid
 * @param {string} category - Kategori produk yang akan dimuat
 */
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    
    // Filter produk berdasarkan kategori
    currentProducts = category === 'all' 
        ? [...allProducts] 
        : allProducts.filter(product => product.category === category);
    
    // Kosongkan grid
    productsGrid.innerHTML = '';
    
    // Tampilkan pesan jika tidak ada produk
    if (currentProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Produk tidak ditemukan</p>';
        return;
    }
    
    // Tambahkan produk ke grid
    currentProducts.forEach(product => {
        productsGrid.appendChild(createProductElement(product));
    });
}

/**
 * Membuat elemen produk
 * @param {Object} product - Objek produk
 * @returns {HTMLElement} Elemen produk
 */
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
    // Badge diskon
    const discountBadge = product.discount 
        ? `<div class="discount">-${calculateDiscountPercent(product)}%</div>` 
        : '';
    
    // Harga produk
    const priceHTML = product.discount
        ? `<h4>Rp${product.discount.toLocaleString('id-ID')}</h4>
           <h3>Rp${product.price.toLocaleString('id-ID')}</h3>`
        : `<h3>Rp${product.price.toLocaleString('id-ID')}</h3>`;
    
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
        </div>
        <ul>
            <li><a href="#"><i class="far fa-eye"></i></a></li>
            <li><a href="#"><i class="far fa-heart"></i></a></li>
            <li><a href="#" class="add-to-cart" 
                 data-product="${product.name}" 
                 data-price="${product.price}">
                <i class="fas fa-shopping-cart"></i>
            </a></li>
        </ul>
    `;
    
    return productDiv;
}

// ==================== FITUR FILTER & PENCARIAN ====================

/**
 * Setup filter kategori
 */
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update UI filter aktif
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Load produk berdasarkan kategori
            loadProducts(this.dataset.category);
        });
    });
}

/**
 * Setup fungsi pencarian
 */
function setupSearch() {
    const searchInput = document.querySelector('.search-form input');
    const searchBtn = document.querySelector('.search-btn');
    
    // Toggle form pencarian
    searchBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.search-form').classList.toggle('active');
    });
    
    // Pencarian saat tekan Enter
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchProducts(searchInput.value);
        }
    });
}

/**
 * Cek parameter URL untuk pencarian
 */
function checkURLSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        document.querySelector('.search-form input').value = searchQuery;
        searchProducts(searchQuery);
    }
}

/**
 * Fungsi pencarian produk
 * @param {string} query - Kata kunci pencarian
 */
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

/**
 * Setup fungsi keranjang belanja
 */
function setupCart() {
    // Tambah ke keranjang
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const button = e.target.closest('.add-to-cart');
            addToCart(button.dataset.product, parseInt(button.dataset.price));
        }
    });
    
    // Submit form pemesanan
    document.getElementById('orderForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitOrder();
    });
}

/**
 * Tambah produk ke keranjang
 * @param {string} productName - Nama produk
 * @param {number} price - Harga produk
 */
function addToCart(productName, price) {
    cart.push({ product: productName, price });
    total += price;
    
    updateCartDisplay();
    updateOrderForm();
    showNotification(`${productName} ditambahkan ke keranjang`);
}

/**
 * Update tampilan keranjang
 */
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;
}

/**
 * Update form pemesanan
 */
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

/**
 * Submit pesanan ke WhatsApp
 */
function submitOrder() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    
    // Validasi form
    if (!name || !phone || !address || cart.length === 0) {
        showNotification('Harap lengkapi semua field dan tambahkan produk', 'error');
        return;
    }
    
    // Format pesan WhatsApp
    const message = `Halo SembakoModern, saya ingin memesan:\n\n${document.getElementById('orderItems').value}\nTotal: ${document.getElementById('orderTotal').value}\n\nNama: ${name}\nNo. HP: ${phone}\nAlamat: ${address}`;
    
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
}

// ==================== FUNGSI PENDUKUNG ====================

/**
 * Render rating bintang
 * @param {number} rating - Nilai rating (0-5)
 * @returns {string} HTML rating bintang
 */
function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    return starsHTML;
}

/**
 * Hitung persentase diskon
 * @param {Object} product - Objek produk
 * @returns {number} Persentase diskon
 */
function calculateDiscountPercent(product) {
    return Math.round((product.discount - product.price) / product.discount * 100);
}

/**
 * Tampilkan notifikasi
 * @param {string} message - Pesan notifikasi
 * @param {string} type - Tipe notifikasi (success/error)
 */
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

/**
 * Setup menu mobile
 */
function setupMobileMenu() {
    document.querySelector('.menu-btn')?.addEventListener('click', function() {
        document.querySelector('.navbar').classList.toggle('active');
        this.classList.toggle('fa-times');
    });
}

// ==================== INISIALISASI APLIKASI ====================
document.addEventListener('DOMContentLoaded', init);
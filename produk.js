// ==================== DATA PRODUK ====================
const allProducts = [
    { id: 1, name: "Beras Premium 5kg", price: 58500, discount: 65000, image: "images/product-beras.jpg", rating: 4.5, category: "Beras & Padi-padian", description: "Beras premium kualitas terbaik", stock: 10 },
    { id: 2, name: "Minyak Goreng 2L", price: 30400, discount: 32000, image: "images/product-minyak.jpg", rating: 4, category: "Minyak & Lemak", description: "Minyak goreng kualitas terbaik", stock: 15 },
    { id: 3, name: "Gula Pasir 1kg", price: 15000, discount: null, image: "images/product-gula.jpg", rating: 5, category: "Sembako Dasar", description: "Gula pasir kristal putih", stock: 20 },
    { id: 4, name: "Telur Ayam 1kg", price: 28000, discount: null, image: "images/product-telur.png", rating: 4.5, category: "Sembako Dasar", description: "Telur ayam segar", stock: 30 },
    { id: 5, name: "Tepung Terigu 1kg", price: 12000, discount: null, image: "images/product-terigu.jpg", rating: 4, category: "Beras & Padi-padian", description: "Tepung terigu protein sedang", stock: 25 },
    { id: 6, name: "Kecap Manis 300ml", price: 15000, discount: null, image: "images/product-kecap.jpg", rating: 4.5, category: "Bumbu Dapur", description: "Kecap manis kental", stock: 18 },
    { id: 7, name: "Mie Instan Ayam Bawang", price: 3200, discount: null, image: "images/product-mie.jpg", rating: 4.5, category: "Makanan Instan", description: "Mie instan rasa ayam bawang", stock: 100 },
    { id: 8, name: "Kopi Sachet 10x20gr", price: 9800, discount: null, image: "images/product-kopi.jpg", rating: 4, category: "Minuman", description: "Kopi instan hitam pekat", stock: 50 },
    { id: 9, name: "Sabun Mandi Batang", price: 3000, discount: null, image: "images/product-sabun.jpg", rating: 4.3, category: "Kebutuhan Rumah Tangga", description: "Sabun batang wangi segar", stock: 80 },
    { id: 10, name: "Susu Bubuk Sachet 40gr", price: 5000, discount: null, image: "images/product-susu.jpg", rating: 4.6, category: "Minuman", description: "Susu bubuk manis untuk anak dan dewasa", stock: 60 },
    { id: 11, name: "Air Mineral 600ml", price: 3500, discount: null, image: "images/product-air.jpg", rating: 5, category: "Minuman", description: "Air mineral segar dalam botol", stock: 200 }
];

let cart = [];
let currentProducts = [...allProducts];

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupCategoryFilters();
});

// ==================== Load Produk ====================
function loadProducts(category = 'all') {
    const grid = document.getElementById('productsGrid');
    currentProducts = category === 'all' ? [...allProducts] : allProducts.filter(p => p.category === category);
    grid.innerHTML = '';
    if (!currentProducts.length) {
        grid.innerHTML = '<p class="no-products">Produk tidak ditemukan</p>';
        return;
    }
    currentProducts.forEach(p => grid.appendChild(createProductCard(p)));
}

// ==================== Create Product Card ====================
function createProductCard(p) {
    const div = document.createElement('div');
    div.className = 'product-card';
    const discountBadge = p.discount ? `<div class="badge">-${Math.round((p.discount - p.price)/p.discount*100)}%</div>` : '';
    const priceHTML = p.discount ? `<span class="old">Rp${p.discount.toLocaleString('id-ID')}</span> <span class="new">Rp${p.price.toLocaleString('id-ID')}</span>` : `<span class="new">Rp${p.price.toLocaleString('id-ID')}</span>`;
    div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="product-img">
        ${discountBadge}
        <h4 class="product-name">${p.name}</h4>
        <div class="rating">${renderStars(p.rating)}</div>
        <div class="price">${priceHTML}</div>
        <button class="add-btn" onclick="addToCart(${p.id})" ${p.stock<=0 ? 'disabled' : ''}>${p.stock > 0 ? 'Tambah' : 'Habis'}</button>
    `;
    return div;
}

// ==================== Star Rating ====================
function renderStars(rating) {
    let stars = '';
    const full = Math.floor(rating), half = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
        stars += i <= full ? '<i class="fas fa-star"></i>' : (i === full + 1 && half ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>');
    }
    return stars;
}

// ==================== Cart ====================
function addToCart(id) {
    const prod = allProducts.find(x => x.id === id);
    if (!prod || prod.stock <= 0) return;
    prod.stock--;
    cart.push(prod);
    document.querySelector('.cart-count').textContent = cart.length;
}

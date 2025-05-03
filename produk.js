// Data produk
const allProducts = [
    {
        id: 1,
        name: "Beras Premium 5kg",
        price: 58500,
        discount: 65000,
        image: "images/product-beras.png",
        rating: 4.5,
        category: "Beras & Padi-padian"
    },
    // ... data produk lainnya ...
];

// Inisialisasi keranjang
let cart = [];
let total = 0;

// Fungsi untuk memuat produk
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? allProducts 
        : allProducts.filter(product => product.category === category);
    
    filteredProducts.forEach(product => {
        const productElement = createProductElement(product);
        productsGrid.appendChild(productElement);
    });
}

// Fungsi untuk membuat elemen produk
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
    // ... (sama dengan fungsi createProductElement sebelumnya) ...
    
    return productDiv;
}

// Fungsi untuk filter kategori
function setupCategoryFilters() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            loadProducts(this.dataset.category);
        });
    });
}

// Event listener untuk halaman produk
document.addEventListener('DOMContentLoaded', function() {
    // Load semua produk awal
    loadProducts();
    
    // Setup filter kategori
    setupCategoryFilters();
    
    // ... (kode keranjang belanja dari script.js) ...
});
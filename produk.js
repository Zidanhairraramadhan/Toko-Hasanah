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
    {
        id: 2,
        name: "Minyak Goreng 2L",
        price: 30400,
        discount: 32000,
        image: "images/product-minyak.png",
        rating: 4,
        category: "Minyak & Lemak"
    }
    // ... tambahkan produk lainnya
];

let cart = [];
let total = 0;

function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? allProducts 
        : allProducts.filter(product => product.category === category);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Produk tidak ditemukan</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        productsGrid.appendChild(createProductElement(product));
    });
}

function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
    let discountBadge = '';
    if (product.discount) {
        const discountPercent = Math.round((product.discount - product.price) / product.discount * 100);
        discountBadge = `<div class="discount">-${discountPercent}%</div>`;
    }
    
    let priceHTML = `<h3>Rp${product.price.toLocaleString('id-ID')}</h3>`;
    if (product.discount) {
        priceHTML = `
            <h4>Rp${product.discount.toLocaleString('id-ID')}</h4>
            <h3>Rp${product.price.toLocaleString('id-ID')}</h3>
        `;
    }
    
    // Render rating
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
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
    
    productDiv.innerHTML = `
        <div class="product-header">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${discountBadge}
        </div>
        <div class="product-footer">
            <h3>${product.name}</h3>
            <div class="rating">${starsHTML}</div>
            <div class="product-price">${priceHTML}</div>
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

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadProducts();
    
    // Setup filters
    setupCategoryFilters();
    
    // Cart functionality
    document.getElementById('productsGrid')?.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart');
        if (addToCartBtn) {
            e.preventDefault();
            addToCart(
                addToCartBtn.dataset.product, 
                parseInt(addToCartBtn.dataset.price)
            );
        }
    });
    
    // Order form
    document.getElementById('orderForm')?.addEventListener('submit', submitOrder);
});

function addToCart(productName, price) {
    cart.push({ product: productName, price });
    total += price;
    updateCartDisplay();
    updateOrderForm();
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

function submitOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName')?.value;
    const phone = document.getElementById('customerPhone')?.value;
    const address = document.getElementById('customerAddress')?.value;
    
    if (!name || !phone || !address || cart.length === 0) {
        showNotification('Harap lengkapi semua field dan tambahkan produk', 'error');
        return;
    }
    
    const itemsText = document.getElementById('orderItems')?.value;
    const totalText = document.getElementById('orderTotal')?.value;
    
    const message = `Halo SembakoModern, saya ingin memesan:\n\n${itemsText}\nTotal: ${totalText}\n\nNama: ${name}\nNo. HP: ${phone}\nAlamat: ${address}`;
    
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }, 10);

// Fungsi untuk handle pencarian
function handleSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        document.querySelector('.search-form input').value = searchQuery;
        filterProductsBySearch(searchQuery);
    }
}

function filterProductsBySearch(query) {
    const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    renderProducts(filtered);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p class="no-results">Produk tidak ditemukan</p>';
        return;
    }
    
    products.forEach(product => {
        grid.appendChild(createProductElement(product));
    });
}

// Panggil di DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupCategoryFilters();
    handleSearch(); // Tambahkan ini
    
    // ... kode lainnya
});

}
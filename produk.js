/**
 * SEMBAKO MODERN - PRODUK.JS (VERSI FINAL YANG DIPERBAIKI)
 * Fitur: Menampilkan produk, filter kategori, pencarian, keranjang belanja, dan stok
 */

document.addEventListener('DOMContentLoaded', function() {

    // ... Data produk (tidak ada perubahan) ...
    const allProducts = [
        // Setiap produk sekarang memiliki ID yang unik
        { id: 1, name: "Beras Premium 5kg", price: 58500, discount: 65000, image: "beras.jpg", rating: 4.5, category: "Kebutuhan Rumah Tangga", description: "Beras premium kualitas terbaik", stock: 10 },
        { id: 2, name: "Minyak Goreng 2L", price: 30400, discount: 32000, image: "minyak.jpg", rating: 4, category: "Kebutuhan Rumah Tangga", description: "Minyak goreng", stock: 15 },
        { id: 3, name: "Gula Pasir 1kg", price: 15000, image: "gula.jpg", rating: 5, category: "Sembako Dasar", description: "Gula pasir kristal putih", stock: 20 },
        { id: 4, name: "Telur Ayam 1kg", price: 28000, image: "telur.jpg", rating: 4.5, category: "Sembako Dasar", description: "Telur ayam segar", stock: 30 },
        { id: 5, name: "Tepung Terigu 1kg", price: 12000, image: "images/product-terigu.png", rating: 4, category: "Kebutuhan Rumah Tangga", description: "Tepung terigu protein sedang", stock: 25 },
        { id: 6, name: "Kecap Manis 300ml", price: 15000, image: "images/product-kecap.png", rating: 4.5, category: "Bumbu Dapur", description: "Kecap manis kental", stock: 18 },
        { id: 7, name: "Mie Instan Ayam Bawang", price: 3200, image: "images/product-mie.png", rating: 4.5, category: "Makanan Instan", description: "Mie instan rasa ayam bawang", stock: 100 },
        { id: 8, name: "Kopi Sachet 10x20gr", price: 9800, image: "images/product-kopi.png", rating: 4, category: "Minuman", description: "Kopi instan hitam pekat", stock: 50 },
        { id: 9, name: "Sabun Mandi Batang", price: 3000, image: "images/product-sabun.png", rating: 4.3, category: "Kebutuhan Rumah Tangga", description: "Sabun batang wangi segar", stock: 80 },
        { id: 10, name: "Susu frisian flag", price: 13500, image: "images/product-susu.png", rating: 4.6, category: "Minuman", description: "Susu bubuk manis untuk anak dan dewasa", stock: 60 },
        { id: 11, name: "Air Mineral 600ml", price: 3500, image: "images/product-air.png", rating: 5, category: "Minuman", description: "Air mineral segar dalam botol", stock: 200 },
        { id: 12, name: "Mie Sedap Rebus Soto", price: 3200, image: "images/product-mie.png", rating: 4.5, category: "Makanan Instan", description: "Mie instan Sedap Rasa Soto", stock: 100 },
        { id: 13, name: "Mie Instan Sedap Goreng", price: 3200, image: "images/product-mie.png", rating: 4.5, category: "Makanan Instan", description: "Mie instan Sedap Goreng", stock: 100 },
        { id: 14, name: "Surya 12", price: 26000, image: "images/product-rokok.png", rating: 4.5, category: "Rokok", description: "Gudang garam", stock: 100 },
        { id: 15, name: "Promag", price: 1000, image: "images/product-promax.png", rating: 4.5, category: "Obat Obatan", description: "Ahlinya lambung", stock: 100 },
        { id: 16, name: "Koyo", price: 1000, image: "images/product-Koyo.png", rating: 4.5, category: "Obat Obatan", description: "Meredakan encok", stock: 100 },
        { id: 17, name: "Bodrexin", price: 1000, image: "images/product-Bodrexin.png", rating: 4.5, category: "Obat Obatan", description: "Menurunkan panas anak-anak", stock: 100 },
        { id: 18, name: "Bodrex", price: 1000, image: "images/product-Bodrex.png", rating: 4.5, category: "Obat Obatan", description: "Obat menurunkan demam dll", stock: 100 },
    ];
    // ... Elemen DOM ...
    let cart = [];
    const productsGrid = document.getElementById('productsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.getElementById('navbar');
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.getElementById('search-form');

    // ... updateProductView() & renderProducts() (tidak ada perubahan) ...

    /**
     * Fungsi untuk membuat satu elemen HTML produk
     * @param {object} product - Objek produk
     */
    function createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const discountBadge = product.discount ? `<div class="discount">-${Math.round((product.discount - product.price) / product.discount * 100)}%</div>` : '';
        const priceHTML = product.discount ? `<h4>Rp${product.discount.toLocaleString('id-ID')}</h4><h3>Rp${product.price.toLocaleString('id-ID')}</h3>` : `<h3>Rp${product.price.toLocaleString('id-ID')}</h3>`;
        const disabledClass = product.stock <= 0 ? 'disabled' : '';
        
        // FIXED: Added width, height, and loading="lazy" to the dynamically created image tag.
        // This is critical to prevent CLS on the product page.
        // We assume a consistent 250x250 size for product grid images.
        productDiv.innerHTML = `
            <div class="product-header">
                <img src="${product.image}" alt="${product.name}" width="250" height="250" loading="lazy">
                ${discountBadge}
            </div>
            <div class="product-footer">
                <h3>${product.name}</h3>
                <div class="rating">${renderRatingStars(product.rating)}</div>
                <div class="product-price">${priceHTML}</div>
                <p class="product-desc">${product.description}</p>
                <p class="product-stock" data-id="${product.id}">Stok: ${product.stock > 0 ? product.stock : 'Habis'}</p>
            </div>
            <ul>
                <li><a href="#" aria-label="Lihat Detail"><i class="far fa-eye"></i></a></li>
                <li><a href="#" aria-label="Tambah ke Favorit"><i class="far fa-heart"></i></a></li>
                <li><a href="#" class="add-to-cart ${disabledClass}" data-id="${product.id}" aria-label="Tambah ke Keranjang"><i class="fas fa-shopping-cart"></i></a></li>
            </ul>`;
        return productDiv;
    }

    // ... Sisa JavaScript (tidak ada perubahan besar) ...
    // ... init(); ...
});
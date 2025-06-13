// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {

    // === ELEMEN DOM YANG SERING DIGUNAKAN ===
    // IMPROVEMENT: Add checks to ensure elements exist before using them.
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('searchInput');
    const productContainer = document.querySelector('.product-container'); // FIXED: Target the container, not individual items
    const cartCount = document.querySelector('.cart-count');
    const cartIcon = document.querySelector('.cart-btn');
    const orderForm = document.getElementById('orderForm');
    const allNavLinks = document.querySelectorAll('a[href^="#"]');

    // === STATE APLIKASI ===
    let cart = [];
    let total = 0;

    // ===================================
    // === FUNGSI-FUNGSI UTAMA ===
    // ===================================

    // --- 1. Fungsi untuk Toggle Menu Mobile ---
    function toggleMenu() {
        navbar.classList.toggle('active');
    }

    // --- 2. Fungsi untuk Menampilkan/Menyembunyikan Form Pencarian ---
    function toggleSearchForm() {
        searchForm.classList.toggle('active');
        if (searchForm.classList.contains('active')) {
            searchInput.focus();
        }
    }

    // --- 3. Fungsi untuk menyaring produk berdasarkan input pencarian ---
    // IMPROVEMENT: Simplified logic for showing "no results" message.
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let productsFound = 0;
        const productItems = productContainer.querySelectorAll('.product');

        productItems.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const isMatch = productName.includes(searchTerm);
            product.style.display = isMatch ? 'flex' : 'none';
            if (isMatch) productsFound++;
        });

        // Handle "no results" message
        let noResultsMessage = productContainer.querySelector('.no-results');
        if (productsFound === 0 && !noResultsMessage) {
            const message = document.createElement('p');
            message.className = 'no-results';
            message.textContent = 'Produk tidak ditemukan.';
            productContainer.appendChild(message);
        } else if (productsFound > 0 && noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    // --- 4. Fungsi untuk Smooth Scrolling ---
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
        }
    }

    // --- 5. Fungsi untuk Header Sticky ---
    // IMPROVEMENT: Using IntersectionObserver for better performance than 'scroll' event.
    function handleStickyHeader(entries) {
        entries.forEach(entry => {
            if (header) {
                 // When the sentinel is NOT intersecting (i.e., scrolled past the top), make header sticky.
                header.classList.toggle('sticky', !entry
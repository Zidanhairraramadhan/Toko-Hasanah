// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {

    // === ELEMEN DOM YANG SERING DIGUNAKAN ===
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('searchInput');
    const productItems = document.querySelectorAll('.product');
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
        // Kita tidak perlu toggle ikon di sini karena akan ditangani oleh penutupan otomatis
    }

    // --- 2. Fungsi untuk Menampilkan/Menyembunyikan Form Pencarian ---
    function toggleSearchForm() {
        searchForm.classList.toggle('active');
        if (searchForm.classList.contains('active')) {
            searchInput.focus();
        }
    }

    // --- 3. Fungsi untuk menyaring produk berdasarkan input pencarian ---
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let productsFound = false;

        productItems.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const isMatch = productName.includes(searchTerm);
            product.style.display = isMatch ? 'flex' : 'none';
            if(isMatch) productsFound = true;
        });
        
        // Menampilkan pesan jika tidak ada produk yang ditemukan
        const noResultsMessage = document.querySelector('.no-results');
        if (!productsFound && !noResultsMessage) {
            const container = document.querySelector('.product-container');
            if(container) {
                 const message = document.createElement('p');
                 message.className = 'no-results';
                 message.textContent = 'Produk tidak ditemukan.';
                 container.appendChild(message);
            }
        } else if (productsFound && noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    // --- 4. Fungsi untuk Smooth Scrolling ---
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
        
        // Tutup navbar mobile jika terbuka setelah klik
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
        }
    }

    // --- 5. Fungsi untuk Header Sticky ---
    function handleStickyHeader() {
        header.classList.toggle('sticky', window.scrollY > 0);
    }

    // --- 6. Fungsi untuk Menambahkan Produk ke Keranjang ---
    function addToCart(e) {
        e.preventDefault();
        const productData = this.dataset;
        const product = {
            name: productData.product,
            price: parseInt(productData.price)
        };

        cart.push(product);
        total += product.price;

        updateCartDisplay();
        updateOrderForm();
        animateAddToCart(this);
        showNotification(`${product.name} telah ditambahkan ke keranjang!`);
    }

    // --- 7. Fungsi untuk Update Tampilan Keranjang ---
    function updateCartDisplay() {
        cartCount.textContent = cart.length;
        cartIcon.classList.add('animate');
        setTimeout(() => {
            cartIcon.classList.remove('animate');
        }, 500);
    }
    
    // --- 8. Fungsi untuk Animasi Tombol Add to Cart ---
    function animateAddToCart(button) {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('added');
        
        // Nonaktifkan tombol sementara
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('added');
            button.disabled = false; // Aktifkan kembali tombol
        }, 1500);
    }
    
    // --- 9. Fungsi untuk Update Form Pemesanan ---
    function updateOrderForm() {
        const orderItemsEl = document.getElementById('orderItems');
        const orderTotalEl = document.getElementById('orderTotal');
        
        const itemsText = cart.map(item => `- ${item.name} (Rp${item.price.toLocaleString('id-ID')})`).join('\n');
        
        orderItemsEl.value = itemsText;
        orderTotalEl.value = `Rp${total.toLocaleString('id-ID')}`;
    }

    // --- 10. Fungsi untuk Mengirim Pesanan via WhatsApp ---
    function submitOrder(e) {
        e.preventDefault();

        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;
        const items = document.getElementById('orderItems').value;
        const totalValue = document.getElementById('orderTotal').value;

        if (!name || !phone || !address || cart.length === 0) {
            showNotification('Harap lengkapi data dan pilih produk!', 'error');
            return;
        }

        const message = `Halo SembakoModern, saya ingin memesan:\n\n${items}\n\n*Total: ${totalValue}*\n\n*Data Pemesan:*\nNama: ${name}\nNo. HP/WA: ${phone}\nAlamat Pengiriman: ${address}\n\nTerima kasih.`;
        const encodedMessage = encodeURIComponent(message);
        
        window.open(`https://wa.me/6283114925705?text=${encodedMessage}`, '_blank');
        
        resetCartAndForm();
    }
    
    // --- 11. Fungsi untuk Reset Keranjang dan Form ---
    function resetCartAndForm() {
        cart = [];
        total = 0;
        updateCartDisplay();
        orderForm.reset();
        document.getElementById('orderItems').value = '';
        document.getElementById('orderTotal').value = '';
    }

    // --- 12. Fungsi untuk Menutup Elemen saat Klik di Luar ---
    function handleClickOutside(e) {
        if (!menuBtn.contains(e.target) && !navbar.contains(e.target)) {
            navbar.classList.remove('active');
        }
        if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
            searchForm.classList.remove('active');
        }
    }
    
    // --- 13. Fungsi untuk Menampilkan Notifikasi ---
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // ===================================
    // === EVENT LISTENERS ===
    // ===================================

    // Header & Navigasi
    menuBtn.addEventListener('click', toggleMenu);
    searchBtn.addEventListener('click', toggleSearchForm);
    allNavLinks.forEach(anchor => anchor.addEventListener('click', smoothScroll));

    // Pencarian Produk
    searchInput.addEventListener('keyup', filterProducts);

    // Keranjang & Pemesanan
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    orderForm.addEventListener('submit', submitOrder);
    
    // Event Listener Global
    window.addEventListener('scroll', handleStickyHeader);
    document.addEventListener('click', handleClickOutside);
});
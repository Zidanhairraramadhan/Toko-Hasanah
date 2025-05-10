// Fungsi untuk toggle menu mobile
document.querySelector('.menu-btn').addEventListener('click', function () {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');

    // Toggle ikon fa-bars <-> fa-times
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Fungsi pencarian
function setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-form');

    if (searchBtn && searchForm) {
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            searchForm.classList.toggle('active');
            if (searchForm.classList.contains('active')) {
                searchForm.querySelector('input').focus();
            }
        });

        searchForm.querySelector('input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query) {
                    window.location.href = `produk.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// Panggil di DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    setupSearch();
});

// Tutup search form jika klik di luar
document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-btn') && !e.target.closest('.search-form')) {
        const searchForm = document.querySelector('.search-form');
        if (searchForm) searchForm.classList.remove('active');
    }
});

// Smooth scroll dan tutup menu mobile
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }

        const navbar = document.querySelector('.navbar');
        const menuIcon = document.querySelector('.menu-btn i');
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            if (menuIcon.classList.contains('fa-times')) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }
    });
});

// Sticky header
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Cart logic + WhatsApp order
document.addEventListener('DOMContentLoaded', function () {
    let cart = [];
    let total = 0;

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const product = this.getAttribute('data-product');
            const price = parseInt(this.getAttribute('data-price'));

            cart.push({ product, price });
            total += price;

            updateCartDisplay();
            updateOrderForm();
            animateAddToCart(this);
        });
    });

    function updateCartDisplay() {
        document.querySelector('.cart-count').textContent = cart.length;
        const cartBtn = document.querySelector('.cart-btn');
        cartBtn.classList.add('animate');
        setTimeout(() => cartBtn.classList.remove('animate'), 500);
    }

    function animateAddToCart(button) {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('added');
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            button.classList.remove('added');
        }, 1000);
    }

    function updateOrderForm() {
        const orderItems = document.getElementById('orderItems');
        const orderTotal = document.getElementById('orderTotal');
        let itemsText = '';
        cart.forEach(item => {
            itemsText += `- ${item.product} (Rp${item.price.toLocaleString('id-ID')})\n`;
        });
        orderItems.value = itemsText;
        orderTotal.value = `Rp${total.toLocaleString('id-ID')}`;
    }

    document.getElementById('orderForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;
        const items = document.getElementById('orderItems').value;
        const total = document.getElementById('orderTotal').value;

        if (!name || !phone || !address || cart.length === 0) {
            alert('Harap lengkapi semua field dan tambahkan minimal 1 produk ke keranjang');
            return;
        }

        const message = `Halo SembakoModern, saya ingin memesan:\n\n${items}\nTotal: ${total}\n\nNama: ${name}\nNo. HP: ${phone}\nAlamat: ${address}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/6281234567890?text=${encodedMessage}`, '_blank');

        resetCart();
    });

    function resetCart() {
        cart = [];
        total = 0;
        document.querySelector('.cart-count').textContent = '0';
        document.getElementById('orderItems').value = '';
        document.getElementById('orderTotal').value = '';
        document.getElementById('orderForm').reset();
    }

    // Animasi saat elemen muncul
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.product, .promo-box, .testimonial-box, .feature');
        elements.forEach(el => {
            const position = el.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.2;
            if (position < screenPos) el.classList.add('animated');
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// Notifikasi
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

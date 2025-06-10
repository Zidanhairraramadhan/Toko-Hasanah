// Fungsi untuk toggle menu mobile
document.querySelector('.menu-btn').addEventListener('click', function() {
    document.querySelector('.navbar').classList.toggle('active');
    this.classList.toggle('fa-times');
    this.classList.toggle('fa-bars');
});

// Fungsi untuk toggle search form
document.querySelector('.search-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelector('.search-form').classList.toggle('active');
    document.querySelector('#searchInput').focus();
});

// Tutup search form ketika klik di luar
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-form') && !e.target.closest('.search-btn')) {
        document.querySelector('.search-form').classList.remove('active');
    }
});

// Fungsi pencarian produk yang lebih baik
function setupSearch() {
    const searchInput = document.querySelector('#searchInput');
    const searchSubmit = document.querySelector('.search-submit');
    const products = document.querySelectorAll('.product');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            products.forEach(product => {
                product.style.display = 'block';
            });
            return;
        }
        
        let hasResults = false;
        
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productCategory = product.querySelector('.category')?.textContent.toLowerCase() || '';
            
            if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                product.style.display = 'block';
                hasResults = true;
            } else {
                product.style.display = 'none';
            }
        });
        
        if (!hasResults) {
            showNotification('Produk tidak ditemukan', 'error');
        }
    }
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    searchSubmit.addEventListener('click', performSearch);
}

// Panggil fungsi setup saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    setupSearch();
    
    // ... kode yang ada sebelumnya tetap dipertahankan ...
    // (fungsi keranjang belanja, animasi, dll)
});

// Fungsi untuk menampilkan notifikasi
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
// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', searchProducts);


// Fungsi untuk menutup search form ketika klik di luar
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-btn') && !e.target.closest('.search-form')) {
        document.querySelector('.search-form').classList.remove('active');
    }
});

// Fungsi untuk smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        
        // Tutup navbar mobile jika terbuka
        if (document.querySelector('.navbar').classList.contains('active')) {
            document.querySelector('.navbar').classList.remove('active');
            document.querySelector('.menu-btn').classList.remove('fa-times');
        }
    });
});

// Fungsi untuk menambahkan efek scroll pada header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Fungsi untuk keranjang belanja dan pemesanan WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    let total = 0;
    
    // Tambahkan produk ke keranjang
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const product = this.getAttribute('data-product');
            const price = parseInt(this.getAttribute('data-price'));
            
            cart.push({ product, price });
            total += price;
            
            // Update tampilan keranjang
            updateCartDisplay();
            
            // Update form pemesanan
            updateOrderForm();
            
            // Animasi tambah ke keranjang
            animateAddToCart(this);
        });
    });
    
    // Fungsi untuk update tampilan keranjang
    function updateCartDisplay() {
        document.querySelector('.cart-count').textContent = cart.length;
        
        // Tambahkan animasi keranjang
        const cartBtn = document.querySelector('.cart-btn');
        cartBtn.classList.add('animate');
        setTimeout(() => {
            cartBtn.classList.remove('animate');
        }, 500);
    }
    
    // Fungsi untuk animasi tombol tambah ke keranjang
    function animateAddToCart(button) {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('added');
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            button.classList.remove('added');
        }, 1000);
    }
    
    // Fungsi untuk update form pemesanan
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
    
    // Submit form pemesanan
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;
        const items = document.getElementById('orderItems').value;
        const total = document.getElementById('orderTotal').value;
        
        // Validasi form
        if (!name || !phone || !address || cart.length === 0) {
            alert('Harap lengkapi semua field dan tambahkan minimal 1 produk ke keranjang');
            return;
        }
        
        // Format pesan WhatsApp
        const message = `Halo SembakoModern, saya ingin memesan:\n\n${items}\nTotal: ${total}\n\nNama: ${name}\nNo. HP: ${phone}\nAlamat: ${address}`;
        
        // Encode message untuk URL
        const encodedMessage = encodeURIComponent(message);
        
        // Redirect ke WhatsApp
        window.open(`https://wa.me/6283114925705?text=${encodedMessage}`, '_blank');
        
        // Reset form dan keranjang setelah pengiriman
        resetCart();
    });
    
    // Fungsi untuk reset keranjang
    function resetCart() {
        cart = [];
        total = 0;
        document.querySelector('.cart-count').textContent = '0';
        document.getElementById('orderItems').value = '';
        document.getElementById('orderTotal').value = '';
        document.getElementById('orderForm').reset();
    }
    
    // Animasi untuk elemen ketika muncul di viewport
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.product, .promo-box, .testimonial-box, .feature');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Jalankan sekali saat load
});


document.addEventListener('DOMContentLoaded', async function() {
    // === Verifikasi Login di Awal Halaman ===
    try {
        const authResponse = await fetch('http://localhost:3000/api/check-auth', {credentials: 'include'});
        const authData = await authResponse.json();
        if (!authData.loggedIn) {
            // Jika tidak login, tendang ke halaman login
            window.location.href = 'login.html';
            return; // Hentikan eksekusi sisa skrip
        }
    } catch (error) {
        // Jika server tidak bisa dihubungi, tendang juga
        window.location.href = 'login.html';
        return;
    }
    // ==========================================


    const API_URL = 'http://localhost:3000/api/products';
    const SERVER_URL = 'http://localhost:3000';
    const form = document.getElementById('productForm');
    const tableBody = document.getElementById('productTableBody');
    const productIdInput = document.getElementById('productId');
    const clearBtn = document.getElementById('clearBtn');
    const logoutBtn = document.getElementById('logoutBtn'); // Tombol logout baru

    async function fetchAndRenderProducts() {
        // ... fungsi ini sama persis seperti sebelumnya ...
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            tableBody.innerHTML = '';
            products.forEach(product => {
                const imageSrc = product.image ? `${SERVER_URL}/${product.image}` : 'images/default.png';
                tableBody.innerHTML += `<tr><td><img src="${imageSrc}" alt="${product.name}"></td><td>${product.name}</td><td>Rp${product.price.toLocaleString('id-ID')}</td><td>${product.stock}</td><td class="actions"><button class="btn-edit" onclick="window.handleEdit(${product.id})">Edit</button><button class="btn-delete" onclick="window.handleDelete(${product.id})">Hapus</button></td></tr>`;
            });
        } catch(e){ console.error(e) }
    }

    // ... fungsi handleEdit dan handleDelete sama persis seperti sebelumnya ...
    window.handleEdit = async (id) => { /* ... (kode tidak berubah) ... */ };
    window.handleDelete = async (id) => { /* ... (kode tidak berubah) ... */ };
    
    form.addEventListener('submit', async function(e) {
        // ... fungsi ini sama persis seperti sebelumnya ...
        e.preventDefault();
        const id = productIdInput.value;
        const productData = { /* ... (ambil data form) ... */ };
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        // Penting: sertakan credentials agar cookie sesi terkirim
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
            credentials: 'include' 
        });
        clearForm();
        fetchAndRenderProducts();
    });

    function clearForm() {
        form.reset();
        productIdInput.value = '';
    }
    clearBtn.addEventListener('click', clearForm);

    // Fungsi untuk Logout
    logoutBtn.addEventListener('click', async () => {
        await fetch('http://localhost:3000/api/logout', { 
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = 'login.html'; // Arahkan ke halaman login setelah logout
    });

    // Muat produk saat halaman pertama kali dibuka
    fetchAndRenderProducts();
});
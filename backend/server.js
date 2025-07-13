// =================================================================
// ==      KODE SERVER.JS YANG SUDAH DIPERBAIKI (SQLite)        ==
// =================================================================

// 1. IMPORT MODUL
require('dotenv').config();
const session = require('express-session');
// const pgSession = require('connect-pg-simple')(session); // <-- DIHAPUS, tidak kompatibel dengan SQLite
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const cookieParser = require('cookie-parser');

// 2. BUAT APLIKASI EXPRESS
const app = express();
const PORT = process.env.PORT || 3000;

// 3. MIDDLEWARE & KONFIGURASI
const publicDirectoryPath = path.join(__dirname, '../');
console.log(`Aplikasi akan menyajikan file dari direktori: ${publicDirectoryPath}`);
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(cookieParser());

// Menggunakan session store bawaan (MemoryStore) yang lebih sederhana
// Ini memperbaiki error karena tidak lagi memerlukan variabel 'db' saat startup.
app.use(session({
    // store: sessionStore, // <-- DIHAPUS, karena kita pakai MemoryStore bawaan
    secret: 'ZIDAN-GANTENG-BANGET', // <-- WAJIB GANTI DENGAN KATA RAHASIA LAIN
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie berlaku selama 30 hari
        // 'secure: true' harus dinonaktifkan saat development di localhost (HTTP)
        // Aktifkan lagi hanya saat hosting online dengan HTTPS
        secure: false, 
        sameSite: 'lax'
    }
}));


// === Kredensial Admin & Database ===
let db; // Variabel db akan diisi nanti oleh initializeDatabase
const ADMIN_USER = 'admin';
const ADMIN_PASS = '12345';
// DATA PRODUK AWAL (18 PRODUK)
const initialProducts = [
    { name: "Beras Premium 5kg", price: 58500, discount: 65000, image: "images/beras.webp", rating: 4.5, category: "Kebutuhan Rumah Tangga", description: "Beras premium kualitas terbaik", stock: 10 },
    { name: "Minyak Goreng 2L", price: 30400, discount: 32000, image: "images/minyak.webp", rating: 4, category: "Kebutuhan Rumah Tangga", description: "Minyak goreng", stock: 15 },
    { name: "Gula Pasir 1kg", price: 15000, discount: null, image: "images/gula.webp", rating: 5, category: "Sembako Dasar", description: "Gula pasir kristal putih", stock: 20 },
    { name: "Telur Ayam 1kg", price: 28000, discount: null, image: "images/telur.webp", rating: 4.5, category: "Sembako Dasar", description: "Telur ayam segar", stock: 30 },
    { name: "Tepung Terigu 1kg", price: 12000, discount: null, image: "images/product-terigu.webp", rating: 4, category: "Kebutuhan Rumah Tangga", description: "Tepung terigu protein sedang", stock: 25 },
    { name: "Kecap Manis 300ml", price: 15000, discount: null, image: "images/product-kecap.webp", rating: 4.5, category: "Bumbu Dapur", description: "Kecap manis kental", stock: 18 },
    { name: "Mie Instan Ayam Bawang", price: 3200, discount: null, image: "images/product-mie.webp", rating: 4.5, category: "Makanan Instan", description: "Mie instan rasa ayam bawang", stock: 100 },
    { name: "Kopi Sachet 10x20gr", price: 9800, discount: null, image: "images/product-kopi.webp", rating: 4, category: "Minuman", description: "Kopi instan hitam pekat", stock: 50 },
    { name: "Sabun Mandi Batang", price: 3000, discount: null, image: "images/product-sabun.webp", rating: 4.3, category: "Kebutuhan Rumah Tangga", description: "Sabun batang wangi segar", stock: 80 },
    { name: "Susu frisian flag", price: 13500, discount: null, image: "images/product-susu.webp", rating: 4.6, category: "Minuman", description: "Susu bubuk manis untuk anak dan dewasa", stock: 60 },
    { name: "Air Mineral 600ml", price: 3500, discount: null, image: "images/product-air.webp", rating: 5, category: "Minuman", description: "Air mineral segar dalam botol", stock: 200 },
    { name: "Mie Sedap Rebus Soto", price: 3200, discount: null, image: "images/product-mie.webp", rating: 4.5, category: "Makanan Instan", description: "Mie instan Sedap Rasa Soto", stock: 100 },
    { name: "Mie Instan Sedap Goreng", price: 3200, discount: null, image: "images/product-mie.webp", rating: 4.5, category: "Makanan Instan", description: "Mie instan Sedap Goreng", stock: 100 },
    { name: "Surya 12", price: 26000, discount: null, image: "images/rokok.webp", rating: 4.5, category: "Rokok", description: "Gudang garam", stock: 100 },
    { name: "Promag", price: 1000, discount: null, image: "images/product-promax.webp", rating: 4.5, category: "Obat Obatan", description: "Ahlinya lambung", stock: 100 },
    { name: "Koyo", price: 1000, discount: null, image: "images/product-Koyo.webp", rating: 4.5, category: "Obat Obatan", description: "Meredakan encok", stock: 100 },
    { name: "Bodrexin", price: 1000, discount: null, image: "images/product-Bodrexin.webp", rating: 4.5, category: "Obat Obatan", description: "Menurunkan panas anak-anak", stock: 100 },
    { name: "Bodrex", price: 1000, discount: null, image: "images/product-Bodrex.webp", rating: 4.5, category: "Obat Obatan", description: "Obat menurunkan demam dll", stock: 100 },
];

async function seedDatabase() {
    const stmt = await db.prepare('INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const product of initialProducts) {
        await stmt.run(product.name, product.price, product.discount, product.image, product.rating, product.category, product.description, product.stock);
    }
    await stmt.finalize();
    console.log('Seeding selesai. 18 produk awal telah dimasukkan.');
}

async function initializeDatabase() {
    db = await open({ filename: './sembako.db', driver: sqlite3.Database });
    await db.exec(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price INTEGER NOT NULL, discount INTEGER, image TEXT, rating REAL, category TEXT, description TEXT, stock INTEGER DEFAULT 0)`);
    
    const row = await db.get('SELECT COUNT(*) as count FROM products');
    if (row.count === 0) {
        console.log('Database kosong, mengisi dengan data awal...');
        await seedDatabase();
    } else {
        console.log('Database sudah berisi data, proses seeding dilewati.');
    }
}

// === Middleware "Penjaga" ===
const checkAuth = (req, res, next) => {
    if (req.session.loggedIn) next();
    else res.status(401).json({ message: 'Akses ditolak. Silakan login.' });
};

// === API ENDPOINTS ===
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.loggedIn = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }
});
app.get('/api/check-auth', (req, res) => res.json({ loggedIn: !!req.session.loggedIn }));
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
});
app.get('/api/products', async (req, res) => {
    const products = await db.all('SELECT * FROM products ORDER BY id DESC');
    res.json(products);
});
app.post('/api/products', checkAuth, async (req, res) => {
    const { name, price, discount, image, rating, category, description, stock } = req.body;
    const result = await db.run('INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, price, discount, image, rating, category, description, stock]);
    res.status(201).json({ id: result.lastID });
});
app.put('/api/products/:id', checkAuth, async (req, res) => {
    const { name, price, discount, image, rating, category, description, stock } = req.body;
    await db.run(`UPDATE products SET name = ?, price = ?, discount = ?, image = ?, rating = ?, category = ?, description = ?, stock = ? WHERE id = ?`, [name, price, discount, image, rating, category, description, stock, req.params.id]);
    res.json({ message: 'Produk berhasil diperbarui' });
});
app.delete('/api/products/:id', checkAuth, async (req, res) => {
    await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Produk berhasil dihapus' });
});

// 5. JALANKAN SERVER
initializeDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server backend berjalan di http://localhost:${PORT}`));
}).catch(err => console.error("Gagal inisialisasi database:", err));
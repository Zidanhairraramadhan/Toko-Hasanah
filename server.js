// 1. IMPORT MODUL (Sudah disesuaikan untuk PostgreSQL)
require('dotenv').config();
const session = require('express-session');
const express = require('express');
const { Pool } = require('pg'); // <-- DIGANTI dari sqlite
const path = require('path');
const cookieParser = require('cookie-parser');
const pgSession = require('connect-pg-simple')(session); // Untuk sesi permanen

const app = express();
const PORT = process.env.PORT || 3000;

// === KONEKSI KE DATABASE POSTGRESQL ===
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// === MIDDLEWARE & KONFIGURASI (Sudah disesuaikan untuk Produksi) ===
app.set('trust proxy', 1); // <-- Penting untuk login di Railway
app.use(express.static(__dirname));
app.use(express.json());
app.use(cookieParser());

const sessionStore = new pgSession({
  pool: db,
  tableName: 'user_sessions'
});

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'ZIDAN-GANTENG-BANGET', // Ambil dari .env atau gunakan default
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Rute Health Check
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// === LOGIKA ANDA YANG SAYA PERTAHANKAN DAN PERBAIKI ===

// Kredensial Admin
const ADMIN_USER = 'zidan';
const ADMIN_PASS = '021105';

// DATA PRODUK AWAL ANDA (TIDAK DIUBAH)
const initialProducts = [
    { name: "Beras Premium 5kg", price: 58500, discount: 65000, image: "images/beras.webp", rating: 4.5, category: "Kebutuhan Rumah Tangga", description: "Beras premium kualitas terbaik", stock: 10 },
    { name: "Minyak Goreng 2L", price: 30400, discount: 32000, image: "images/minyak.webp", rating: 4, category: "Kebutuhan Rumah Tangga", description: "Minyak goreng", stock: 15 },
    { name: "Gula Pasir 1kg", price: 15000, discount: null, image: "images/gula.webp", rating: 5, category: "Sembako Dasar", description: "Gula pasir kristal putih", stock: 20 },
    // ... (semua 18 produk Anda ada di sini)
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
    const query = 'INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    for (const product of initialProducts) {
        const values = [product.name, product.price, product.discount, product.image, product.rating, product.category, product.description, product.stock];
        await db.query(query, values);
    }
    console.log('Seeding selesai. 18 produk awal telah dimasukkan.');
}

async function initializeDatabase() {
    // Membuat tabel products
    await db.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, discount INTEGER, 
            image TEXT, rating REAL, category TEXT, description TEXT, stock INTEGER DEFAULT 0
        );
    `);
    // Membuat tabel untuk sesi
    await db.query(`
        CREATE TABLE IF NOT EXISTS "user_sessions" (
            "sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL
        ) WITH (OIDS=FALSE);
        ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `);
    console.log("Semua tabel database siap digunakan.");
    
    // Mengecek dan mengisi data produk jika kosong
    const { rows } = await db.query('SELECT COUNT(*) as count FROM products');
    if (parseInt(rows[0].count) === 0) {
        console.log('Database produk kosong, mengisi dengan data awal...');
        await seedDatabase();
    } else {
        console.log('Database produk sudah berisi data, proses seeding dilewati.');
    }
}

// === API ENDPOINTS ANDA (TIDAK DIUBAH) ===
const checkAuth = (req, res, next) => { if (req.session.loggedIn) { next(); } else { res.status(401).json({ message: 'Akses ditolak.' }); } };
app.post('/api/login', (req, res) => { const { username, password } = req.body; if (username === ADMIN_USER && password === ADMIN_PASS) { req.session.loggedIn = true; res.json({ success: true }); } else { res.status(401).json({ success: false, message: 'Username atau password salah.' }); } });
app.get('/api/check-auth', checkAuth, (req, res) => { res.json({ loggedIn: true }); });
app.post('/api/logout', (req, res) => { req.session.destroy(() => res.json({ success: true })); });
app.get('/api/products', async (req, res) => { const result = await db.query('SELECT * FROM products ORDER BY id DESC'); res.json(result.rows); });
app.post('/api/products', checkAuth, async (req, res) => { const { name, price, discount, image, rating, category, description, stock } = req.body; const result = await db.query( 'INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [name, price, discount, image, rating, category, description, stock] ); res.status(201).json({ id: result.rows[0].id }); });
app.put('/api/products/:id', checkAuth, async (req, res) => { const { name, price, discount, image, rating, category, description, stock } = req.body; await db.query( 'UPDATE products SET name = $1, price = $2, discount = $3, image = $4, rating = $5, category = $6, description = $7, stock = $8 WHERE id = $9', [name, price, discount, image, rating, category, description, stock, req.params.id] ); res.json({ message: 'Produk berhasil diperbarui' }); });
app.delete('/api/products/:id', checkAuth, async (req, res) => { await db.query('DELETE FROM products WHERE id = $1', [req.params.id]); res.json({ message: 'Produk berhasil dihapus' }); });

// === MENJALANKAN SERVER ===
initializeDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server backend berjalan di port ${PORT}`);
    });
}).catch(err => {
    console.error("Gagal inisialisasi atau menjalankan server:", err);
    process.exit(1);
});
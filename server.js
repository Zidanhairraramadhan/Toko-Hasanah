require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi Pool Koneksi Database PostgreSQL
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware & Konfigurasi
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());
app.use(cookieParser());

// Konfigurasi Penyimpanan Sesi di Database
const sessionStore = new pgSession({
  pool: db,
  tableName: 'user_sessions'
});

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'lax'
    }
}));

// Rute Health Check untuk merespons gateway Railway
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Kredensial Admin
const ADMIN_USER = 'zidan';
const ADMIN_PASS = '021105';

// ================== DATA PRODUK AWAL ==================
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
    const query = 'INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    for (const product of initialProducts) {
        const values = [product.name, product.price, product.discount, product.image, product.rating, product.category, product.description, product.stock];
        await db.query(query, values);
    }
    console.log('Seeding selesai. 18 produk awal telah dimasukkan.');
}

// Fungsi untuk inisialisasi tabel
async function initializeDatabase() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, discount INTEGER, 
            image TEXT, rating REAL, category TEXT, description TEXT, stock INTEGER DEFAULT 0
        );
    `);
    console.log("Tabel 'products' siap digunakan.");

    const { rows } = await db.query('SELECT COUNT(*) as count FROM products');
    if (parseInt(rows[0].count) === 0) {
        console.log('Database kosong, mengisi dengan data awal...');
        await seedDatabase();
    } else {
        console.log('Database sudah berisi data, proses seeding dilewati.');
    }
}

// ... (Salin semua endpoint API Anda dari app.post('/api/login') hingga app.delete(...) di sini) ...
const checkAuth = (req, res, next) => { if (req.session.loggedIn) { next(); } else { res.status(401).json({ message: 'Akses ditolak.' }); } };
app.post('/api/login', (req, res) => { const { username, password } = req.body; if (username === ADMIN_USER && password === ADMIN_PASS) { req.session.loggedIn = true; res.json({ success: true }); } else { res.status(401).json({ success: false, message: 'Username atau password salah.' }); } });
app.get('/api/check-auth', (req, res) => { res.json({ loggedIn: !!req.session.loggedIn }); });
app.post('/api/logout', (req, res) => { req.session.destroy(err => { if (err) { return res.status(500).json({ success: false, message: 'Gagal logout' }); } res.clearCookie('connect.sid'); res.json({ success: true }); }); });
app.get('/api/products', async (req, res) => { try { const result = await db.query('SELECT * FROM products ORDER BY id DESC'); res.json(result.rows); } catch (err) { console.error("Error di /api/products:", err); res.status(500).json({ error: 'Gagal mengambil data produk' }); } });
app.post('/api/products', checkAuth, async (req, res) => { try { const { name, price, discount, image, rating, category, description, stock } = req.body; const result = await db.query( 'INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [name, price, discount, image, rating, category, description, stock] ); res.status(201).json({ id: result.rows[0].id }); } catch (err) { res.status(500).json({ error: 'Gagal menambah produk' }); } });
app.put('/api/products/:id', checkAuth, async (req, res) => { try { const { name, price, discount, image, rating, category, description, stock } = req.body; await db.query( 'UPDATE products SET name = $1, price = $2, discount = $3, image = $4, rating = $5, category = $6, description = $7, stock = $8 WHERE id = $9', [name, price, discount, image, rating, category, description, stock, req.params.id] ); res.json({ message: 'Produk berhasil diperbarui' }); } catch (err) { res.status(500).json({ error: 'Gagal memperbarui produk' }); } });
app.delete('/api/products/:id', checkAuth, async (req, res) => { try { await db.query('DELETE FROM products WHERE id = $1', [req.params.id]); res.json({ message: 'Produk berhasil dihapus' }); } catch (err) { res.status(500).json({ error: 'Gagal menghapus produk' }); } });

// Jalankan server setelah inisialisasi DB
initializeDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server backend berjalan di port ${PORT}`);
    });
}).catch(err => {
    console.error("Gagal inisialisasi atau menjalankan server:", err);
    process.exit(1);
});
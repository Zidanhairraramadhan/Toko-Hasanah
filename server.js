require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');

// --- Fungsi Utama untuk Memulai Server ---
async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // === 1. KONFIGURASI KONEKSI DATABASE ===
   const db = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        // (Tidak perlu 'ssl: false', karena default-nya sudah false)
   });

    // === 2. MEMBUAT SEMUA TABEL TERLEBIH DAHULU ===
    // Membuat tabel untuk produk
    await db.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, discount INTEGER, 
            image TEXT, rating REAL, category TEXT, description TEXT, stock INTEGER DEFAULT 0
        );
    `);
    // Membuat tabel untuk sesi
    await db.query(`
        CREATE TABLE IF NOT EXISTS "user_sessions" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
        ) WITH (OIDS=FALSE);
    `);
    // Menambahkan Primary Key hanya jika belum ada
    const constraintCheck = await db.query(`
        SELECT conname FROM pg_constraint WHERE conrelid = '"user_sessions"'::regclass AND contype = 'p';
    `);
    if (constraintCheck.rowCount === 0) {
        await db.query('ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;');
    }
    console.log("Semua tabel database siap digunakan.");


    // === 3. KONFIGURASI MIDDLEWARE (SETELAH DB SIAP) ===
    app.set('trust proxy', 1);
    app.use(cors());
    app.use(express.static(__dirname));
    app.use(express.json());
    app.use(cookieParser());

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
            httpOnly: true,
            sameSite: 'lax'
        }
    }));

    // === 4. KONFIGURASI RUTE DAN API ===
    const ADMIN_USER = 'zidan';
    const ADMIN_PASS = '021105';
    
    // Rute Health Check
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    const checkAuth = (req, res, next) => {
        if (req.session.loggedIn) next();
        else res.status(401).json({ message: 'Akses ditolak.' });
    };

    // Endpoint API
    app.post('/api/login', (req, res) => {
        const { username, password } = req.body;
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            req.session.loggedIn = true;
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Username atau password salah.' });
        }
    });

    app.get('/api/check-auth', checkAuth, (req, res) => {
        res.json({ loggedIn: true });
    });

    app.post('/api/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).json({ success: false, message: 'Gagal logout' });
            res.clearCookie('connect.sid');
            res.json({ success: true });
        });
    });

    app.get('/api/products', async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM products ORDER BY id DESC');
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: 'Gagal mengambil data produk' });
        }
    });

    app.post('/api/products', checkAuth, async (req, res) => {
        try {
            const { name, price, discount, image, rating, category, description, stock } = req.body;
            const result = await db.query(
                'INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
                [name, price, discount, image, rating, category, description, stock]
            );
            res.status(201).json({ id: result.rows[0].id });
        } catch (err) {
            res.status(500).json({ error: 'Gagal menambah produk' });
        }
    });

    app.put('/api/products/:id', checkAuth, async (req, res) => {
        try {
            const { name, price, discount, image, rating, category, description, stock } = req.body;
            await db.query(
                'UPDATE products SET name = $1, price = $2, discount = $3, image = $4, rating = $5, category = $6, description = $7, stock = $8 WHERE id = $9',
                [name, price, discount, image, rating, category, description, stock, req.params.id]
            );
            res.json({ message: 'Produk berhasil diperbarui' });
        } catch (err) {
            res.status(500).json({ error: 'Gagal memperbarui produk' });
        }
    });

    app.delete('/api/products/:id', checkAuth, async (req, res) => {
        try {
            await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
            res.json({ message: 'Produk berhasil dihapus' });
        } catch (err) {
            res.status(500).json({ error: 'Gagal menghapus produk' });
        }
    });

    // === 5. MENJALANKAN SERVER (PALING AKHIR) ===
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server backend berjalan di port ${PORT}`);
    });
}

// Memulai seluruh aplikasi
startServer().catch(err => {
    console.error("Gagal menjalankan server:", err);
    process.exit(1);
});
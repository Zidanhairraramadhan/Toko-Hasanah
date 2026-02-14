require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');

// --- Fungsi Utama untuk Memulai Server ---
async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // === 1. KONFIGURASI KONEKSI DATABASE ===
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'db_toko_hasanah',
        port: process.env.DB_PORT || 3306
    };

    let db;
    try {
        db = await mysql.createPool(dbConfig);
        await db.getConnection(); // Test connection
        console.log("Terhubung ke database MySQL.");
    } catch (err) {
        console.error("Gagal terhubung ke database:", err);
        process.exit(1);
    }

    // === 2. MEMBUAT SEMUA TABEL TERLEBIH DAHULU ===
    // Membuat tabel untuk produk
    await db.execute(`
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price INT NOT NULL,
            discount INT,
            image TEXT,
            rating FLOAT,
            category VARCHAR(100),
            description TEXT,
            stock INT DEFAULT 0
        );
    `);
    
    // Tabel users (untuk admin)
    await db.execute(`
         CREATE TABLE IF NOT EXISTS users (
            id_user INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            role VARCHAR(20) NOT NULL
        );
    `);

    // Insert admin jika belum ada
    const [users] = await db.execute("SELECT * FROM users WHERE username = 'zidan'");
    if (users.length === 0) {
        await db.execute("INSERT INTO users (username, password, role) VALUES ('zidan', '021105', 'admin')");
    }

    console.log("Semua tabel database siap digunakan.");


    // === 3. KONFIGURASI MIDDLEWARE (SETELAH DB SIAP) ===
    app.set('trust proxy', 1);
    app.use(cors());
    app.use(express.static(__dirname));
    app.use(express.json());
    app.use(cookieParser());

    const sessionStore = new MySQLStore({
        ...dbConfig,
        clearExpired: true,
        checkExpirationInterval: 900000,
        expiration: 86400000,
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    });

    app.use(session({
        store: sessionStore,
        secret: process.env.SESSION_SECRET || 'rahasia_negara_62',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: false, // Set false for HTTP (localhost)
            httpOnly: true
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
    app.post('/api/login', async (req, res) => {
        const { username, password } = req.body;
        // Cek ke database users
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
            if (rows.length > 0) {
                 req.session.loggedIn = true;
                 req.session.user = rows[0];
                 res.json({ success: true });
            } else {
                 if (username === ADMIN_USER && password === ADMIN_PASS) {
                    req.session.loggedIn = true;
                    res.json({ success: true });
                } else {
                    res.status(401).json({ success: false, message: 'Username atau password salah.' });
                }
            }
        } catch (error) {
            console.error(error);
             res.status(500).json({ success: false, message: 'Server error' });
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
            const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal mengambil data produk' });
        }
    });

    app.post('/api/products', checkAuth, async (req, res) => {
        try {
            const { name, price, discount, image, rating, category, description, stock } = req.body;
            const [result] = await db.execute(
                'INSERT INTO products (name, price, discount, image, rating, category, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, price, discount, image, rating, category, description, stock]
            );
            res.status(201).json({ id: result.insertId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal menambah produk' });
        }
    });

    app.put('/api/products/:id', checkAuth, async (req, res) => {
        try {
            const { name, price, discount, image, rating, category, description, stock } = req.body;
            await db.execute(
                'UPDATE products SET name = ?, price = ?, discount = ?, image = ?, rating = ?, category = ?, description = ?, stock = ? WHERE id = ?',
                [name, price, discount, image, rating, category, description, stock, req.params.id]
            );
            res.json({ message: 'Produk berhasil diperbarui' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Gagal memperbarui produk' });
        }
    });

    app.delete('/api/products/:id', checkAuth, async (req, res) => {
        try {
            const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
            res.json({ message: 'Produk berhasil dihapus' });
        } catch (err) {
            console.error(err);
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
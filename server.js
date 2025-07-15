require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi Pool Koneksi Database PostgreSQL
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ================== PERBAIKAN PENTING DI SINI ==================
// Memberitahu Express untuk percaya pada proxy dari Railway.
// Ini adalah kunci agar cookie 'secure' bisa bekerja dengan benar.
app.set('trust proxy', 1); 
// =============================================================

// Middleware
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
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
        secure: true, // WAJIB 'true' untuk HTTPS di production
        httpOnly: true, // Meningkatkan keamanan
        sameSite: 'lax' // Pengaturan standar yang aman untuk satu domain
    }
}));

// Rute Health Check
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Kredensial Admin
const ADMIN_USER = 'admin';
const ADMIN_PASS = '54321';

// Fungsi untuk inisialisasi tabel
async function initializeDatabase() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, discount INTEGER, 
            image TEXT, rating REAL, category TEXT, description TEXT, stock INTEGER DEFAULT 0
        );
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS "user_sessions" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
        ) WITH (OIDS=FALSE);
        ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `);
    console.log("Semua tabel database siap digunakan.");
}

// Middleware "Penjaga" Otentikasi
const checkAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ message: 'Akses ditolak.' });
    }
};

// API Endpoints
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
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal logout' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// ... (semua endpoint API Anda yang lain untuk products)

// Jalankan server setelah inisialisasi DB
initializeDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server backend berjalan di port ${PORT}`);
    });
}).catch(err => {
    console.error("Gagal inisialisasi atau menjalankan server:", err);
    process.exit(1);
});
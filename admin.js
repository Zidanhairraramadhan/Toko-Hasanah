// =================================================================
// ==      KODE SERVER.JS DENGAN PERBAIKAN STATIC FILE      ==
// =================================================================

// 1. IMPORT MODUL
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path'); // Modul 'path' sangat penting untuk ini
const session = require('express-session');
const cookieParser = require('cookie-parser');

// 2. BUAT APLIKASI EXPRESS
const app = express();
const PORT = 3000;


// 3. MIDDLEWARE & KONFIGURASI

// PENTING: Mendefinisikan lokasi folder frontend (satu level di atas folder 'backend')
const publicDirectoryPath = path.join(__dirname, '../');

// Log untuk debugging: Tampilkan path yang akan digunakan
console.log(`Aplikasi akan menyajikan file dari direktori: ${publicDirectoryPath}`);

// Middleware untuk menyajikan semua file HTML, CSS, JS dari folder utama
app.use(express.static(publicDirectoryPath));

// Middleware lain yang sudah ada
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'kunci-rahasia-yang-super-aman-dan-unik',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));


// === Kredensial Admin & Inisialisasi Database (Tidak ada perubahan) ===
let db;
const ADMIN_USER = 'admin';
const ADMIN_PASS = '12345';
const initialProducts = [ /* ... data 18 produk Anda ... */ ];
async function seedDatabase() { /* ... fungsi seeding ... */ }
async function initializeDatabase() {
  db = await open({ filename: './sembako.db', driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price INTEGER NOT NULL, discount INTEGER, image TEXT, rating REAL, category TEXT, description TEXT, stock INTEGER DEFAULT 0)`);
  const row = await db.get('SELECT COUNT(*) as count FROM products');
  if (row.count === 0) {
      console.log('Database kosong, mengisi dengan data awal...');
      // await seedDatabase(); // Anda bisa aktifkan ini jika database kosong
  } else {
      console.log('Database sudah berisi data.');
  }
}

// === Middleware "Penjaga" (Tidak ada perubahan) ===
const checkAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ message: 'Akses ditolak. Silakan login.' });
    }
};

// ===========================================
// 4. API ENDPOINTS (Tidak ada perubahan)
// ===========================================

// Endpoint Autentikasi
app.post('/api/login', (req, res) => { /* ... kode tidak berubah ... */ });
app.get('/api/check-auth', (req, res) => { /* ... kode tidak berubah ... */ });
app.post('/api/logout', (req, res) => { /* ... kode tidak berubah ... */ });

// Endpoint Produk (CRUD)
app.get('/api/products', async (req, res) => { /* ... kode tidak berubah ... */ });
app.post('/api/products', checkAuth, async (req, res) => { /* ... kode tidak berubah ... */ });
app.put('/api/products/:id', checkAuth, async (req, res) => { /* ... kode tidak berubah ... */ });
app.delete('/api/products/:id', checkAuth, async (req, res) => { /* ... kode tidak berubah ... */ });


// 5. JALANKAN SERVER
initializeDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server backend berjalan di http://localhost:${PORT}`));
}).catch(err => console.error("Gagal inisialisasi database:", err));
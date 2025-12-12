const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// --- BARU UNTUK AUTH ---
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load JWT_SECRET dari file .env
// --- END BARU AUTH ---

// Import Models
const Flashcard = require('./models/Flashcard');
const Deck = require('./models/Deck');
const User = require('./models/User'); // Import User Model

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Koneksi Database
mongoose.connect('mongodb://0.0.0.0:27017/flashcard_db')
  .then(() => console.log('✅ Database MongoDB Konek!'))
  .catch((err) => console.error('❌ Gagal konek database:', err));

// --- MIDDLEWARE PROTEKSI (OTAK KEAMANAN) ---
// Fungsi ini akan dijalankan SEBELUM user mengakses rute yang dilindungi
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') // Format: Bearer <token>
  ) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Simpan User ID ke request agar bisa dipakai di rute berikutnya
      req.userId = decoded.id; 

      next(); // Lanjut ke rute yang dituju
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- ROUTES AUTHENTICATION ---

// 1. REGISTER USER BARU
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Username sudah dipakai' });
    }

    // Enkripsi Password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Buat Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d', // Token kadaluarsa dalam 30 hari
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. LOGIN USER
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    // Bandingkan password yang diketik dengan password terenkripsi di DB
    if (user && (await bcrypt.compare(password, user.password))) {
      // Buat Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: user._id,
        username: user.username,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Username atau Password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ROUTES DECK & FLASHCARD (SEKARANG DILINDUNGI) ---

// 3. GET: Ambil SEMUA kartu milik user yang sedang login
app.get('/flashcards', protect, async (req, res) => {
  try {
    // Cari semua kartu yang userId-nya sama dengan user yang login
    const cards = await Flashcard.find({ userId: req.userId }); 
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Ambil semua daftar Deck (Sekarang butuh protect)
app.get('/decks', protect, async (req, res) => {
  try {
    // Hanya ambil deck milik user yang sedang login
    const decks = await Deck.find({ userId: req.userId }); 
    res.json(decks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. POST: Buat Deck Baru
app.post('/decks', protect, async (req, res) => {
  try {
    const { name, icon } = req.body;
    
    const newDeck = new Deck({
      name,
      icon: icon || '📁', // Gunakan icon default jika tidak ada
      userId: req.userId // Wajib, menautkan ke user yang sedang login
    });

    const savedDeck = await newDeck.save();
    res.status(201).json(savedDeck);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. DELETE: Hapus Deck
app.delete('/decks/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Opsional: Hapus SEMUA kartu yang ada di Deck tersebut (Wajib!)
    await Flashcard.deleteMany({ deckId: id, userId: req.userId });

    // Hapus Deck itu sendiri (Wajib cek kepemilikan)
    const result = await Deck.deleteOne({ _id: id, userId: req.userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Deck tidak ditemukan atau bukan milik Anda" });
    }

    res.json({ message: "Deck dan semua kartunya berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. PUT: Update/Edit Nama Deck
app.put('/decks/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;

    // Cari dan update (Wajib cek kepemilikan)
    const updatedDeck = await Deck.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { name, icon },
      { new: true } // Mengembalikan dokumen yang sudah diupdate
    );

    if (!updatedDeck) {
      return res.status(404).json({ message: "Deck tidak ditemukan atau bukan milik Anda" });
    }

    res.json(updatedDeck);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Ambil kartu SPESIFIK berdasarkan Deck ID
app.get('/decks/:deckId/cards', protect, async (req, res) => {
  try {
    const { deckId } = req.params;
    // Hanya ambil kartu milik user yang sedang login DAN Deck ID-nya sesuai
    const cards = await Flashcard.find({ deckId: deckId, userId: req.userId }); 
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. POST: Tambah kartu baru (Sekarang butuh protect + userId)
app.post('/flashcards', protect, async (req, res) => {
  try {
    const { question, answer, deckId } = req.body;

    const newCard = new Flashcard({
      question,
      answer,
      deckId, // Asumsi form di frontend mengirim deckId
      userId: req.userId, // Ambil User ID dari Token yang sudah diverifikasi
    });

    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 7. PUT: Update status kartu (SRS Logic)
app.put('/flashcards/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { correct } = req.body;

    const card = await Flashcard.findOne({ _id: id, userId: req.userId }); // Wajib cek kepemilikan
    if (!card) return res.status(404).json({ message: "Kartu tidak ditemukan atau bukan milik Anda" });

    // ... (Logika Leitner System sama seperti sebelumnya) ...
    if (correct) {
      card.box += 1;
      const daysToAdd = Math.pow(2, card.box); 
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      card.nextReview = nextDate;
    } else {
      card.box = 1;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1); 
      card.nextReview = nextDate;
    }

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 8. DELETE: Hapus kartu
app.delete('/flashcards/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    // Wajib cek kepemilikan sebelum menghapus
    await Flashcard.deleteOne({ _id: id, userId: req.userId }); 
    res.json({ message: "Kartu berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server lari kencang di http://localhost:${PORT}`);
});
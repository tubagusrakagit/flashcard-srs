const mongoose = require('mongoose');
const Flashcard = require('./models/Flashcard');
const Deck = require('./models/Deck');

// --- PASTIKAN ID INI SUDAH DI-PASTE DARI USER ROKANTYR ---
const USER_ID = '693b92792fd6c1ffc41b71be'; // <-- ID UNIK MILIK ROKANTYR
// --------------------------------------------------------

// Koneksi Database (Sama kayak index.js)
mongoose.connect('mongodb://0.0.0.0:27017/flashcard_db')
  .then(() => {
    console.log('✅ Database Konek! Mulai Seeding...');
    seedDB();
  })
  .catch((err) => console.log(err));

const seedDB = async () => {
  try {
    // 1. BERSIH-BERSIH: Hapus semua data lama biar fresh
    await Flashcard.deleteMany({});
    await Deck.deleteMany({});
    console.log('🧹 Data lama disapu bersih...');

    // 2. TANAM DECK BARU (WAJIB ADA userId!)
    const deckJS = new Deck({ 
      name: 'JavaScript Dasar', 
      icon: '💛',
      userId: USER_ID // <-- TAMBAHAN INI!
    });
    await deckJS.save();

    const deckInggris = new Deck({ 
      name: 'English Vocab', 
      icon: '🇬🇧',
      userId: USER_ID // <-- TAMBAHAN INI!
    });
    await deckInggris.save();
    
    const deckSejarah = new Deck({ 
      name: 'Sejarah Indo', 
      icon: '📜',
      userId: USER_ID // <-- TAMBAHAN INI!
    });
    await deckSejarah.save();

    console.log('📁 Deck berhasil dibuat!');

    // 3. TANAM KARTU (WAJIB ADA userId!)
    const cards = [
      // Kartu buat JS
      {
        question: 'Apa hasil dari 1 + "1"?',
        answer: '"11" (String Concatenation)',
        deckId: deckJS._id,
        userId: USER_ID // <-- TAMBAHAN INI!
      },
      {
        question: 'Keyword untuk variabel konstan?',
        answer: 'const',
        deckId: deckJS._id,
        userId: USER_ID // <-- TAMBAHAN INI!
      },
      // Kartu buat Inggris
      {
        question: 'Translate: Kucing',
        answer: 'Cat',
        deckId: deckInggris._id,
        userId: USER_ID // <-- TAMBAHAN INI!
      },
      {
        question: 'Translate: Merah',
        answer: 'Red',
        deckId: deckInggris._id,
        userId: USER_ID // <-- TAMBAHAN INI!
      },
      // Kartu buat Sejarah
      {
        question: 'Tahun berapa Indonesia merdeka?',
        answer: '1945',
        deckId: deckSejarah._id,
        userId: USER_ID // <-- TAMBAHAN INI!
      }
    ];

    // Masukin semua kartu sekaligus
    await Flashcard.insertMany(cards);
    console.log('🃏 Kartu berhasil disebar ke deck masing-masing!');
    
    console.log('🎉 SEEDING SELESAI! Database siap dipakai.');
  } catch (err) {
    console.error('❌ Gagal Seeding:', err);
  } finally {
    // Tutup koneksi kalau udah kelar
    mongoose.connection.close();
  }
};
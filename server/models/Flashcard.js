const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  box: { type: Number, default: 1 },
  nextReview: { type: Date, default: Date.now },
  
  // --- TAMBAHAN BARU ---
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck', // Ini referensi ke model 'Deck'
    // required: true, <--- Kita matikan dulu validasi wajibnya biar ga error pas seeding awal
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Wajib punya pemilik
  }
});


module.exports = mongoose.model('Flashcard', flashcardSchema);
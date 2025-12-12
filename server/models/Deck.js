const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: '📁' },
  // --- TAMBAHAN BARU ---
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referensi ke model User
    required: true
  }
});

module.exports = mongoose.model('Deck', deckSchema);
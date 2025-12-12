const mongoose = require('mongoose');
const User = require('./models/User'); 

// Koneksi Database
mongoose.connect('mongodb://0.0.0.0:27017/flashcard_db')
  .then(() => {
    console.log('✅ Koneksi Database Sukses. Mencari User...');
    
    // Cari user yang baru kamu buat
    return User.findOne({ username: 'rokantyr' });
  })
  .then(user => {
    if (user) {
      console.log('\n======================================');
      console.log('         USER ID ANDA ADALAH:');
      console.log(`         ${user._id.toString()}`); // <-- COPY ID INI
      console.log('======================================\n');
    } else {
      console.log('❌ User testuser tidak ditemukan. Cek lagi apakah Anda sudah Register.');
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('\n❌ ERROR SAAT MENCARI USER:', err.message);
    mongoose.connection.close();
  });
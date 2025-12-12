# 🧠 Flashcard SRS (Spaced Repetition System)

![Cover Image/Screenshot Aplikasi](./assets/COVER README.png)

Aplikasi Full-Stack Flashcard berbasis sistem pengulangan berselang (Spaced Repetition System) yang dirancang untuk mengoptimalkan efisiensi belajar. Menggunakan algoritma Leitner Box yang canggih untuk menentukan kapan waktu terbaik untuk mengulang sebuah materi.

## 🌟 Fitur Utama

* **User Authentication (JWT):** Login dan Register User yang aman. Data (Deck dan Kartu) terisolasi sepenuhnya per user.
* **Logika SRS (Spaced Repetition):** Menggunakan sistem Box Level. Kartu naik level jika benar, dan diatur tanggal kemunculan berikutnya (menggunakan logika eksponensial).
* **Deck Management:** Kartu dikelompokkan dalam kategori (Deck) untuk memisahkan topik belajar (e.g., JavaScript, English Vocab, Sejarah).
* **CRUD Lengkap:** Kemampuan untuk membuat, membaca, mengubah (melalui review), dan menghapus Kartu.
* **Desain UX:** Tampilan Brutalist minimalis, kontras tinggi, dan animasi 3D Flip yang mulus pada kartu.

## 🛠️ Stack Teknologi

| Area | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Backend/API** | Node.js (Express) | Routing dan logika server. |
| **Database** | MongoDB (Mongoose) | Database NoSQL yang menyimpan data Deck, Card, dan User. |
| **Security** | JWT & bcrypt | JSON Web Tokens untuk sesi user, dan bcrypt untuk enkripsi password. |
| **Frontend/UI** | React.js | Library utama untuk membangun antarmuka pengguna. |
| **HTTP Client** | Axios | Digunakan untuk melakukan request ke API Backend. |

## 📦 Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah untuk menjalankan proyek di lingkungan lokal Anda:

### Prasyarat

* [Node.js](https://nodejs.org/) (Versi 18+)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Harus berjalan di port default `27017`)

### 1. Kloning Repositori & Instalasi Dependencies

```bash
# Kloning dari GitHub
git clone [https://github.com/tubagusrakagit/flashcard-srs.git](https://github.com/tubagusrakagit/flashcard-srs.git)
cd flashcard-srs

# Instalasi Dependencies Backend
cd server
npm install
cd ..

# Instalasi Dependencies Frontend
cd client
npm install
cd ..
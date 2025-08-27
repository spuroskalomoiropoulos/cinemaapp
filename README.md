# 🎬 Cinema Reservation App

## 📌 Περιγραφή
Εφαρμογή mobile για κράτηση θέσεων σε κινηματογράφο.  
Υλοποιήθηκε με:
- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express
- **Database:** MariaDB

Η εφαρμογή επιτρέπει στους χρήστες:
- Να κάνουν **εγγραφή** και **σύνδεση**.
- Να βλέπουν λίστα με διαθέσιμους κινηματογράφους.
- Να κάνουν αναζήτηση με βάση το όνομα ή την τοποθεσία.
- Να βλέπουν διαθέσιμες ταινίες σε κάθε σινεμά.
- Να κάνουν κράτηση με επιλογή ημερομηνίας, ώρας και θέσεων.
- Να προβάλλουν και να διαγράφουν μελλοντικές κρατήσεις τους.

---

## ⚙️ ΟδηγίΣες εγκατάστασης

1️⃣ # Backend

```bash
cd server
npm install
npm start   

**Σημείωση: Σιγουρέψου ότι η βάση MariaDB τρέχει και ότι το αρχείο .env έχει τα σωστά στοιχεία σύνδεσης.**

2️⃣ # Frontend
cd cinemamitropolit
npm install
npx expo start
**Σκάναρε το QR Code με την εφαρμογή Expo Go στο κινητό.**

3️⃣ # Database Setup

Για να δημιουργήσετε τη βάση, τρέξτε:
```sql
CREATE DATABASE cinema;
USE cinema;

-- Users table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

-- Cinemas table
CREATE TABLE cinemas (
  cinema_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100),
  description TEXT
);

-- Movies table
CREATE TABLE movies (
  movie_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  cinema_id INT,
  duration INT,
  rating VARCHAR(10),
  FOREIGN KEY (cinema_id) REFERENCES cinemas(cinema_id)
);

-- Reservations table
CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  movie_id INT,
  cinema_id INT,
  date DATE,
  time TIME,
  seat_numbers VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
  FOREIGN KEY (cinema_id) REFERENCES cinemas(cinema_id)
);
✉️ # Postman Collection

Για γρήγορο έλεγχο των API endpoints, υπάρχει έτοιμο αρχείο Postman:

`postman_collection.json`

Μπορείτε να το εισάγετε στο Postman:  
**File → Import → Upload Files → επιλέξτε το `postman_collection.json`.**

🔧 Τεχνολογίες που χρησιμοποιήθηκαν

React Native (Expo) για το mobile frontend

Node.js + Express για backend

MariaDB για βάση δεδομένων

JWT (JSON Web Tokens) για authentication

Axios για επικοινωνία μεταξύ frontend & backend

📜 Λειτουργίες

Εγγραφή / Σύνδεση με token authentication

Λίστα και αναζήτηση κινηματογράφων

Λίστα ταινιών ανά σινεμά

Κράτηση θέσεων με επιλογή ώρας και ημερομηνίας

Προβολή ιστορικού κρατήσεων

Διαγραφή κρατήσεων

👨‍💻 Οδηγίες για τον developer

Τροποποίησε το lib/api.ts αν αλλάξει η τοπική IP για το backend.

Σιγουρέψου ότι το backend τρέχει στο port 4000.

Η βάση πρέπει να είναι ενεργή πριν τρέξεις το project.

📝 Σημειώσεις

Δοκιμασμένο σε Android μέσω Expo Go.

Οι κρατήσεις εμφανίζονται σε πραγματικό χρόνο στο προφίλ μετά από refresh.


🚀 Δημιουργός:Σπυρος Καλομοιροπουλος
Υλοποιήθηκε για το μάθημα Mobile & Distributed Systems (CN6035).
> ⚠️ **Σημείωση:** Αν τα παρακάτω screenshots δεν εμφανίζονται σωστά, μπορείτε να τα βρείτε όλα στον φάκελο:

## 📸 Screenshots

### 🔑 Login
![Login](./screenshots/login%20scs.jpg)

### 🆕 Register
![Register](./screenshots/register%20scs.jpg)

### 🎥 Cinemas List
![Cinemas](./screenshots/cinemasscs.png)

### 🍿 Movies 
![Movies](./screenshots/movies%20menu%20scs.jpg)

### 🍿 Movie Pick And Seat Pick
![Movie-Seatnumber](./screenshots/pick%20seat%20and%20movies%20scs.jpg)

### ⏱️ Time Pick 
![Time](./Screenshots/pick%20hour%20scs.jpg)

### 📅 Date Pick
![Date](./Screenshots/pickday%20scs.jpg)

### ❌Delete Messages
![Delete](./Screenshots/delete%20message%20scs.jpg)
,(./Screenshots/delete%20ok%20scs.jpg)

### 👤 Profile
![Profile](./screenshots/reservationsmade%20scs.jpg)


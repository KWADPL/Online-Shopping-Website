// Importowanie modułów
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require('bcrypt');
const session = require('express-session');
const moment = require('moment-timezone');
const PORT = 8080;

// Konfiguracja
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(session({ secret: 'your-secret-random-long-secret-key-1234', resave: true, saveUninitialized: true }));

// Middleware sprawdzający stan logowania
app.use((req, res, next) => {
  res.locals.loggedIn = req.session && req.session.userId ? true : false;

  if (req.session && req.session.userId) {
    const currentTime = Date.now();
    req.session.lastActivityTime = req.session.lastActivityTime || currentTime;

    // Ustaw czas wygaśnięcia sesji (20 minut w milisekundach)
    const sessionTimeout = 20 * 60 * 1000;

    // Sprawdź, czy sesja wygasła
    if (currentTime - req.session.lastActivityTime > sessionTimeout) {
      // Sesja wygasła, zniszcz sesję i przekieruj na stronę logowania
      req.session.destroy((err) => {
        if (err) {
          console.error('Your session is done.', err);
        }
        res.redirect('/login?alert=sesja-wygasla');
      });
    }
  }

  next();
});

app.get('/server-time', (req, res) => {
  const serverTime = moment().tz('Europe/Warsaw').format(); // Format the time in Europe/Warsaw time zone
  res.json({ serverTime });
});


    mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

    // Schemat użytkownika
    const userSchema = new mongoose.Schema({
      username: String,
      password: String,
      email: String,
      role: { type: String, default: 'user' }
    });

    const User = mongoose.model('User', userSchema);

    // Trasy

    // Rejestracja
    app.get('/register', (req, res) => {
      res.sendFile(path.join(__dirname, 'SignIn.html'));
    });

    app.post('/register', async (req, res) => {
      try {
        const { username, password, email, gRecaptchaResponse } = req.body;

        // Weryfikacja reCAPTCHA
        const recaptchaSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
        const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${gRecaptchaResponse}`;

        const recaptchaResponse = await axios.post(recaptchaVerificationURL);
        const recaptchaData = recaptchaResponse.data;

        if (!recaptchaData.success) {
          return res.status(400).send('reCAPTCHA verification failed. Fill all fields correctly and verify yourself!');
        }

        // Walidacja pól
        if (!username || !password || !email) {
          return res.status(400).send('All fields are required.');
        }

        // Haszowanie hasła i zapis do bazy danych
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          password: hashedPassword,
          email,
          role: 'user'
        });

        await newUser.save();

        console.log('Registration successful. Redirecting to login page.');
        res.redirect('/login?alert=registration-successful');
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error: Registration failed.');
      }
    });

    // Logowanie
    app.get('/login', (req, res) => {
      // Pobranie parametru z adresu URL
      const registrationSuccessful = req.query['registration-successful'];

      // Wyświetlenie powiadomienia na stronie
      res.sendFile(path.join(__dirname, 'LogIn.html'));
    });

    app.post('/login', async (req, res) => {
      try {
        const { username, password, gRecaptchaResponse } = req.body;
    
        // Weryfikacja reCAPTCHA
        const recaptchaSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
        const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${gRecaptchaResponse}`;
    
        const recaptchaResponse = await axios.post(recaptchaVerificationURL);
        const recaptchaData = recaptchaResponse.data;
    
        if (!recaptchaData.success) {
          return res.status(400).send('reCAPTCHA verification failed. Fill all fields correctly and verify yourself!');
        }
    
        // Sprawdzenie użytkownika w bazie danych
        const user = await User.findOne({ username });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).send('Invalid credentials.');
        }
    
        if (user.role !== 'admin') {
          // Sprawdzenie, czy przekierowanie już zostało wykonane
          if (!res.headersSent) {
            // Ustawienie identyfikatora użytkownika w sesji
            req.session.userId = user._id;
            req.session.lastActivityTime = Date.now();
            req.session.cookie.maxAge = 20 * 60 * 1000; // Ustawia czas wygaśnięcia na 20 minut
            res.redirect('/profile.html?login-successful=true');
          }
        } else {
          // Przekierowanie na stronę profilu z powiadomieniem o udanym logowaniu
          res.redirect('/profile.html?login-successful=true');
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Login error.');
      }
    });
    
    
    // Trasa do danych profilowych
    app.get('/profile.html', (req, res) => {
      // Pobranie parametru z adresu URL
      const loginSuccessful = req.query['login-successful'];

      // Sprawdzenie, czy użytkownik jest zalogowany
      const userId = req.session.userId;
      if (!userId) {
        // Jeśli użytkownik nie jest zalogowany, przekieruj na stronę logowania
        return res.redirect('/login');
      }

      // Wyświetlenie powiadomienia na stronie
      res.sendFile(path.join(__dirname, 'Profile.html'));
    });

    // Obsługa danych profilowych
    app.get('/profile-data', async (req, res) => {
      try {
        // Sprawdzenie, czy użytkownik jest zalogowany
        const userId = req.session.userId;
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Pobranie danych użytkownika na podstawie identyfikatora z sesji
        const user = await User.findById(userId);

        // Sprawdzenie, czy użytkownik istnieje w bazie danych
        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }

        // Zwrócenie danych użytkownika
        const userData = {
          username: user.username,
          email: user.email,
        };

        res.json(userData);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user data.' });
      }
    });

    // Dodana trasa do sprawdzenia sesji
    app.get('/session-info', (req, res) => {
      if (req.session.userId) {
        res.send(`Bieżący użytkownik zalogowany. ID użytkownika: ${req.session.userId}`);
      } else {
        res.send('Brak aktywnej sesji.');
      }
    });

    app.get('/server-time', (req, res) => {
      res.json({ serverTime: new Date() });
    });

    // Obsługa 404 - Nie znaleziono
    app.use((req, res) => {
      res.status(404).send('404 - Not Found');
    });

    // Nasłuchiwanie na określonym porcie
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });


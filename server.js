const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require('bcrypt');
const session = require('express-session');
const PORT = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(session({ secret: 'your-secret-random-long-secret-key-1234', resave: true, saveUninitialized: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

const User = mongoose.model('User', userSchema);

// Registration Page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'SignIn.html'));
});

// Handle Registration Requests
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, gRecaptchaResponse } = req.body;

    // Verify reCAPTCHA
    const recaptchaSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
    const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${gRecaptchaResponse}`;
    
    const recaptchaResponse = await axios.post(recaptchaVerificationURL);
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      return res.send('<script>alert("reCAPTCHA verification failed. Fill all fields correctly and verify yourself!"); window.location.href = "/register";</script>');
    }

    // Add validation
    if (!username || !password || !email) {
      return res.send('<script>alert("All fields are required."); window.location.href = "/register";</script>');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User
    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });

    // Save the user to the database
    await newUser.save();

    res.send('<script>alert("Registration completed successfully. You can log in now."); window.location.href = "/login";</script>');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error: Registration failed.');
  }
});

// Login Page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'LogIn.html'));
});

// Handle Login Requests
app.post('/login', async (req, res) => {
  try {
    const { username, password, gRecaptchaResponse } = req.body;

    // Verify reCAPTCHA
    const recaptchaSecretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
    const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${gRecaptchaResponse}`;
    
    const recaptchaResponse = await axios.post(recaptchaVerificationURL);
    const recaptchaData = recaptchaResponse.data;

    if (!recaptchaData.success) {
      return res.send('<script>alert("reCAPTCHA verification failed. Fill all fields correctly and verify yourself!"); window.location.href = "/login";</script>');
    }

    res.send('<script>alert("Login successful."); window.location.href = "/welcome";</script>');
  } catch (err) {
    console.error(err);
    res.status(500).send('Login error.');
  }
});

// Welcome Page
app.get('/welcome', (req, res) => {
  res.send('Welcome! You have been successfully logged in.');
});

// 404 - Not Found
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

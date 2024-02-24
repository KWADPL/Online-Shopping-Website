const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Ustaw folder docelowy dla przesyłanych plików

const Product = require('./models/productModel');

// Middleware sprawdzający, czy użytkownik jest adminem
const isAdmin = (req, res, next) => {
  // Dodaj tutaj logikę sprawdzającą, czy użytkownik jest zalogowany jako admin
  // Np. sprawdź jego rolę lub zapisz tę informację w sesji
  // Poniżej przykład - zależy to od Twojej autentykacji
  const isAdmin = true; // Zakładamy, że użytkownik jest adminem
  if (isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized - Admins only' });
  }
};

// Dodawanie produktu
router.post(
  '/add-product',
  isAdmin,
  upload.single('image'), // Dodaj middleware multer do obsługi przesyłania pliku
  [
    body('name').notEmpty(),
    body('origin').notEmpty(),
    body('sizes').isArray(),
    body('price').isNumeric(),
    body('category').notEmpty(),
  ],
  async (req, res) => {
    try {
      // Sprawdź, czy są błędy walidacji
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Pobierz dane produktu z żądania
      const { name, origin, sizes, price, category } = req.body;

      // Przypisz ścieżkę przesyłanego pliku obrazu do zmiennej
      const image = req.file ? req.file.path : '';

      // Stwórz nowy produkt
      const newProduct = new Product({
        image,
        name,
        origin,
        sizes,
        price,
        category,
      });

      // Zapisz produkt do bazy danych
      await newProduct.save();

      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

module.exports = router;

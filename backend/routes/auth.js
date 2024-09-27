const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Отримуємо логін і пароль з .env файлу
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

// Логін (POST)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Перевірка email
  if (email !== adminEmail) {
    return res.status(401).json({ message: 'Невірний email' });
  }

  // Перевірка пароля
  if (password !== adminPassword) {
    return res.status(401).json({ message: 'Невірний пароль' });
  }

  // Генерація JWT токена
  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

  res.status(200).json({ token });
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // Додано для обслуговування статичних файлів
require('dotenv').config();

const app = express();

// Налаштування CORS
app.use(cors((req, callback) => {
  // Визначення CORS-опцій
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://pool-2da3e3f8acbe.herokuapp.com' 
      : 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  };
  
  // Логування значення CLIENT_ORIGIN (для перевірки)
  console.log('CLIENT_ORIGIN:', process.env.CLIENT_ORIGIN);
  
  // Логування CORS опцій
  console.log('CORS options:', corsOptions);
  
  // Виклик колбека з опціями
  callback(null, corsOptions);
}));

app.use(express.json()); // Middleware для обробки JSON

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Помилка підключення до MongoDB:', err));

// Підключення роутів
const settingsRouter = require('./routes/settings');
app.use('/api/settings', settingsRouter);
console.log('Підключено /api/settings');

const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);
console.log('Підключено /api/bookings');

const authRouter = require('./routes/auth');
const { log } = require('console');
app.use('/api/auth', authRouter);
console.log('Підключено /api/auth');

// Якщо у режимі продакшн, обслуговуємо React-фронтенд
if (process.env.NODE_ENV === 'production') {
  // Вказуємо, що статичні файли знаходяться в папці frontend/build
  app.use(express.static(path.join(__dirname, '../build')));

  // Якщо запит не знайдено в API, обслуговуємо index.html з React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));

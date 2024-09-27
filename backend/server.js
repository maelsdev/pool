const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Налаштування CORS для дозволу запитів з фронтенду (React)
app.use(cors({
  origin: 'http://localhost:3000', // Дозволяємо запити з фронтенду, який працює на порту 3000
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Дозволяємо необхідні HTTP методи
  credentials: true, // Дозволяємо відправку кукі і автентифікаційних даних, якщо потрібно
}));

app.use(express.json()); // Middleware для обробки JSON

// Підключення до MongoDB через URI з .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Помилка підключення до MongoDB:', err));

// Підключення роутів для налаштувань
const settingsRouter = require('./routes/settings');
app.use('/api/settings', settingsRouter);
console.log('Підключено /api/settings'); // Логування після підключення маршруту

// Підключення роутів для бронювань
const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);
console.log('Підключено /api/bookings'); // Логування після підключення маршруту

// Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));

// Підключення роутів для авторизації
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
console.log('Підключено /api/auth'); // Логування після підключення маршруту


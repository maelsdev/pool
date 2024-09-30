const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Для роботи зі шляхами до статичних файлів
require('dotenv').config();

const app = express();

// Налаштування CORS для дозволу запитів з фронтенду (React)
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_ORIGIN // Домен у продакшені
  : 'http://localhost:3000';  // Домен у локальному середовищі

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true,
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

// Обслуговування статичних файлів React у продакшені
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  // Всі маршрути, які не є API, мають повертати frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));

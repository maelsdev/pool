const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User'); // Підключаємо модель користувача для MongoDB

// Отримання всіх користувачів
router.get('/users', async (req, res) => {
  try {
      const users = await User.find({}, { password: 0 }); // Витягування всіх користувачів без паролів
      console.log('Отримані користувачі:', users); // Логування отриманих користувачів
      res.status(200).json(users);
  } catch (error) {
      console.error('Помилка отримання користувачів:', error); // Логування помилки
      res.status(500).json({ message: 'Помилка отримання користувачів' });
  }
});

// Видалення користувача
router.delete('/users/:username', async (req, res) => {
  try {
      const { username } = req.params;
      const result = await User.deleteOne({ username }); // Видаляємо користувача
      if (result.deletedCount === 0) {
          console.log(`Користувача ${username} не знайдено`); // Логування
          return res.status(404).json({ message: 'Користувача не знайдено' });
      }
      console.log(`Користувача ${username} видалено`); // Логування
      res.status(200).json({ message: 'Користувача видалено' });
  } catch (error) {
      console.error('Помилка при видаленні користувача:', error); // Логування помилки
      res.status(500).json({ message: 'Помилка при видаленні користувача' });
  }
});

// Маршрут для реєстрації користувачів
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Перевіряємо, чи існує вже користувач з таким логіном
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(`Користувач ${username} вже існує`); // Логування
            return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
        }

        // Хешуємо пароль перед збереженням
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log(`Хешований пароль для користувача ${username}:`, hashedPassword); // Логування

        // Створюємо нового користувача з хешованим паролем
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        console.log(`Користувача ${username} створено успішно`); // Логування
        res.status(201).json({ message: 'Користувача створено успішно' });
    } catch (error) {
        console.error('Помилка при створенні користувача:', error); // Логування помилки
        res.status(500).json({ message: 'Помилка при створенні користувача' });
    }
});

// Маршрут для логіну користувачів
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) {
          console.log(`Користувача ${username} не знайдено`);
          return res.status(401).json({ message: 'Невірний логін або пароль' });
      }

      console.log('Збережений хеш пароля:', user.password);
      console.log('Введений пароль:', password);

      

      // Перевіряємо пароль за допомогою bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      
      console.log('Пароль є дійсним:', isPasswordValid);

      if (!isPasswordValid) {
          console.log(`Невірний пароль для користувача ${username}`);
          return res.status(401).json({ message: 'Невірний логін або пароль' });
      }

      console.log(`Користувача ${username} успішно авторизовано`);
      res.status(200).json({ message: 'Успішний вхід' });
  } catch (error) {
      console.error('Помилка сервера:', error);
      res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;

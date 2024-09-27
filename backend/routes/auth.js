const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User'); // Підключаємо модель користувача для MongoDB

// Маршрут для реєстрації користувачів
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Перевіряємо, чи існує вже користувач з таким логіном
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
        }

        // Хешуємо пароль перед збереженням
        const hashedPassword = await bcrypt.hash(password, 10);

        // Створюємо нового користувача з хешованим паролем
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Користувача створено успішно' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при створенні користувача' });
    }
});

// Маршрут для логіну користувачів
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Знаходимо користувача за логіном (username)
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Невірний логін або пароль' });
        }

        // Перевіряємо пароль за допомогою bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        // Додай відладкове повідомлення для перевірки
        console.log('Password is valid:', isPasswordValid);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Невірний логін або пароль' });
        }

        // Якщо все ок, відправляємо позитивну відповідь
        res.status(200).json({ message: 'Успішний вхід' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

module.exports = router;

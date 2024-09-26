const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Отримати поточні налаштування
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Налаштування не знайдено" });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Зберегти або оновити налаштування
router.post('/', async (req, res) => {
  const { pricePerHour, priceForTwoHours } = req.body;

  try {
    // Перевіряємо, чи існують налаштування
    let settings = await Settings.findOne();
    if (settings) {
      // Оновлюємо поточні налаштування
      settings.pricePerHour = pricePerHour;
      settings.priceForTwoHours = priceForTwoHours;
    } else {
      // Створюємо нові налаштування
      settings = new Settings({
        pricePerHour,
        priceForTwoHours
      });
    }

    await settings.save();
    res.json({ message: "Налаштування збережено", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

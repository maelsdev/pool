const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Створити нове бронювання (POST)
router.post('/', async (req, res) => {
  const { lastName, firstName, phone, date, time, duration, seats, totalPrice, paid, remaining } = req.body;

  const newBooking = new Booking({
    lastName,
    firstName,
    phone,
    date,
    time,
    duration,
    seats,
    totalPrice,
    paid,
    remaining
  });

  try {
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: 'Не вдалося зберегти бронювання', error: err });
  }
});

// Отримати всі бронювання (GET)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Не вдалося отримати бронювання', error: err });
  }
});

// Оновити існуюче бронювання (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = req.body;

    // Знайти бронювання за ID і оновити його
    const booking = await Booking.findByIdAndUpdate(id, updatedBooking, { new: true });

    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.log('Помилка оновлення:', err);
    res.status(500).json({ message: 'Не вдалося оновити бронювання', error: err });
  }
});

// Видалити бронювання (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }
    res.status(200).json({ message: 'Бронювання успішно видалено' });
  } catch (err) {
    console.log('Помилка видалення:', err);
    res.status(500).json({ message: 'Не вдалося видалити бронювання', error: err });
  }
});

module.exports = router;

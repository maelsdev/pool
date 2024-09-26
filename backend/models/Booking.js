const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  seats: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Вартість бронювання
  paid: { type: Number, required: true, default: 0 }, // Сплачено
  remaining: { type: Number, required: true } // Залишок
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
    
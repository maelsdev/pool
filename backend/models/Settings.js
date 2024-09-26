const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  pricePerHour: { type: Number, required: true },
  priceForTwoHours: { type: Number, required: true }
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
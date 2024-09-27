const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Схема користувача
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Хешування пароля перед збереженням
userSchema.pre('save', async function (next) {
    const user = this;

    // Хешування пароля тільки якщо пароль змінився або новий
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

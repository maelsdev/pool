import React, { useState, useEffect } from 'react';
import './SettingsPage.css'; // Імпортуємо CSS
import axios from 'axios';

const SettingsPage = () => {
  // Стани для введених цін
  const [pricePerHour, setPricePerHour] = useState('');
  const [priceForTwoHours, setPriceForTwoHours] = useState('');

  // Стани для поточних цін, які приходять з сервера
  const [currentPricePerHour, setCurrentPricePerHour] = useState(null);
  const [currentPriceForTwoHours, setCurrentPriceForTwoHours] = useState(null);

  // Стан для відображення лоадера і повідомлення
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Завантажуємо поточні ціни з сервера при першому завантаженні сторінки
  useEffect(() => {
    axios.get('http://localhost:5001/api/settings')
      .then(response => {
        const settings = response.data;
        setCurrentPricePerHour(settings.pricePerHour);
        setCurrentPriceForTwoHours(settings.priceForTwoHours);
      })
      .catch(err => console.error('Помилка завантаження налаштувань:', err));
  }, []);

  // Обробник для збереження нових налаштувань
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true); // Показуємо лоадер під час запиту

    const updatedPrices = {
      pricePerHour: pricePerHour || currentPricePerHour,
      priceForTwoHours: priceForTwoHours || currentPriceForTwoHours
    };

    axios.post('http://localhost:5001/api/settings', updatedPrices)
      .then(() => {
        setCurrentPricePerHour(updatedPrices.pricePerHour);
        setCurrentPriceForTwoHours(updatedPrices.priceForTwoHours);
        setPricePerHour('');
        setPriceForTwoHours('');
        setSuccessMessage('Налаштування успішно збережено!'); // Повідомлення про успіх
        setTimeout(() => setSuccessMessage(''), 3000); // Прибираємо повідомлення через 3 секунди
      })
      .catch(err => console.error('Помилка збереження налаштувань:', err))
      .finally(() => setLoading(false)); // Приховуємо лоадер після завершення запиту
  };

  return (
    <div className="settings-container">
      <h1>Налаштування Цін</h1>

      {loading && <div className="loader"></div>} {/* Лоадер */}

      {successMessage && <div className="success-message">{successMessage}</div>} {/* Повідомлення про успіх */}

      <form onSubmit={handleSave}>
        <div>
          <label>Ціна за одну годину: </label>
          <input
            type="number"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            placeholder={`Поточна ціна: ${currentPricePerHour !== null ? currentPricePerHour : 'Завантажується...'}`}
          />
        </div>
        <div>
          <label>Ціна за дві години: </label>
          <input
            type="number"
            value={priceForTwoHours}
            onChange={(e) => setPriceForTwoHours(e.target.value)}
            placeholder={`Поточна ціна: ${currentPriceForTwoHours !== null ? currentPriceForTwoHours : 'Завантажується...'}`}
          />
        </div>
        <button type="submit" disabled={loading}>Зберегти</button>
      </form>
    </div>
  );
};

export default SettingsPage;

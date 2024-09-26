import React, { useState, useEffect } from 'react';
import './BookingPage.css';
import axios from 'axios';
import BookingTable from '../components/BookingTable';

const BookingPage = () => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [time, setTime] = useState('08:00');
  const [duration, setDuration] = useState('1');
  const [seats, setSeats] = useState(1);
  const [pricePerHour, setPricePerHour] = useState(100);
  const [priceForTwoHours, setPriceForTwoHours] = useState(180);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paid, setPaid] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/settings')
      .then(response => {
        const settings = response.data;
        setPricePerHour(settings.pricePerHour);
        setPriceForTwoHours(settings.priceForTwoHours);
      })
      .catch(err => console.error('Помилка завантаження налаштувань:', err));
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    axios.get('http://localhost:5001/api/bookings')
      .then(response => {
        setBookings(response.data);
      })
      .catch(err => console.error('Помилка завантаження бронювань:', err));
  };

  useEffect(() => {
    const price = duration === '1' ? pricePerHour : priceForTwoHours;
    const total = price * seats;
    setTotalPrice(total);
    setRemaining(total - paid);
  }, [seats, duration, pricePerHour, priceForTwoHours, paid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      lastName,
      firstName,
      phone,
      date,
      time,
      duration,
      seats,
      totalPrice,
      paid,
      remaining,
    };

    axios.post('http://localhost:5001/api/bookings', bookingData)
      .then(response => {
        setBookings([...bookings, response.data]);
        clearForm();
      })
      .catch(err => console.error('Помилка збереження бронювання:', err));
  };

  const clearForm = () => {
    setLastName('');
    setFirstName('');
    setPhone('');
    setDate(getTodayDate());
    setTime('08:00');
    setDuration('1');
    setSeats(1);
    setPaid(0);
  };

  return (
    <div className="booking-page">
      <h1>Форма Бронювання</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Прізвище: </label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Ім'я: </label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Телефон: </label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Дата: </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Час: </label>
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            {[...Array(15)].map((_, index) => {
              const hour = index + 8;
              const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
              return <option key={formattedHour} value={formattedHour}>{formattedHour}</option>;
            })}
          </select>
        </div>

        <div className="form-group">
          <label>Тривалість перебування: </label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="1">1 година</option>
            <option value="2">2 години</option>
          </select>
        </div>

        <div className="form-group">
          <label>Кількість місць: </label>
          <input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Загальна вартість: </label>
          <input type="text" value={totalPrice} readOnly />
        </div>

        <button type="submit">Забронювати</button>
      </form>

      <BookingTable bookings={bookings} setBookings={setBookings} />
    </div>
  );
};

export default BookingPage;

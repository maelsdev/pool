import React, { useState, useEffect } from 'react';
import './BookingTable.css';
import axios from 'axios';

const BookingTable = ({ bookings, setBookings }) => {
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [paymentAmount, setPaymentAmount] = useState(0); // Поле для введення суми оплати
  const [pricePerHour, setPricePerHour] = useState(100); // Ціна за годину
  const [priceForTwoHours, setPriceForTwoHours] = useState(180); // Ціна за дві години

  // Завантажуємо ціни з налаштувань
  useEffect(() => {
    axios.get('http://localhost:5001/api/settings')
      .then(response => {
        const settings = response.data;
        setPricePerHour(settings.pricePerHour);
        setPriceForTwoHours(settings.priceForTwoHours);
      })
      .catch(err => console.error('Помилка завантаження налаштувань:', err));
  }, []);

  const handleEdit = (booking) => {
    setEditingBookingId(booking._id);
    setEditedBooking({ ...booking });
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
    setEditedBooking({});
  };

  const handleSaveEdit = async (id) => {
    try {
      const updatedTotalPrice = calculateTotalPrice(editedBooking.duration, editedBooking.seats);
      const updatedBooking = {
        ...editedBooking,
        totalPrice: updatedTotalPrice
      };

      const response = await axios.put(`http://localhost:5001/api/bookings/${id}`, updatedBooking);
      
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id ? response.data : booking
        )
      );
      setEditingBookingId(null);
    } catch (err) {
      console.error('Помилка оновлення бронювання:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error('Помилка видалення бронювання:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  // Функція для обчислення загальної вартості
  const calculateTotalPrice = (duration, seats) => {
    const price = duration === '1' ? pricePerHour : priceForTwoHours;
    return price * seats;
  };

  // Оновлюємо загальну вартість під час редагування кількості місць або тривалості
  useEffect(() => {
    if (editingBookingId) {
      const updatedTotalPrice = calculateTotalPrice(editedBooking.duration, editedBooking.seats);
      setEditedBooking((prevBooking) => ({
        ...prevBooking,
        totalPrice: updatedTotalPrice,
      }));
    }
  }, [editedBooking.duration, editedBooking.seats]);

  // Логіка сортування за датою та часом
  const sortedBookings = bookings.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB; // Сортуємо від меншого до більшого
  });

  // Функція для обробки платежу
  const handlePaymentChange = (e) => {
    setPaymentAmount(Number(e.target.value)); // Оновлюємо введену суму оплати
  };

  const handleAddPayment = async (booking) => {
    const updatedBooking = {
      ...booking,
      paid: booking.paid + paymentAmount, // Оновлюємо сплачено
      remaining: booking.totalPrice - (booking.paid + paymentAmount), // Оновлюємо залишок
    };
    try {
      const response = await axios.put(`http://localhost:5001/api/bookings/${booking._id}`, updatedBooking);
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b._id === booking._id ? response.data : b))
      );
      setPaymentAmount(0); // Очищуємо поле після оплати
    } catch (err) {
      console.error('Помилка оновлення бронювання після оплати:', err);
    }
  };

  return (
    <table className="booking-table">
      <thead>
        <tr>
          <th>Прізвище</th>
          <th>Ім'я</th>
          <th>Телефон</th>
          <th>Дата</th>
          <th>Час</th>
          <th>Тривалість</th>
          <th>Кількість місць</th>
          <th>Загальна вартість</th>
          <th>Сплачено</th>
          <th>Залишок</th>
          <th>Оплата</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {sortedBookings.map((booking) => (
          <tr key={booking._id}>
            <td>
              {editingBookingId === booking._id ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedBooking.lastName || ''}
                  onChange={handleChange}
                />
              ) : (
                booking.lastName
              )}
            </td>
            <td>
              {editingBookingId === booking._id ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedBooking.firstName || ''}
                  onChange={handleChange}
                />
              ) : (
                booking.firstName
              )}
            </td>
            <td>
              {editingBookingId === booking._id ? (
                <input
                  type="tel"
                  name="phone"
                  value={editedBooking.phone || ''}
                  onChange={handleChange}
                />
              ) : (
                booking.phone
              )}
            </td>
            <td>
              {editingBookingId === booking._id ? (
                <input
                  type="date"
                  name="date"
                  value={editedBooking.date || ''}
                  onChange={handleChange}
                />
              ) : (
                booking.date
              )}
            </td>
            <td>
              {editingBookingId === booking._id ? (
                <input
                  type="time"
                  name="time"
                  value={editedBooking.time || ''}
                  onChange={handleChange}
                />
              ) : (
                booking.time
              )}
            </td>
            <td>
              {editingBookingId === booking._id ? (
                <select name="duration" value={editedBooking.duration || '1'} onChange={handleChange}>
                  <option value="1">1 година</option>
                  <option value="2">2 години</option>
                </select>
              ) : booking.duration === '1' ? '1 година' : '2 години'}
            </td>
            <td>
              {editingBookingId === booking._id ? (
                <input
                  type="number"
                  name="seats"
                  value={editedBooking.seats || ''}
                  onChange={handleChange}
                />
              ) : (
                booking.seats
              )}
            </td>
            <td>{editingBookingId === booking._id ? editedBooking.totalPrice : booking.totalPrice}</td>
            <td>{booking.paid}</td>
            <td>{booking.remaining}</td>
            <td>
              <input
                type="number"
                value={paymentAmount}
                onChange={handlePaymentChange}
                placeholder="Сума оплати"
              />
              <button onClick={() => handleAddPayment(booking)}>Сплатити</button>
            </td>
            <td>
              {editingBookingId === booking._id ? (
                <>
                  <button onClick={() => handleSaveEdit(booking._id)}>Зберегти</button>
                  <button onClick={handleCancelEdit}>Скасувати</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(booking)}>Редагувати</button>
                  <button onClick={() => handleDelete(booking._id)}>Видалити</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingTable;

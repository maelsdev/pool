import React, { useState, useEffect } from 'react';
import './BookingTable.css';
import axios from 'axios';

const BookingTable = ({ bookings, setBookings }) => {
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [pricePerHour, setPricePerHour] = useState(100); // Ціна за годину
  const [priceForTwoHours, setPriceForTwoHours] = useState(180); // Ціна за дві години
  const [paymentAmounts, setPaymentAmounts] = useState({});

  // Отримати поточну дату у форматі YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
        totalPrice: updatedTotalPrice,
        remaining: updatedTotalPrice - editedBooking.paid // Оновлюємо залишок
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
        remaining: updatedTotalPrice - prevBooking.paid, // Оновлюємо залишок динамічно
      }));
    }
  }, [editedBooking.duration, editedBooking.seats]);

  const handlePaymentChange = (e, bookingId) => {
    const value = e.target.value;
    setPaymentAmounts((prev) => ({
      ...prev,
      [bookingId]: value, // Оновлюємо суму оплати лише для конкретного бронювання
    }));
  };

  const handleAddPayment = async (booking) => {
    const paymentValue = parseFloat(paymentAmounts[booking._id] || 0);
    if (paymentValue > booking.remaining) {
      return;
    }

    const updatedBooking = {
      ...booking,
      paid: booking.paid + paymentValue,
      remaining: booking.remaining - paymentValue,
    };

    try {
      const response = await axios.put(`http://localhost:5001/api/bookings/${booking._id}`, updatedBooking);
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b._id === booking._id ? response.data : b))
      );
      setPaymentAmounts((prev) => ({
        ...prev,
        [booking._id]: '', // Очищення поля після сплати для конкретного бронювання
      }));
    } catch (err) {
      console.error('Помилка оновлення бронювання після оплати:', err);
    }
  };

  // Фільтруємо бронювання за сьогоднішньою датою
  const todayDate = getTodayDate();
  const filteredBookings = bookings.filter((booking) => booking.date === todayDate);

  // Логіка сортування за датою та часом
  const sortedBookings = filteredBookings.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB; // Сортуємо від меншого до більшого
  });

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
            <td>{booking.duration === '1' ? '1 година' : '2 години'}</td>
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
            <td
              style={{
                backgroundColor: booking.remaining === 0 ? 'green' : 'transparent',
                color: booking.remaining === 0 ? 'white' : 'black',
              }}
            >
              {booking.remaining}
            </td>
            <td>
              <input
                type="number"
                value={paymentAmounts[booking._id] || ''}
                onChange={(e) => handlePaymentChange(e, booking._id)}
                placeholder="Сума оплати"
                style={{
                  color: parseFloat(paymentAmounts[booking._id] || 0) > booking.remaining ? 'red' : 'black',
                }}
              />
              <button
                onClick={() => handleAddPayment(booking)}
                disabled={parseFloat(paymentAmounts[booking._id] || 0) > booking.remaining} // Деактивація кнопки, якщо сума більша за залишок
              >
                Сплатити
              </button>
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

import React, { useState, useEffect, useCallback } from 'react'; // Додаємо useCallback
import './BookingTable.css';
import axios from 'axios';
import API_URL from '../config'

const BookingTable = ({ bookings, setBookings }) => {
  // Отримати поточну дату у форматі YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [pricePerHour, setPricePerHour] = useState(100);
  const [priceForTwoHours, setPriceForTwoHours] = useState(180);
  const [filterDate, setFilterDate] = useState(getTodayDate());
  const [showAll, setShowAll] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [searchLastName, setSearchLastName] = useState(''); // Фільтр за прізвищем

  // Використовуємо useCallback для мемоізації calculateTotalPrice
  const calculateTotalPrice = useCallback((duration, seats) => {
    const price = duration === '1' ? pricePerHour : priceForTwoHours;
    return price * seats;
  }, [pricePerHour, priceForTwoHours]);

  useEffect(() => {
    axios.get(`${API_URL}/api/settings`)
      .then(response => {
        const settings = response.data;
        setPricePerHour(settings.pricePerHour);
        setPriceForTwoHours(settings.priceForTwoHours);
      })
      .catch(err => console.error('Помилка завантаження налаштувань:', err));
  }, []); // Залишаємо порожній масив, щоб отримати налаштування один раз

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
        remaining: updatedTotalPrice - editedBooking.paid,
      };

      const response = await axios.put(`${API_URL}/api/bookings/${id}`, updatedBooking);
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
      await axios.delete(`${API_URL}/api/bookings/${id}`);
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

  const handlePaymentChange = (e, bookingId) => {
    const value = e.target.value;
    setPaymentAmounts((prev) => ({
      ...prev,
      [bookingId]: value,
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
      const response = await axios.put(`${API_URL}/api/bookings/${booking._id}`, updatedBooking);
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b._id === booking._id ? response.data : b))
      );
      setPaymentAmounts((prev) => ({
        ...prev,
        [booking._id]: '', // Очищення поля після сплати
      }));
    } catch (err) {
      console.error('Помилка оновлення бронювання після оплати:', err);
    }
  };

  useEffect(() => {
    if (editingBookingId) {
      const updatedTotalPrice = calculateTotalPrice(editedBooking.duration, editedBooking.seats);
      setEditedBooking((prevBooking) => ({
        ...prevBooking,
        totalPrice: updatedTotalPrice,
        remaining: updatedTotalPrice - prevBooking.paid,
      }));
    }
  }, [editedBooking.duration, editedBooking.seats, calculateTotalPrice, editingBookingId]); // Додаємо editingBookingId

  const filteredBookings = showAll ? bookings : bookings.filter((booking) => booking.date === filterDate);

  const searchedBookings = filteredBookings.filter((booking) =>
    booking.lastName.toLowerCase().includes(searchLastName.toLowerCase())
  );

  const sortedBookings = searchedBookings.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  // Функція для друку таблиці
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const tableHtml = `
      <html>
      <head><title>Друк бронювань</title></head>
      <body>
        <h1>Таблиця бронювань</h1>
        <table border="1" cellpadding="10" cellspacing="0">
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
            </tr>
          </thead>
          <tbody>
            ${sortedBookings
              .map(
                (booking) => `
                  <tr>
                    <td>${booking.lastName}</td>
                    <td>${booking.firstName}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td>${booking.duration === '1' ? '1 година' : '2 години'}</td>
                    <td>${booking.seats}</td>
                    <td>${booking.totalPrice}</td>
                    <td>${booking.paid}</td>
                    <td>${booking.remaining}</td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <div className="filters">
        <label>Дата: </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setShowAll(false);
          }}
        />
        <button onClick={() => setShowAll(true)}>Показати всі</button>
        <label>Пошук за прізвищем: </label>
        <input
          type="text"
          value={searchLastName}
          onChange={(e) => setSearchLastName(e.target.value)}
          placeholder="Введіть прізвище"
        />
        <button onClick={handlePrint}>Роздрукувати</button>
      </div>

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
              <td>{editingBookingId === booking._id ? <input type="text" name="lastName" value={editedBooking.lastName || ''} onChange={handleChange} /> : booking.lastName}</td>
              <td>{editingBookingId === booking._id ? <input type="text" name="firstName" value={editedBooking.firstName || ''} onChange={handleChange} /> : booking.firstName}</td>
              <td>{editingBookingId === booking._id ? <input type="tel" name="phone" value={editedBooking.phone || ''} onChange={handleChange} /> : booking.phone}</td>
              <td>{editingBookingId === booking._id ? <input type="date" name="date" value={editedBooking.date || ''} onChange={handleChange} /> : booking.date}</td>
              <td>{editingBookingId === booking._id ? <input type="time" name="time" value={editedBooking.time || ''} onChange={handleChange} /> : booking.time}</td>
              <td>
                {editingBookingId === booking._id ? (
                  <select name="duration" value={editedBooking.duration || '1'} onChange={handleChange}>
                    <option value="1">1 година</option>
                    <option value="2">2 години</option>
                  </select>
                ) : booking.duration === '1' ? '1 година' : '2 години'}
              </td>
              <td>{editingBookingId === booking._id ? <input type="number" name="seats" value={editedBooking.seats || ''} onChange={handleChange} /> : booking.seats}</td>
              <td>{editingBookingId === booking._id ? editedBooking.totalPrice : booking.totalPrice}</td>
              <td>{booking.paid}</td>
              <td style={{ backgroundColor: booking.remaining === 0 ? 'green' : 'transparent', color: booking.remaining === 0 ? 'white' : 'black' }}>{booking.remaining}</td>
              <td>
                <input type="number" value={paymentAmounts[booking._id] || ''} onChange={(e) => handlePaymentChange(e, booking._id)} placeholder="Сума оплати" />
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
    </div>
  );
};

export default BookingTable;

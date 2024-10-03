import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const PaymentHistoryPage = () => {
  const [paymentLogs, setPaymentLogs] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/payment-logs`) // URL до API для отримання історії оплат
    
      .then(response => {
        setPaymentLogs(response.data);
      })
      .catch(err => console.error('Помилка завантаження історії оплат:', err));
  }, []);

  return (
    <div>
      <h1>Історія оплат</h1>
      <table>
        <thead>
          <tr>
            <th>Прізвище</th>
            <th>Ім'я</th>
            <th>Дата бронювання</th>
            <th>Час бронювання</th>
            <th>Сума оплати</th>
            <th>Дата і час оплати</th>
          </tr>
        </thead>
        <tbody>
          {paymentLogs.map((log) => (
            <tr key={log._id}>
              <td>{log.lastName}</td>
              <td>{log.firstName}</td>
              <td>{log.date}</td>
              <td>{log.time}</td>
              <td>{log.amount}</td>
              <td>{new Date(log.paymentDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryPage;

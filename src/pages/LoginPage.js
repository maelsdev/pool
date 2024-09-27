import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Зберігаємо токен
      setAuthenticated(true); // Встановлюємо стан авторизації
    } catch (err) {
      setError('Невірний email або пароль');
    }
  };

  return (
    <div>
      <h2>Логін адміністратора</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button type="submit">Логін</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;

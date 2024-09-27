import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ onLogout }) => { // Додаємо пропс onLogout
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Бронювання</Link>
        </li>
        <li>
          <Link to="/settings">Налаштування</Link>
        </li>
        <li>
          <button onClick={onLogout}>Вийти</button> {/* Кнопка для виходу */}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

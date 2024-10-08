import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Бронювання</Link>
        </li>
        <li>
          <Link to="/settings">Налаштування</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

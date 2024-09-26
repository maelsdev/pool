import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Імпорт стилів
import Navigation from './components/Navigation'; // Імпорт навігації
import BookingPage from './pages/BookingPage'; // Імпорт сторінки бронювання
import SettingsPage from './pages/SettingsPage'; // Імпорт сторінки налаштувань

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation /> {/* Виводимо навігацію */}

        <Routes>
          <Route path="/" element={<BookingPage />} /> {/* Сторінка з бронюванням */}
          <Route path="/settings" element={<SettingsPage />} /> {/* Сторінка налаштувань */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

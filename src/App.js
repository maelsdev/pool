import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Імпортуємо бібліотеку для кукіс
import './App.css'; // Імпорт стилів
import Navigation from './components/Navigation'; // Імпортуємо навігацію
import BookingPage from './pages/BookingPage'; // Імпортуємо сторінку бронювання
import SettingsPage from './pages/SettingsPage'; // Імпортуємо сторінку налаштувань
import Login from './pages/Login'; // Імпортуємо сторінку авторизації

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Стан для авторизації

    useEffect(() => {
        console.log('Checking authentication...');
        const storedAuth = Cookies.get('isAuthenticated'); // Отримуємо кукіс

        console.log('Stored Auth:', storedAuth); // Лог для перевірки

        // Перевіряємо, чи користувач авторизований
        if (storedAuth === 'true') {
            setIsAuthenticated(true); // Встановлюємо стан авторизації
            console.log('User is authenticated');
        } else {
            console.log('User is not authenticated');
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        Cookies.set('isAuthenticated', 'true', { expires: 1 }); // Зберігаємо кукіс на 1 день
        console.log('Login successful, stored in cookies');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        Cookies.remove('isAuthenticated'); // Видаляємо кукіс
        console.log('User logged out');
    };

    return (
        <Router>
            <div className="App">
                {isAuthenticated && <Navigation onLogout={handleLogout} />} {/* Відображати навігацію тільки якщо авторизований */}

                <Routes>
                    <Route path="/" element={isAuthenticated ? <BookingPage /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} /> {/* Перенаправляємо, якщо авторизований */}
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} /> {/* Перенаправлення для невідомих маршрутів */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

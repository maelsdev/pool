import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Ініціалізуємо navigate

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Намагаємося увійти з:', { username, password }); // Логування введених даних

        fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then((response) => {
            console.log('Статус відповіді:', response.status); // Логування статусу відповіді

            if (response.ok) {
                onLogin(); // Викликаємо функцію при успішному вході
                navigate('/'); // Перенаправляємо на сторінку бронювання
            } else {
                console.log('Login failed with status:', response.status);
                setErrorMessage('Невірний логін або пароль');
            }
        })
        .catch((error) => {
            console.error('Помилка під час авторизації:', error);
            setErrorMessage('Сталася помилка. Спробуйте пізніше.');
        });
    };

    return (
        <div className="login-container">
            <h2>Вхід</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Логін"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
};

export default Login;

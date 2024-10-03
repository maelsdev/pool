import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Завантажити користувачів з сервера
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/auth/users`);
                if (!response.ok) {
                    throw new Error('Не вдалося отримати користувачів');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Помилка при завантаженні користувачів:', error);
                setErrorMessage('Не вдалося завантажити користувачів');
            }
        };

        fetchUsers();
    }, []); // Виконати тільки один раз при монтуванні

    const addUser = async (e) => {
        e.preventDefault();
        const newUser = { username, password };

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                // Додати користувача до списку
                setUsers([...users, newUser]);
                setUsername('');
                setPassword('');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Не вдалося додати користувача');
            }
        } catch (error) {
            console.error('Помилка при додаванні користувача:', error);
            setErrorMessage('Не вдалося додати користувача');
        }
    };

    const deleteUser = async (usernameToDelete) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/users/${usernameToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter(user => user.username !== usernameToDelete)); // Видаляємо користувача
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Не вдалося видалити користувача');
            }
        } catch (error) {
            console.error('Помилка при видаленні користувача:', error);
            setErrorMessage('Не вдалося видалити користувача');
        }
    };

    return (
        <div>
            <h2>Керування Користувачами</h2>
            <form onSubmit={addUser}>
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
                <button type="submit">Додати Користувача</button>
            </form>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <h3>Список Користувачів</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        {user.username} <button onClick={() => deleteUser(user.username)}>Видалити</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;

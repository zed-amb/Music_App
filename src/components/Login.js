import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../network/network';
import UserContext from '../contexts/user-context';
import './login.css'; 

export default function Login() {
    const { setUserState } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            setUserState({ token: response.accessToken, id: response.id, username: response.username, playType: response.playType });
            localStorage.setItem("token", response.accessToken);
            navigate("/");
        } catch (err) {
            setError("Failed to login. Please check your username and password.");
        }
    };

    return (
        <div className="login-container">

            <form onSubmit={handleLogin} className="login-form">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="welcome-message">Welcome to my Music App</div>
        </div>
    );
}

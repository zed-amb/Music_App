
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../network/network';
import UserContext from '../contexts/user-context';

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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}
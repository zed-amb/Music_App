import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserContext from './contexts/user-context';
import Home from './components/Home';
import MusicTable from './components/MusicTable';
import Login from './components/Login';

function App() {
    const [userState, setUserState] = useState({
        token: localStorage.getItem("token"),
        id: null,
        username: null,
        playType: null
    });

    useEffect(() => {
        localStorage.setItem("token", userState.token || "");
    }, [userState.token]);

    return (
        <UserContext.Provider value={{ userState, setUserState }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={!userState.token ? <Login /> : <Navigate to="/welcome" />} />
                    <Route path="/welcome" element={userState.token ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/music" element={<MusicTable />} />
                </Routes>
            </Router>
        </UserContext.Provider>
    );
}

export default App;


import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/user-context';
import MusicTable from './MusicTable';

function Home() {
    const { userState, setUserState } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserState({ token: null, id: null, username: null, playType: null }); 
        localStorage.removeItem('token'); 
        navigate('/login');
    };

    return (
        <div>
            <h1>Welcome, {userState.username}</h1>
            <button onClick={handleLogout}>Logout</button>
            <MusicTable />
        </div>
    );
}

export default Home;

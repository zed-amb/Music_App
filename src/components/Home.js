import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/user-context';
import MusicTable from './MusicTable';
import logoImg from '../images/Mlogo.jpg';

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logoImg} alt="Logo" style={{ width: '100px', marginRight: '10px' }} /> {/* Adjust the width of the logo */}
                    <h1 style={{ margin: '0', textAlign: 'center', flexGrow: 1 }}>Welcome, {userState.username}</h1> {/* Center the Welcome text */}
                </div>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <MusicTable />
        </div>
    );
}

export default Home;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchSongs, removeFromPlaylist, getPlaylist } from '../network/network';
import { FaPlay, FaPause, FaPlus, FaTrashAlt, FaStepForward, FaStepBackward, FaRandom } from 'react-icons/fa';
import backgroundImg from '../images/mymusic.jpg';

export default function MusicTable() {
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState('');
    const [currentSong, setCurrentSong] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const audioRef = useRef(null);

    const fetchSongs = useCallback(async () => {
        try {
            const data = await searchSongs(searchQuery);
            setSongs(data);
        } catch (err) {
            setError(err.message);
        }
    }, [searchQuery]); 

    useEffect(() => {
        fetchSongs();
    }, [searchQuery, fetchSongs]); 

    useEffect(() => {
        fetchPlaylist();
    }, []); 

    const fetchPlaylist = async () => {
        try {
            const data = await getPlaylist();
            setPlaylist(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddToPlaylist = async (songId) => {
        if (playlist.some(song => song.id === songId)) {
            console.log("Song already in playlist");
            return;
        }
        try {
            const newSong = songs.find(song => song.id === songId);
            if (newSong) {
                setPlaylist(prevPlaylist => [...prevPlaylist, newSong]);
            } else {
                console.error("Song not found in the list of available songs");
            }
        } catch (err) {
            setError(err.message);
        }
    };


    const handleRemoveFromPlaylist = async (songId) => {
        try {
            await removeFromPlaylist(songId);
            setPlaylist(prevPlaylist => prevPlaylist.filter(song => song.id !== songId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePlaySong = (songIndex) => {
        const songUrl = `http://localhost:3000/music/${playlist[songIndex].urlPath.replace('music/', '')}`;
        setCurrentSongIndex(songIndex);
        setCurrentSong(songUrl);
        setIsPlaying(!isPlaying);
        if (audioRef && audioRef.current) {
            if (isPlaying && currentSongIndex === songIndex) {
   
                audioRef.current.pause();
            } else {
                audioRef.current.src = songUrl;
                audioRef.current.play()
                    .then(() => {
                        console.log("Audio is being played");
                    })
                    .catch(err => {
                        console.error("Error playing the song:", err);
                        setIsPlaying(false);
                    });
            }
        } else {
            console.error("audioRef is not set.");
        }
    };

    const handleForward = () => {
        if (isPlaying) {
            audioRef.current.pause();
        }
        const nextIndex = (currentSongIndex + 1) % playlist.length;
        handlePlaySong(nextIndex);
    };

    const handlePrevious = () => {
        if (isPlaying) {
            audioRef.current.pause();
        }
        const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        handlePlaySong(prevIndex);
    };

    const handleShuffle = () => {
        const randomIndex = Math.floor(Math.random() * playlist.length);
        handlePlaySong(randomIndex);
    };

    const handleSearch = async () => {
        try {
            await fetchSongs();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="music-table-container" style={{ 
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textAlign: 'center',
            paddingTop: '50px',
            color: '#90caf9', 
        }}>
            <div style={{ marginBottom: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '80%', 
                        padding: '15px',
                        fontSize: '18px', 
                        border: '1px solid #ccc',
                        borderRadius: '10px', 
                        boxSizing: 'border-box',
                    }}
                />
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Your Music</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: 'auto', border: '2px solid #fff', color: '##47a7f5' }}>
                <thead>
                    <tr>
                        <th style={{ border: '2px solid #fff', fontWeight: 'bold', padding: '10px', fontSize: '18px' }}>Index</th>
                        <th style={{ border: '2px solid #fff', fontWeight: 'bold', padding: '10px', fontSize: '18px' }}>Title</th>
                        <th style={{ border: '2px solid #fff', fontWeight: 'bold', padding: '10px', fontSize: '18px' }}>Release Date</th>
                        <th style={{ border: '2px solid #fff', fontWeight: 'bold', padding: '10px', fontSize: '18px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => (
                        <tr key={song.id}>
                            <td style={{ border: '2px solid #fff', padding: '10px', fontSize: '16px' }}>{index + 1}</td>
                            <td style={{ border: '2px solid #fff', padding: '10px', fontSize: '16px' }}>{song.title}</td>
                            <td style={{ border: '2px solid #fff', padding: '10px', fontSize: '16px' }}>{song.releaseDate}</td>
                            <td style={{ border: '2px solid #fff', padding: '10px', fontSize: '16px' }}>
                                <button onClick={() => handleAddToPlaylist(song.id)}><FaPlus /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 style={{ fontSize: '24px', marginTop: '20px', marginBottom: '10px' }}>Your Playlist</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: 'auto', border: '2px solid #fff', color: '##47a7f5' }}>
                <thead>
                    <tr>
                        <th style={{ border: '2px solid #fff', fontWeight: 'bold', padding: '10px', fontSize: '18px' }}>Index</th>
                        <th style={{ border: '2px solid #fff', fontWeight: 'bold', padding: '10px', fontSize: '18px' }}>Title</th>
                        <th style={{ border: '2px solid #fff', fontWeight: 'bold', padding: '10px', fontSize: '18px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {playlist.map((song, index) => (
                        <tr key={song.id}>
                            <td style={{ border: '2px solid #fff', padding: '10px', fontSize: '16px' }}>{index + 1}</td>
                            <td style={{ border: '2px solid #fff', padding: '10px', fontSize: '16px' }}>{song.title}</td>
                            <td style={{ border: '2px solid #fff', padding: '10px', fontSize: '16px' }}>
                                <button onClick={() => handlePlaySong(index)}>
                                    {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
                                </button>
                                <button onClick={() => handleRemoveFromPlaylist(song.id)}><FaTrashAlt /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <audio
                ref={audioRef}
                controls
                autoPlay
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{ marginTop: '20px', width: '80%' }}
            >
                <source src={currentSong} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            <div style={{ marginTop: '20px' }}>
                <button onClick={handlePrevious} style={{ marginRight: '10px' }}><FaStepBackward /></button>
                <button onClick={handleForward} style={{ marginRight: '10px' }}><FaStepForward /></button>
                <button onClick={handleShuffle}><FaRandom /></button>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { searchSongs, addToPlaylist, removeFromPlaylist, getPlaylist } from '../network/network';


export default function MusicTable() {
    const [songs, setSongs] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [currentSong, setCurrentSong] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        fetchSongs();
        fetchPlaylist();
    }, []);

    const fetchSongs = async () => {
        try {
            const data = await searchSongs(''); 
            setSongs(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchPlaylist = async () => {
        try {
            const data = await getPlaylist();
            setPlaylist(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddToPlaylist = async (songId) => {
        try {
            const updatedPlaylist = await addToPlaylist(songId);
            setPlaylist(updatedPlaylist);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveFromPlaylist = async (songId) => {
        try {
            const updatedPlaylist = await removeFromPlaylist(songId);
            setPlaylist(updatedPlaylist);
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePlaySong = (urlPath) => {
        setCurrentSong(urlPath);
    };

    return (
        <div>
            <h2>Your Music</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Title</th>
                        <th>Release Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => (
                        <tr key={song.id}>
                            <td>{index + 1}</td>
                            <td>{song.title}</td>
                            <td>{song.releaseDate}</td>
                            <td>
                                <button onClick={() => handleAddToPlaylist(song.id)}>Add to Playlist</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Your Playlist</h2>
            <table>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {playlist.map((song, index) => (
                        <tr key={song.id}>
                            <td>{index + 1}</td>
                            <td>{song.title}</td>
                            <td>
                                <button onClick={() => handlePlaySong(song.urlPath)}>Play</button>
                                <button onClick={() => handleRemoveFromPlaylist(song.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <audio controls src={currentSong} autoPlay>
                <source src={currentSong} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3000/api";

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


const checkError = (response) => {
    if (response.data.accessToken) {
        return response.data;
    } else if (response.data.status === "error") {
        throw new Error(response.data.message);
    }
    return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post('/auth/login', { username, password });
  return checkError(response);
};

export const searchSongs = async (query) => {
  const response = await axios.get(`/music?search=${query}`);
  return checkError(response);
};

export const getPlaylist = async () => {
  const response = await axios.get('/playlist');
  return checkError(response);
};

export const addToPlaylist = async (songId) => {
  const response = await axios.post('/playlist/add', { songId });
  return checkError(response);
};

export const removeFromPlaylist = async (songId) => {
    try {
        const response = await axios.post('/playlist/remove', { songId });
        return checkError(response);
    } catch (error) {
        console.error("Error removing from playlist:", error.response ? error.response.data : error.message);
        throw error; 
    }
};

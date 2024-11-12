import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client'; 
import Login_signup from './pages/Login_signup';
import InterestSelector from './pages/InterestSelector';
import Sidebar from './pages/Sidebar';
import MusicPlayer from './pages/MusicPlayer';
import Navbar from './pages/Navbar';
import AlbumPage from './pages/AlbumPage';
import LikedSongs from './pages/LikedSongs';
import Search from './pages/Search';
import LibraryPage from './pages/LibraryPage';
import PlaylistPage from './pages/PlaylistPage';
import CreatePlaylist from './pages/CreatePlaylist';
import History from './pages/History';
import Home from './pages/Home';
import Player from './pages/Player';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Share from './pages/Share';
import SocketRoom from './pages/SocketRoom';
import Artists from './pages/Artists';
import ArtistPage from './pages/ArtistPage';
import axios from 'axios'

const App = () => {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const userId = sessionStorage.getItem('userId');
    const location = useLocation();
    const [currentSong, setCurrentSong] = useState(null);
    const [songs, setSongs] = useState([]);
    const [socket, setSocket] = useState(null);  // Store the socket instance
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/interest';
    const [recommendations, setRecommendations] = useState([]);
    useEffect(() => {
        if (currentSong) {
          // Get song history from sessionStorage (or localStorage if that's where it's stored)
          const currentHistory = JSON.parse(sessionStorage.getItem('songHistory')) || [];
    
          // Remove the current song if it exists to prevent duplicates
          const songIndex = currentHistory.findIndex(song => song._id === currentSong._id);
          if (songIndex !== -1) {
            currentHistory.splice(songIndex, 1);
          }
    
          // Add the current song to the top of the history
          const updatedHistory = [currentSong, ...currentHistory];
    
          // Update sessionStorage with the new history
          sessionStorage.setItem('songHistory', JSON.stringify(updatedHistory));
    
          // Get the token from sessionStorage (or wherever you store it)
          const token = sessionStorage.getItem('token'); // Make sure this token exists and is valid
    
          // Send the updated history to the backend to get recommendations
          const headers = token ? { Authorization: token} : {}; // Optional token header
    
          axios.post('http://localhost:8080/auth/recommendations', { songHistory: updatedHistory }, { headers })
            .then(response => {
            //   console.log('Recommendations received:', response.data);
              setRecommendations(response.data.recommendations); // Store recommendations
            })
            .catch(error => {
              console.error('Error fetching recommendations:', error);
            });
        }
      }, [currentSong]); 
     

     const [token, setToken] = useState(null);
  

    const handleSongSelection = (song, albumSongs) => {
        setCurrentSong(song);
        if (albumSongs && Array.isArray(albumSongs)) {
            setSongs(albumSongs);
        }
    };


    useEffect(() => {
        if (!userId) return; // Don't initialize socket until userId is available
    
        const socketIo = io('http://localhost:8080', {
            withCredentials: true
        });
    
        socketIo.emit('join-room', userId);
        socketIo.on('connect', () => {
            console.log('Connected to WebSocket server');
          });
          
          socketIo.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
          });
          
        // Listen for new song notifications
        
        socketIo.on('new-song', (data) => {
          console.log(`New song added: ${data.songName} by artist ${data.artistId}`);
          
          setNotificationCount(prevCount => prevCount + 1);  // Increase the notification count
          setNotifications(prevNotifications => [
            ...prevNotifications,
            { message: data.message },
          ]);
        });
    
        return () => {
          socketIo.disconnect();
        };
      }, [userId]);

    return (
        <div className="App">
            {isAuthRoute ? (
                <div className="App1">
                    <Routes>
                        <Route path="/" element={userId ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                        <Route path="/login" element={<Login_signup />} />
                        <Route path="/interest" element={<InterestSelector userId={userId} />} />
                    </Routes>
                </div>
            ) : (
                <div className='App2'>
                    <ToastContainer />
                    <div className="h-screen w-screen flex overflow-x-auto overflow-y-auto scrollbar-hide">
                        <div className="h-screen bg-black flex flex-col justify-between overflow-hid z-10">
                            <Sidebar />
                        </div>
                        <div className="h-screen w-screen bg-app-black scrollbar-hide z-9">
                        <Navbar notificationCount={notificationCount+1} setNotificationCount={setNotificationCount} notifications={notifications} />
                            <Routes>

                                <Route path="/" element={<Navigate to={userId ? "/home" : "/login"} />} />
                                <Route path="/home" element={<Home onSongSelect={handleSongSelection} recommendations={recommendations}/>} />
                                <Route path="/album-p/:id" element={<AlbumPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/liked-songs" element={<LikedSongs onSongSelect={handleSongSelection} />} />
                                <Route path="/search" element={<Search onSongSelect={handleSongSelection} />} />
                                <Route path='/playlist' element={<CreatePlaylist />} />
                                <Route path="/library" element={<LibraryPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/playlist/:id" element={<PlaylistPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/history" element={<History setCurrentSong={handleSongSelection} />} />
                                <Route path="/player" element={<Player />} />
                                <Route path="/playlist-shared/:playlistId" element={<Share/>} />
                                <Route path='/room' element={<SocketRoom currentSong={currentSong} setCurrentSong={handleSongSelection} />} />
                                <Route path="/artists" element={<Artists/>} />
                                <Route path="/artists/:id" element={<ArtistPage currentSong={currentSong} setCurrentSong={handleSongSelection} />} />
                                

                            </Routes>
                        </div>
                    </div>
                    <MusicPlayer songs={songs || []} currentSong={currentSong} onSongChange={handleSongSelection} />
                </div>
            )}
        </div>
    );
};

export default App;
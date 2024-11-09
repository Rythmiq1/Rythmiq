import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client'; 
import Login_signup from './pages/Login_signup';
import GenreSelectionPopup from './pages/GenreSelector';
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
import Songs from './pages/Songs';
import Share from './pages/Share';

const App = () => {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const userId = sessionStorage.getItem('userId');
    const location = useLocation();
    const [currentSong, setCurrentSong] = useState(null);
    const [songs, setSongs] = useState([]);
    const [socket, setSocket] = useState(null);  // Store the socket instance
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/genre';

    useEffect(() => {
        if (currentSong) {
            const currentHistory = JSON.parse(sessionStorage.getItem('songHistory')) || [];
            const songIndex = currentHistory.findIndex(song => song._id === currentSong._id);

            if (songIndex !== -1) {
                currentHistory.splice(songIndex, 1);
            }
            const updatedHistory = [currentSong, ...currentHistory];
            sessionStorage.setItem('songHistory', JSON.stringify(updatedHistory));
        }
    }, [currentSong]);
     
    //  const id = '0TnOYISbd1XYRBk9myaseg'


     const [token, setToken] = useState(null);

     // Fallback for testing
    //  useEffect(() => {
    //    const fetchToken = async () => {
    //     //  const fetchedToken = await getSpotifyToken();
    //      setToken(fetchedToken || 'default-token-for-testing');
    //    };
     
    //    fetchToken();
    //  }, []);

    const handleSongSelection = (song, albumSongs) => {
        setCurrentSong(song);
        if (albumSongs && Array.isArray(albumSongs)) {
            setSongs(albumSongs);
        }
    };


    useEffect(() => {
        if (!userId) return; // Don't initialize socket until userId is available
    
        const socketIo = io('http://localhost:8080', {
          transports: ['websocket', 'polling'],
        });
    
        socketIo.emit('join-room', userId);
    
        // Listen for new song notifications
        socketIo.on('new-song', (data) => {
          console.log(`New song added: ${data.songName} by artist ${data.artistId}`);
          setNotificationCount(prevCount => prevCount + 1);  // Increase the notification count
          setNotifications(prevNotifications => [
            ...prevNotifications,
            { message: `New song added: ${data.songName} by artist ${data.artistId}` },
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
                        <Route path="/genre" element={<GenreSelectionPopup userId={userId} />} />
                    </Routes>
                </div>
            ) : (
                <div className='App2'>
                    <ToastContainer />
                    <div className="h-screen w-screen flex overflow-x-auto overflow-y-auto scrollbar-hide">
                        <div className="h-screen bg-black flex flex-col justify-between overflow-hid">
                            <Sidebar />
                        </div>
                        <div className="h-screen w-screen bg-app-black scrollbar-hide">
                        <Navbar notificationCount={notificationCount} setNotificationCount={setNotificationCount} notifications={notifications} />
                            <Routes>

                                <Route path="/" element={<Navigate to={userId ? "/home" : "/login"} />} />
                                <Route path="/home" element={<Home onSongSelect={handleSongSelection} />} />
                                <Route path="/album-p/:id" element={<AlbumPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/liked-songs" element={<LikedSongs onSongSelect={handleSongSelection} />} />
                                <Route path="/search" element={<Search onSongSelect={handleSongSelection} />} />
                                <Route path='/playlist' element={<CreatePlaylist />} />
                                <Route path="/library" element={<LibraryPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/playlist/:id" element={<PlaylistPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/history" element={<History setCurrentSong={handleSongSelection} />} />
                                <Route path="/player" element={<Player />} />
                                <Route path="/playlist-shared/:playlistId" element={<Share/>} />

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

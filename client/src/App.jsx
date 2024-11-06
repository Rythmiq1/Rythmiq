import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login_signup from './pages/Login_signup';
import GenreSelectionPopup from './pages/GenreSelector';
import Display from './pages/Display';
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

const App = () => {
    const userId = localStorage.getItem('userId');
    const location = useLocation();
    const [currentSong, setCurrentSong] = useState(null);
    const [songs, setSongs] = useState([]);  // Store all songs
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

    // Function to handle song selection from AlbumPage or other components
    const handleSongSelection = (song, albumSongs) => {
        console.log('Selected Song:', song);
        console.log('Album Songs:', albumSongs);
        setCurrentSong(song);
        if (albumSongs && Array.isArray(albumSongs)) {
            setSongs(albumSongs);  // Only set if it's a valid array
        }
    };
    

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
                    <div className="h-screen w-screen flex overflow-x-auto overflow-y-auto scrollbar-hide">
                        <div className="h-screen w-1/5 bg-black flex flex-col justify-between">
                            <Sidebar />
                        </div>
                        <div className="h-screen w-4/5 bg-app-black scrollbar-hide">
                            <Navbar />
                            <Routes>
                                <Route path="/" element={<Navigate to={userId ? "/home" : "/login"} />} />
                                <Route path="/home" element={<Display onSongSelect={handleSongSelection} />} />
                                <Route path="/album-p/:id" element={<AlbumPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/liked-songs" element={<LikedSongs onSongSelect={handleSongSelection} />} />
                                <Route path="/search" element={<Search onSongSelect={handleSongSelection} />} />
                                <Route path='/playlist' element={<CreatePlaylist />} />
                                <Route path="/library" element={<LibraryPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/playlist/:id" element={<PlaylistPage setCurrentSong={handleSongSelection} />} />
                                <Route path="/history" element={<History setCurrentSong={handleSongSelection} />} />
                            </Routes>
                        </div>
                    </div>
                    <MusicPlayer songs={songs || []} currentSong={currentSong} onSongChange={handleSongSelection} />

                </div>
            )}
        </div>
    );
}

export default App;

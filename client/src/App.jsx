import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import BASE_URL from "./config";

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
import Share from './pages/Share';
import SocketRoom from './pages/SocketRoom';
import Artists from './pages/Artists';
import ArtistPage from './pages/ArtistPage';
import Info from './pages/info';
import MobileSidebar from './pages/MobileSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userId = sessionStorage.getItem('userId');
  const location = useLocation();
  const isAuthRoute = ['/login', '/interest'].includes(location.pathname);
  const isRoomPage = location.pathname === '/room';

  useEffect(() => {
    if (!currentSong) return;

    const history = JSON.parse(sessionStorage.getItem('songHistory')) || [];
    const idx = history.findIndex(s => s._id === currentSong._id);
    if (idx !== -1) history.splice(idx, 1);
    const newHist = [currentSong, ...history];

    sessionStorage.setItem('songHistory', JSON.stringify(newHist));

    const token = sessionStorage.getItem('token');
    axios.post(`${BASE_URL}/auth/recommendations`, { songHistory: newHist }, {
      headers: token ? { Authorization: token } : {}
    })
    .then(res => setRecommendations(res.data.recommendations || []))
    .catch(err => console.error(err));
  }, [currentSong]);

  useEffect(() => {
    if (!userId) return;

    const socket = io(BASE_URL, { withCredentials: true });
    socket.emit('join-room', userId);
    socket.on('new-song', data => {
      setNotificationCount(c => c + 1);
      setNotifications(n => [...n, { message: data.message }]);
    });

    return () => socket.disconnect();
  }, [userId]);

  const handleSongSelection = (song, albumSongs) => {
    setCurrentSong(song);
    if (Array.isArray(albumSongs)) setSongs(albumSongs);
  };

  return (
    <div className="w-screen min-h-screen bg-black text-white  scrollbar-hide">
      {isAuthRoute ? (
        <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 to-black p-4">
          <Routes>
            <Route path="/" element={userId ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login_signup />} />
            <Route path="/interest" element={<InterestSelector userId={userId} />} />
          </Routes>
        </div>
      ) : (
        <div className="scrollbar-hide relative flex flex-col h-screen w-screen bg-gray-950 text-white overflow-auto">
  <ToastContainer />

 
  <Navbar
    notificationCount={notificationCount}
    setNotificationCount={setNotificationCount}
    notifications={notifications}
    onMobileMenuClick={() => setMobileSidebarOpen(true)}
  />

  <div className="flex flex-1 overflow-hidden relative">
 
    <div className="hidden md:block h-full">
      <Sidebar />
    </div>

   
    <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

   
    <main className="flex-1 overflow-y-auto p-4 pt-16 z-10 scrollbar-hide">
      <Routes>
        <Route path="/" element={<Navigate to={userId ? "/home" : "/login"} />} />
        <Route path="/home" element={<Home onSongSelect={handleSongSelection} recommendations={recommendations} />} />
        <Route path="/album-p/:id" element={<AlbumPage setCurrentSong={handleSongSelection} />} />
        <Route path="/liked-songs" element={<LikedSongs onSongSelect={handleSongSelection} />} />
        <Route path="/search" element={<Search onSongSelect={handleSongSelection} />} />
        <Route path="/playlist" element={<CreatePlaylist />} />
        <Route path="/library" element={<LibraryPage setCurrentSong={handleSongSelection} />} />
        <Route path="/playlist/:id" element={<PlaylistPage setCurrentSong={handleSongSelection} />} />
        <Route path="/history" element={<History setCurrentSong={handleSongSelection} />} />
        <Route path="/player" element={<Player />} />
        <Route path="/playlist-shared/:playlistId" element={<Share />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistPage currentSong={currentSong} setCurrentSong={handleSongSelection} />} />
        <Route path="/info" element={<Info />} />
        <Route path="/room" element={<SocketRoom />} />
      </Routes>
    </main>
  </div>

  
  {!isRoomPage && currentSong && (
    <div className="fixed bottom-0 left-0 w-full z-30">
      <MusicPlayer
        songs={songs}
        currentSong={currentSong}
        onSongChange={handleSongSelection}
      />
    </div>
  )}
</div>
      )}
    </div>
  );
};

export default App;

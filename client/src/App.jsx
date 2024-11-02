import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login_signup from './pages/Login_signup';
import GenreSelectionPopup from './pages/GenreSelector';
import Display from './pages/Display';
import Sidebar from './pages/Sidebar';
import MusicPlayer from './pages/MusicPlayer';
import Navbar from './pages/Navbar';
import AlbumItem from './pages/AlbumItem';
import DisplayAlbum from './pages/DisplayAlbum';

const App = () => {
    const userId = localStorage.getItem('userId');
    const location = useLocation(); // Get current location

    // Determine if we should render App1 or App2 based on the current route
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/genre';

    return (
        <div className="App">
            {isAuthRoute ? (
                <div className="App1">
                    <Routes>
                        {/* Redirect to home or login based on userId */}
                        <Route path="/" element={userId ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                        <Route path="/login" element={<Login_signup />} />
                        <Route path="/genre" element={<GenreSelectionPopup userId={userId} />} />
                    </Routes>
                </div>
            ) : (
                <div className='App2'>
                    <div className="h-screen w-screen flex overflow-x-auto overflow-y-auto scrollbar-hide">
                        <div className="h-screen w-1/5 bg-black flex flex-col justify-between pb-10">
                            <Sidebar />
                        </div>
                        <div className="h-screen w-4/5 bg-app-black scrollbar-hide">
                            <Navbar />
                            <Routes>
                               <Route path="/" element={userId ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                               <Route path="/home" element={<Display />} />
                               <Route path="/g" element={<AlbumItem />} />
                               <Route path="/home/album/:id" element={<DisplayAlbum />} /> {/* Update route here */}
</Routes>
                        </div>
                        <MusicPlayer />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
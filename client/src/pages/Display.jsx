import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import DisplayAlbum from './DisplayAlbum';

const Display = () => {
    const userId = localStorage.getItem('userId');
    const selectedGenre = localStorage.getItem('selectedGenre');

    // Ensure userId and selectedGenre are available before proceeding
    if (!userId || !selectedGenre) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="album/:id" element={<DisplayAlbum />} /> {/* Keep this nested route */}
            </Routes>
        </div>
    );
};

export default Display;

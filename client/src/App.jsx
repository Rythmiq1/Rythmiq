import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login_signup from './pages/Login_signup';
import Home from './pages/Home';
import GenreSelectionPopup from './pages/GenreSelector';

function App() {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

    return (
        <div>
            <Routes>
                <Route path='/login' element={<Login_signup />} />
                <Route path='/home' element={<Home />} />
                <Route path='/genre' element={<GenreSelectionPopup userId={userId} />} /> {/* Pass userId as prop */}
            </Routes>
        </div>
    );
}

export default App;

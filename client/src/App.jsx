import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login_signup from './pages/Login_signup';
import Home from './pages/Home';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login_signup />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;

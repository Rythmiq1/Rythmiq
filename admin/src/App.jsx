import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddAlbum from './pages/AddAlbum';
import AddSong from './pages/AddSong';
import ListAlbum from './pages/ListAlbum';
import ListSong from './pages/ListSong';
import Sidebar from './components/Sidebar';
import BASE_URL from "./config"; 
export const url = `${BASE_URL}`;
const App = () => {
   return (
    <div className="relative">
    <div className="md:hidden w-full h-24 bg-gray-800 flex items-center justify-center">
  <img
    src="./src/assets/browser-logo.png"
    alt="Rythmiq Logo"
    className="w-[25%] max-w-xs"
  />
</div>


      <div className="flex items-start min-h-screen pt-12 md:pt-0">
        <ToastContainer />
        <Sidebar />
        <div className="flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]">
          <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
            <Routes>
              <Route path="/" element={<AddSong />} />
              <Route path="/add-song" element={<AddSong />} />
              <Route path="/list-songs" element={<ListSong />} />
              <Route path="/add-album" element={<AddAlbum />} />
              <Route path="/list-albums" element={<ListAlbum />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App

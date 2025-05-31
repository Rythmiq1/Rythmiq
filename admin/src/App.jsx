import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAlbum from "./pages/AddAlbum";
import AddSong from "./pages/AddSong";
import ListAlbum from "./pages/ListAlbum";
import ListSong from "./pages/ListSong";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

const isLoggedIn = () => {
  const token = sessionStorage.getItem("adminToken");
  return typeof token === "string" && token.length > 10;
};

const App = () => {
  return (
    <div className="relative">
      <div className="fixed md:hidden w-full h-24 bg-gray-800 flex items-center justify-center">
        <img
          src="./src/assets/browser-logo.png"
          alt="Rythmiq Logo"
          className="w-[25%] max-w-xs"
        />
      </div>

      <div className="flex items-start min-h-screen md:pt-0">
        <ToastContainer />

        {isLoggedIn() && <Sidebar />}

        <div className="flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]">
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<AddSong />} />
            <Route path="/add-song" element={<AddSong />} />
            <Route path="/list-songs" element={<ListSong />} />
            <Route path="/add-album" element={<AddAlbum />} />
            <Route path="/list-albums" element={<ListAlbum />} />


            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

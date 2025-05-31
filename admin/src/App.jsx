import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAlbum from "./pages/AddAlbum";
import AddSong from "./pages/AddSong";
import ListAlbum from "./pages/ListAlbum";
import ListSong from "./pages/ListSong";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

const App = () => {
  const location = useLocation();

  const checkAuth = () => {
    const token = sessionStorage.getItem("adminToken");
    return typeof token === "string" && token.length > 10;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, [location.pathname]);

  return (
    <div className="relative">

      <div className="fixed md:hidden w-full h-24 bg-gray-800 flex items-center justify-center z-50">
        <img
          src="/browser-logo.png"
          alt="Rythmiq Logo"
          className="w-[25%] max-w-xs"
        />
      </div>

      <div className="flex items-start min-h-screen md:pt-0">
        <ToastContainer />
        {isAuthenticated && <Sidebar />}

        <div className="flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]">
          <Routes>
            <Route
              path="/login"
              element={<Login onLogin={() => setIsAuthenticated(true)} />}
            />

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

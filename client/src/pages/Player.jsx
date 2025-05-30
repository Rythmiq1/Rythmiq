import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFillDrip, FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import { MdOutlineMusicNote } from 'react-icons/md';
import BASE_URL from "../config";

const Player = () => {
  const location = useLocation();
  const currentSong = location.state?.currentSong;

  const [bgColorIndex, setBgColorIndex] = useState(0);

  const colors = [
     '#A8E6CF',
    '#FF8B94',
    '#FFB7B2',
    '#B2EBF2',
    '#D1C4E9',
  ];

  const changeBackgroundColor = () => {
    setBgColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10 transition-all duration-700 ease-in-out scrollbar-hide "
      style={{ background: `linear-gradient(to right, ${colors[bgColorIndex]}, #ffffff)` }}
    >
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center relative scrollbar-hide ">

  
        <div className="relative w-64 h-64 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl animate-spin-slow ">
          {currentSong?.image ? (
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 text-xl ">
              <MdOutlineMusicNote size={50} />
            </div>
          )}
        </div>

 
        <div className="flex-1 text-center md:text-left ">
          <h2 className="text-4xl font-extrabold text-white mb-2">
            {currentSong?.name || "Song Title"}
          </h2>
          <p className="text-lg text-white/90 mb-6">
            {currentSong?.desc || "No description available for this song."}
          </p>

         
          <div className="flex gap-1 justify-center md:justify-start mb-8 ">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white rounded"
                style={{
                  height: `${Math.random() * 30 + 10}px`,
                  animation: `pulse ${Math.random() * 2 + 1}s infinite ease-in-out alternate`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

     
          
        </div>

      
        <button
          onClick={changeBackgroundColor}
          className="absolute top-6 right-6 md:bottom-10 md:right-10 p-4 bg-white/20 hover:bg-white/40 border border-white/30 rounded-full transition transform hover:scale-110 shadow-lg"
        >
          <FaFillDrip className="text-black text-xl h-8 w-6" />
        </button>
      </div>

      
      <style>{`
        @keyframes pulse {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(1.5); }
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Player;

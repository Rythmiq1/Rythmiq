import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFillDrip } from 'react-icons/fa'; // Import the icon
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
      className="fixed w-screen flex text-white h-screen gap-20" 
      style={{ 
        backgroundColor: colors[bgColorIndex], 
        justifyContent: 'center', 
        alignItems: 'center',
      }}
    >
      <div className="flex items-center justify-center">

        
        <div className="nft" style={{ marginLeft: '-50px' }}> 
          <div className="main">
            {currentSong && 
              <img 
                src={currentSong.image} 
                alt={currentSong.title} 
                className="tokenImage"
                style={{ height: '300px', width: '300px', objectFit: 'cover' }} 
              />
            }
          </div>
        </div>

        
        <div className="ml-8">
          <h2 className="text-5xl font-bold text-sky-800">{currentSong?.name || 'Song Name Here'}</h2> 
          <p className="text-sm mt-2 text-black">{currentSong?.desc || 'No description available'}</p>
        </div>

        {/* Button to Change Background Color */}
        <div className="flex-1 flex justify-start">
          {currentSong ? (
            <div>
              <button 
                onClick={changeBackgroundColor}
                className="p-4 bg-black text-white border border-white rounded-full absolute bottom-44 right-20 flex items-center space-x-2"
              >
                <FaFillDrip size={24} className="text-white" /> 
              </button>
            </div>
          ) : (
            <h1>No song selected</h1>
          )}
        </div>

      </div>
    </div>
  );
};

export default Player;

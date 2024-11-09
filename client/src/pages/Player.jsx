
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFillDrip } from 'react-icons/fa';

const Player = () => {
  const location = useLocation();
  const currentSong = location.state?.currentSong; 

  
  const [bgColorIndex, setBgColorIndex] = useState(0);

  // Array of pastel colors for the background
  const colors = [
    '#A8E6CF', // Pastel Green
    '#FF8B94', // Pastel Red
    '#FFB7B2', // Pastel Pink
    '#B2EBF2', // Pastel Cyan
    // '#FFF9B0', // Pastel Yellow
    '#D1C4E9', // Pastel Purple
  ];
  
  
  // Define the button styling
  const buttonStyling =
    'flex space-x-3 mr-2 font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 text-gray-100 rounded-sm ring-2 ring-purple-400 px-6 py-2 hover:bg-white hover:text-white hover:ring-slate-300 mx-8 shadow-lg shadow-indigo-300/50 transition duration-300 ease-in-out';

  const playSong = (song) => {
    console.log('Playing song:', song);
  
  };


  const changeBackgroundColor = () => {
    setBgColorIndex((prevIndex) => (prevIndex + 1) % colors.length); 
  };

  return (
    <div className="flex text-white h-screen gap-20" style={{ backgroundColor: colors[bgColorIndex], }}>


<div className='ml-32 mt-8 flex'>
      <div className="flex w-[60%]">
        {currentSong && 
        (
        <img src={currentSong.image} alt={currentSong.title} className="ml-12 mt-20 h-[500px] w-[600px] object-contain "/>
        )}
      </div>
      <div>
        <h1 className="text-black ml-1 font-bold text-5xl mt-80">{currentSong?.name}</h1>
        <p className="text-black ml-1 mt-5">{currentSong?.desc}</p>
      </div>

      <div className="flex-1 flex justify-start">
        {currentSong ? (
          <div>
            <button onClick={changeBackgroundColor}
              className="p-4 bg-black text-white border border-white rounded-full absolute bottom-40 right-10 flex items-center space-x-2">
              <FaFillDrip size={24} className="text-white " /> 
              <span className="text-white font-bold"></span> 
            </button>
          </div>
        ) : (
          <h1>No song selected</h1>
        )}
      </div>
      </div>

      {/* <div className='ml-32 mt-24'>
      <div className="music-case">
      <div className="front-case">
        <div className="icon"></div>
      </div>
      <div className="disc">
        <div className="hole"></div>
      </div>
      <div className="back-case"></div>

     
      </div>
      </div> */}

      

      



      
    </div>



    


        
  );
};

export default Player;

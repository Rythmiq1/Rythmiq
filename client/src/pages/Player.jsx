// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { FaPlay } from 'react-icons/fa'; // Make sure to import FaPlay if not already imported

// const Player = () => {
//   const location = useLocation();
//   const currentSong = location.state?.currentSong; // Get the currentSong from location state

//   // Create an object for the queue songs
//   const songQueue = [
//     {
//       title: "Blinding Lights",
//       artist: "The Weeknd",
//       description: "A synth-heavy track that blends 80s vibes with a modern twist. Known for its catchy beat and emotional depth."
//     },
//     {
//       title: "Levitating",
//       artist: "Dua Lipa",
//       description: "A fun and upbeat pop song with a touch of retro flair, perfect for dancing or getting in a good mood."
//     },
//     {
//       title: "Save Your Tears",
//       artist: "The Weeknd",
//       description: "A heart-wrenching pop track with a melancholy melody and the signature smooth vocals of The Weeknd."
//     }
//   ];

//   // Define the button styling
//   const buttonStyling = "flex space-x-3 mr-2 font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 text-gray-100 rounded-sm ring-2 ring-purple-400 px-6 py-2 hover:bg-white hover:text-white hover:ring-slate-300 mx-8 shadow-lg shadow-indigo-300/50 transition duration-300 ease-in-out";

//   // Function to handle song play
//   const playSong = (song) => {
//     console.log("Playing song:", song);
//     // Add your logic to play the song here
//   };

//   return (
//     <div className='flex text-white h-screen'>
//    <div className='flex-1 w-[30%]'>
//   {currentSong && (
//     <img 
//       src={currentSong.image} 
//       alt={currentSong.title} 
//       className='ml-12 mt-20 h-[50%] w-[60%] object-contain transform transition duration-500 ease-in-out animate-slideDown'
//     />
//   )}
//   <h1 className='text-white ml-36 font-bold text-4xl mt-2'>{currentSong?.name}</h1>
//   <p className='text-white ml-36'>{currentSong?.desc}</p>
// </div>


//       <div className='flex-1 flex justify-start'>
//         {currentSong ? ( <div></div>
//           // <div>
//           //   <h3 className="font-bold text-3xl text-center mb-14 mt-9">Queue</h3>

//           //   <ul>
//           //     {songQueue.map((song, index) => 
//           //     (
//           //       <li key={index} className="flex items-center mb-4">

//           //         <button className={buttonStyling} onClick={() => playSong(song)}>
//           //           <FaPlay className="text-lg" />
//           //         </button>

//           //         <div className='ml-10'>
//           //           <strong>"{song.title}"</strong><br />
//           //           <p>{song.artist}</p>
//           //           <em>Description:</em> {song.description}
//           //         </div>
//           //       </li>
//           //     ))}
//           //   </ul>
//           // </div>
//         ) : (
//           <h1>No song selected</h1>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Player;


import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFillDrip } from 'react-icons/fa';

const Player = () => {
  const location = useLocation();
  const currentSong = location.state?.currentSong; // Get the currentSong from location state

  // Define state for background color
  const [bgColorIndex, setBgColorIndex] = useState(0);

  // Array of pastel colors for the background
  const colors = [
    '#39FF14', // Neon Green
    '#FF073A', // Neon Red
    '#FF1493', // Neon Pink
    '#00FFFF', // Neon Cyan
    '#FFFF00', // Neon Yellow
    '#8A2BE2', // Neon Blue
  ];
  
  // Define the button styling
  const buttonStyling =
    'flex space-x-3 mr-2 font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 text-gray-100 rounded-sm ring-2 ring-purple-400 px-6 py-2 hover:bg-white hover:text-white hover:ring-slate-300 mx-8 shadow-lg shadow-indigo-300/50 transition duration-300 ease-in-out';

  // Function to handle song play
  const playSong = (song) => {
    console.log('Playing song:', song);
    // Add your logic to play the song here
  };

  // Function to change the background color
  const changeBackgroundColor = () => {
    setBgColorIndex((prevIndex) => (prevIndex + 1) % colors.length); // Cycle through colors
  };

  return (
    <div
      className="flex text-white h-screen"
      style={{
        background: `linear-gradient(to right, ${colors[bgColorIndex]}, black)`, // Set the background to a gradient
      }}
    >
      <div className="flex-1 w-[30%]">
        {currentSong && (
          <img
          src={currentSong.image}
          alt={currentSong.title}
          className="ml-12 mt-20 h-[50%] w-[60%] object-contain transform transition duration-500 ease-in-out animate-runningShadow"
        />
        
        )}
        <h1 className="text-white ml-36 font-bold text-4xl mt-2">{currentSong?.name}</h1>
        <p className="text-white ml-36">{currentSong?.desc}</p>
      </div>

      <div className="flex-1 flex justify-start">
        {currentSong ? (
          <div>
            <button
              onClick={changeBackgroundColor}
              className="p-4 bg-black text-white border border-white rounded-full absolute bottom-17 right-10 flex items-center space-x-2"
            >
              <FaFillDrip size={24} className="text-white " /> 
              <span className="text-white font-bold"></span> 
            </button>
          </div>
        ) : (
          <h1>No song selected</h1>
        )}
      </div>
    </div>
  );
};

export default Player;

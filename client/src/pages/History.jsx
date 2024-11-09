import React, { useEffect, useState } from 'react';
import { FaPlay, FaTrash } from 'react-icons/fa';

const History = ({ setCurrentSong }) => {
  const [songHistory, setSongHistory] = useState([]);

  const buttonStyling = "flex space-x-3 mr-2 font-semibold bg-white text-teal-500 border-2 border-teal-500 rounded-full px-6 py-2 hover:bg-teal-500 hover:text-white hover:border-teal-500 mx-8 shadow-lg shadow-teal-300/50 transition duration-300 ease-in-out";

  useEffect(() => {
    const fetchHistory = () => {
      const history = JSON.parse(sessionStorage.getItem('songHistory')) || [];
      setSongHistory(history);
    };
    fetchHistory();
    const handleStorageChange = (event) => {
      if (event.key === 'songHistory') {
        fetchHistory();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handlePlayClick = (song) => {
    setCurrentSong(song); 
    const updatedHistory = songHistory.filter(s => s._id !== song._id); 
    updatedHistory.unshift(song);
    setSongHistory(updatedHistory);
    sessionStorage.setItem('songHistory', JSON.stringify(updatedHistory));
  };

  const handleDeleteClick = (songToDelete) => {
    const updatedHistory = songHistory.filter(song => song._id !== songToDelete._id);
    setSongHistory(updatedHistory);
    sessionStorage.setItem('songHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-b from-[#006161] to-black rounded-lg shadow-xl w-full h-full mx-auto">
      <h2 className="text-3xl mb-4 text-white font-semibold text-center">Recently Listened</h2>
      
      <div className="w-11/12 md:w-3/4 lg:w-2/3 rounded-lg p-6 shadow-md overflow-y-auto max-h-[70vh]" style={{ backgroundColor: '#00827f' }}>
        {songHistory.length > 0 ? (
          songHistory.map((song, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg mb-2 hover:bg-gray-600 transition duration-200" style={{ backgroundColor: '#20b2aa' }}>
              <div className="flex items-center">
                <FaPlay 
                  className="text-white cursor-pointer mr-3" 
                  onClick={() => handlePlayClick(song)} 
                />
                <p className="text-white font-medium">{song.name}</p>
              </div>
              <div className="flex items-center">
                <p className="text-gray-400 mr-4">{song.duration}</p>
                <FaTrash 
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteClick(song)} 
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No songs played yet.</p>
        )}
      </div>
    </div>
  );
};

export default History;
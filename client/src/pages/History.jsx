import React, { useEffect, useState } from 'react';
import { FaPlay, FaTrash } from 'react-icons/fa';

const History = ({ setCurrentSong }) => {
  const [songHistory, setSongHistory] = useState([]);

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

  const handleDeleteClick = (songId) => {
    const updatedHistory = songHistory.filter(song => song._id !== songId);
    setSongHistory(updatedHistory);
    sessionStorage.setItem('songHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-xl w-full h-full mx-auto">
      <h2 className="text-3xl mb-4 text-purple-400 font-semibold text-center">Recently Listened</h2>
      
      <div className="w-11/12 md:w-3/4 lg:w-2/3 bg-gray-800 rounded-lg p-6 shadow-md overflow-y-auto max-h-[70vh]">
        {songHistory.length > 0 ? (
          songHistory.map((song, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg mb-2 hover:bg-gray-600 transition duration-200">
              <div className="flex items-center">
                <FaPlay 
                  className="text-purple-400 cursor-pointer mr-3 hover:text-purple-500" 
                  onClick={() => handlePlayClick(song)} 
                />
                <p className="text-white font-medium">{song.name}</p>
              </div>
              <div className="flex items-center">
                <p className="text-gray-400 mr-4">{song.duration}</p>
                
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No songs played yet.</p>
        )}
      </div>
    </div>
  );
};

export default History;

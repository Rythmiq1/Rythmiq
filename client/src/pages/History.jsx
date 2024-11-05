import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';

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

  return (
    <div className="p-6 bg-gray-800 rounded-lg w-full max-w-md mx-auto h-full overflow-y-auto">
      <h2 className="text-3xl mb-4 text-purple-400 font-semibold text-center">Recently Played Songs</h2>
      {songHistory.length > 0 ? (
        songHistory.map((song, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded mb-3 hover:bg-gray-600 transition duration-200">
            <div className="flex items-center">
              <FaPlay 
                className="text-purple-400 cursor-pointer mr-4 hover:text-purple-500" 
                onClick={() => handlePlayClick(song)} 
              />
              <p className="text-white font-medium">{song.name}</p>
            </div>
            <p className="text-gray-400">{song.duration}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No songs played yet.</p>
      )}
    </div>
  );
};

export default History;

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
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-3xl mb-4 text-white">History of Played Songs</h2>
      {songHistory.length > 0 ? (
        songHistory.map((song, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2">
            <div className="flex items-center ml-5">
              <FaPlay 
                className="text-white cursor-pointer mr-10" 
                onClick={() => handlePlayClick(song)} 
              /> 
              <p className="text-white">{song.name}</p>
            </div>
            <p className="text-white mr-24">{song.duration}</p>
          </div>
        ))
      ) : (
        <p className="text-white">No songs played yet.</p>
      )}
    </div>
  );
};
export default History;

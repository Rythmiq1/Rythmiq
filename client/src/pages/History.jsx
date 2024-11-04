import React, { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa'; // Import the play icon

const History = () => {
  const [songHistory, setSongHistory] = useState([]);

  useEffect(() => {
    // Retrieve song history from session storage on component mount
    const history = JSON.parse(sessionStorage.getItem('songHistory')) || [];
    setSongHistory(history);
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-3xl mb-4 text-white">History of Played Songs</h2>
      {songHistory.length > 0 ? (
        songHistory.map((song, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2">
            <div className="flex items-center ml-5">
              <FaPlay className="text-white cursor-pointer mr-10" /> 
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

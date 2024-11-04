import React from 'react';
import { FaPlay } from 'react-icons/fa'; // Import the play icon

const History = () => {
  const sampleHistory = [
    { name: "Shape of You", duration: "3:53" },
    { name: "Blinding Lights", duration: "3:20" },
    { name: "Levitating", duration: "3:23" },
    { name: "Watermelon Sugar", duration: "3:03" },
    { name: "Bad Guy", duration: "3:14" },
  ];

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-3xl mb-4 text-white">History of Played Songs</h2>
      {sampleHistory.length > 0 ? (
        sampleHistory.map((song, index) => (
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

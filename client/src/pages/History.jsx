import React, { useEffect, useState } from 'react';
import { FaPlay, FaTrash } from 'react-icons/fa';

const History = ({ setCurrentSong }) => {
  const [songHistory, setSongHistory] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      const history = JSON.parse(localStorage.getItem('songHistory')) || [];
      setSongHistory(history);
    };
    loadHistory();
    window.addEventListener('storage', (e) => {
      if (e.key === 'songHistory') loadHistory();
    });
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
    const updated = [song, ...songHistory.filter(s => s._id !== song._id)];
    setSongHistory(updated);
    localStorage.setItem('songHistory', JSON.stringify(updated));
  };

  const deleteSong = (song) => {
    const updated = songHistory.filter(s => s._id !== song._id);
    setSongHistory(updated);
    localStorage.setItem('songHistory', JSON.stringify(updated));
  };

  return (
    
    <section className="min-h-screen w-screen bg-gradient-to-b from-[#006161] to-black">
      
      <div className="pt-10 pb-16 px-4 sm:px-6 lg:px-12">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          ⏱️ Recently Listened
        </h2>

        {songHistory.length === 0 ? (
          <p className="text-center text-gray-300">No songs played yet.</p>
        ) : (
          <div className="max-w-7xl mx-auto">
            <ul className="divide-y divide-gray-700 max-h-[70vh] overflow-y-auto">
              {songHistory.map((song, idx) => (
                <li
                  key={song._id}
                  className={`flex flex-col sm:flex-row items-center justify-between py-4 px-2 transition hover:bg-white/10 ${
                    idx % 2 === 0 ? 'bg-black/10' : ''
                  }`}
                >
                  
                  <div className="flex items-center w-full sm:w-2/3">
                    <button
                      onClick={() => playSong(song)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition mr-4"
                      aria-label={`Play ${song.name}`}
                    >
                      <FaPlay className="text-white" />
                    </button>
                    <span className="text-white font-medium line-clamp-1">{song.name}</span>
                  </div>

                 
                  <div className="flex items-center justify-end w-full sm:w-1/3 mt-3 sm:mt-0 space-x-6">
                    <span className="text-gray-300 text-sm">{song.duration}</span>
                    <button
                      onClick={() => deleteSong(song)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition"
                      aria-label={`Remove ${song.name}`}
                    >
                      <FaTrash className="text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default History;

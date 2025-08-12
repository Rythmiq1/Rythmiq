import React, { useState, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import BASE_URL from "../config";

const LikedSongs = ({ onSongSelect }) => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/get-liked`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
        });
        if (!res.ok) throw new Error('Couldn’t load liked songs');
        const { data } = await res.json();
        setLikedSongs(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedSongs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#005050] to-black">
        <p className="text-white text-lg">Loading your liked songs…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#005050] to-black">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide min-h-screen bg-gradient-to-b from-[#006161] to-black py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto text-white scrollbar-hide">
        <h1 className="text-4xl font-bold mb-6 text-center">❤️ Your Liked Songs</h1>

        {likedSongs.length === 0 ? (
          <p className="text-center text-gray-300">No liked songs yet.</p>
        ) : (
          <div className="scrollbar-hide bg-black/20 rounded-2xl overflow-hidden shadow-lg">
            <ul className="scrollbar-hide divide-y divide-gray-700 max-h-[70vh] overflow-y-auto">
              {likedSongs.map((song, idx) => (
                <li
                  key={song._id}
                  className={`flex flex-col sm:flex-row items-center sm:items-stretch p-4 hover:bg-white/10 transition ${
                    idx % 2 === 0 ? 'bg-black/10' : ''
                  }`}
                >
                 
                  <img
                    src={song.image}
                    alt={song.name}
                    className="w-24 h-24 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  
                  <div className="flex-1 px-4 py-2 flex flex-col justify-center">
                    <span className="text-lg font-semibold line-clamp-1">
                      {song.name}
                    </span>
                    <span className="text-sm text-gray-300 line-clamp-1">
                      {song.artist || 'Unknown Artist'}
                    </span>
                    {song.desc && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {song.desc}
                      </p>
                    )}
                  </div>

              
                  <button
                    onClick={() => onSongSelect(song)}
                    aria-label={`Play ${song.name}`}
                    className="mt-2 sm:mt-auto sm:ml-4 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold rounded-full shadow hover:scale-105 transition"
                  >
                    <FaPlay />
                    <span className="hidden sm:inline">Play</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;

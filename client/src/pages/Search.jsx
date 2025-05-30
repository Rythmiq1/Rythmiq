import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlay } from 'react-icons/fa';
import BASE_URL from "../config";

const Search = ({ onSongSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const url = `${BASE_URL}`;

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/song/list`);
      if (response.data.success) {
        setSongs(response.data.songs);
        setFilteredSongs(response.data.songs);
      } else {
        toast.error("Failed to fetch songs.");
      }
    } catch (error) {
      console.error("Fetch songs error:", error);
      toast.error("An error occurred while fetching songs.");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.info('Please log in to search for songs.');
      return;
    }
    fetchSongs();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = songs.filter(song =>
      song.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  const playSong = (song) => {
    onSongSelect(song);
  };

  return (
    <div className="mt-4 p-6 rounded-3xl bg-gradient-to-b from-[#004d4d] to-black shadow-2xl scrollbar-hide">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Search Songs</h2>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for songs..."
        className="w-full p-3 text-lg rounded-xl mb-6 bg-white text-black focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-md"
      />

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div
              key={song._id}
              className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-md"
            >
              <div className="flex items-center gap-4 w-full sm:w-[40%]">
                <img src={song.image} alt={song.title} className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <p className="text-white font-semibold text-base sm:text-lg">{song.name}</p>
                  <p className="text-gray-300 text-sm">{song.album ? song.album.name : "Unknown Album"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-[40%] text-sm sm:text-base text-gray-300 sm:pl-6">
                <p>{song.duration}</p>
              </div>

              <button
                className="flex items-center gap-2 px-5 py-2 bg-white text-teal-600 border-2 border-teal-600 rounded-full font-semibold hover:bg-teal-600 hover:text-white transition-all shadow-lg"
                onClick={() => playSong(song)}
              >
                <FaPlay />
                <span className="hidden sm:inline">Play</span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-white text-base sm:text-lg mt-4">
            No songs found.{" "}
            <span className="text-pink-400 font-semibold">
              Join our Admin Facility to upload your favorites!
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlay } from 'react-icons/fa';

const Search = ({ onSongSelect }) => {
  const buttonStyling = "flex space-x-1 mr-2 font-semibold bg-white text-teal-500 border-2 border-teal-500 rounded-xl px-6 py-2 hover:bg-teal-500 hover:text-white hover:border-teal-500 mx-8 shadow-lg shadow-teal-300/50 transition duration-300 ease-in-out";

  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const url = 'http://localhost:8080';

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
    console.log("Selected Song:", song);
    onSongSelect(song);
  };

  return (
    <div className="p-4 rounded-lg bg-gradient-to-b from-[#006161] to-black ml-3 mr-2" >
      <h2 className="text-3xl mb-4 text-white">Search Songs</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Type to search for a song..."
        className="p-2 border border-gray-300 rounded w-full mb-4 text-black"
      />
      <div>
        

        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song._id}
              className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 bg-transparent text-sm mr-5"
              
            >
              <img className="w-12" src={song.image} alt={song.title} />
              <p className="text-white font-semibold ml-12">{song.name}</p>
              <p className="text-white ml-44">{song.album ? song.album.name : "N/A"}</p>
              <p className="text-white">{song.duration}</p>

              <button className={buttonStyling} onClick={() => playSong(song)}>
                <FaPlay className="text-lg" />
              </button>

          

            </div>
          ))
        ) : (
          <p className="py-2 text-white">
            No songs found matching your search. 
            <span className="text-pink-500 font-semibold">
              Please feel free to join our Admin Facility to upload songs!
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;

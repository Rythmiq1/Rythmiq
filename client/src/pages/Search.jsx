import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const url = 'http://localhost:8080';

  // Function to fetch songs from the API
  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/song/list`);
      console.log("Fetched songs:", response.data); // Log response data

      if (response.data.success) {
        setSongs(response.data.songs);
        setFilteredSongs(response.data.songs); // Initialize with all songs
      } else {
        toast.error("Failed to fetch songs.");
      }
    } catch (error) {
      console.error("Fetch songs error:", error);
      toast.error("An error occurred while fetching songs.");
    }
  };

  useEffect(() => {
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

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-3xl mb-4 text-white">Search Songs</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Type to search for a song..."
        className="p-2 border border-gray-300 rounded w-full mb-4 text-black"
      />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-700">
          <b className="text-white">Image</b>
          <b className="text-white ml-12">Name</b>
          <b className="text-white ml-44">Album</b>
          <b className="text-white">Duration</b>
        </div>
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song._id} className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-600'>
              <img className='w-12' src={song.image} alt={song.title} />
              <p className="text-white font-semibold ml-12">{song.name}</p> {/* Ensure this matches your data */}
              <p className="text-white ml-44">{song.album ? song.album.name : "N/A"}</p>
              <p className="text-white">{song.duration}</p>
            </div>
          ))
        ) : (
          <p className="py-2 text-white">No songs found</p>
        )}
      </div>
    </div>
  );
};

export default Search;

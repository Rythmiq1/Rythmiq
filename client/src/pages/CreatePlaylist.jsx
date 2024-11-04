import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const CreatePlaylist = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/song/list');
        if (response.data.success) {
          setAvailableSongs(response.data.songs);
        }
      } catch (error) {
        toast.error('Failed to load songs.');
      }
    };

    fetchSongs();
  }, []);

  const addSong = (songId) => {
    const song = availableSongs.find((s) => s._id === songId);
    if (song && !selectedSongs.includes(song)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const removeSong = (songId) => {
    setSelectedSongs(selectedSongs.filter((song) => song._id !== songId));
  };

  const submitPlaylist = async () => {
    if (!name || selectedSongs.length === 0) {
      toast.error('Please enter a name and add at least one song.');
      return;
    }

    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    try {
      const response = await axios.post(
        'http://localhost:8080/playlist/create',
        {
          name,
          description,
          songs: selectedSongs.map((song) => song._id),
        },
        {
          headers: {
            Authorization: token, 
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setSelectedSongs([]);
      } else {
        toast.error(response.data.message || 'Failed to create playlist.');
      }
    } catch (error) {
      toast.error('Failed to create playlist.');
    }
  };

  return (
    <div className="w-full h-screen p-8 bg-gray-800 rounded-lg shadow-2xl mt-10 text-white transition-all duration-300 transform hover:shadow-3xl">
      <h2 className="text-2xl font-bold text-center mb-6">Create Your Playlist</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Playlist Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="drop-shadow-2xl w-3/5 px-3 py-2 border-none bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400 transition-transform duration-200"
          placeholder="Enter playlist name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="drop-shadow-2xl w-3/5 px-3 py-2 border-none bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400 transition-transform duration-200"
          placeholder="Enter a short description"
          rows="2"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 ">Add Songs</label>
        <select
          className="drop-shadow-2xl w-3/5 px-3 py-2 border-none bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-white transition-colors duration-200 cursor-pointer"
          onChange={(e) => addSong(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select a song to add</option>
          {availableSongs.map((song) => (
            <option key={song._id} value={song._id}>
              {song.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-1/5 mb-6">
        <label className="block text-sm font-medium mb-1">Selected Songs</label>
        <ul className="space-y-2">
          {selectedSongs.map((song) => (
            <li
              key={song._id}
              className="drop-shadow-2xl flex items-center justify-between  rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg"
            >
              <span className="text-sm">{song.name}</span>
              <button
                onClick={() => removeSong(song._id)}
                className="btn-s font-semibold"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={submitPlaylist}
        className="drop-shadow-2xl w-3/5 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-300 transform hover:scale-105"
      >
        Create Playlist
      </button>
    </div>
  );
};

export default CreatePlaylist;

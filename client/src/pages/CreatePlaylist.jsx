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
    <div className="w-full h-screen p-8  bg-black rounded-lg shadow-lg mt-10 text-white">
      <h2 className="text-xl font-bold text-center mb-6">Create Your Playlist</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Playlist Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400"
          placeholder="Enter playlist name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400"
          placeholder="Enter a short description"
          rows="2"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Add Songs</label>
        <select
          className="w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-white"
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

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Selected Songs</label>
        <ul className="space-y-1">
          {selectedSongs.map((song) => (
            <li key={song._id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <span className="text-sm">{song.name}</span>
              <button
                onClick={() => removeSong(song._id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={submitPlaylist}
        className="w-full py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors duration-200"
      >
        Create Playlist
      </button>
    </div>
  );
};

export default CreatePlaylist;

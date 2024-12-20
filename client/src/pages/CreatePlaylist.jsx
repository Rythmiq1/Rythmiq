import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import upload_area from '../assets/upload_area.png';

const CreatePlaylist = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [image, setImage] = useState(null); 
  const token = sessionStorage.getItem('token'); 

  const buttonStyling = "flex space-x-3 mr-2 font-semibold bg-white text-teal-500 border-2 border-teal-500 rounded-full px-6 py-2 hover:bg-teal-500 hover:text-white hover:border-teal-500 mx-8 shadow-lg shadow-teal-300/50 transition duration-300 ease-in-out";

  useEffect(() => {
    const fetchSongs = async () => {
      if (!token) {
        toast.info('Please log in to create a playlist.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/song/list', {
          headers: { Authorization: token } 
        });
        if (response.data.success) {
          setAvailableSongs(response.data.songs);
        }
      } catch (error) {
        toast.error('Failed to load songs.');
      }
    };
    fetchSongs();
  }, [token]);
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
    if (!name || selectedSongs.length === 0 || !image) {
      toast.error('Please enter a name, add at least one song, and upload an image.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);
    selectedSongs.forEach((song) => {
      formData.append('songs', song._id);
    });

    try {
      const response = await axios.post(
        'http://localhost:8080/playlist/create',
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Playlist created successfully!');
        setName('');
        setDescription('');
        setSelectedSongs([]);
        setImage(null);
      } else {
        toast.error(response.data.message || 'Failed to create playlist.');
      }
    } catch (error) {
      toast.error('Failed to create playlist.');
    }
  };
  if (!token) {
    return <div className='text-2xl font-bold ml-6 text-white'>Please Login To Create Your Own Playlist</div>;
  }

  return (
    <div className="ml-2 rounded-lg w-full h-screen p-8 bg-gradient-to-b from-[#006161] to-black rounded-lg shadow-2xl mt-10 text-white transition-all duration-300 transform hover:shadow-3xl overflow-y-auto max-h-[calc(110vh-200px)]">
      <h2 className="text-2xl font-bold text-center mb-6">Create Your Playlist</h2>
      <div className='flex flex-col gap-4 mb-6'>
        <p>Upload Image</p>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
        <label htmlFor="image">
          <img src={image ? URL.createObjectURL(image) : upload_area} className='w-24 cursor-pointer' alt="Upload Image" />
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Playlist Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
      className="drop-shadow-2xl w-3/5 px-3 py-2 border-none bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-black placeholder-gray-400 transition-transform duration-200"
      placeholder="Enter playlist name"
    />

      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description} onChange={(e) => setDescription(e.target.value)}
          className="drop-shadow-2xl w-3/5 px-3 py-2 border-none bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-black placeholder-gray-400 transition-transform duration-200"
          placeholder="Enter a short description" rows="2"
        />

      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Add Songs</label>

        <select
          className="drop-shadow-2xl w-3/5 px-3 py-2 border-none bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-black transition-colors duration-200 cursor-pointer"
          onChange={(e) => addSong(e.target.value)} defaultValue="" >


          <option value="" disabled>Select a song to add</option>
          {availableSongs.map((song) => (
            <option key={song._id} value={song._id}>
              {song.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-1/5 mb-6">
        <label className="block text-sm font-medium mb-1 text-white">Selected Songs</label>
        <ul className="space-y-2">
          {selectedSongs.map((song) => (
            <li
              key={song._id}
              className="drop-shadow-2xl flex items-center justify-between rounded-lg transition-transform duration-200 hover:scale-105 shadow-lg"
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
        className="drop-shadow-2xl w-3/5 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-300 transform hover:scale-105">
        Create Playlist </button>
        
    </div>
  );
};  

export default CreatePlaylist;
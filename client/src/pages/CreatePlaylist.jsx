import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import upload_area from '../assets/upload_area.png';
import BASE_URL from "../config"; 

const CreatePlaylist = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [image, setImage] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) return toast.info('Please log in to create a playlist.');
    axios.get(`${BASE_URL}/song/list`, { headers: { Authorization: token } })
      .then(res => res.data.success && setAvailableSongs(res.data.songs))
      .catch(() => toast.error('Failed to load songs.'));
  }, [token]);

  const addSong = id => {
    const song = availableSongs.find(s => s._id === id);
    if (song && !selectedSongs.includes(song)) {
      setSelectedSongs(prev => [...prev, song]);
    }
  };
  const removeSong = id =>
    setSelectedSongs(prev => prev.filter(s => s._id !== id));

  const submitPlaylist = async () => {
    if (!name || !image || selectedSongs.length === 0)
      return toast.error('Name, image & ≥1 song required.');

    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', description);
    fd.append('image', image);
    selectedSongs.forEach(s => fd.append('songs', s._id));

    try {
      const res = await axios.post(`${BASE_URL}/playlist/create`, fd, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Playlist created!');
        setName(''); setDescription(''); setSelectedSongs([]); setImage(null);
      } else toast.error(res.data.message || 'Creation failed.');
    } catch {
      toast.error('Creation failed.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#006161] to-black">
        <p className="text-white text-xl font-bold">Please log in to create a playlist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#006161] to-black">
      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">🎵 Create Your Playlist</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
          <div className="space-y-6">
          
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Cover Image</label>
              <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-gray-500 rounded-lg overflow-hidden cursor-pointer hover:border-teal-400 transition">
                <label htmlFor="image">
                  <img
                    src={image ? URL.createObjectURL(image) : upload_area}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={e => setImage(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-semibold text-white mb-1">Playlist Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter playlist name"
                className="w-full px-4 py-2 rounded-lg bg-white text-black focus:ring-2 ring-teal-400 transition"
              />
            </div>

        
            <div>
              <label className="block text-sm font-semibold text-white mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Short description..."
                className="w-full px-4 py-2 rounded-lg bg-white text-black focus:ring-2 ring-teal-400 transition"
              />
            </div>
          </div>

       
          <div className="space-y-6">
          
            <div>
              <label className="block text-sm font-semibold text-white mb-1">Add Songs</label>
              <select
                defaultValue=""
                onChange={e => addSong(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white text-black focus:ring-2 ring-teal-400 transition cursor-pointer"
              >
                <option value="" disabled>
                  Select a song…
                </option>
                {availableSongs.map(song => (
                  <option key={song._id} value={song._id}>
                    {song.name}
                  </option>
                ))}
              </select>
            </div>

           
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Selected Songs
              </label>
              <ul className="max-h-64 overflow-auto space-y-2">
                {selectedSongs.map(song => (
                  <li
                    key={song._id}
                    className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-lg backdrop-blur hover:bg-white/20 transition"
                  >
                    <span className="text-white">{song.name}</span>
                    <button
                      onClick={() => removeSong(song._id)}
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit */}
            <button
              onClick={submitPlaylist}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition"
            >
              🚀 Create Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;

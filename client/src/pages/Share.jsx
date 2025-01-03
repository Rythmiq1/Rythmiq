import React, { useEffect, useState } from 'react';
import { FaPlay, FaPlus, FaEllipsisH } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Share = () => {
  const { playlistId } = useParams(); // Get playlist ID from URL
  const [playlist, setPlaylist] = useState(null); // State for playlist data
  const [loading, setLoading] = useState(true); // Loading state
  const [message, setMessage] = useState(''); // Success or error message

 
  const buttonStyling =
    'flex space-x-3 mr-2 font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 text-gray-100 rounded-sm ring-2 ring-purple-400 px-6 py-2 hover:bg-white hover:text-white hover:ring-slate-300 mx-8 shadow-lg shadow-indigo-300/50 transition duration-300 ease-in-out';

    
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/playlist/${playlistId}`);
        if (response.data.success) {
          setPlaylist(response.data.playlist);
        } else {
          console.error('Failed to fetch playlist:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  // Function to handle saving the playlist
  const handleAddPlaylist = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/auth/save-playlist/${playlistId}`,
        {}, 
        {
          headers: {
            'Authorization': `${sessionStorage.getItem('token')}`, // Assuming token is stored in localStorage
          }
        }
      );

      if (response.data.success) {
        setMessage('Playlist added to your saved playlists.');
      } else {
        setMessage('Failed to add playlist: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error saving playlist:', error);
      setMessage('An error occurred while saving the playlist.');
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  if (!playlist) return <div className="text-white">Playlist not found!</div>;

  return (
    <div className="ml-2 rounded-lg w-full h-full min-h-screen bg-gradient-to-b from-[#006161] to-black p-8 text-white flex flex-col">
      <div className="flex items-center w-full h-full">
        <img
          src={playlist.image}
          alt={playlist.name}
          className="h-40 w-40 object-cover shadow-lg transform transition-all duration-200 hover:scale-200 hover:border-4 hover:border-white"
        />
        <div className="ml-8">
          <p className="uppercase text-sm">Playlist</p>
          <h1 className="text-6xl font-bold">{playlist.name}</h1>
          <p className="text-lg mt-2">{playlist.description}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center mt-0 space-x-4">
        <button className="bg-transparent border border-white hover:border-2 hover:border-white text-white text-lg font-bold py-2 px-4 rounded-full flex items-center transition-all duration-500 ease-in-out">
          <FaPlay className="mr-2" /> Play
        </button>

        <button
          className="bg-transparent border border-white hover:border-2 hover:border-white text-white text-lg font-bold py-2 px-4 rounded-full flex items-center transition-all duration-500 ease-in-out"
          onClick={handleAddPlaylist} // Trigger the add playlist function
        >
          <FaPlus className="mr-2" /> Add
        </button>

        <button className="bg-transparent border border-white hover:border-2 hover:border-white text-white text-lg font-bold py-2 px-4 rounded-full flex items-center transition-all duration-500 ease-in-out">
          <FaEllipsisH className="mr-2" />
        </button>
      </div>

      {/* Display success or error message */}
      {message && <p className="mt-4 text-green-500">{message}</p>}

      {/* Song List */}
      <div className="mt-8">
        <div className="flex justify-between items-center text-gray-400 border-b border-gray-700 pb-2">
          <span>Title</span>
          <span>Duration</span>
        </div>
        <ul className="mt-4">
          {playlist.songs && playlist.songs.length > 0 ? (
            playlist.songs.map((song) => (
              <li key={song._id} className="flex justify-between items-center py-2 hover:bg-gray-800 rounded-md transition duration-200">
                <div>
                  <p className="font-bold text-white">{song.name}</p>
                  <p className="text-gray-400 text-sm">{song.desc}</p>
                </div>
                <span className="text-gray-400">{song.duration}</span>
              </li>
            ))
          ) : (
            <p>No songs available in this playlist.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Share;

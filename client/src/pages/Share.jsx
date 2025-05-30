import React, { useEffect, useState } from 'react';
import { FaPlay, FaPlus, FaEllipsisH } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../config";

const Share = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/playlist/${playlistId}`);
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

  const handleAddPlaylist = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/save-playlist/${playlistId}`,
        {},
        {
          headers: {
            Authorization: `${sessionStorage.getItem('token')}`,
          },
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-xl">
        Loading...
      </div>
    );

  if (!playlist)
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-xl">
        Playlist not found!
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#006161] to-black p-6 md:p-12 text-white flex justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10">
        
        <div className="flex-shrink-0 flex flex-col items-center md:items-start">
          <img
            src={playlist.image}
            alt={playlist.name}
            className="rounded-lg shadow-2xl w-64 h-64 object-cover mb-6 md:mb-0 md:w-72 md:h-72 transition-transform duration-300 hover:scale-105 hover:shadow-white"
          />
          <div className="text-center md:text-left">
            <p className="uppercase tracking-wider text-sm text-green-400 font-semibold mb-1">
              Playlist
            </p>
            <h1 className="text-5xl font-extrabold leading-tight mb-2">{playlist.name}</h1>
            <p className="text-gray-300 text-lg max-w-xs">{playlist.description}</p>
          </div>
        </div>

        
        <div className="flex flex-col flex-grow">
          
          <div className="flex flex-wrap gap-5 mb-8 justify-center md:justify-start">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 px-8 py-3 rounded-full font-semibold shadow-lg hover:from-pink-500 hover:to-indigo-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400"
              aria-label="Play Playlist"
              title="Play Playlist"
            >
              <FaPlay size={20} /> Play
            </button>

            <button
              onClick={handleAddPlaylist}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-400 px-8 py-3 rounded-full font-semibold shadow-lg hover:from-green-500 hover:to-green-300 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400"
              aria-label="Add Playlist"
              title="Add Playlist"
            >
              <FaPlus size={20} /> Add
            </button>

            <button
              className="flex items-center gap-2 border border-gray-500 hover:border-gray-300 px-8 py-3 rounded-full font-semibold text-gray-300 hover:text-white shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400"
              aria-label="More Options"
              title="More Options"
            >
              <FaEllipsisH size={20} />
            </button>
          </div>

         
          {message && <p className="mb-6 text-green-400 font-medium">{message}</p>}

          
          <div className="overflow-auto rounded-lg bg-gray-900 bg-opacity-40 p-4 shadow-inner max-h-[60vh]">
            <div className="grid grid-cols-[3fr_1fr] gap-4 border-b border-gray-700 pb-2 text-gray-400 font-semibold uppercase tracking-wide text-sm">
              <span>Title</span>
              <span className="text-right">Duration</span>
            </div>

            <ul className="mt-4 space-y-3">
              {playlist.songs && playlist.songs.length > 0 ? (
                playlist.songs.map((song) => (
                  <li
                    key={song._id}
                    className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                  >
                    <div>
                      <p className="font-semibold text-white">{song.name}</p>
                      <p className="text-gray-400 text-sm truncate max-w-xs">{song.desc}</p>
                    </div>
                    <span className="text-gray-400 font-mono tabular-nums">{song.duration}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-center py-10">No songs available in this playlist.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;

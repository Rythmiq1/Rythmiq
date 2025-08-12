import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import defaultImg from '../assets/images/Rhythmiq.png';
import LikedCard from '../components/LikedCard';
import { IoIosShareAlt, IoIosRemoveCircleOutline } from 'react-icons/io';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import BASE_URL from "../config";

const LibraryPage = ({ setCurrentSong }) => {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [savedPlaylists, setSavedPlaylists] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [playlistsResponse, likedSongsResponse, savedPlaylistsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/playlist/my-playlists`, { headers: { Authorization: token } }),
          axios.get(`${BASE_URL}/auth/get-liked`, { headers: { Authorization: token } }),
          axios.get(`${BASE_URL}/auth/saved-playlists`, { headers: { Authorization: token } }),
        ]);

        if (playlistsResponse.data.success) setPlaylists(playlistsResponse.data.playlists);
        else throw new Error("Could not fetch playlists");

        if (likedSongsResponse.data.success) setLikedSongs(likedSongsResponse.data.data);

        if (savedPlaylistsResponse.data.success) setSavedPlaylists(savedPlaylistsResponse.data.savedPlaylists);
        else throw new Error("Could not fetch saved playlists");
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
    else {
      setError("User not found or logged in.");
      setLoading(false);
    }
  }, [userId]);

  const handleSelectSong = (song) => setCurrentSong(song);

  const handleRemovePlaylist = async (playlistId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('User is not authenticated. Please log in.');
        return;
      }

      const response = await axios.delete(`${BASE_URL}/playlist/delete-playlist`, {
        headers: { Authorization: token },
        data: { playlistId },
      });

      if (response.data.success) {
        toast.success('Playlist removed successfully!');
        setPlaylists(playlists.filter((p) => p._id !== playlistId));
      } else {
        toast.error('Failed to remove playlist.');
      }
    } catch (error) {
      console.error('Error removing playlist:', error);
      toast.error('Error removing playlist.');
    }
  };

  const handleLikeToggle = async (songId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('User is not authenticated. Please log in.');
      return;
    }

    const headers = { Authorization: token };
    const songIdObj = { songId };
    const isLiked = likedSongs.some((song) => song._id === songId);

    setLikedSongs(isLiked ? likedSongs.filter((song) => song._id !== songId) : [...likedSongs, { _id: songId }]);

    try {
      if (isLiked) {
        const res = await axios.delete(`${BASE_URL}/auth/delete-like-song`, { data: songIdObj, headers });
        if (!res.data.success) throw new Error();
        toast.success('Song unliked!');
      } else {
        const res = await axios.post(`${BASE_URL}/auth/like-song`, songIdObj, { headers });
        if (!res.data.success) throw new Error();
        toast.success('Song liked!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setLikedSongs(isLiked ? [...likedSongs, { _id: songId }] : likedSongs.filter((song) => song._id !== songId));
      toast.error('Failed to update like status');
    }
  };

  const handlePlaylistClick = (playlistId) => navigate(`/playlist/${playlistId}`);

  const handleShareClick = (playlistId) => {
    const url = `${window.location.origin}/playlist-shared/${playlistId}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const closeModal = () => setShowShareModal(false);

  if (loading) return <div className="text-white text-xl text-center mt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#006161] to-black text-white scrollbar-hide">
      <ToastContainer />

      
      <section className="mb-12 scrollbar-hide">
  <h2 className="text-3xl font-bold mb-6">Your Playlists</h2>
  {playlists.length === 0 ? (
    <p className="text-gray-300">You have no playlists yet.</p>
  ) : (
    <div className="scrollbar-hide flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-700 py-2 px-1">
      {playlists.map((playlist) => (
        <div
          key={playlist._id}
          className="flex-shrink-0 max-w-[280px] w-full sm:w-56 rounded-lg shadow-lg bg-gradient-to-br from-green-700 to-green-900 hover:scale-105 transform transition-transform cursor-pointer relative flex flex-col"
        >
          <img
            src={playlist.image || defaultImg}
            alt={playlist.name}
            className="rounded-t-lg w-full h-40 object-cover"
            onClick={() => handlePlaylistClick(playlist._id)}
          />
          <div className="p-4 flex flex-col flex-grow">
            <div>
              <h3 className="text-xl font-semibold truncate">{playlist.name}</h3>
              <p className="text-gray-300 text-sm mt-1 line-clamp-3">{playlist.description}</p>
            </div>

         
            <div className="mt-4 flex flex-wrap gap-3 justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareClick(playlist._id);
                }}
                className="flex items-center justify-center flex-1 min-w-[40%] bg-green-600 hover:bg-green-500 transition rounded-md py-2 text-white font-semibold shadow-md"
                aria-label="Share Playlist"
                title="Share Playlist"
              >
                <IoIosShareAlt size={20} className="mr-2" />
                Share
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePlaylist(playlist._id);
                }}
                className="flex items-center justify-center flex-1 min-w-[40%] bg-red-600 hover:bg-red-500 transition rounded-md py-2 text-white font-semibold shadow-md"
                aria-label="Delete Playlist"
                title="Delete Playlist"
              >
                <IoIosRemoveCircleOutline size={20} className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>


      
      <section className="mb-12 scrollbar-hide">
        <h2 className="text-3xl font-bold mb-6">Liked Songs</h2>
        {likedSongs.length === 0 ? (
          <p className="text-gray-300">You have not liked any songs yet.</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-700 py-2 px-1">
            {likedSongs.map((song) => (
              <LikedCard
                key={song._id}
                song={song}
                isLiked={likedSongs.some((s) => s._id === song._id)}
                onSelect={() => handleSelectSong(song)}
                onToggleLike={() => handleLikeToggle(song._id)}
              />
            ))}
          </div>
        )}
      </section>

   
      <section className="mb-20 scrollbar-hide">
        <h2 className="text-3xl font-bold mb-6">Your Saved Playlists</h2>
        {savedPlaylists.length === 0 ? (
          <p className="text-gray-300">No saved playlists yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedPlaylists.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-gradient-to-br from-green-700 to-green-900 rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition-transform flex flex-col"
                onClick={() => handlePlaylistClick(playlist._id)}
              >
                <img
                  src={playlist.image || defaultImg}
                  alt={playlist.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-lg font-semibold truncate">{playlist.name}</h3>
                  <p className="text-gray-300 text-sm line-clamp-3 mt-1">{playlist.desc || playlist.description || 'No description'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

   
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 hover:text-red-600 text-xl font-bold"
              aria-label="Close share modal"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-white">Share this Playlist</h3>
            <div className="flex items-center mb-4 space-x-3">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-gray-800 text-white rounded px-3 py-2 truncate select-all"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={handleCopyLink}
                className="bg-green-600 hover:bg-green-700 transition text-white rounded px-4 py-2"
              >
                Copy Link
              </button>
            </div>
            <div className="flex justify-center space-x-6 text-white text-2xl">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on WhatsApp"
                title="Share on WhatsApp"
                className="hover:text-green-400"
              >
                <FaWhatsapp />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Facebook"
                title="Share on Facebook"
                className="hover:text-blue-500"
              >
                <FaFacebook />
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="hover:text-pink-500"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;

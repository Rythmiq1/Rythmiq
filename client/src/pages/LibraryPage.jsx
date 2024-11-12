import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import defaultImg from '../assets/images/Rhythmiq.png';
import MusicPlayer from './MusicPlayer';
import LikedCard from '../components/LikedCard';
import { FaShareAlt, FaTrash } from 'react-icons/fa';
import { IoIosShareAlt } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const LibraryPage = () => {
    const [playlists, setPlaylists] = useState([]); // My Playlists state
    const [likedSongs, setLikedSongs] = useState([]); // Liked Songs state
    const [savedPlaylists, setSavedPlaylists] = useState([]); // Saved Playlists stateplaying song
    const [showShareModal, setShowShareModal] = useState(false); // Modal visibility
    const [shareUrl, setShareUrl] = useState(''); // Shared URL
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error handling
    const navigate = useNavigate(); // React Router's navigate
    const userId = sessionStorage.getItem('userId'); // Get userId from session storage

    // Combined useEffect to fetch all data (playlists, liked songs, saved playlists)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                
                // Fetch playlists
                const playlistsResponse = await axios.get('http://localhost:8080/playlist/my-playlists', {
                    headers: { Authorization: token },
                });
                if (playlistsResponse.data.success) {
                    setPlaylists(playlistsResponse.data.playlists);
                } else {
                    throw new Error("Could not fetch playlists");
                }
    
                // Fetch liked songs
                const likedSongsResponse = await axios.get('http://localhost:8080/auth/get-liked', {
                    headers: { Authorization: token },
                });
                if (likedSongsResponse.data.success) {
                    setLikedSongs(likedSongsResponse.data.data);
                }
    
                // Fetch saved playlists
                const savedPlaylistsResponse = await axios.get('http://localhost:8080/auth/saved-playlists', {
                    headers: { Authorization: token },
                });
                if (savedPlaylistsResponse.data.success) {
                    setSavedPlaylists(savedPlaylistsResponse.data.savedPlaylists);
                } else {
                    throw new Error("Could not fetch saved playlists");
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
    
        if (userId) {
            fetchData();
        } else {
            setError("User not found or logged in.");
            setLoading(false);
        }
    }, [userId, likedSongs]); // Add likedSongs as a dependency here
    

    // Handle song selection
    const handleSelectSong = (song) => {
        setCurrentSong(song);
    };
    const handleRemovePlaylist = async (playlistId) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                toast.error('User is not authenticated. Please log in.');
                return;
            }
    
            // Make the DELETE request to the backend to remove the playlist
            const response = await axios.delete('http://localhost:8080/playlist/delete-playlist', {
                headers: {
                    Authorization: token,  // Include the user's auth token
                },
                data: { playlistId },  // Send the playlistId in the request body
            });
    
            if (response.data.success) {
                toast.success('Playlist removed successfully!');
                // Update the local state to remove the playlist from UI
                setPlaylists(playlists.filter(playlist => playlist._id !== playlistId));
            } else {
                toast.error('Failed to remove playlist.');
            }
        } catch (error) {
            console.error('Error removing playlist:', error);
            toast.error('Error removing playlist.');
        }
    };
    // Handle like toggle for songs
    const handleLikeToggle = async (songId) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error('User is not authenticated. Please log in.');
            return;
        }
    
        const headers = { Authorization: token };
        const songIdObj = { songId };
    
        // Determine if the song is currently liked
        const isLiked = likedSongs.some((song) => song._id === songId);
    
        // Optimistically update the liked songs in the UI
        const updatedLikedSongs = isLiked
            ? likedSongs.filter((song) => song._id !== songId)
            : [...likedSongs, { _id: songId }];
        setLikedSongs(updatedLikedSongs);
    
        try {
            let response;
            if (isLiked) {
                // Send request to unlike the song
                response = await axios.delete('http://localhost:8080/auth/delete-like-song', {
                    data: songIdObj,
                    headers,
                });
                if (!response.data.success) throw new Error('Failed to unlike the song');
                toast.success('Song unliked!');
            } else {
                // Send request to like the song
                response = await axios.post('http://localhost:8080/auth/like-song', songIdObj, { headers });
                if (!response.data.success) throw new Error('Failed to like the song');
                toast.success('Song liked!');
            }
        } catch (error) {
            console.error('Error liking/unliking song:', error);
            setLikedSongs(isLiked ? [...likedSongs, { _id: songId }] : likedSongs.filter((song) => song._id !== songId));
        }
    };
    

    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };
    

    const handleShareClick = (playlistId) => {
        const generatedUrl = `${window.location.origin}/playlist-shared/${playlistId}`;
        setShareUrl(generatedUrl);
        setShowShareModal(true);
    };
    

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
    };

    // Handle close share modal
    const closeModal = () => {
        setShowShareModal(false);
    };

    // Loading state
    if (loading) return <div className="text-white text-xl">Loading...</div>;

    return (
      <div className="ml-2 rounded-lg flex  w-screen overflow-hidden flex-col justify-start min-h-screen bg-gradient-to-b from-[#006161] to-black p-4 mt-16 ">
    <ToastContainer />
    <h2 className="text-2xl font-semibold text-white mb-4">Your Playlists:</h2>

 
    <div className="ml-4 flex overflow-x-auto space-x-5 w-screen scrollbar-hide bg-transparent">
        {playlists?.map((playlist) => (
            <div
                key={playlist._id}
                className="w-full h-[420px] rounded-md shadow-md dark:text-gray-800 
                    flex flex-col cursor-pointer transform transition-transform duration-200 
                    hover:scale-95 hover:border-2 gas kr"
            >
                {/* Playlist Image */}
                <img
                    src={playlist.image || defaultImg}
                    alt={playlist.name}
                    className="object-cover object-top rounded-t-md h-56 dark:bg-gray-500"
                    onClick={() => handlePlaylistClick(playlist._id)}
                />

                {/* Playlist Details */}
                <div className="flex-grow p-4 space-y-4 w-60 flex flex-col justify-between">
                    <div className="space-y-2">
                        <h2 className="text-xl text-white font-semibold tracking-wide">{playlist.name}</h2>
                        <p className="text-white text-sm">{playlist.description}</p>
                    </div>

                    {/* Share Button */}
                    <div className="flex justify-between items-center">
                            {/* Share Button */}
                            <button
                                type="button"
                                className="flex items-center justify-center w-12 p-2 text-lg rounded-md dark:bg-[#006161] text-white"
                                onClick={() => handleShareClick(playlist._id)}
                            >
                                <IoIosShareAlt />
                            </button>

                            {/* Remove Button */}
                            <button
                                type="button"
                                className="flex items-center justify-center w-12 p-2 text-lg rounded-md bg-transparent text-white"
                                onClick={() => handleRemovePlaylist(playlist._id)} // Implement handleRemovePlaylist to handle the playlist removal
                            >
                                <IoIosRemoveCircleOutline />
                            </button>
                        </div>
                </div>
            </div>
        ))}
</div>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Liked Songs:</h2>
            <div className="ml-4 flex overflow-x-auto space-x-4 scrollbar-hide">
                {likedSongs.map((song) => (
                    <LikedCard
                    key={song._id} 
                    song={song} 
                    isLiked={!likedSongs.includes(song._id)} 
                    onSelect={() => handleSelectSong(song)} 
                    onToggleLike={() => handleLikeToggle(song._id)} 
                    />
                ))}
            </div>


{showShareModal && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
  <div className="bg-black p-6 rounded-lg max-w-md w-full text-center shadow-2xl transform transition-all duration-300 ease-in-out scale-105 relative">
      
      {/* Close Button */}
      <button 
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1 rounded-full transition duration-200 transform hover:scale-105 focus:outline-none"
          onClick={closeModal}>
          X
      </button>
      
      {/* Modal Content */}
      <h2 className="text-2xl font-bold mb-4 text-white">Share this Playlist</h2>

      {/* Scrollable Link with Copy Button */}
      <div className="flex items-center justify-between mb-4 gap-4">
        
          <div className="flex-1 text-gray-300 bg-gray-800 px-2 py-1 rounded-md overflow-x-auto whitespace-nowrap scrollbar-hide"
              style={{ maxWidth: '70%' }}>{shareUrl}</div>

          <button 
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none"
              onClick={handleCopyLink}>
              Copy Link</button>

      </div>

      {/* Social Share Options */}
      <div className="mt-3 flex justify-around">
          <button className="flex flex-col items-center text-white hover:text-green-500 transition duration-200 bg-transparent border-none outline-none">
              <FaWhatsapp size={30} />
          </button>
          <button className="flex flex-col items-center text-white hover:text-blue-700 transition duration-200 bg-transparent border-none outline-none">
              <FaFacebook size={30} />
          </button>
          <button className="flex flex-col items-center text-white hover:text-pink-500 transition duration-200 bg-transparent border-none outline-none">
              <FaInstagram size={30} />
          </button>
      </div>
  </div>
</div>

)}

<div className="text-blue-50 mt-8 mb-20">
  <h2 className="text-white text-xl font-bold mb-4">Your Saved Playlists</h2>
  
  {savedPlaylists?.length === 0 ? (
    <p>No playlists saved.</p>
  ) : (
    <div className="ml-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 cursor-pointer">
      {savedPlaylists.map((playlist) => (
        <div
          key={playlist._id}
          className="max-w-[16rem] w-72 rounded-md shadow-md bg-transparent text-white 
            flex flex-col cursor-pointer transform transition-transform duration-200 
            hover:scale-95 hover:border-2 gas kr"
        >
          <div className="flex flex-col items-center">
            <img
              src={playlist.image || defaultImg}
              alt={playlist.name}
              className="object-cover w-full h-64 rounded-t-md"
              onClick={() => handlePlaylistClick(playlist._id)}
            />

            <div className="flex-grow p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-8">
                  <h2 className="text-l font-semibold tracking-wide text-white truncate">
                    {playlist.name}
                  </h2>
                </div>
                <p className="text-sm text-black overflow-hidden text-ellipsis line-clamp-2">
                  {playlist.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
</div>
    );
};

export default LibraryPage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import defaultImg from '../assets/images/Rhythmiq.png';
import MusicPlayer from './MusicPlayer';
import LikedCard from '../components/LikedCard';

const LibraryPage = () => {
    const [playlists, setPlaylists] = useState([]); // My Playlists state
    const [likedSongs, setLikedSongs] = useState([]); // Liked Songs state
    const [savedPlaylists, setSavedPlaylists] = useState([]); // Saved Playlists state
    const [currentSong, setCurrentSong] = useState(null); // Currently playing song
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
    }, [userId]);

    // Handle song selection
    const handleSelectSong = (song) => {
        setCurrentSong(song);
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

        try {
            let response;
            if (likedSongs.some((song) => song._id === songId)) {
                response = await axios.delete('http://localhost:8080/auth/delete-like-song', {
                    data: songIdObj,
                    headers,
                });
                if (response.data.success) {
                    setLikedSongs(likedSongs.filter(song => song._id !== songId));
                    toast.success('Song unliked!');
                }
            } else {
                response = await axios.post('http://localhost:8080/auth/like-song', songIdObj, { headers });
                if (response.data.success) {
                    setLikedSongs([...likedSongs, { _id: songId }]);
                    toast.success('Song liked!');
                }
            }
        } catch (error) {
            console.error('Error liking/unliking song:', error);
            toast.error('Failed to update like status');
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
      <div className="flex flex-col justify-start min-h-screen bg-gradient-to-b from-[#006161] to-black p-4 mt-16 mb-20">
    <ToastContainer/>
    <h2 className="text-2xl font-semibold text-white mb-4">Your Playlists:</h2>

    {/* Horizontal Scroll Container */}
    <div className="flex overflow-x-auto space-x-5 scrollbar-hide bg-transparent w-full">
        {playlists?.map((playlist) => (
            <div
                key={playlist._id}
                className="max-w-[32rem] w-[36rem] rounded-md shadow-md dark:text-gray-800 
                    flex flex-col cursor-pointer transform transition-transform duration-200 
                    hover:scale-105 hover:border-2 gas kr"
            >
                {/* Playlist Image */}
                <img
                    src={playlist.image || defaultImg}
                    alt={playlist.name}
                    className="object-cover object-top w-full rounded-t-md h-56 dark:bg-gray-500"
                    onClick={() => handlePlaylistClick(playlist._id)}
                />

                {/* Playlist Details */}
                <div className="flex-grow p-4 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                        <h2 className="text-xl text-white font-semibold tracking-wide">{playlist.name}</h2>
                        <p className="text-white text-sm">{playlist.description}</p>
                    </div>

                    {/* Share Button */}
                    <button
                        type="button"
                        className="flex items-center justify-center w-full p-2 text-lg tracking-wide 
                            font-bold rounded-md dark:bg-[#006161]"
                        onClick={() => handleShareClick(playlist._id)}
                    >
                        Share
                    </button>
                </div>
            </div>
        ))}
</div>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Liked Songs:</h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {likedSongs.map((song) => (
                    <LikedCard
                        key={song._id}
                        song={song}
                        isLiked={likedSongs.some((s) => s._id === song._id)}
                        onSelect={() => handleSelectSong(song)}
                        onToggleLike={handleLikeToggle}
                    />
                ))}
            </div>

            {currentSong && <MusicPlayer song={currentSong} />}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 ">
    <div className="bg-white p-8 rounded-xl max-w-md w-full text-center shadow-lg transform transition-all duration-300 ease-in-out scale-105">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Share this Playlist</h2>
        <p className="mb-6 text-gray-600 truncate">{shareUrl}</p>
        <div className="flex justify-center space-x-4">
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition duration-200 transform hover:scale-105 focus:outline-none"
                onClick={handleCopyLink}
            >
                Copy Link
            </button>
            <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-5 py-2 rounded-full transition duration-200 transform hover:scale-105 focus:outline-none"
                onClick={closeModal}
            >
                Close
            </button>
        </div>
    </div>
</div>

            )}

<div className="text-blue-50 mt-8">
  <h2 className="text-white text-xl font-bold">Your Saved Playlists</h2>
  
  {savedPlaylists?.length === 0 ? (
    <p>No playlists saved.</p>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 cursor-pointer">
      {savedPlaylists.map((playlist) => (
        <div
          key={playlist._id}
          className="max-w-[16rem] w-72 rounded-md shadow-md bg-transparent text-white 
            flex flex-col cursor-pointer transform transition-transform duration-200 
            hover:scale-105 hover:border-2 gas kr"
        >
          <div className="flex flex-col items-center">
            <img
              src={playlist.image || defaultImg}
              alt={playlist.name}
              className="object-cover w-full h-64 rounded-t-md"
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
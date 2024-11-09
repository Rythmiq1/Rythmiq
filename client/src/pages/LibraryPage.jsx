import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import defaultImg from '../assets/images/Rhythmiq.png';
import MusicPlayer from './MusicPlayer';
import { FaShare } from 'react-icons/fa';
import LikedCard from '../components/LikedCard'; 

const LibraryPage = () => {
    const [playlists, setPlaylists] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null); 
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/share'); 
      };

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/playlist/my-playlists', {
                    headers: { Authorization: token },
                });
                if (response.data.success) {
                    setPlaylists(response.data.playlists);
                } else {
                    throw new Error("Could not fetch playlists");
                }
            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, []);

    const fetchLikedSongs = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/auth/get-liked', {
                headers: { Authorization: token },
            });
            if (response.data.success) {
                setLikedSongs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching liked songs:', error);
            toast.error('Please Login');
        }
    };

    useEffect(() => {
        fetchLikedSongs();
    }, []);

    const handleSelectSong = (song) => {
        setCurrentSong(song);
    };

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

    const closeModal = () => {
        setShowShareModal(false);
    };

    if (loading) return <div className="text-white text-xl">Loading...</div>;

    return (
        <div className="flex flex-col justify-start min-h-screen bg-gradient-to-b from-[#006161] to-black p-4 mt-16">
            <ToastContainer />
            <h2 className="text-2xl font-semibold text-white mb-4">Your Playlists:</h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {playlists.map((playlist) => (
                    <div
                        key={playlist._id}
                        className="bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 cursor-pointer relative"
                    >
                        <img
                            src={playlist.image || defaultImg}
                            alt={playlist.name}
                            className="w-full h-40 object-cover rounded-md"
                            onClick={() => handlePlaylistClick(playlist._id)}
                        />
                        <h3 className="text-lg font-semibold text-white mt-2">{playlist.name}</h3>
                        <p className="text-gray-400">{playlist.description}</p>
                        
                        {/* Share Button */}
                        <button
                            className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2"
                            onClick={() => handleShareClick(playlist._id)}
                        >
                            Share
                        </button>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4">Share this Playlist</h2>
                        <p className="mb-4">{shareUrl}</p>
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
                            onClick={handleCopyLink}
                        >
                            Copy Link
                        </button>
                        <button 
                            className="bg-gray-500 text-white px-4 py-2 rounded-full"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Card = ({ song, isLiked, onSelect, onToggleLike }) => {
    return (
        <div 
            className="bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg"
            onClick={onSelect}
        >
            <img
                src={song.image || defaultImg}
                alt={song.name}
                className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold text-white mt-2">{song.name}</h3>
            <p className="text-gray-400">{song.artist}</p>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleLike(song._id); }} 
                className="text-2xl mt-1" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <span role="img" aria-label="heart" className={`transition duration-200 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                    {isLiked ? '❤️' : '🤍'}
                </span>
            </button>
        </div>
    );
};

export default LibraryPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import defaultImg from '../assets/images/Rhythmiq.png';
import MusicPlayer from './MusicPlayer';

const LibraryPage = () => {
    const [playlists, setPlaylists] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null); 
    const navigate = useNavigate();

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
                toast.error("Failed to load playlists.");
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
            toast.error('Failed to fetch liked songs');
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

    if (loading) return <div className="text-white text-xl">Loading...</div>;

    return (
        <div className="flex flex-col justify-start min-h-screen bg-gray-800 p-4 mt-16">
            <ToastContainer />
            <h2 className="text-2xl font-semibold text-white mb-4">Your Playlists:</h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {playlists.map((playlist) => (
                    <div
                        key={playlist._id}
                        onClick={() => handlePlaylistClick(playlist._id)}
                        className="bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 cursor-pointer"
                    >
                        <img
                            src={playlist.image || defaultImg}
                            alt={playlist.name}
                            className="w-full h-40 object-cover rounded-md"
                        />
                        <h3 className="text-lg font-semibold text-white mt-2">{playlist.name}</h3>
                        <p className="text-gray-400">{playlist.description}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Liked Songs:</h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {likedSongs.map((song) => (
                    <Card 
                        key={song._id} 
                        song={song} 
                        isLiked={likedSongs.some((s) => s._id === song._id)} 
                        onSelect={() => handleSelectSong(song)} 
                        onToggleLike={handleLikeToggle} 
                    />
                ))}
            </div>

         
            {currentSong && <MusicPlayer song={currentSong} />}
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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MusicPlayer from './MusicPlayer'; 
import defaultImg from '../assets/images/Rhythmiq.png';

const PlaylistPage = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSong, setCurrentSong] = useState(null); 
    const [likedSongs, setLikedSongs] = useState([]); 

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/playlist/${id}`, {
                    headers: { Authorization: token },
                });
                if (response.data.success) {
                    setPlaylist(response.data.playlist);
                } else {
                    throw new Error("Could not fetch playlist details");
                }
            } catch (error) {
                console.error("Error fetching playlist details:", error);
                toast.error("Failed to load playlist.");
            } finally {
                setLoading(false);
            }
        };

        const fetchLikedSongs = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/auth/get-liked', {
                    headers: { Authorization: token },
                });
                if (response.data && response.data.success) {
                    setLikedSongs(response.data.data.map(song => song._id));
                }
            } catch (error) {
                console.error('Error fetching liked songs:', error);
                toast.error('Failed to fetch liked songs');
            }
        };

        fetchPlaylist();
        fetchLikedSongs();
    }, [id]);

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
            if (likedSongs.includes(songId)) {
                response = await axios.delete('http://localhost:8080/auth/delete-like-song', {
                    data: songIdObj,
                    headers
                });
                if (response.data.success) {
                    setLikedSongs(likedSongs.filter(id => id !== songId));
                    toast.success('Song unliked!');
                }
            } else {
                response = await axios.post('http://localhost:8080/auth/like-song', songIdObj, { headers });
                if (response.data.success) {
                    setLikedSongs([...likedSongs, songId]);
                    toast.success('Song liked!');
                }
            }
        } catch (error) {
            console.error('Error liking/unliking song:', error);
            toast.error('Failed to update like status');
        }
    };

    if (loading) return <div className="text-white text-xl">Loading...</div>;
    if (!playlist) return <div className="text-white text-xl">Playlist not found</div>;

    return (
        <div className="flex flex-col justify-start min-h-screen bg-gray-800 p-4 mt-16">
            <ToastContainer />
            <h2 className="text-3xl font-semibold text-white mb-4">{playlist.name}</h2>
            <p className="text-gray-400 mb-6">{playlist.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlist.songs.map((song) => (
                    <Card 
                        key={song._id} 
                        song={song} 
                        isLiked={likedSongs.includes(song._id)} 
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
            className="bg-black bg-opacity-40 w-full h-72 p-4 rounded-lg flex flex-col items-start justify-between cursor-pointer"
            onClick={onSelect}
        >
            <img
                src={song.image || defaultImg}
                alt={song.name}
                className="w-full h-36 object-cover rounded-md"
            />
            <div className="mt-2 flex-grow">
                <h3 className="text-lg font-semibold text-white">{song.name}</h3>
                <p className="text-gray-400 text-sm">
                    {song.description ? song.description : "No description available"}
                </p>
            </div>

            <div className="flex justify-between w-full mt-1 text-gray-400 text-xs">
                <span>Duration: {song.duration}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggleLike(song._id); }} 
                    className="text-2xl" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span role="img" aria-label="heart" className={`transition duration-200 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default PlaylistPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MusicPlayer from './MusicPlayer'; 
import LikedCard from '../components/LikedCard';

const PlaylistPage = ({ setCurrentSong }) => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
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
        setCurrentSong(song); // Use the prop to set the current song
    };

    const handleLikeToggle = async (songId) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error('User is not authenticated. Please log in.');
            return;
        }
    
        const headers = { Authorization: token };
    
        try {
            let response;
            const isLiked = likedSongs.includes(songId);
    
            if (isLiked) {
                response = await axios.delete('http://localhost:8080/auth/delete-like-song', {
                    data: { songId },
                    headers,
                });
            } else {
                response = await axios.post('http://localhost:8080/auth/like-song', { songId }, { headers });
            }
    
            if (response.data.success) {
                setLikedSongs((prevLikedSongs) => 
                    isLiked ? prevLikedSongs.filter(id => id !== songId) : [...prevLikedSongs, songId]
                );
                toast.success(isLiked ? 'Song unliked!' : 'Song liked!');
            } else {
                toast.error('Failed to update like status');
            }
        } catch (error) {
            console.error('Error liking/unliking song:', error);
            toast.error('Failed to update like status');
        }
    };

    if (loading) return <div className="text-white text-xl">Loading...</div>;
    if (!playlist) return <div className="text-white text-xl">Playlist not found</div>;

    return (
        <div className="ml-2 rounded-lg flex flex-col justify-start min-h-screen bg-gray-800 p-4 mt-16">
            <ToastContainer />
            <h2 className="text-3xl font-semibold text-white mb-4">{playlist.name}</h2>
            <p className="text-gray-400 mb-6">{playlist.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {playlist.songs.map((song) => (
                    <LikedCard 
                        key={song._id}
                        song={song} 
                        isLiked={likedSongs.includes(song._id)} 
                        onSelect={() => handleSelectSong(song)} 
                        onToggleLike={() => handleLikeToggle(song._id)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default PlaylistPage;

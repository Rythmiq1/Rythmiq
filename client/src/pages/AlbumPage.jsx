import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MusicPlayer from './MusicPlayer';
import axios from 'axios';
import LikedCard from '../components/LikedCard';
import BASE_URL from "../config"; 
const AlbumPage = ({ setCurrentSong }) => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]); // List of liked song IDs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSong, setCurrentSongState] = useState(null);
   

    // Fetch album data
    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`${BASE_URL}/album/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                if (data.album && Array.isArray(data.songs)) {
                    setAlbum(data.album);
                    setSongs(data.songs);
                } else throw new Error("Album or songs not found");
            } catch (error) {
                console.error("Error fetching album:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
        fetchLikedSongs();
    }, [id]);

    // Fetch liked songs
    const fetchLikedSongs = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/auth/get-liked`, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.data && response.data.success) {
                setLikedSongs(response.data.data.map(song => song._id)); // Update liked songs list
            }
        } catch (error) {
            console.error('Error fetching liked songs:', error);
            toast.error('Failed to fetch liked songs');
        }
    };
    const handleSelectSong = (song) => {
        console.log(song,songs);
        setCurrentSong(song, songs);
        setCurrentSongState(song);
    };

    if (loading) return <div className="text-white text-xl">Loading...</div>;
    if (error) return <div className="text-white text-xl">Error: {error}</div>;

    return (
        <div className="ml-2 rounded-lg flex flex-col items-center justify-start min-h-screen   bg-gradient-to-b from-[#006161] to-black p-4 mt-16">
            <ToastContainer />
            {album ? (
                <>
                    <div className="mt-8 w-full flex flex-col items-start">
                        <h2 className="text-2xl font-semibold text-white mb-4">Songs:</h2>
                        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                            {songs.length > 0 ? (
                                songs.map((song) => (
                                    <LikedCard
                                        key={song._id} 
                                        song={song} 
                                        isLiked={likedSongs.includes(song._id)} // Pass liked status based on fetched liked songs
                                        onSelect={() => handleSelectSong(song)} 
                                        onToggleLike={() => fetchLikedSongs()} 
                                    />
                                ))
                            ) : (
                                <p className="text-white text-lg">No songs available.</p>
                            )}
                        </div>
                    </div>
                    {currentSong && <MusicPlayer song={currentSong} />}
                </>
            ) : (
                <p className="text-white text-lg">No album data available.</p>
            )}
        </div>
    );
};


export default AlbumPage;


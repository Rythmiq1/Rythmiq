import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MusicPlayer from './MusicPlayer'; // Import MusicPlayer component

const AlbumPage = ({ setCurrentSong }) => { // Keep prop as is for now
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSong, setCurrentSongState] = useState(null); // Use different name for state setter

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`http://localhost:8080/album/${id}`);
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
    }, [id]);

    const handleLikeSong = async (songId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to like a song.');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/liked-songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, songId }),
            });
            if (!response.ok) throw new Error('Failed to like song');
            toast.success('Song liked!');
        } catch (error) {
            console.error('Error liking song:', error);
            toast.error('Failed to like song');
        }
    };

    const handleSelectSong = (song) => {
        setCurrentSong(song); // Use the prop to set the current song in the parent
        setCurrentSongState(song); // Update local state for MusicPlayer
    };

    if (loading) return <div className="text-white text-xl">Loading...</div>;
    if (error) return <div className="text-white text-xl">Error: {error}</div>;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-800 p-4 mt-16">
            <ToastContainer />
            {album ? (
                <>
                    <div className="mt-8 w-full flex flex-col items-start">
                        <h2 className="text-2xl font-semibold text-white mb-4">Songs:</h2>
                        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                            {songs.length > 0 ? (
                                songs.map((song) => (
                                    <Card 
                                        key={song._id} 
                                        song={song} 
                                        onLike={() => handleLikeSong(song._id)} 
                                        onSelect={() => handleSelectSong(song)} 
                                    />
                                ))
                            ) : (
                                <p className="text-white text-lg">No songs available.</p>
                            )}
                        </div>
                    </div>
                    {currentSong && <MusicPlayer song={currentSong} />} {/* Pass the currentSong to MusicPlayer */}
                </>
            ) : (
                <p className="text-white text-lg">No album data available.</p>
            )}
        </div>
    );
};

const Card = ({ song, onLike, onSelect }) => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        onLike();
    };

    return (
        <div onClick={onSelect} className='bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 cursor-pointer'>
            <img src={song.image} alt={song.name} className='w-full h-40 object-cover rounded-md' />
            <div className='mt-2 flex flex-row'>
                <div>
                    <h3 className='text-lg font-semibold text-white'>{song.name}</h3>
                    <p className='text-gray-400'>{song.desc}</p>
                    <p className='text-gray-400'>Duration: {song.duration}</p>
                </div>
                <button onClick={handleLike} className='mt-4 text-2xl' style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <span role="img" aria-label="heart" className={`transition duration-200 ${liked ? 'text-red-500' : 'text-gray-400'}`}>
                        {liked ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AlbumPage;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const LikedCard = ({ song, isLiked, onSelect, onToggleLike, onDeleteLike }) => {
    const [liked, setLiked] = useState(isLiked);

    useEffect(() => {
        setLiked(isLiked); // Sync liked state with parent when it changes
    }, [isLiked]);

    const handleLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('User is not authenticated. Please log in.');
            return;
        }

        const headers = { Authorization: token };
        const songId = { songId: song._id };
        let response;

        try {
            // Send the request to either like or unlike the song
            if (liked) {
                // Unliking the song
                response = await axios.delete('http://localhost:8080/auth/delete-like-song', {
                    data: songId,
                    headers,
                });
                // Inform parent to update the state
                if (response.data.success) {
                    setLiked(false); // Toggle the like state locally
                    onDeleteLike(song._id); // Notify parent to remove the song from liked list
                    toast.success("Song unliked");
                } else {
                    toast.error(response.data.message || 'Failed to unlike song');
                }
            } else {
                // Liking the song
                response = await axios.post('http://localhost:8080/auth/like-song', songId, {
                    headers,
                });
                if (response.data.success) {
                    setLiked(true); // Toggle the like state locally
                    onToggleLike(song._id, true); // Notify parent to add the song to liked list
                    // toast.success(response.data.message);
                } else {
                    toast.error(response.data.message || 'Failed to like song');
                }
            }
        } catch (error) {
            console.error('Error liking/unliking song:', error);
            if (error.response) {
                toast.error(`Error: ${error.response.data?.message || 'Unexpected error occurred'}`);
            } else {
                // toast.error('Network error or server down.');
            }
        }
    };

    return (
        <div className="bg-transparent">
            <div
                className="w-72 h-[420px] rounded-md shadow-md text-white 
                    flex flex-col cursor-pointer transform transition-transform duration-200 
                    hover:scale-95 hover:border-2 gas kr"
                onClick={onSelect} 
            >
                <img
                    src={song.image || 'defaultImg'} 
                    alt={song.name}
                    className="object-cover w-full h-64 rounded-t-md"
                />

                <div className="flex-grow p-4 space-y-4 flex flex-col justify-between align-middle relative">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold tracking-wide text-white truncate">{song.name}</h2>
                        <p className="text-white text-sm truncate">
                            {song.desc}
                        </p>
                        <p className="text-gray-400 text-sm">Duration: {song.duration}</p>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); handleLike(); }} 
                        className="absolute right-2 bottom-0 text-2xl"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <div
                            role="img" 
                            aria-label="heart" 
                            className={`transition duration-200 ${liked ? 'text-red-500' : 'text-gray-400'}`}
                        >
                            {liked ? '❤️' : '🤍'}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LikedCard;

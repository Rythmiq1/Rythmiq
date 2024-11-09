import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../App.css';
const LikedCard = ({ song, isLiked, onSelect, onToggleLike }) => {
    const [liked, setLiked] = useState(isLiked);

    useEffect(() => {
        setLiked(isLiked); // Update local liked state based on prop
    }, [isLiked]);

    const handleLike = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                toast.error('User is not authenticated. Please log in.');
                return;
            }

            const headers = { Authorization: token };
            const songId = { songId: song._id };
            let response;

            if (liked) {
                response = await axios.delete(
                    'http://localhost:8080/auth/delete-like-song',
                    { data: songId, headers }
                );
                setLiked(false);
                onToggleLike(true);
            } else {
                response = await axios.post(
                    'http://localhost:8080/auth/like-song',
                    songId,
                    { headers }
                );
                setLiked(true);
                onToggleLike(false);
            }

            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || 'Unexpected response from server');
            }

        } catch (error) {
            console.error('Error liking/unliking song:', error);
            if (error.response) {
                toast.error(`Error: ${error.response.data?.message || 'Unexpected error occurred'}`);
            } else {
                toast.error('Network error or server down.');
            }
        }
    };

    return (
        <div 
            onClick={onSelect} 
            className='card'
        >
            <div className='bg-black  w-64 h-80 p-4 rounded-lg'>
            <div className="relative">
                <img src={song.image} alt={song.name} className="w-full h-40 object-cover rounded-md" />
                
                {/* Heart icon button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handleLike(); }} 
                    className="absolute ml-32 mt-16 text-2xl"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span 
                        role="img" 
                        aria-label="heart" 
                        className={`transition duration-200 ${liked ? 'text-red-500' : 'text-gray-400'}`}
                    >
                        {liked ? '❤️' : '🤍'}
                    </span>
                </button>

                   {/* Song details */}

                <div className="mt-3">
                <h3 className="text-lg font-semibold text-white">{song.name}</h3>
                <p className="text-gray-400 text-sm">{song.desc}</p>
                <p className="text-gray-400 text-sm mt-1">Duration: {song.duration}</p>
            </div>
            </div>
            </div>
           

          
            
        </div>
    );
};

export default LikedCard;

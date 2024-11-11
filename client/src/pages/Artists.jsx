import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for API requests
import { toast } from 'react-toastify';

const Artists = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState(new Set());  // Store followed artist IDs

  useEffect(() => {
    // Fetch the list of artists
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:8080/artist/artists');
        const data = await response.json();
        
        if (data.success) {
          setArtists(data.data); // Set artists data
        } else {
          console.error('Failed to fetch artists');
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    // Fetch followed artists
    const fetchFollowedArtists = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to follow artists');
          return;
        }

        const response = await axios.get('http://localhost:8080/auth/all-followed-artists', {
          headers: { Authorization: token }
        });

        if (response.data.success) {
          const followedArtistIds = new Set(response.data.followedArtists.map(artist => artist._id));
          setFollowedArtists(followedArtistIds); // Store followed artist IDs in the set
        } else {
          toast.error('Failed to fetch followed artists');
        }
      } catch (error) {
        console.error('Error fetching followed artists:', error);
        toast.error('Error fetching followed artists');
      }
    };

    // Call the fetch functions
    fetchArtists();
    fetchFollowedArtists();
  }, []);

  const handleFollowUnfollow = async (artistId, index) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('User is not authenticated. Please log in.');
      return;
    }

    try {
      const action = followedArtists.has(artistId) ? 'unfollow-artist' : 'follow-artist';
      const url = `http://localhost:8080/auth/${action}`;

      const response = await axios.post(url, { artistId }, {
        headers: { Authorization: token }
      });

      if (response.data.success) {
        // Update followedArtists set to toggle the follow state
        setFollowedArtists((prev) => {
          const newFollowedArtists = new Set(prev);
          if (action === 'follow-artist') {
            newFollowedArtists.add(artistId);
          } else {
            newFollowedArtists.delete(artistId);
          }
          return newFollowedArtists;
        });
        
        toast.success(response.data.message);
      } else {
        toast.error('Failed to follow/unfollow artist');
      }
    } catch (error) {
      console.error('Error following/unfollowing artist:', error);
      toast.error('Error following/unfollowing artist');
    }
  };

  const handleCardClick = (artistId) => {
    navigate(`/artists/${artistId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-gradient-to-b from-[#006161] to-black mb-20">
      {artists.map((artist, index) => (
        <div key={artist._id} 
             className="max-w-[16rem] rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 
             flex flex-col cursor-pointer transform transition-transform duration-200 
             hover:scale-105 hover:border-2 hover:border-white"
             onClick={() => handleCardClick(artist._id)}>

          <img src={artist.image} alt={artist.name}
               className="object-cover object-top w-full rounded-t-md h-56 dark:bg-gray-500"/>

          <div className="flex-grow p-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-wide">{artist.name}</h2>
              <p className="dark:text-gray-800 text-sm">{artist.bio || artist.description}</p>
            </div>
            <button type="button"
              className={`flex items-center justify-center w-full p-2 text-lg tracking-wide 
                font-bold rounded-md dark:bg-[#006161] 
              ${followedArtists.has(artist._id) ? 'text-red-600' : 'text-gray-50'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleFollowUnfollow(artist._id, index);
              }}>
              {followedArtists.has(artist._id) ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Artists;

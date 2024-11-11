
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Artists = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState({});

  useEffect(() => {
    const fetchArtists = async () => {
      try 
      {
        const response = await fetch('http://localhost:8080/artist/artists');
        const data = await response.json();
        console.log(response);

        if (data.success) {
          setArtists(data.data); 
        } else {
          console.error('Failed to fetch artists');
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const toggleFollow = (index) => {
    setFollowedArtists((prev) => ({
      ...prev,
      [index]: !prev[index], 
    }));
  };

  const handleCardClick = (artistId) => {
    navigate(`/artists/${artistId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 
                bg-gradient-to-b from-[#006161] to-black mb-20">
      {artists.map((artist, index) => 
      (
        <div key={artist._id}
          className="max-w-[16rem] rounded-md shadow-md dark:bg-gray-50 dark:text-gray-800 
          flex flex-col cursor-pointer transform transition-transform duration-200 
          hover:scale-105 hover:border-2 hover:border-white gas ne"
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
              ${followedArtists[index] ? 'text-red-600' : 'text-gray-50'}`}
              onClick=
              {
                (e) => 
                { 
                e.stopPropagation(); toggleFollow(index); 
                }
                }>
              {followedArtists[index] ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Artists;
import React, { useState, useEffect } from 'react';

const LikedSongs = ({ onSongSelect }) => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const playSong = (song) => {
    console.log("Selected Song:", song); 
    onSongSelect(song); 
  };


  const buttonStyling = "flex space-x-3 mr-2 font-semibold bg-white text-teal-500 border-2 border-teal-500 rounded-full px-6 py-2 hover:bg-teal-500 hover:text-white hover:border-teal-500 mx-8 shadow-lg shadow-teal-300/50 transition duration-300 ease-in-out";

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/get-liked', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${sessionStorage.getItem('token')}` // or however you're storing the token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch liked songs.');
        }

        const data = await response.json();
        setLikedSongs(data.data); // assuming 'data' field contains liked songs array
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  const handlePlayClick = (title) => 
  {
    console.log(`Playing ${title}`);
    
  };

  if (loading) {
    return (
      <div className="liked-songs-container p-5 bg-gradient-to-b from-[#006161] to-black">
        <h1 className="text-2xl font-bold mb-4 text-white">Liked Songs</h1>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="liked-songs-container p-5">
        <h1 className="text-2xl font-bold mb-4 text-white">Liked Songs</h1>
        <p className="text-white">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="liked-songs-container p-5 bg-gradient-to-b from-[#006161] to-black">
      <h1 className="text-2xl font-bold mb-4 text-white">Liked Songs</h1>
      {likedSongs.length === 0 ? (
        <p className="text-white">No liked songs available.</p>
      ) : (
        <ul>
          {likedSongs.map((song) => (
            <li key={song._id} className="flex items-center justify-between py-2 text-white">
              <div className="flex items-center">
                <img src={song.image} alt={song.name} className="w-16 h-16 mr-4" />
                <div className="flex-1">
                  <span className="font-semibold">{song.name} - {song.artist}</span>
                  <p className="text-sm">{song.desc}</p>
                </div>
              </div>
           
              <button className={buttonStyling} onClick={() => playSong(song)} aria-label={`Play ${song.name}`}> 
              <span className="text-lg">&#9658;</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedSongs;

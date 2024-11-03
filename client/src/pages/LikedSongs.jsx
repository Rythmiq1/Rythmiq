import React, { useState, useEffect } from 'react';

const LikedSongs = () => {
  // Sample liked songs data with images and descriptions
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    // Simulate fetching liked songs
    const fetchLikedSongs = () => {
      // Sample data for demonstration
      const sampleLikedSongs = [
        { 
          id: 1, 
          title: 'Song One', 
          artist: 'Artist A', 
          imageUrl: 'https://via.placeholder.com/100', // Sample image URL
          description: 'A beautiful song that lifts your spirits.' 
        },
        { 
          id: 2, 
          title: 'Song Two', 
          artist: 'Artist B', 
          imageUrl: 'https://via.placeholder.com/100', // Sample image URL
          description: 'An energetic tune that makes you dance.' 
        },
        { 
          id: 3, 
          title: 'Song Three', 
          artist: 'Artist C', 
          imageUrl: 'https://via.placeholder.com/100', // Sample image URL
          description: 'A mellow track perfect for relaxation.' 
        },
      ];
      setLikedSongs(sampleLikedSongs);
    };

    fetchLikedSongs();
  }, []);

  const handlePlayClick = (title) => {
    console.log(`Playing ${title}`);
  };

  return (
    <div className="liked-songs-container p-5">
      <h1 className="text-2xl font-bold mb-4 text-white">Liked Songs</h1>
      {likedSongs.length === 0 ? (
        <p className="text-white">No liked songs available.</p>
      ) : (
        <ul>
          {likedSongs.map((song) => (
            <li key={song.id} className="flex items-center justify-between border-b py-2 text-white">
              <div className="flex items-center">
                <img src={song.imageUrl} alt={song.title} className="w-16 h-16 mr-4" /> {/* Song image */}
                <div className="flex-1">
                  <span className="font-semibold">{song.title} - {song.artist}</span>
                  <p className="text-sm">{song.description}</p> {/* Song description */}
                </div>
              </div>
              <button 
                onClick={() => handlePlayClick(song.title)} 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                aria-label={`Play ${song.title}`} 
              >
               
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

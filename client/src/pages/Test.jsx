import React, { useState, useEffect } from 'react';

const Test = () => {
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMusic = async () => {
    const url = 'https://spotify23.p.rapidapi.com/albums/?ids=3IBcauSj5M2A6lTeffJzdv,2noRn2Aes5aoNVsU6iWThc,5ht7ItJgpBH7W6vJ5BqpPr';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'b3a04094e5msh37d4f4a894c8514p10a07cjsn4d10b501f00a', // Use environment variable for security
        'x-rapidapi-host': 'spotify23.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setMusicData(result.albums); // Assuming the response has an 'albums' array with multiple albums
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMusic();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-white" style={{ padding: '20px' }}>
      <h1>Album Details</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {musicData.length > 0 ? (
          musicData.map((album) => (
            <div key={album.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px' }}>
              <img src={album.images[0].url} alt={album.name} style={{ width: '100%', borderRadius: '8px' }} />
              <h2>{album.name}</h2>
              <p><strong>Artist:</strong> {album.artists[0].name}</p>
              <p><strong>Release Date:</strong> {album.release_date}</p>
              <p><strong>Total Tracks:</strong> {album.total_tracks}</p>
            </div>
          ))
        ) : (
          <div>No album data available</div>
        )}
      </div>
    </div>
  );
};

export default Test;

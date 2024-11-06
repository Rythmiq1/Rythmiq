// src/components/Album.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbum } from '../redux/albumSlice';

function Album() {
  const dispatch = useDispatch();
  const { albumData, status, error } = useSelector((state) => state.album);

  useEffect(() => {
    const albumId = '4aawyAB9vmqN3uQ7FjRGTy';  // Replace with the album ID you want
    dispatch(fetchAlbum(albumId));  // Dispatch the fetchAlbum action
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className='text-white'>
      {albumData ? (
        <>
          <h2>{albumData.name}</h2>
          <p>By {albumData.artists.map((artist) => artist.name).join(', ')}</p>
          <p>Release Date: {albumData.release_date}</p>
          <ul>
            {albumData.tracks.items.map((track) => (
              <li key={track.id}>{track.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No album data</p>
      )}
    </div>
  );
}

export default Album;

// src/components/Songs.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongs, selectAllSongs } from '../redux/songSlice';

const Songs = ({ token }) => {
  const dispatch = useDispatch();
  const songs = useSelector(selectAllSongs);
  const songStatus = useSelector((state) => state.songlist.status);
  const error = useSelector((state) => state.songlist.error);

  useEffect(() => {
    if (token) {
      dispatch(fetchSongs(token));
    }
  }, [dispatch, token]);

  if (songStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (songStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Top Songs</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <img src={song.album.images[0].url} alt={song.name} width={50} />
            <span>{song.name}</span> - {song.artists.map(artist => artist.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Songs;

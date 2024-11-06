import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbums } from '../redux/spotifySlice';

const Test = ({ artistId }) => {
  const dispatch = useDispatch();
  const albums = useSelector((state) => state.spotify.albums);
  const albumStatus = useSelector((state) => state.spotify.status);
  const error = useSelector((state) => state.spotify.error);

  useEffect(() => {
    if (albumStatus === 'idle') {
      dispatch(fetchAlbums(artistId));
    }
  }, [albumStatus, dispatch, artistId]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 p-8">
      <h2 className="text-center text-4xl font-semibold text-white mb-8">Albums</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albumStatus === 'loading' && (
          <div className="col-span-full text-center text-white text-xl">Loading...</div>
        )}
        {albumStatus === 'failed' && (
          <div className="col-span-full text-center text-red-500 text-xl">Error: {error}</div>
        )}
        {albumStatus === 'succeeded' &&
          albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                className="w-full h-56 object-cover"
                src={album.images[0]?.url || 'https://via.placeholder.com/500'}
                alt={album.name}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 truncate">{album.name}</h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Test;

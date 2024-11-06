// src/features/spotifySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getSpotifyToken } from '../spotifyAuth';

export const fetchAlbums = createAsyncThunk('spotify/fetchAlbums', async (artistId) => {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.items;
});

export const fetchPlaylists = createAsyncThunk('spotify/fetchPlaylists', async () => {
  const token = await getSpotifyToken();
  const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
  return response.data.items;
});


const spotifySlice = createSlice({
    name: 'spotify',
    initialState: {
        albums: [],
        playlists: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbums.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAlbums.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.albums = action.payload;
            })
            .addCase(fetchAlbums.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default spotifySlice.reducer;

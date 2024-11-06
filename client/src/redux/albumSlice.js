// src/albumSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getSpotifyToken } from '../spotifyAuth';  

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1/albums';  

export const fetchAlbum = createAsyncThunk('album/fetchAlbum', async (albumId) => {
  try {
    const token = await getSpotifyToken();  // Get the access token dynamically

    // Make the API request with the albumId
    const response = await axios.get(`${SPOTIFY_BASE_URL}/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;  // Return the album data once fetched
  } catch (error) {
    throw new Error('Failed to fetch album data');
  }
});

const albumSlice = createSlice({
  name: 'album',
  initialState: {
    albumData: null,  
    status: 'idle', 
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbum.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(fetchAlbum.fulfilled, (state, action) => {
        state.status = 'succeeded';  
        state.albumData = action.payload;
      })
      .addCase(fetchAlbum.rejected, (state, action) => {
        state.status = 'failed'; 
        state.error = action.error.message;
      });
  },
});

export default albumSlice.reducer;

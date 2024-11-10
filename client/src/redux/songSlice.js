import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Spotify API Error:', errorData);
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      // console.log(data);
      return data.items;
    } catch (error) {
      console.error('Network Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const songSlice = createSlice({
  name: 'songs',
  initialState: {
    songs: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.songs = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAllSongs = (state) => state.songlist.songs; 

export default songSlice.reducer;
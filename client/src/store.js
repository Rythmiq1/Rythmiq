// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import albumReducer from './redux/albumSlice';  // Import the reducer

const store = configureStore({
    reducer: {
        album: albumReducer,  // Use albumReducer to manage album state
    },
});

export default store;

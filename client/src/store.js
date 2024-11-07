// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import songReducer from './redux/songSlice';  // Import the reducer

const store = configureStore({
    reducer: {
        songlist: songReducer,
    },
});

export default store;

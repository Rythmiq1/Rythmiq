import React, { useState } from 'react';
import Player from './Player';
import MusicPlayer from './MusicPlayer.jsx';

const colorChange = () => {

  const [bgColorIndex, setBgColorIndex] = useState(0);

  // Array of pastel colors for the background
  const colors = [
    '#A8E6CF', // Pastel Green
    '#FF8B94', // Pastel Red
    '#FFB7B2', // Pastel Pink
    '#B2EBF2', // Pastel Cyan
    '#D1C4E9', // Pastel Purple
  ];

  const changeBackgroundColor = () => {
    setBgColorIndex((prevIndex) => (prevIndex + 1) % colors.length); // Cycle through colors
  };

  return (
    <div>
      <Player bgColor={colors[bgColorIndex]} changeBackgroundColor={changeBackgroundColor}
      />
      <MusicPlayer bgColor={colors[bgColorIndex]} />
    </div>
  );
};

export default colorChange;

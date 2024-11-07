// Card.js
import React from 'react';
import defaultImg from '../assets/images/Rhythmiq.png';
const Card = ({ song, isLiked, onSelect, onToggleLike }) => {
  return (
      <div 
          className="card" 
          onClick={onSelect}
      >
          <img
              src={song.image || defaultImg}
              alt={song.name}
              className="card-image"
          />
          <div className="card-content">
              <h3 className="heading">{song.name}</h3>
              <p>{song.description ? song.description : "No description available"}</p>
              <div className="card-footer">
                  <span>Duration: {song.duration}</span>
                  <button 
                      onClick={(e) => { e.stopPropagation(); onToggleLike(song._id); }} 
                      className="like-button"
                  >
                      <span role="img" aria-label="heart" className={`heart-icon ${isLiked ? 'liked' : ''}`}>
                          {isLiked ? '❤️' : '🤍'}
                      </span>
                  </button>
              </div>
          </div>
      </div>
  );
};


export default Card;

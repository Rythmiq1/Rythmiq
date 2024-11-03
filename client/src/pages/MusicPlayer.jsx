import { useState, useRef, useEffect } from "react";
import shuffle from "../assets/shuffle.png";
import prev from "../assets/prev.png";
import pause from "../assets/pause.png";
import play from "../assets/play.png";
import next from "../assets/next.png";
import loop from "../assets/loop.png";
import plays from "../assets/plays.png";
import mic from "../assets/mic.png";
import queue from "../assets/queue.png";
import speaker from "../assets/speaker.png";
import volume from "../assets/volume.png";
import mini_player from "../assets/mini-player.png";
import zoom from "../assets/zoom.png";
import rhythmiq from "../assets/images/Rhythmiq.png";

const MusicPlayer = ({ currentSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };
  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  useEffect(() => {
    console.log("Current Song:", currentSong);
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.file; 
      audioRef.current.load(); 
      setIsPlaying(false); 
    }
  }, [currentSong]);
  return (
    <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center bg-gray-800 p-4 rounded-t shadow-lg z-50'>
      {currentSong && (
        <audio 
          ref={audioRef} 
          onEnded={handleAudioEnd} 
          onLoadedMetadata={handleMetadataLoaded} 
          onTimeUpdate={handleTimeUpdate} 
        />
      )}
      <div className='absolute left-4 top-4'>
        <img className='w-12 h-12 rounded-lg border-2 border-gray-600' src={currentSong ? currentSong.image : rhythmiq} alt={currentSong ? currentSong.title : "No song playing"} />
      </div>
      <div className='flex flex-col items-center gap-1'>
        <div className='flex gap-4'>
          <img className='w-4 cursor-pointer' src={shuffle} alt='shuffle' />
          <img className='w-4 cursor-pointer' src={prev} alt='previous' />
          <img 
            className='w-4 cursor-pointer' 
            src={isPlaying ? pause : play} 
            alt='play' 
            onClick={handlePlayPause}
          />
          <img className='w-4 cursor-pointer' src={next} alt='next' />
          <img className='w-4 cursor-pointer' src={loop} alt='loop' />
        </div>

        <div className='flex items-center gap-5'>
          <p className="text-white">{formatTime(currentTime)}</p>
          <div className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
            <hr className='h-1 border-none w-0 bg-green-800 rounded-full' style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
          <p className="text-white">{duration ? formatTime(duration) : "0:00"}</p>
        </div>
      </div>
      <div className='hidden lg:flex items-center gap-2 opacity-75'>
        <img className='w-4' src={plays} alt='plays' />
        <img className='w-4' src={mic} alt='mic' />
        <img className='w-4' src={queue} alt='queue' />
        <img className='w-4' src={speaker} alt='speaker' />
        <img className='w-4' src={volume} alt='volume' />
        <div className='w-20 bg-slate-50 h-1 rounded'></div>
        <img className='w-4' src={mini_player} alt='mini player' />
        <img className='w-4' src={zoom} alt='zoom' />
      </div>
    </div>
  );
};
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default MusicPlayer;

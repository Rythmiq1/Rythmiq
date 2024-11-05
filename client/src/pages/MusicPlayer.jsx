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
import mute from "../assets/mute.png";

const MusicPlayer = ({ currentSong, onSongChange })  => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(1); // Volume state
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  

  // Function to play/pause the audio
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

  // When metadata is loaded, set the duration
  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = currentVolume; // Restore previous volume
      }else {
        audioRef.current.volume = 0; // Mute the audio
      }
      setIsMuted(!isMuted); // Toggle mute state
    }
  };

  // When audio ends, reset play state
  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  // Update the current time as the audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Update audio source when the song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.file;
      audioRef.current.load();
      setIsPlaying(false);
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
      audioRef.current.src = currentSong.file; 
      audioRef.current.load(); 
      setIsPlaying(true); // Automatically set isPlaying to true
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      }); // Automatically play the audio
    }
    setIsPlaying(true);
  }, [currentSong]);
  

  // Function to handle progress bar click
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left; // Get click position
    const newTime = (clickX / progressBar.clientWidth) * duration; // Calculate new time
    audioRef.current.currentTime = newTime; // Set audio's current time to the new time
    setCurrentTime(newTime); // Update state to reflect the new time
    if (!isPlaying) {
      audioRef.current.play(); // Play if it was paused
      setIsPlaying(true);
    }
  };

  // Function to handle volume clicks
  const handleVolumeClick = (e) => {
    const volumeBar = e.currentTarget;
    const clickX = e.clientX - volumeBar.getBoundingClientRect().left;
    const newVolume = clickX / volumeBar.clientWidth;
    audioRef.current.volume = newVolume;
    setCurrentVolume(newVolume); // Update the volume state
  };

  // Optional: Handle volume scroll events
  const handleVolumeScroll = (e) => {
    const newVolume = Math.min(Math.max(currentVolume + (e.deltaY > 0 ? -0.05 : 0.05), 0), 1); // Increment/decrement volume
    audioRef.current.volume = newVolume; // Set new volume
    setCurrentVolume(newVolume); // Update state
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center bg-gray-800 p-4 rounded-t shadow-lg z-50'>
      {currentSong && (
        <audio 
        ref={audioRef} 
        onEnded={handleAudioEnd} 
        onLoadedMetadata={handleMetadataLoaded} 
        onTimeUpdate={handleTimeUpdate} 
        preload="auto" 
      />
      
      )}
      <div className='absolute left-4 top-4'>
        <img className='w-12 h-12 rounded-lg border-2 border-gray-600' src={currentSong ? currentSong.image : rhythmiq} alt={currentSong ? currentSong.title : "No song playing"} />
      </div>
      <div className='flex flex-col items-center gap-1 ml-20'>
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
          <div className='relative w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer' onClick={handleProgressClick}>
            <div className='h-1 bg-gray-300 rounded-full'></div>
            <div className='h-1 bg-gray-600 rounded-full' style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            
            <div
              className="absolute w-3 h-3 bg-gray-600 rounded-full"
              style={{ left: `${(currentTime / duration) * 100}%`, top: '-1px', transform: 'translateX(-50%)' }} // Adjust 'top' to align with the progress line
            ></div>
          </div>
          <p className="text-white">{duration ? formatTime(duration) : "0:00"}</p>
        </div>
      </div>
      <div className='hidden lg:flex items-center gap-2 opacity-75'>
        {/* <img className='w-4' src={plays} alt='plays' /> */}
        {/* <img className='w-4' src={mic} alt='mic' />
        <img className='w-4' src={queue} alt='queue' /> */}
        {/* <img className='w-4' src={speaker} alt='speaker' /> */}
        <img className='w-4 cursor-pointer ml-10' src={isMuted ? mute : volume} alt='volume' onClick={toggleMute} />

        
        
        <div className='relative w-20 h-1 bg-slate-50 rounded cursor-pointer' 
            onClick={handleVolumeClick} onWheel={handleVolumeScroll}>
        <div className='absolute top-0 left-0 h-full bg-gray-400 rounded' style={{ width: `${currentVolume * 100}%` }}></div>
        <div className="absolute w-3 h-3 bg-gray-500 rounded-full"
          style={{ left: `${currentVolume * 100}%`, top: '1px', transform: 'translateY(-55%)' }}>
      </div>
      </div>
{/* 
        <img className='w-4' src={mini_player} alt='mini player' /> */}
        <img className='w-4 ml-10 mr-7' src={zoom} alt='zoom' />
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
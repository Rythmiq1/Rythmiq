import { useState, useRef, useEffect } from "react";
import { IoShuffle } from "react-icons/io5";
import { IoIosPause , IoMdSkipForward} from "react-icons/io";
import { IoMdSkipBackward } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { SlLoop } from "react-icons/sl";
import { IoVolumeHighOutline, IoVolumeMuteOutline  } from "react-icons/io5";
import rhythmiq from "../assets/images/Rhythmiq.png";
import zoom from "../assets/zoomin.png";
import shrink from "../assets/zoomout.png";
import { useNavigate } from 'react-router-dom'; 
import BASE_URL from "../config"; 


const MusicPlayer = ({ currentSong, songs, onSongChange }) => {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(1); 
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const navigate = useNavigate(); 
  const [isZoomed, setIsZoomed] = useState(true);


  const toggleImage = () => {
    if (!isZoomed) {
      setIsZoomed(true);
      navigate('/player', { state: { currentSong } }); 
    } else {
      setIsZoomed(false);
      navigate('/');
    }
};


  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false); 
  const [originalSongs, setOriginalSongs] = useState([]); 
  const [shuffledSongs, setShuffledSongs] = useState([]); 
  const [currentSongIndex, setCurrentSongIndex] = useState(0); 
  const safeSongs = songs || [];

  useEffect(() => {
    setOriginalSongs(safeSongs); 
    setShuffledSongs(safeSongs); 
  }, [safeSongs]);

  useEffect(() => {
 
    
  }, [safeSongs]);


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

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = currentVolume; 
      } else {
        audioRef.current.volume = 0; 
      }
      setIsMuted(!isMuted); 
    }
  };

  
  const handleAudioEnd = () => {
    if (isLooping) {
      // If loop is enabled, restart the song
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    } else {
      // Move to the next song
      handleNext();
    }
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
      audioRef.current.src = currentSong.file||currentSong.preview_url;
      audioRef.current.load();
      setIsPlaying(true); // Automatically set isPlaying to true
      audioRef.current.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
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

  // Function to handle Next song
  const handleNext = () => {
    if (shuffledSongs.length === 0) return; // Prevent errors if there are no songs
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= shuffledSongs.length) {
      nextIndex = 0; // Loop back to first song if at the end
    }
    setCurrentSongIndex(nextIndex);
    onSongChange(shuffledSongs[nextIndex]); // Notify parent to change song
  };


  // Function to handle Previous song
  const handlePrev = () => {
    if (shuffledSongs.length === 0) return; // Prevent errors if there are no songs
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) {
      prevIndex = shuffledSongs.length - 1; // Loop back to last song if at the beginning
    }
    setCurrentSongIndex(prevIndex);
    onSongChange(shuffledSongs[prevIndex]); // Notify parent to change song
  };

  // Function to shuffle songs
  const handleShuffle = () => {
    setIsShuffling(!isShuffling);
    if (!isShuffling) {
      // Shuffle the songs when activated
      const shuffled = [...originalSongs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
      }
      setShuffledSongs(shuffled);
      setCurrentSongIndex(0); // Reset to the first song after shuffle
      onSongChange(shuffled[0]); // Start with the first song in shuffled list
    } else {
      // Revert back to the original order
      setShuffledSongs(originalSongs);
      setCurrentSongIndex(0); // Reset to the first song in original list
      onSongChange(originalSongs[0]); // Start with the first song in original list
    }
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 flex justify-between items-center bg-black p-4 rounded-t shadow-lg z-50'>
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
        <img className='w-12 h-12 rounded-lg border-2 border-gray-600' src={currentSong ? currentSong.image : rhythmiq} 
        alt={currentSong ? currentSong.title : "No song playing"} />
      </div>
      <div className='flex flex-col items-center gap-1 ml-20'>
      <div className='flex gap-4 items-center'>
  <IoShuffle
    className='w-6 h-6 cursor-pointer text-white'
    onClick={handleShuffle}
    style={{ transform: isShuffling ? 'rotate(180deg)' : 'none' }} // Optionally rotate on shuffle
  />
  <IoMdSkipBackward
    className='w-5 h-5 cursor-pointer text-white' // Ensure consistent size with w-6 h-6
    onClick={handlePrev}
  />
  {isPlaying ? (
    <IoIosPause className='w-6 h-6 cursor-pointer text-white' onClick={handlePlayPause} />
  ) : (
    <FaPlay className='w-4 h-5 cursor-pointer text-white' onClick={handlePlayPause} />
  )}
  <IoMdSkipForward
    className='w-5 h-5 cursor-pointer text-white'
    onClick={handleNext}
  />
  <SlLoop
    className={`w-6 h-6 cursor-pointer text-white ${isLooping ? 'text-green-500' : 'text-white'}`}
    onClick={() => setIsLooping(!isLooping)}
  />
</div>


        <div className='flex items-center gap-5'>
          <p className="text-white">{formatTime(currentTime)}</p>
          <div className='relative w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer' onClick={handleProgressClick}>
            <div className='h-1 bg-teal-500 rounded-full'></div>
            <div className='h-1 bg-teal-600 rounded-full' style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            
            <div
              className="absolute w-3 h-3 bg-gray-600 rounded-full"
              style={{ left: `${(currentTime / duration) * 100}%`, top: '-1px', transform: 'translateX(-50%)' }} // Adjust 'top' to align with the progress line
            ></div>
          </div>
          <p className="text-white">{formatTime(duration)}</p>
        </div>
      </div>
      <div className='hidden lg:flex items-center gap-2 opacity-75'>
      {isMuted ? ( <IoVolumeMuteOutline className="w-5 h-5 cursor-pointer text-white" onClick={toggleMute} />) 
      : 
      ( <IoVolumeHighOutline className="w-5 h-5 cursor-pointer text-white" onClick={toggleMute} />)
        }
       
        {/* <img className='w-4 cursor-pointer ml-10' src={isMuted ? FaVolumeMute : FaVolumeUp} alt='volume' onClick={toggleMute} /> */}


        
        <div className='relative w-20 h-1 bg-slate-50 rounded cursor-pointer' 
            onClick={handleVolumeClick} onWheel={handleVolumeScroll}>
        <div className="absolute top-0 left-0 h-full rounded"
            style={{ width: `${currentVolume * 100}%`, backgroundColor: '#006161' }}>
          </div>

        <div className="absolute w-3 h-3 bg-gray-500 rounded-full"
          style={{ left: `${currentVolume * 100}%`, top: '1px', transform: 'translateY(-55%)' }}>
      </div>
      </div>

        <img className='ml-10 mr-7 cursor-pointer' 
        style={{ filter: 'invert(1)', width: '32px', height: '32px' }} 
        src={isZoomed ? shrink : zoom}  alt={isZoomed ? 'shrink' : 'zoom'} onClick={toggleImage}
      />

      </div>
</div>

      
    
  );
};

export default MusicPlayer;

const formatTime = (time) => {
  const minutes = Math.floor(time / 60); // Get minutes
  const seconds = Math.floor(time % 60); // Get remaining seconds
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};
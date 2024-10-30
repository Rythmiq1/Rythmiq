import React, { useEffect, useState } from 'react';
import logo from "../assets/images/Rhythmiq-bg.ico";
import IconText from '../components/IconText';
import TextWithHover from '../components/TextWithHover';

const focusCardsData = [
  { 
    title: "Peaceful Piano",
    description: "Relax and indulge with beautiful piano pieces",
    imgUrl: "https://images.unsplash.com/photo-1730135974091-c6e8349db0a3?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Deep Focus",
    description: "Keep calm and focus with ambient and post-rock",
    imgUrl: "https://plus.unsplash.com/premium_photo-1682125853703-896a05629709?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Instrumental Study",
    description: "Instrumental beats to help you concentrate",
    imgUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Lofi Beats",
    description: "Chilled Lofi beats for studying or relaxing",
    imgUrl: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?q=80&w=1898&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    title: "Nature Sounds",
    description: "Connect with nature to focus and unwind",
    imgUrl: "https://media.istockphoto.com/id/483495210/photo/concert-crowd.jpg?s=2048x2048&w=is&k=20&c=tZG4ZBYp7ohE4Qwa-SA8CzGPjdmd4UTmnnVNr1X39go="
  }
];

const SpotifyPlaylistCardsData = [...focusCardsData]; // Assuming both arrays are similar for now

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  return (
    <div className="h-screen w-screen flex">
      <div className="h-screen w-1/5 bg-black flex flex-col justify-between pb-10">
        <div>
          <div className="logoDiv p-6">
            <img src={logo} alt="logo" className="w-40 h-25 cursor-pointer" />
          </div>
          <div className="py-5">
            <IconText iconName="home" displayText="Home" active />
            <IconText iconName="search" displayText="Search" />
            <IconText iconName="library_music" displayText="Your Library" />
          </div>
          <div className="pt-5 space-y-2">
            <IconText iconName="library_add" displayText="Create Playlist" />
            <IconText iconName="favorite" displayText="Liked Songs" />
          </div>
        </div>

        <div className="px-5 pb-5 text-white">
          <div className="flex items-center justify-start border border-gray-100 text-white w-3/4 rounded-full px-2 py-1 hover:border-white cursor-pointer transition-colors duration-200">
            <IconText iconName="public" displayText="English" />
          </div>
          <div className="mt-4 text-gray-400 text-xs space-y-1">
            {["About Us", "Cookies", "Privacy Center", "Privacy Policy", "Legal"].map((text, index) => (
              <p 
                key={index} 
                className="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="h-screen w-4/5 bg-app-black overflow-auto">
        <div className="navbar flex items-center justify-end w-full h-1/10 bg-black bg-opacity-30 text-white px-6 space-x-6">
          <div className="flex items-center space-x-4">
            <TextWithHover displayText="Premium" />
            <TextWithHover displayText="Support" />
            <TextWithHover displayText="Download" />
          </div>
          <div className="h-6 border-l-2 border-gray-400"></div>
          <div className="flex items-center space-x-4">
            <TextWithHover displayText="Sign up" />
            <button className="bg-white text-black font-bold px-4 py-1 rounded-full hover:bg-gray-200 transition">Log In</button>
          </div>
        </div>

        <div className="content p-8 pt-0 overflow-auto">
          <PlayListView titleText={"Focus"} cardData={focusCardsData}/>
          <PlayListView titleText={"Spotify Playlist"} cardData={SpotifyPlaylistCardsData}/>
          <PlayListView titleText={"Sound Of India"} cardData={focusCardsData}/>
        </div>
      </div>
    </div>
  );
}

const PlayListView = ({ titleText, cardData }) => {
  return (
    <div className='text-white mt-8'>
      <div className='text-2xl font-semibold mb-5'>{titleText}</div>
      <div className='w-full flex justify-between space-x-4'>
        {cardData.map((item, index) => (
          <Card 
            key={index} // Add key for better performance and to avoid warnings
            title={item.title}
            description={item.description} 
            imgUrl={item.imgUrl}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, description, imgUrl }) => {
  return (
    <div className='bg-black bg-opacity-40 w-1/5 px-4 py-2 rounded-lg'>
      <div className='pb-4 pt-2'>
        <img className='w-full rounded-md' src={imgUrl} alt={title} /> {/* Use title for better accessibility */}
      </div>
      <div className='text-white font-semibold py-3'>{title}</div>
      <div className='text-gray-500 text-sm'>{description}</div>
    </div>
  );
};

export default Home;

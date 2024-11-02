import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const focusCardsData = [
  { 
    id: 1,
    title: "Peaceful Piano",
    description: "Relax and indulge with beautiful piano pieces",
    imgUrl: "https://images.unsplash.com/photo-1730135974091-c6e8349db0a3?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    id: 2,
    title: "Deep Focus",
    description: "Keep calm and focus with ambient and post-rock",
    imgUrl: "https://plus.unsplash.com/premium_photo-1682125853703-896a05629709?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    id: 3,
    title: "Instrumental Study",
    description: "Instrumental beats to help you concentrate",
    imgUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    id: 4,
    title: "Lofi Beats",
    description: "Chilled Lofi beats for studying or relaxing",
    imgUrl: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?q=80&w=1898&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { 
    id: 5,
    title: "Nature Sounds",
    description: "Connect with nature to focus and unwind",
    imgUrl: "https://media.istockphoto.com/id/483495210/photo/concert-crowd.jpg?s=2048x2048&w=is&k=20&c=tZG4ZBYp7ohE4Qwa-SA8CzGPjdmd4UTmnnVNr1X39go="
  }
];

const SpotifyPlaylistCardsData = [...focusCardsData];

function Display() {
  const navigate = useNavigate();
  return (
    <div>
      <PlayListView titleText={"Focus"} cardData={focusCardsData}/>
      <PlayListView titleText={"Spotify Playlist"} cardData={SpotifyPlaylistCardsData}/>
      <PlayListView titleText={"Sound Of India"} cardData={focusCardsData}/>
    </div>
  );
}

const PlayListView = ({ titleText, cardData }) => {
  return (
    <div className='text-white mt-8'>
      <div className='text-2xl font-semibold mb-5'>{titleText}</div>
      <div className='w-full flex overflow-x-auto space-x-4 scrollbar-hide'>
        {cardData.map((item) => (
          <NavLink to={`/home/album/${item.id}`} key={item.id}>
            <Card 
              title={item.title}
              description={item.description} 
              imgUrl={item.imgUrl}
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, description, imgUrl }) => {
  return (
    <div className='bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 scrollbar-hide'>
      <img src={imgUrl} alt={title} className='w-full h-40 object-cover rounded-md' />
      <div className='mt-2'>
        <h3 className='text-lg font-semibold text-white'>{title}</h3>
        <p className='text-gray-400'>{description}</p>
      </div>
    </div>
  );
}

export default Display;
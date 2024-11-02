import React from 'react';
import { useNavigate } from 'react-router-dom';

function AlbumItem({ image, name, desc, id }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/album/${id}`)} 
      className='min-w-[180px] p-2 px-3 rounded cursor-pointer bg-black bg-opacity-40 hover:bg-opacity-50 transition duration-200'
    >
      <img className='rounded' src={image} alt={name} />
      <p className='font-bold mt-2 mb-1'>{name}</p>
      <p className='text-slate-200 text-sm'>{desc}</p>
    </div>
  );
}

export default AlbumItem;

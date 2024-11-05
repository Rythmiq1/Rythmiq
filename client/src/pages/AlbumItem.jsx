import React from 'react';
import { useNavigate } from 'react-router-dom';


const AlbumItem = ({ id, name, desc, image }) => {
    const navigate = useNavigate();
    return (
        < div onClick = {()=>navigate(`/home/album/${id}`)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
            
                <img src={image} alt={name} className="w-40 h-40 rounded" />
                <h3 className="text-white">{name}</h3>
                <p className="text-gray-400">{desc}</p>
            
        </div>
    );
};

export default AlbumItem;

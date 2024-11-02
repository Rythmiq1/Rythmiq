import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const url = 'http://localhost:8080';

const ListAlbum = () => {
  const [data, setData] = useState([]);

  const fetchAlbums = async () => {
    try {
      // Corrected template literal for the URL
      const response = await axios.get(`${url}/album/list`);

      if (response.data.success) {
        setData(response.data.albums);
      }
    } catch (error) {
      toast.error("Error occurred while fetching albums.");
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`${url}/album/remove`, { id });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      }
    } catch (error) {
      toast.error("Error occurred while removing album.");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p>All Albums List</p>
      <br />
      <div className=''>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr]
         items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Colour</b>
          <b>Action</b>
        </div>
        {data.map((item, index) => 
        {
          return (
            <div key={index} className='grid grid-cols-[1fr_1fr_1fr] 
            sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border
             border-gray-300 text-sm mr-5'>
              <img className='w-12' src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <input type="color" value={item.bgColour} readOnly />
              <p className='cursor-pointer' onClick={() => removeAlbum(item._id)}>x</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListAlbum;

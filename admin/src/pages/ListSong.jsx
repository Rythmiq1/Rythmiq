import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ListSong = () => {
  const [data, setData] = useState([]);
  const url = 'http://localhost:8080';

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/song/list`);
      console.log(response);

      if (response.data.success) {
        setData(response.data.songs);
      } else {
        toast.error("Failed to fetch songs.");
      }
    } catch (error) {
      console.error("Fetch songs error:", error); // Log the actual error
      toast.error("An error occurred while fetching songs.");
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.post(`${url}/song/remove`, { id });
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSongs(); // Refresh the song list after removal
      } else {
        toast.error("Failed to remove song.");
      }
    } catch (error) {
      console.error("Remove song error:", error); // Log the actual error
      toast.error("An error occurred while removing the song.");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {data.map((item) => (
          <div key={item._id} className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5'>
            <img className='w-12' src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.album ? item.album.name : "N/A"}</p> {/* Handle cases where album might not exist */}
            <p>{item.duration}</p>
            <p className='cursor-pointer' onClick={() => removeSong(item._id)}>x</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListSong;

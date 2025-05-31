import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";

const ListSong = () => {
  const [data, setData] = useState([]);
  const url = `${BASE_URL}`;

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/song/list`);
      if (response.data.success) {
        setData(response.data.songs);
      } else {
        toast.error("Failed to fetch songs.");
      }
    } catch {
      toast.error("An error occurred while fetching songs.");
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.post(`${url}/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSongs();
      } else {
        toast.error("Failed to remove song.");
      }
    } catch {
      toast.error("An error occurred while removing the song.");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Songs</h1>
      <div className="hidden sm:grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-4 p-4 bg-gray-100 border border-gray-200 rounded-md text-gray-700 text-sm">
        <span className="font-semibold">Image</span>
        <span className="font-semibold">Name</span>
        <span className="font-semibold">Album</span>
        <span className="font-semibold">Duration</span>
        <span className="font-semibold">Action</span>
      </div>
      <div className="space-y-4 mt-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex flex-col sm:grid sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-4 p-4">
              <img
                className="w-12 h-12 object-cover rounded-md"
                src={item.image}
                alt={item.name}
              />
              <p className="text-gray-800 font-medium">{item.name}</p>
              <p className="text-gray-600">
                {item.album ? item.album.name : "N/A"}
              </p>
              <p className="text-gray-600">{item.duration}</p>
              <button
                onClick={() => removeSong(item._id)}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSong;

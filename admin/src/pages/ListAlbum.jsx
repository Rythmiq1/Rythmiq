import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config";
const url = `${BASE_URL}`;

const ListAlbum = () => {
  const [data, setData] = useState([]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/album/list`);
      if (response.data.success) {
        setData(response.data.albums);
      }
    } catch {
      toast.error("Error occurred while fetching albums.");
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await axios.delete(`${url}/album/remove`, { data: { id } });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      }
    } catch {
      toast.error("Error occurred while removing album.");
    }
  };

  const removeSong = async (albumId, songId) => {
    try {
      const response = await axios.post(`${url}/song/remove`, { albumId, songId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      }
    } catch {
      toast.error("Error occurred while removing song.");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Albums</h1>
      <div className="hidden sm:grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr] items-center gap-4 p-4 bg-gray-100 border border-gray-200 rounded-md text-gray-700 text-sm">
        <span className="font-semibold">Image</span>
        <span className="font-semibold">Name</span>
        <span className="font-semibold">Description</span>
        <span className="font-semibold">Color</span>
        <span className="font-semibold">Actions</span>
      </div>
      <div className="space-y-4 mt-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex flex-col sm:grid sm:grid-cols-[0.5fr_1fr_2fr_1fr_1fr] items-center gap-4 p-4">
              <img
                className="w-12 h-12 object-cover rounded-md"
                src={item.image}
                alt={item.name}
              />
              <p className="text-gray-800 font-medium">{item.name}</p>
              <p className="text-gray-600">{item.desc}</p>
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-md border border-gray-300"
                  style={{ backgroundColor: item.bgColour }}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => removeAlbum(item._id)}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                >
                  Delete Album
                </button>
                {item.songs && item.songs.length > 0 && (
                  <details className="w-full">
                    <summary className="px-3 py-1 bg-teal-500 text-white text-xs rounded cursor-pointer hover:bg-teal-600 transition">
                      View Songs ({item.songs.length})
                    </summary>
                    <div className="mt-2 space-y-2">
                      {item.songs.map((song) => (
                        <div
                          key={song._id}
                          className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded px-3 py-2"
                        >
                          <span className="text-gray-700 text-sm">{song.name}</span>
                          <button
                            onClick={() => removeSong(item._id, song._id)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAlbum;

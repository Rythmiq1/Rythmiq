import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config";

const url = `${BASE_URL}`;

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Helper to get token or redirect if missing
  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("You must be logged in as admin to view albums.");
      navigate("/login");
      return null;
    }
    return token;
  };

  // Fetch all albums with Authorization header
  const fetchAlbums = async () => {
    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      const response = await axios.get(`${url}/album/list`, {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        setData(response.data.albums);
      } else {
        toast.error(response.data.message || "Failed to fetch albums.");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 403) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        toast.error("Error occurred while fetching albums.");
      }
    }
  };

  // Remove an album by ID (DELETE) with Authorization header
  const removeAlbum = async (id) => {
    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      const response = await axios.delete(`${url}/album/remove`, {
        data: { id },
        headers: { Authorization: token },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      } else {
        toast.error(response.data.message || "Failed to remove album.");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 403) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        toast.error("Error occurred while removing album.");
      }
    }
  };

  // Remove a song from an album (POST) with Authorization header
  const removeSong = async (albumId, songId) => {
    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      const response = await axios.post(
        `${url}/song/remove`,
        { albumId, songId },
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums();
      } else {
        toast.error(response.data.message || "Failed to remove song.");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 403) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        toast.error("Error occurred while removing song.");
      }
    }
  };

  // On component mount, fetch albums
  useEffect(() => {
    fetchAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Albums</h1>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr] items-center gap-4 p-4 bg-gray-100 border border-gray-200 rounded-md text-gray-700 text-sm">
        <span className="font-semibold">Image</span>
        <span className="font-semibold">Name</span>
        <span className="font-semibold">Description</span>
        <span className="font-semibold">Color</span>
        <span className="font-semibold">Actions</span>
      </div>

      {/* Album List */}
      <div className="space-y-4 mt-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex flex-col sm:grid sm:grid-cols-[0.5fr_1fr_2fr_1fr_1fr] items-center gap-4 p-4">
              {/* Album Image */}
              <img
                className="w-12 h-12 object-cover rounded-md"
                src={item.image}
                alt={item.name}
              />

              {/* Album Name */}
              <p className="text-gray-800 font-medium">{item.name}</p>

              {/* Album Description */}
              <p className="text-gray-600">{item.desc}</p>

              {/* Album Color Preview */}
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-md border border-gray-300"
                  style={{ backgroundColor: item.bgColour }}
                />
              </div>

              {/* Actions: Delete album & View / remove songs */}
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

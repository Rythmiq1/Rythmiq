import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config";

const ListSong = () => {
  const [data, setData] = useState([]);
  const url = `${BASE_URL}`;
  const navigate = useNavigate();

  // Helper to get token or redirect if missing
  const getTokenOrRedirect = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("You must be logged in as admin to view songs.");
      navigate("/login");
      return null;
    }
    return token;
  };

  // Fetch all songs with Authorization header
  const fetchSongs = async () => {
    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      const response = await axios.get(`${url}/song/list`, {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        setData(response.data.songs);
      } else {
        toast.error(response.data.message || "Failed to fetch songs.");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 403) {
        toast.error("Unauthorized. Please login again.");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        toast.error("An error occurred while fetching songs.");
      }
    }
  };

  // Remove a song by ID (POST) with Authorization header
  const removeSong = async (id) => {
    const token = getTokenOrRedirect();
    if (!token) return;

    try {
      const response = await axios.post(
        `${url}/song/remove`,
        { id },
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchSongs();
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
        toast.error("An error occurred while removing the song.");
      }
    }
  };

  // On component mount, fetch songs
  useEffect(() => {
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Songs</h1>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-4 p-4 bg-gray-100 border border-gray-200 rounded-md text-gray-700 text-sm">
        <span className="font-semibold">Image</span>
        <span className="font-semibold">Name</span>
        <span className="font-semibold">Album</span>
        <span className="font-semibold">Duration</span>
        <span className="font-semibold">Action</span>
      </div>

      {/* Song List */}
      <div className="space-y-4 mt-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex flex-col sm:grid sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-4 p-4">
              {/* Song Image */}
              <img
                className="w-12 h-12 object-cover rounded-md"
                src={item.image}
                alt={item.name}
              />

              {/* Song Name */}
              <p className="text-gray-800 font-medium">{item.name}</p>

              {/* Song's Album Name */}
              <p className="text-gray-600">
                {item.album ? item.album.name : "N/A"}
              </p>

              {/* Song Duration */}
              <p className="text-gray-600">{item.duration}</p>

              {/* Remove Button */}
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

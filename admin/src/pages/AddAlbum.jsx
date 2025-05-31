import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../config";
import upload_area from "../assets/upload_area.png";

const url = `${BASE_URL}`;

const AddAlbum = () => {
  const [image, setImage] = useState(null);
  const [colour, setColour] = useState("#ffffff");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to get the token or redirect to login
  const getTokenOrRedirect = () => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      toast.error("You must be logged in as admin to access this page.");
      navigate("/login"); // adjust if your login route is different
      return null;
    }
    return token;
  };

  // On mount, check if token exists; if not, redirect
  useEffect(() => {
    getTokenOrRedirect();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const token = getTokenOrRedirect();
    if (!token) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("bgColour", colour);

      const response = await axios.post(`${url}/album/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      if (response.data.success) {
        toast.success("Album Added");
        setName("");
        setDesc("");
        setColour("#ffffff");
        setImage(null);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 403) {
        toast.error("Unauthorized. Please login again.");
        sessionStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        toast.error("Error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Add New Album</h2>
        <form onSubmit={onSubmitHandler} className="space-y-5">
          {/* Upload Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="sr-only"
            />
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-teal-500 transition-colors"
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-full object-contain rounded-md"
                />
              ) : (
                <img src={upload_area} alt="Upload" className="h-16" />
              )}
              <span className="mt-2 text-sm text-gray-500">
                {image ? image.name : "Click to upload or drag and drop"}
              </span>
            </label>
          </div>

          {/* Album Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Album Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter album name"
              className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Album Description */}
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
              Album Description
            </label>
            <textarea
              id="desc"
              name="desc"
              rows="3"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter album description"
              className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
          </div>

          {/* Background Colour Picker */}
          <div className="flex items-center space-x-4">
            <label htmlFor="colour" className="block text-sm font-medium text-gray-700">
              Background Colour
            </label>
            <input
              id="colour"
              name="colour"
              type="color"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className="w-10 h-10 p-0 border-0 cursor-pointer"
            />
            <div
              className="w-10 h-10 rounded-md border border-gray-300"
              style={{ backgroundColor: colour }}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          >
            ADD ALBUM
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddAlbum;

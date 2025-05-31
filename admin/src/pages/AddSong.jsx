import React, { useEffect, useState } from "react";
import upload_song from "../assets/upload_song.png";
import upload_area from "../assets/upload_area.png";
import upload_added from "../assets/upload_added.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BASE_URL from "../config";
const url = `${BASE_URL}`;

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [artist, setArtist] = useState("none");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const [artistData, setArtistData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumResponse = await axios.get(`${url}/album/list`);
        if (albumResponse.data.success) {
          setAlbumData(albumResponse.data.albums);
        } else {
          toast.error("Failed to fetch albums.");
        }
        const artistResponse = await axios.get(`${url}/artist/artists`);
        if (artistResponse.data.success) {
          setArtistData(artistResponse.data.data);
        } else {
          toast.error("Failed to fetch artists.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);
      formData.append("artist", artist);
      formData.append("type", type);
      const response = await axios.post(`${url}/song/add`, formData);
      if (response.data.success) {
        toast.success("Song Added Successfully");
        setName("");
        setDesc("");
        setAlbum("none");
        setArtist("none");
        setType("");
        setImage(null);
        setSong(null);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Add New Song</h2>
        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label htmlFor="song" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Song
            </label>
            <input
              id="song"
              name="song"
              type="file"
              accept="audio/*"
              onChange={(e) => setSong(e.target.files[0])}
              className="sr-only"
            />
            <label
              htmlFor="song"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-teal-500 transition-colors"
            >
              {song ? (
                <img src={upload_added} alt="Uploaded" className="h-12" />
              ) : (
                <img src={upload_song} alt="Upload Song" className="h-12" />
              )}
              <span className="mt-2 text-sm text-gray-500">
                {song ? song.name : "Click to upload or drag and drop"}
              </span>
            </label>
          </div>

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
                <img src={upload_area} alt="Upload Area" className="h-12" />
              )}
              <span className="mt-2 text-sm text-gray-500">
                {image ? image.name : "Click to upload or drag and drop"}
              </span>
            </label>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Song Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter song name"
              className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
              Song Description
            </label>
            <textarea
              id="desc"
              name="desc"
              rows="3"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter song description"
              className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Song Type
            </label>
            <select
              id="type"
              name="type"
              onChange={(e) => setType(e.target.value)}
              value={type}
              required
              className="block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select Type</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="energetic">Energetic</option>
              <option value="calm">Calm</option>
              <option value="romantic">Romantic</option>
              <option value="uplifting">Uplifting</option>
              <option value="melancholy">Melancholy</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="album" className="block text-sm font-medium text-gray-700">
              Album
            </label>
            <select
              id="album"
              name="album"
              onChange={(e) => setAlbum(e.target.value)}
              value={album}
              className="block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="none">None</option>
              {albumData.length > 0 ? (
                albumData.map((albumItem) => (
                  <option key={albumItem._id} value={albumItem._id}>
                    {albumItem.name}
                  </option>
                ))
              ) : (
                <option disabled>No albums available</option>
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
              Artist
            </label>
            <select
              id="artist"
              name="artist"
              onChange={(e) => setArtist(e.target.value)}
              value={artist}
              className="block w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="none">None</option>
              {artistData.length > 0 ? (
                artistData.map((artistItem) => (
                  <option key={artistItem._id} value={artistItem._id}>
                    {artistItem.name}
                  </option>
                ))
              ) : (
                <option disabled>No artists available</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          >
            SUBMIT
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddSong;

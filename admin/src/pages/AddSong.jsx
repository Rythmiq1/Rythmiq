import React, { useEffect, useState } from 'react';
import upload_song from '../assets/upload_song.png';
import upload_area from '../assets/upload_area.png';
import upload_added from '../assets/upload_added.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const url = "http://localhost:8080";

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  // Fetch album data when component mounts
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`${url}/album/list`); // Adjust the URL according to your API
        if (response.data.success) {
          setAlbumData(response.data.albums); // Assuming the API returns an array of albums
        } else {
          toast.error("Failed to load albums");
        }
      } catch (error) {
        toast.error("Error occurred while fetching albums");
      }
    };
    
    fetchAlbums();
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

      // Calling API
      const response = await axios.post(`${url}/song/add`, formData);

      if (response.data.success) {
        toast.success("Song Added");
        setName("");
        setDesc("");
        setAlbum("none");
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
    <div className='grid place-items-center min-h-[80vh]'>
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-black'>
      <div className='flex flex-col gap-8'>
        <div className="flex flex-col gap-4">
          <p>Upload song</p>
          <input onChange={(e) => setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />
          <label htmlFor="song">
            <img src={song ? upload_added : upload_song} className='w-24 cursor-pointer' alt="Upload Song" />
          </label>
        </div>

        <div className='flex flex-col gap-4'>
          <p>Upload Image</p>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : upload_area} className='w-24 cursor-pointer' alt="Upload Image" />
          </label>
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Song name</p>
          <input onChange={(e) => setName(e.target.value)} value={name}
            className='bg-transparent border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'
            type="text"
            placeholder='Type here'
            required
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Song Description</p>
          <input onChange={(e) => setDesc(e.target.value)} value={desc}
            className='bg-transparent border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'
            type="text"
            placeholder='Type here'
            required
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Album</p>
          <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent border-2 border-black p-2.5 w-[max(40vw,250px)]'>
            <option value="none">None</option>
            {albumData.map((albumItem) => (
              <option key={albumItem.id} value={albumItem.id}>{albumItem.name}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="bg-black text-white p-2 rounded">Submit</button>
      <ToastContainer />
    </form>
  );
}

export default AddSong;

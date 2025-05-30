import React, { useState } from 'react';
import upload_area from '../assets/upload_area.png';
import { toast } from 'react-toastify';
import axios from 'axios';
import BASE_URL from "../config"; 
const url = `${BASE_URL}`;

const AddAlbum = () => {
  const [image, setImage] = useState(null); // Use null instead of false for file input
  const [colour, setColour] = useState("#ffffff"); // Store color here
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("desc", desc);
        formData.append("image", image); // Ensure `image` is properly set
        formData.append("bgColour", colour); // Use `colour` here

        console.log('Form Data:', {
            name,
            desc,
            colour, // Use `colour` in console log
            image: image ? image.name : "No image selected"
        });

        const response = await axios.post(`${url}/album/add`, formData);

        if (response.data.success) {
            toast.success("Album Added");
            setName("");
            setDesc("");
            setColour("#ffffff"); // Reset colour to default
            setImage(null); // Reset image
        } else {
            toast.error("Something went wrong");
        }
    } catch (error) {
        console.error("Error occurred:", error.response ? error.response.data : error.message);
        toast.error("Error occurred");
    } finally {
        setLoading(false);
    }
};

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
      <div className="flex flex-col gap-4">
        <p>Upload Image</p>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
        <label htmlFor="image">
          <img className='w-24 cursor-pointer' src={image ? URL.createObjectURL(image) : upload_area} alt="Upload Album" />
        </label>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album name</p>
        <input className='bg-transparent border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' 
          onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Type here' required />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album description</p>
        <input className='bg-transparent border-gray-400 p-2.5 w-[max(40vw,250px)]' 
          onChange={(e) => setDesc(e.target.value)} value={desc} type="text" placeholder='Type here' required />
      </div>

      <div className="flex flex-col gap-3">
        <p>Background Colour</p>
        <input onChange={(e) => setColour(e.target.value)} value={colour} type="color" />
      </div>

      <button className='text-base bg-black text-white py-2.5 px-14 cursor-pointer' type='submit'>ADD</button>
    </form>
  );
};

export default AddAlbum;

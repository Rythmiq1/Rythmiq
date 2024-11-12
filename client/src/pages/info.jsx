import React from 'react';
import jatin1 from "../assets/jatin1.jpeg";
import yashi from "../assets/yashi.jpg";
import kitty from "../assets/kitty.jpg";
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

function Info() {
  return (
    <div className="ml-2 rounded-lg min-h-screen flex flex-row gap-10 items-center justify-center bg-gradient-to-b from-[#006161] to-black text-white">


      <div className="w-[400px] h-[500px] max-w-sm shadow-xl p-10 rounded-lg bg-transparent bg-opacity-15 relative overflow-hidden 
      flex flex-col items-center text-center space-y-6 gas xe" >
        
      <img src={jatin1} alt="Jatin Rajput" className="w-40 h-40 object-cover rounded-full transform hover:scale-110 transition duration-300 hover:border-white transition duration-300" />

        
        <h1 className="text-3xl font-bold text-white">Jatin Rajput</h1>
        <p className="text-lg text-gray-300"></p>
        
        <div className="flex space-x-5 ">
          <a href="mailto:your-email@example.com" target="_blank" rel="noopener noreferrer">
            <FaEnvelope className="text-4xl text-white" />
          </a>
          <a href="https://www.linkedin.com/in/jatin31195/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-4xl text-white" />
          </a>
          <a href="https://github.com/jatin31195" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-4xl text-white" />
          </a>
        </div>
      </div>

      {/* Yashika's Card */}
      <div className="w-[400px] h-[500px] max-w-sm shadow-xl p-10 rounded-lg bg-transparent bg-opacity-15 relative
       overflow-hidden flex flex-col items-center text-center space-y-6 gas xe"
     >
        <img src={yashi} alt="Yashika Jain" className="w-40 h-40 object-cover rounded-full transform hover:scale-110 transition duration-300" />
        
        <h1 className="text-3xl font-bold text-white">Yashika Jain</h1>
        <p className="text-lg text-gray-300"></p>
        
        <div className="flex space-x-5">
          <a href="mailto:yashika.2023ca116@mnnit.ac.in" target="_blank" rel="noopener noreferrer">
            <FaEnvelope className="text-4xl text-white" />
          </a>
          <a href="https://www.linkedin.com/in/yashika-jain-055a28281/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-4xl text-white" />
          </a>
          <a href="https://github.com/yashika532" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-4xl text-white" />
          </a>
        </div>
      </div>

      {/* Sneha's Card */}
      <div className="w-[400px] h-[500px] max-w-sm shadow-xl p-10 rounded-lg bg-transparent bg-opacity-15 relative overflow-hidden 
      flex flex-col items-center text-center space-y-6 gas xe">
        
        <img src={kitty} alt="Sneha Agrawal" className="w-40 h-40 object-cover rounded-full transform hover:scale-110 transition duration-300" />
        
        <h1 className="text-3xl font-bold text-white">Sneha Agrawal</h1>
        <p className="text-lg text-gray-300"></p>
        
        <div className="flex space-x-5">
          <a href="mailto:sneha.2023ca98@mnnit.ac.in">
            <FaEnvelope className="text-4xl text-white" />
          </a>
          <a href="https://www.linkedin.com/in/sneha-agrawal-bb0a0519b" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-4xl text-white" />
          </a>
          <a href="https://github.com/snehaa14" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-4xl text-white" />
          </a>
        </div>
      </div>

    </div>
  );
}

export default Info;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const genres = [
    { name: 'Lata Mangeshkar', image: 'https://static.toiimg.com/thumb/msid-89386079,imgsize-36578,width-900,height-1200,resizemode-6/89386079.jpg' },
    { name: 'A. R. Rahman', image: 'https://i.pinimg.com/736x/8a/33/7e/8a337e8142145d98801ea4a5700d60fb.jpg' },
    { name: 'Kishore Kumar', image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/d/c/x/small-spos13840-poster-the-legend-kishore-kumar-bollywood-singer-original-imaggefk7khzfyzm.jpeg?q=90&crop=false' },
    { name: 'Honey Singh', image: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2016/05/443612830.jpg' },
    { name: 'Shreya Ghoshal', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpaVXXBJVyeM4Sz1pzvCdML4N0NCDqthV6BQ&s' },
    { name: 'Arijit Singh', image: 'https://static.toiimg.com/thumb/imgsize-23456,msid-92037952,width-600,resizemode-4/92037952.jpg' },
    { name: 'Pandit Ravi Shankar', image: 'https://images.medindia.net/amp-images/health-images/pandit-ravi-shankar.jpg' },
    { name: 'Sonu Nigam', image: 'https://e1.pxfuel.com/desktop-wallpaper/592/168/desktop-wallpaper-indian-singer-sonu-nigam-sonu-nigam.jpg' },
    { name: 'Asha Bhosle', image: 'https://c.saavncdn.com/artists/Asha_Bhosle_002_20200212082318_500x500.jpg' },
    { name: 'Badshah', image: 'https://i.pinimg.com/236x/37/10/17/371017deac0b8b4949b2fbd0ec3f3b02.jpg' },
];

const GenreSelector = ({ userId }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        if (!userId) {
            console.error("User ID is not available. Please log in.");
            setErrorMessage("User ID is not available. Please log in.");
        } else {
            setErrorMessage('');
        }
    }, [userId]);

    const handleGenreClick = (genre) => {
        setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token);

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        const requestBody = { genreIds: selectedGenres };
        console.log('Submitting genres:', requestBody);

        try {
            const response = await fetch('http://localhost:8080/auth/select-genres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); 
            console.log('Success:', data);
            navigate('/home'); // Navigate to home page on success
        } catch (error) {
            console.error('Error updating interests:', error.message);
        }
    };

    if (!userId) {
        return (
            <div>
                <h1>Select Genres</h1>
                <p>{errorMessage}</p>
                <p>Please log in to select genres.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg bg-gray-100">
            <h1 className="text-center text-2xl font-semibold mb-4">Select Genres</h1>
            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
            <div className="flex flex-wrap gap-8 justify-center">
                {genres.map((genre) => (
                    <div 
                        key={genre.name}
                        onClick={() => handleGenreClick(genre.name)}
                        className={`cursor-pointer text-center w-28 p-1 rounded-full bg-white border-4 
                            ${selectedGenres.includes(genre.name) ? 'border-green-500' : 'border-white'} shadow-md`}
                    >
                        <img
                            src={genre.image}
                            alt={genre.name}
                            className="w-24 h-24 rounded-full border-4 border-white mb-2"
                        />
                        <p className="text-sm font-bold">{genre.name}</p>
                    </div>
                ))}
            </div>
            <button 
                onClick={handleSubmit} 
                className="mt-6 block mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Submit Genres
            </button>
        </div>
    );
};

export default GenreSelector;

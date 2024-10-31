import React, { useEffect, useState } from 'react';

const GenreSelector = ({ userId }) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Check if userId is available
    useEffect(() => {
        if (!userId) {
            console.error("User ID is not available. Please log in.");
            setErrorMessage("User ID is not available. Please log in.");
        } else {
            setErrorMessage(''); // Clear error message if userId is present
        }
    }, [userId]);

    const handleGenreChange = (genre) => {
        // Toggle genre selection
        setSelectedGenres((prev) => {
            if (prev.includes(genre)) {
                return prev.filter((g) => g !== genre);
            } else {
                return [...prev, genre];
            }
        });
    };

    const handleSubmit = async () => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Log the token for debugging purposes
        console.log('Retrieved token:', token);

        // Check if the token is available
        if (!token) {
            console.error('Token not found in local storage');
            return; // Exit if no token is found
        }

        // Prepare the request body with selected genre IDs
        const requestBody = { genreIds: selectedGenres }; // Use selectedGenres
        console.log('Submitting genres:', requestBody);

        try {
            // Make the fetch request with the appropriate headers
            const response = await fetch('http://localhost:8080/auth/select-genres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token, // Send the token directly in the Authorization header
                },
                body: JSON.stringify(requestBody), // Convert the body to JSON
            });

            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                const errorData = await response.text(); // Get the error response text
                console.error('Error response:', errorData); // Log the error response
                throw new Error(`HTTP error! status: ${response.status}`); // Throw an error
            }

            // Parse the response data if successful
            const data = await response.json(); 
            console.log('Success:', data); // Log the success response
        } catch (error) {
            console.error('Error updating interests:', error.message); // Log any errors that occur
        }
    };

    // If userId is not available, display a message and return early
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
        <div>
            <h1>Select Genres</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div>
                {['Genre1', 'Genre2', 'Genre3', 'Genre4', 'Genre5'].map((genre) => (
                    <label key={genre} htmlFor={genre}>
                        <input
                            id={genre}
                            type="checkbox"
                            value={genre}
                            checked={selectedGenres.includes(genre)}
                            onChange={() => handleGenreChange(genre)}
                        />
                        {genre}
                    </label>
                ))}
            </div>
            <button onClick={handleSubmit}>Submit Genres</button>
        </div>
    );
};

export default GenreSelector;

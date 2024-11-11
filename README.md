# Music Discovery and Playlist Management Platform

Welcome to the Music Discovery and Playlist Management Platform, a comprehensive web application where users can explore music, create custom playlists, and enjoy personalized song recommendations based on their interests.

## Features

### 1. **User Authentication & Interests**
- **Sign Up / Login**: Users can create an account or log in using their credentials.
- **Interest Selection**: During sign-up, users can choose up to 3 music interests to help personalize their experience.

### 2. **Music Library & Playback**
- **Play Songs**: Users can play songs from any available music library.
- **Queue, Shuffle, One-Loop**: Songs can be played in a queue, shuffled, or on a one-loop basis for an enhanced listening experience.
- **History**: Keep track of all songs listened to by the user, creating a rich history of their music preferences.

### 3. **Playlist Management**
- **Create and Share Playlists**: Users can create custom playlists and share them with friends or other users.
- **Liked Songs Playlist**: Any songs that are liked by the user are automatically added to their "Liked Songs" playlist.
- **Custom Playlists**: Users can curate their own playlists from the music library.

### 4. **Personalized Song Suggestions**
- **Interest-Based Suggestions**: Personalized song recommendations based on the user’s defined interests.
- **Discover New Music**: The platform uses the user’s preferences and history to suggest new songs they might enjoy.

### 5. **Visual Enhancements**
- **Album Art**: Vibrant album art is displayed alongside songs to create a visually immersive experience while listening.

### 6. **Latest Releases & Artist Notifications**
- **New Releases**: A dedicated section to display the latest song releases so users can stay up-to-date with new music.
- **Follow Artists**: Users can follow their favorite artists and receive notifications about new releases, concerts, and updates.

## Getting Started

### Prerequisites
- Node.js (version >= 14.0.0)
- MongoDB (for database management)
- Cloudinary account (for image/file storage)
- Spotify Developer account (for integration with Spotify API)
- Google Developer account (for OAuth)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/Rythmiq1/Rythmiq.git

2.Install Node_Modules
  ```
   npm install
```
cd Rythmiq/client
```
npm install
```
cd Rythmiq/server
```
npm install
```
Set up environment variables:
Create a .env file in the root of the project.
Add the following environment variables:
```
Copy code
PORT=8080
MONGO_CONN=your_string
GOOGLE_CLIENT_ID=your google client Id
GOOGLE_CLIENT_SECRET=Your google client secret
CLIENT_SECRET=anykey to keep as your secret key

CLOUDINARY_CLOUD_NAME=cloudninary organisation name
CLOUDINARY_API_KEY=your cloudninary Api key
CLOUDINARY_API_SECRET=your cloudinary Secret key
```
create public\temp directory in server

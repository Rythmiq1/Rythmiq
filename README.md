## *Rythmiq*
### Key Features of Rythmiq

# User Authentication & Interests: Sign up/login with up to 3 music interests for personalization.
# Music Library & Playback: Play songs with options for queue, shuffle, and one-loop.
# Playlist Management: Create, share, and manage custom playlists; auto-generated liked songs playlist.
# Personalized Recommendations: Interest-based song suggestions and new music discovery.
# Visual Enhancements: Vibrant album art displayed with songs.
# Latest Releases & Artist Notifications: Stay updated on new releases and follow artists for updates.
## Getting Started

### Prerequisites
- Node.js (version >= 14.0.0)
- MongoDB (for database management)
- Cloudinary account (for image/file storage)
- Spotify Developer account (for integration with Spotify API)
- Google Developer account (for OAuth)

### Installation
1. Clone the repository:
   
bash
   git clone https://github.com/Rythmiq1/Rythmiq.git

2.Install Node_Modules

   npm install
cd Rythmiq/client
npm install
cd Rythmiq/server
npm install
Set up environment variables:
Create a .env file in the root of the project.
Add the following environment variables:

Copy code
PORT=8080
MONGO_CONN=your_string
GOOGLE_CLIENT_ID=your google client Id
GOOGLE_CLIENT_SECRET=Your google client secret
CLIENT_SECRET=anykey to keep as your secret key

CLOUDINARY_CLOUD_NAME=cloudninary organisation name
CLOUDINARY_API_KEY=your cloudninary Api key
CLOUDINARY_API_SECRET=your cloudinary Secret key
create public\temp directory in server
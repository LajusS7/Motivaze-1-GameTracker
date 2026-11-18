# Motivaze-1-GameTracker | Full-Stack Game Backlog & Game Review Application

We, Motivaze+1, are working on a game tracker to track backlogs, leave reviews, and potentially many more features.

### Local Installation & Setup

## Prequesites
- Node.js
- MongoDB Atlas instance

## Installation
1. Clone Repository:
    git clone https://github.com/LajusS7/Motivaze-1-GameTracker.git

2. Navigate to Project Folder:
    cd Motivaze-1-GameTracker

3. Install Dependencies:
    npm install

4. Create a '.env' file in the main project folder matching the template below:

    Environment Variable    |    Description    |    Example / Default Value

    - MONGODB_URI | MongoDB Atlas connection string | mongodb+srv://username:password@cluster-url/

    - JWT_SECRET | Secret used to sign authentication tokens | your_secret_key

    - RAWG_KEY | API key used to retrieve game information | your_rawg_api_key

## Backend Setup
1. Open a terminal in the project folder.

2. Install Dependencies (if not installed already):
    npm install

3. Start Express server:
    npm run server

4. Backend API runs at:
    http://localhost:3001

## Frontend Setup
1. Open a second terminal in the project folder.

2. Start React Development server:
    npm run dev

3. Open the local URL displayed in the terminal (typically):
    http://localhost:5173
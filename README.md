# Motivaze-1-GameTracker | Full-Stack Game Backlog & Game Review Application

We, Motivaze+1, are working on a game tracker to track backlogs, leave reviews, manage game activity, and track the platform and playtime of a game.

## Application Structure Overview

- **Frontend:** React and Vite provide user interface, allowing user to browse games, manage their library, and write reviews. 
- **Backend:** Node.js and Express handle API requests, user authentication, and application functions.
- **Database:** MongoDB Atlas stores user accounts, games, library entries, and reviews.
- **External API:** RAWG Video Game Database provides game information for game catalog (limited catalog only shows first 20 games, plan to scale up to show more games in future).
- **Authentication:** JSON Web Tokens (JWT) are used to protect routes and user-specific information.

### Local Installation & Setup

## Prequesites
- Node.js
- MongoDB Atlas instance
- RAWG API Key

## Installation
1. Clone Repository:
    git clone https://github.com/LajusS7/Motivaze-1-GameTracker.git

2. Navigate to Project Folder:
    cd Motivaze-1-GameTracker

3. Install Dependencies:
    npm install

4. Create a '.env' file in the main project folder matching the template below:

    |    Environment Variable    |    Description    |    Example / Default Value    |

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


### API Endpoint Specification Table

| Method | Endpoint | Auth Required | Description | Request Body Example | Expected Status |

|-----|-----|-----|-----|-----|-----|

| POST | `/api/auth/register` | No | Creates a new user account | `{ "username": "alex", "password": "SecurePass123!" }` | `201 Created` |

| POST | `/api/auth/login` | No | Authenticates an existing user and returns a JWT | `{ "username": "alex", "password": "SecurePass123!" }` | `200 OK` |

| GET | `/api/dashboard` | Yes | Retrieves dashboard welcome information | None | `200 OK` |

| GET | `/api/games` | No | Retrieves RAWG games and custom games | None | `200 OK` |

| POST | `/api/games` | Yes | Adds a custom game to the catalog | `{ "name": "Minecraft" }` | `201 Created` |

| GET | `/api/library` | Yes | Retrieves the user's game library | None | `200 OK` |

| POST | `/api/library` | Yes | Adds a game to the user's library | `{ "gameId": 3498, "gameName": "Grand Theft Auto V", "gameImage": "https://example.com/image.jpg", "status": "Want to Play" }` | `201 Created` |

| PUT | `/api/library/:id` | Yes (Owner) | Updates a game's library status | `{ "status": "Playing" }` | `200 OK` |

| DELETE | `/api/library/:id` | Yes (Owner) | Removes a game from the user's library | None | `200 OK` |

| POST | `/api/reviews` | Yes | Creates a review for a game | `{ "gameId": 3498, "gameName": "Grand Theft Auto V", "rating": 5, "reviewText": "Great game!" }` | `201 Created` |

| GET | `/api/reviews/game/:gameId` | Yes | Retrieves reviews for a specific game | None | `200 OK` |

| PUT | `/api/reviews/:id` | Yes (Owner) | Updates an existing review | `{ "rating": 4, "reviewText": "Updated review!" }` | `200 OK` |

| DELETE | `/api/reviews/:id` | Yes (Owner) | Deletes an existing review | None | `200 OK` |
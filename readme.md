# Chill Gamer: Backend for Game Review Application

Welcome to the backend of **Chill Gamer**, the RESTful API designed to support game reviews, user authentication, and data management for the Chill Gamer front-end application. 

**Live API url:** [Chill Gamer backend](https://b10-a10-server-side-nine.vercel.app/) 

## Key Features
- **RESTful API:** Provides endpoints for game reviews, and user watchlists.
- **MongoDB Integration:** Uses MongoDB for data storage, allowing for seamless data operations and queries.
- **Environment Variables:** Database credentials is managed through environment variables for security.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Technologies Used](#technologies-used)

## Installation
To run the backend application locally:
1. Clone this repository:
   ```bash
   git clone https://github.com/programming-hero-web-course2/b10-a10-server-side-mes-shahadat.git
   ```
2. Navigate to the project directory:
   ```bash
   cd b10-a10-server-side-mes-shahadat
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root of the project and add the following variables:
```plaintext
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

Make sure to replace the placeholders with your actual credentials.

## Usage
1. Start the server:
   ```bash
   npm start
   ```
2. The server will run on `http://localhost:3000` by default.

## API Endpoints
Here are some key API endpoints provided by the backend:

### Reviews Management
- **GET** `/reviews`: Retrieve all reviews
- **GET** `/my-reviews/:email`: Retrieve all user reviews
- **POST** `/add-review`: Add a new review 
- **GET** `/review/:id`: Fetch a specific review by ID
- **PUT** `/update-review/:id`: Update a review by ID (protected route)
- **DELETE** `/review/:id`: Delete a review by ID (protected route)

### User Watchlist
- **POST** `/my-saved-watchlist`: Retrieve user's watchlist (protected route)
- **POST** `/my-watchlist`: Add a game to user's watchlist (protected route)
- **DELETE** `/my-watchlist/:id`: Remove a game from watchlist (protected route)

### Other
- **GET** `/banners`: Get all banners
- **GET** `/new-release`: Get new released reviews
- **GET** `/recommended`: Get recommended reviews
- **GET** `/highest-rated`: Get high rated reviews
- **GET** `/reviews-count`: Get review counts using query strings
- **GET** `/genres`: Retrieve all genres
- **GET** `/tags`: Retrieve all tags
- **GET** `/platforms`: Retrieve all platforms

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user data and game reviews
- **dotenv**: For environment variable management
- **Hosting:** Vercel (Back-end)
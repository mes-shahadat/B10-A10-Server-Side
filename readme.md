# Chill Gamer: Backend for Game Review Application

Welcome to the backend of **Chill Gamer**, the RESTful API designed to support game reviews, user authentication, and data management for the Chill Gamer front-end application. 

## Live API URL
[Chill Gamer API Documentation](http://api.example.com) *(Replace with actual API documentation URL)*

## Key Features
- **RESTful API:** Provides endpoints for user authentication, game reviews, and user watchlists.
- **Secure Authentication:** Implements JWT (JSON Web Tokens) for user authentication.
- **MongoDB Integration:** Uses MongoDB for data storage, allowing for seamless data operations and queries.
- **Environment Variables:** Sensitive information (like database credentials and API keys) is managed through environment variables for security.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Technologies Used](#technologies-used)
5. [Challenges](#challenges)
6. [Contribution](#contribution)
7. [License](#license)

## Installation
To run the backend application locally:
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/chill-gamer-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd chill-gamer-backend
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
2. The server will run on `http://localhost:5000` by default.

## API Endpoints
Here are some key API endpoints provided by the backend:

### Reviews Management
- **GET** `/api/reviews`: Retrieve all reviews
- **POST** `/api/reviews`: Add a new review (protected route)
- **GET** `/api/review/:id`: Fetch a specific review by ID
- **PUT** `/api/review/:id`: Update a review by ID (protected route)
- **DELETE** `/api/review/:id`: Delete a review by ID (protected route)

### User Watchlist
- **GET** `/api/watchlist`: Retrieve user's watchlist (protected route)
- **POST** `/api/watchlist`: Add a game to watchlist (protected route)
- **DELETE** `/api/watchlist/:id`: Remove a game from watchlist (protected route)

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user data and game reviews
- **Mongoose**: ODM library for MongoDB and Node.js
- **JWT**: For secure authentication
- **dotenv**: For environment variable management

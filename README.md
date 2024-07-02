# Blue Eating Backend System

## Overview
This project involves the development of a backend system for a web application created during a hackathon. The application focuses on promoting nutrition habits common among centenarians. Key features include the implementation of encryption techniques for data security, the design of scalable MongoDB Atlas databases, and the creation of RESTful API features to facilitate front-end and back-end communication.

## Project Motivation
The U.S. is facing a growing population that is affected by problems such as obesity, cardiovascular disease, diabetes and more. These problems often lead to high medical costs, which can be devastating for people. The foods that are linked to these problems are also usually highly processed, which results in a large portion of carbon emissions produced by the U.S. each year. These problems are seldom seen in the five locations dubbed "blue zones", which have the highest concentrations of centenarians and minimal food-related diseases/conditions. We wanted to provide a comprehensive "blue zone" lifestyle resource available to people around the world and allow them to develop a community centered around healthy, sustainable living.

## Features
- **User Data Encryption**: Integrated encryption techniques to safeguard user data.
- **MongoDB Atlas Databases**: Designed and implemented scalable databases to handle large quantities of recipes and user profiles.
- **RESTful APIs**: Collaborated with front-end designers to generate API features for better communication between front-end and back-end systems.
- **API Testing**: Case tested RESTful APIs with Postman to improve database management practices and user experience.

## Technologies Used
- **Database**: MongoDB Atlas
- **Programming Language**: JavaScript
- **Version Control**: Git
- **API Testing**: Postman

## Setup and Installation
1. Clone the repository:
   ```sh
   git clone <github.com/kdiaz1452/blue_eating_back>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - `DB_URI`: Your MongoDB Atlas connection string.
   - `SECRET_KEY`: Your encryption secret key.
   
4. Start the development server:
   ```sh
   npm start
   ```
5. Complete the necessary setup with the frontend:
   [Frontend](https://github.com/burtone520/blue-eating/tree/master)

## API Endpoints
- **User Registration**: `POST /api/register`
- **User Login**: `POST /api/login`
- **Get Recipes**: `GET /api/recipes`
- **Add Recipe**: `POST /api/recipes`

## Testing
- Use Postman to test API endpoints. Import the Postman collection provided in the `postman/` directory.

## Learning Outcomes
We learned more about MongoDB Atlas, GitHub Copilot, generating REST APIs, and debugging techniques appropriate for web applications. We also learned how to create a business model appropriate for our product and design a plan for Blue Eating's growth potential.

## Challenges
We ran into a few challenges throughout our project. We initially ran into some difficulties connecting the databases using MongoDB Atlas and initializing the REST APIs we generated via those APIs. Specifically, we had some difficulty passing recipe images into our database, but resolved that issue by circumnavigating MongoDB Atlas. To do this, we implemented a muter and then stored the images into a folder inside of a Node.js file.

## Contributors
- [Brilynd]((https://github.com/Brilynd))
- [eburton520]((https://github.com/eburton520))

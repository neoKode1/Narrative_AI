Narrative AI
Narrative AI is a web application that allows users to generate images, animate them, and add voice to create a complete narrative. It utilizes the Hugging Face API to generate images based on user input prompts and integrates with a backend server for handling requests.

Getting Started
This project was bootstrapped with Create React App for the frontend and an Express server for the backend.

Prerequisites
Node.js installed on your machine.
A Hugging Face API key for image generation.
A .env file in your server folder with the following content:
plaintext
Copy code
REPLICATE_API_TOKEN=your_replicate_api_token_here
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
PORT=5000
Available Scripts
In the project directory, you can run the following commands for both frontend and backend:

Frontend (Client)
cd client
Run one of the following commands:
npm start
Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

npm test
Launches the test runner in the interactive watch mode.

npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

Backend (Server)
cd server
Run one of the following commands:
npm start
Starts the Express server at http://localhost:5000.

npm run dev
Starts the server in development mode using Nodemon to automatically restart on file changes.

Usage
Navigate to the frontend at http://localhost:3000.
Enter a prompt in the input field and click "Generate Image" to create an AI-generated image.
The image will appear on the page after successful generation.
Project Structure
bash
Copy code
narrative-ai/
│
├── client/                  # Frontend React app
│   ├── public/              # Static public assets (favicon, HTML, etc.)
│   ├── src/                 # Source code for React app
│   ├── .env                 # Environment variables for the client
│   └── ...
│
├── server/                  # Backend Express app
│   ├── routes/              # API routes for image and video generation
│   ├── services/            # API service handlers for Hugging Face and RunwayML
│   ├── .env                 # Environment variables for the server (not committed to git)
│   ├── index.js             # Entry point for the server
│   └── ...
│
└── .gitignore               # Files to ignore in Git
Environment Setup
Make sure you have two .env files for this project:

Client-side (client/.env):
This file can include environment-specific variables for the React app.

Server-side (server/.env):
This file contains sensitive environment variables, such as API keys and the port. Ensure this file is added to .gitignore to prevent accidental sharing of secrets.

Deployment
Client:
After running npm run build in the client folder, deploy the contents of the build folder to your preferred hosting provider (e.g., Netlify, Vercel, or GitHub Pages).

Server:
Deploy the server folder to a hosting provider that supports Node.js (e.g., Heroku, AWS, or DigitalOcean). Make sure to set the environment variables (e.g., the API keys) in the provider's dashboard.

Learn More
React: To learn React, check out the React documentation.
Create React App: Learn more about the CRA setup here.
Hugging Face: Learn more about Hugging Face APIs.
Contributing
Feel free to contribute to the project by opening issues or pull requests on the GitHub repository.

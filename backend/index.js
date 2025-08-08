// index.js
// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const cors = require("cors");
const open = require("open");
const auth = require("./spotify/auth"); // Handles Spotify authentication logic
const generator = require("./spotify/generator"); // Handles playlist generation logic
const search = require("./spotify/search"); // Handles searching for shows
const configRoutes = require("./routes/configRoutes");

// Create an Express app instance
const app = express();
const PORT = 8888; // Port the server will listen on

// Use CORS middleware BEFORE any routes
app.use(
  cors({
    origin: "http://localhost:5173", // allow your Vue frontend
    methods: ["GET", "POST"], // allow needed methods
    credentials: false, // unless you're using cookies
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use("/", configRoutes);

// Route to start the Spotify login process
// Redirects user to Spotify login page with appropriate scopes
app.get("/login", auth.login);

// Callback route that Spotify redirects to after user grants access
// Exchanges authorization code for access token
app.get("/callback", auth.callback);

app.get("/searchShow", search.searchShow);

// Route to generate a playlist for the authenticated user
// Now accepts parameters in the request body: musicUris, podcastShowIds, playlistName, playlistDescription
app.post("/generate", generator.generatePlaylist);

// Start the Express server and print useful URLs to console
app.listen(PORT, () => {
  console.log(`🎧 Server running at http://localhost:${PORT}`);
  console.log(
    `🔐 Visit http://localhost:${PORT}/login to authenticate with Spotify.`
  );
});

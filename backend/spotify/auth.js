const querystring = require('querystring');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const tokenPath = path.resolve(__dirname, '../token.json'); // File to store token

// Load Spotify credentials from environment variables
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Store the access token in memory (will be lost on server restart)
let access_token = null;

// Redirects the user to Spotify's authorization page
exports.login = (req, res) => {
  const scope = 'playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-read-playback-position'; // Permissions we're requesting
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
  });

  // Redirect to Spotify login page
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
};

// Spotify redirects to this route after the user grants access
exports.callback = async (req, res) => {
  const code = req.query.code || null; // Authorization code returned by Spotify

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
        },
      }
    );

    // Save the token in memory
    access_token = tokenResponse.data.access_token;

    // Also persist the token to a local file so we don’t lose it on server restart
    fs.writeFileSync(tokenPath, JSON.stringify({
        access_token,
    }));     

    // Confirmation response
    res.send('✅ Authenticated with Spotify! You can now POST to /generate');

  } catch (error) {
    // Log error and return 500 if token request fails
    console.error(error.response?.data || error.message);
    res.status(500).send('Error retrieving Spotify token');
  }
};


// Return the stored access token
// Load from file if it's not in memory
exports.getAccessToken = () => {
    // Use cached token if available
    if (access_token) return access_token;
  
    // If there's a saved token file, read from it
    if (fs.existsSync(tokenPath)) {
      const saved = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      access_token = saved.access_token;
      return access_token;
    }
  
    // If no token is available, return null
    return null;
  };

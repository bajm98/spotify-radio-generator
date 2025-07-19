const axios = require('axios');

/**
 * Search for a track on Spotify by name (and optionally artist)
 * @param {string} query - Search string (e.g. "eminem lose yourself")
 * @param {string} token - A valid Spotify access token
 * @returns {Promise<string|null>} - The URI of the best match, or null if not found
 */

exports.searchTrackUri = async(query, token) =>{
    console.log("🔍 Search query:", query);
    console.log("🪪 Token starts with:", token?.substring(0, 20));
    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: query,
          type: 'track',
          limit: 1,
        }
      }
    );
  
    const track = response.data.tracks.items[0];
    return track ? track.uri : null;
  }
  
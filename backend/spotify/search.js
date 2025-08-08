const axios = require("axios");
const { getAccessToken } = require("./auth");

/**
 * Search for a track on Spotify by name (and optionally artist)
 * @param {string} query - Search string (e.g. "eminem lose yourself")
 * @param {string} token - A valid Spotify access token
 * @returns {Promise<string|null>} - The URI of the best match, or null if not found
 */

exports.searchTrackUri = async (query, token) => {
  console.log("🔍 Search query:", query);
  console.log("🪪 Token starts with:", token?.substring(0, 20));
  const response = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q: query,
      type: "track",
      limit: 1,
    },
  });

  const track = response.data.tracks.items[0];
  return track ? track.uri : null;
};

exports.searchShow = async (req, res) => {
  const token = getAccessToken(); // Get the current access token
  if (!token) return res.status(401).send("Not authenticated with Spotify");
  const query = req.query.q || ""; // Search query from request parameters
  if (!query) return res.status(400).send("Missing search query parameter");
  console.log("🔍 Search query:", query);
  console.log("🪪 Token starts with:", token?.substring(0, 20));

  const shows = await searchShowByName(query, token);
  if (!shows) {
    return res.status(404).send("No shows found for this query");
  }
  res.json(shows);
};

searchShowByName = async (query, token) => {
  const response = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      q: query,
      type: "show",
      limit: 5,
    },
  });

  const shows = [];
  response.data.shows.items.forEach((element) => {
    shows.push({
      id: element.id,
      name: element.name,
      uri: element.uri,
    });
  });
  return shows.length > 0 ? shows : null;
};

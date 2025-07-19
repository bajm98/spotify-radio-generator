const axios = require('axios');

  /**
   * 
   * @param {string} playlistId 
   * @param {string} token 
   * @returns {Promise<string>}
   */
async function getPlaylistByPlaylistId(playlistId, token) {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const playlist = response.data;
    return playlist;
  };

  /**
 * Fetch all track URIs from a given Spotify playlist
 * Handles pagination and skips unavailable tracks
 * 
 * @param {string} playlistId - The Spotify playlist ID
 * @param {string} token - A valid Spotify access token
 * @returns {Promise<string[]>} - Array of Spotify track URIs
 */
async function getTracksFromPlaylist(playlistId, token) {
    const limit = 100;
    let offset = 0;
    let allTracks = [];
    let hasMore = true;
  
    while (hasMore) {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit, offset },
        }
      );
  
      const items = response.data.items;
  
      const uris = items
        .filter(item => item.track && item.track.uri)
        .map(item => item.track.uri);
  
      allTracks.push(...uris);
      offset += items.length;
      hasMore = items.length === limit;
    }
  
    return allTracks;
  };

module.exports = {
    getPlaylistByPlaylistId,
    getTracksFromPlaylist
};
``

const axios = require('axios');
const { getAccessToken } = require('./auth');
const { searchTrackUri } = require('./search');
const { getPlaylistByPlaylistId,  getTracksFromPlaylist } = require('./playlist');
const { shuffleArray } = require('../utils/utils');

const INTERVAL = 1; // Number of songs between each episode in the playlist (e.g. 2 = E S S E S S E S S E)
/**
 * Helper function to fetch the latest episode URI of a given podcast show
 * @param {string} showId - The Spotify ID of the podcast show
 * @param {string} token - A valid Spotify access token
 * @returns {Promise<string>} - The URI of the latest episode
 */
async function getLatestEpisodeUri(showId, token) {
    const response = await axios.get(
      `https://api.spotify.com/v1/shows/${showId}/episodes?limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const episode = response.data.items[0];
    return episode.uri;
  };

  async function getLatestEpisode(showId, token) {
    const response = await axios.get(
      `https://api.spotify.com/v1/shows/${showId}/episodes?limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const episode = response.data.items[0];
    return episode;
  };

  /**
   * 
   * @param {string} playlistId 
   * @param {string} token 
   * @returns {Promise<string>}
   */
async function getPlaylist(playlistId, token) {
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
 * Main route handler for generating a playlist
 * Creates a new playlist and fills it with a mix of music and podcast episodes
 */
exports.generatePlaylist = async (req, res) => {
  const token = getAccessToken(); // Get the current access token
  if (!token) return res.status(401).send('Not authenticated with Spotify');

  try {
    // Step 1: Read parameters from the request body
    const {
        musicUris = [],                // Array of Spotify music track URIs
        podcastShowIds = [],           // Array of Spotify podcast show IDs
        playlistName = '🎧 My Playlist', // Optional custom playlist name
        playlistDescription = 'Generated with love 💚',
        searchTracks = [], // Array of key words to search Spotify music track URIs
        playlistIds = [] // Array of Spotify playlist URIs
      } = req.body;
      console.log("1");
    // Step 1: Get the user's Spotify profile (to get their user ID)
    const user = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Step 2: Create a new empty playlist in the user's account
    const myPlaylist = await axios.post(
      `https://api.spotify.com/v1/users/${user.data.id}/playlists`,
      {
        //name: '🎶 My Custom Radio (Prototype)',
        //description: 'Automatically generated playlist',
        name: playlistName,
        description: playlistDescription,
        public: false,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const myPlaylistId = myPlaylist.data.id;

    // Fetch the latest episode URI from each show
    /*const podcastUris = await Promise.all(
        podcastShowIds.map(showId => getLatestEpisodeUri(showId, token))
    );*/

    const podcastEpisodes = await Promise.all(
      podcastShowIds.map(showId => getLatestEpisode(showId, token))
    );

    const podcastUris = podcastEpisodes.filter(episode => episode && !episode.resume_point?.fully_played).map(episode => episode.uri);

    /*const playlists = await Promise.all(
        playlistIds.map(playlistId => getPlaylist(playlistId, token))
    );

    const playlistTracks = playlists.map(playlist => playlist.tracks);
    
    const playlistTracksUris = playlistTracks.map(playlist => playlist.items.map(item => item.track.uri)); */

    const playlistTracksUris = await Promise.all(
        playlistIds.map(playlistId => getTracksFromPlaylist(playlistId, token))
    );
    
    // Shuffle the order
    const shuffledUris = shuffleArray(playlistTracksUris.flat());

    // Limit the number of songs for the day
    const dailyMusic = shuffledUris.slice(0, 20); // or however many you want

    // Search for the music track URIs 
    const musicSearched = await Promise.all(
        searchTracks.map(query => searchTrackUri(query, token))
    );
    
    musicUris.push(...musicSearched.filter(uri => uri)); // Add non-null URIs to the list
    musicUris.push(...playlistTracksUris.flat());

    // Step 5: Alternate music and podcast episodes
    const mixedUris = mixEpisodesAndMusic(podcastUris, dailyMusic, INTERVAL);
    //const maxLength = Math.max(musicUris.length, podcastUris.length);
    /*for (let i = 0; i < maxLength; i++) {
        if (musicUris[i]) mixedUris.push(musicUris[i]);
        if (podcastUris[i]) mixedUris.push(podcastUris[i]);
    }*/
    console.log("2");
    // Step 6: Add the mixed tracks/episodes to the new playlist
    await axios.post(
        `https://api.spotify.com/v1/playlists/${myPlaylistId}/tracks`,
        { uris: mixedUris },
        {
        headers: { Authorization: `Bearer ${token}` },
        }
    );

    // Return the URL of the created playlist
    res.json({
      message: '✅ Playlist created!',
      url: myPlaylist.data.external_urls.spotify,
    });

  } catch (err) {
    // Log error and return 500 if any step fails
    console.error(err.response?.data || err.message);
    res.status(500).send('Error while creating the playlist');
  }
};

/**
 * Mix music and episodes into a single array:
 * Starts with an episode, then 2 songs, then an episode, etc.
 *
 * @param {string[]} episodes - Array of episode URIs
 * @param {string[]} music - Array of track URIs
 * @returns {string[]} Mixed playlist URIs
 */
function mixEpisodesAndMusic(episodes, music, interval) {
    const result = [];
    let episodeIndex = 0;
    let musicIndex = 0;
  
    while (episodeIndex < episodes.length || musicIndex < music.length) {
      if (episodeIndex < episodes.length) {
        result.push(episodes[episodeIndex++]);
      }
  
      // Add up to 2 songs after each episode
      for (let i = 0; i < interval && musicIndex < music.length; i++) {
        result.push(music[musicIndex++]);
      }
    }
  
    return result;
  }


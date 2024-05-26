const axios = require("axios");
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const getUser = async (req, res) => {
  try {
    if (!req.user || !req.user.accessToken) {
      throw new Error('Access token is missing');
    }

    const accessToken = req.user.accessToken;
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Spotify profile:', error.message);
    res.status(500).send('Error fetching Spotify profile');
  }
};

const getRecentlyPlayed = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/spotify");
  }

  try {
    const { accessToken } = req.user;

    // Fetch recently played tracks
    const recentlyPlayedResponse = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const tracks = recentlyPlayedResponse.data.items.map((item) => item.track);

    // Get track IDs to fetch audio features
    const trackIds = tracks.map((track) => track.id).join(",");

    // Fetch audio features for the tracks
    const audioFeaturesResponse = await axios.get(
      `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const audioFeatures = audioFeaturesResponse.data.audio_features;

    // Analyze mood based on valence, danceability, and energy
    const valenceSum = audioFeatures.reduce(
      (sum, feature) => sum + feature.valence,
      0
    );
    const danceabilitySum = audioFeatures.reduce(
      (sum, feature) => sum + feature.danceability,
      0
    );
    const energySum = audioFeatures.reduce(
      (sum, feature) => sum + feature.energy,
      0
    );

    const averageValence = valenceSum / audioFeatures.length;
    const averageDanceability = danceabilitySum / audioFeatures.length;
    const averageEnergy = energySum / audioFeatures.length;

    let mood;
    if (
      averageValence > 0.7 &&
      averageDanceability > 0.7 &&
      averageEnergy > 0.7
    ) {
      mood = "Energetic";
    } else if (
      averageValence > 0.7 &&
      averageDanceability > 0.7 &&
      averageEnergy <= 0.7
    ) {
      mood = "Happy";
    } else if (
      averageValence > 0.7 &&
      averageDanceability <= 0.7 &&
      averageEnergy > 0.7
    ) {
      mood = "Excited";
    } else if (
      averageValence <= 0.7 &&
      averageValence > 0.3 &&
      averageDanceability <= 0.7 &&
      averageEnergy <= 0.7
    ) {
      mood = "Content";
    } else if (
      averageValence > 0.3 &&
      averageDanceability <= 0.5 &&
      averageEnergy <= 0.5
    ) {
      mood = "Relaxed";
    } else if (
      averageValence > 0.3 &&
      averageDanceability <= 0.5 &&
      averageEnergy > 0.5
    ) {
      mood = "Calm";
    } else if (
      averageValence <= 0.3 &&
      averageDanceability <= 0.3 &&
      averageEnergy <= 0.3
    ) {
      mood = "Sad";
    } else if (
      averageValence <= 0.3 &&
      averageDanceability > 0.5 &&
      averageEnergy <= 0.5
    ) {
      mood = "Bored";
    } else if (
      averageValence <= 0.3 &&
      averageDanceability <= 0.5 &&
      averageEnergy > 0.5
    ) {
      mood = "Tense";
    } else {
      mood = "Neutral";
    }

    res.json({ mood, tracks });
  } catch (error) {
    console.error("Error fetching recently played:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getTopArtists = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/spotify");
  }
  try {
    const { accessToken } = req.user;
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const artists = response.data.items;
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopSongs = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/spotify");
  }
  try {
    const { accessToken } = req.user;
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const tracks = response.data.items;
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/spotify');
  }
  try {
    const { accessToken } = req.user;
    spotifyApi.setAccessToken(accessToken);

    // Get recently played tracks
    const recentlyPlayedResponse = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const recentlyPlayedTracks = recentlyPlayedResponse.data.items.map(item => item.track);

    // Get audio features for recently played tracks
    const trackIds = recentlyPlayedTracks.map(track => track.id);
    const audioFeaturesResponse = await spotifyApi.getAudioFeaturesForTracks(trackIds);
    const audioFeatures = audioFeaturesResponse.body.audio_features;

    // Analyze the mood
    const mood = analyzeMood(audioFeatures);

    // Get recommendations based on the mood
    const recommendationsResponse = await spotifyApi.getRecommendations({
      seed_tracks: trackIds.slice(0, 5), // Use up to 5 seed tracks
      target_danceability: mood.danceability,
      target_energy: mood.energy,
    });
    const recommendedTracks = recommendationsResponse.body.tracks;

    res.json(recommendedTracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const analyzeMood = (audioFeatures) => {
  let totalDanceability = 0;
  let totalEnergy = 0;

  audioFeatures.forEach(feature => {
    totalDanceability += feature.danceability;
    totalEnergy += feature.energy;
  });

  const avgDanceability = totalDanceability / audioFeatures.length;
  const avgEnergy = totalEnergy / audioFeatures.length;

  return {
    danceability: avgDanceability,
    energy: avgEnergy,
  };
};
  
module.exports = {
  getRecentlyPlayed,
  getTopArtists,
  getTopSongs,
  getRecommendations,
  getUser,
};

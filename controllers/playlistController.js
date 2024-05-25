// controllers/playlistController.js
const axios = require("axios");

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
module.exports = {
  getRecentlyPlayed,
  getTopArtists,
  getTopSongs
};

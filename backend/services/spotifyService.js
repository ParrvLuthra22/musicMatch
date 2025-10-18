import axios from 'axios';
import { config } from '../config/config.js';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/**
 * Get Spotify access token using client credentials
 */
export const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${config.spotify.clientId}:${config.spotify.clientSecret}`
          ).toString('base64')}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw new Error('Failed to authenticate with Spotify');
  }
};

/**
 * Spotify API helper class
 */
export class SpotifyAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Make a request to Spotify API
   */
  async request(endpoint, method = 'GET', data = null) {
    try {
      const response = await axios({
        method,
        url: `${SPOTIFY_API_BASE}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        data,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid or expired Spotify token');
      }
      throw error;
    }
  }

  /**
   * Get user's top tracks
   */
  async getTopTracks(timeRange = 'medium_term', limit = 20) {
    return this.request(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }

  /**
   * Get user's top artists
   */
  async getTopArtists(timeRange = 'medium_term', limit = 20) {
    return this.request(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  }

  /**
   * Get currently playing track
   */
  async getCurrentlyPlaying() {
    return this.request('/me/player/currently-playing');
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    return this.request('/me');
  }

  /**
   * Get user's recently played tracks
   */
  async getRecentlyPlayed(limit = 20) {
    return this.request(`/me/player/recently-played?limit=${limit}`);
  }

  /**
   * Get audio features for tracks
   */
  async getAudioFeatures(trackIds) {
    const ids = Array.isArray(trackIds) ? trackIds.join(',') : trackIds;
    return this.request(`/audio-features?ids=${ids}`);
  }

  /**
   * Search for tracks, artists, albums, etc.
   */
  async search(query, types = ['track', 'artist'], limit = 20) {
    const typeString = types.join(',');
    return this.request(
      `/search?q=${encodeURIComponent(query)}&type=${typeString}&limit=${limit}`
    );
  }

  /**
   * Get artist information
   */
  async getArtist(artistId) {
    return this.request(`/artists/${artistId}`);
  }

  /**
   * Get multiple artists
   */
  async getArtists(artistIds) {
    const ids = Array.isArray(artistIds) ? artistIds.join(',') : artistIds;
    return this.request(`/artists?ids=${ids}`);
  }
}

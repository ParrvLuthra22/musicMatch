import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SpotifyContext = createContext();

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

export const SpotifyProvider = ({ children }) => {
  const { user, session } = useAuth();
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshSpotifyData = async () => {
    if (!session?.provider_token) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch top tracks
      const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20', {
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
        },
      });

      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json();
        setTopTracks(tracksData.items || []);
      }

      // Fetch top artists
      const artistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20', {
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
        },
      });

      if (artistsResponse.ok) {
        const artistsData = await artistsResponse.json();
        setTopArtists(artistsData.items || []);
      }

      // Fetch currently playing track
      const currentResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
        },
      });

      if (currentResponse.ok && currentResponse.status !== 204) {
        const currentData = await currentResponse.json();
        setCurrentTrack(currentData.item || null);
      }

    } catch (err) {
      setError('Failed to fetch Spotify data');
      console.error('Spotify API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && session?.provider_token) {
      refreshSpotifyData();
    }
  }, [user, session?.provider_token]);

  const value = {
    topTracks,
    topArtists,
    currentTrack,
    loading,
    error,
    refreshSpotifyData,
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};
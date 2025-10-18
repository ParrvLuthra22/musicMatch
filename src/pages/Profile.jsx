import React, { useState, useEffect } from 'react';
import { Camera, Music, Save, RefreshCw, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSpotify } from '../contexts/SpotifyContext';
import { supabase } from '../lib/supabase';
import { Navigation } from '../components/layout/Navigation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const { topArtists, topTracks, refreshSpotifyData, loading: spotifyLoading } = useSpotify();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    // Update profile with Spotify data when available
    if (topArtists.length > 0 && profile) {
      const genres = Array.from(new Set(
        topArtists.flatMap(artist => artist.genres)
      )).slice(0, 10);

      const artists = topArtists.map(artist => artist.name).slice(0, 10);

      updateSpotifyData(genres, artists);
    }
  }, [topArtists, profile]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name,
          bio: data.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSpotifyData = async (genres, artists) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          top_genres: genres,
          top_artists: artists,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        top_genres: genres,
        top_artists: artists,
      } : null);
    } catch (error) {
      console.error('Error updating Spotify data:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        bio: formData.bio,
      } : null);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Your Profile</h1>
          <p className="text-gray-300">Manage your profile and music preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Form */}
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <Button variant="secondary" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <div className="space-y-6">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell others about yourself and your music taste..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                />
              </div>

              <Button
                onClick={handleSave}
                loading={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </Card>

          {/* Spotify Integration */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Spotify Music Data
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={refreshSpotifyData}
                loading={spotifyLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {profile?.top_artists.length > 0 ? (
              <div className="space-y-6">
                {/* Top Artists */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Top Artists</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.top_artists.slice(0, 10).map((artist, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-600/30 text-purple-200 text-sm rounded-full"
                      >
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Genres */}
                {profile.top_genres.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Top Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.top_genres.slice(0, 10).map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-pink-600/30 text-pink-200 text-sm rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Tracks */}
                {topTracks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recent Top Tracks</h3>
                    <div className="space-y-3">
                      {topTracks.slice(0, 5).map((track, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          {track.album.images[0] && (
                            <img
                              src={track.album.images[0].url}
                              alt={track.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{track.name}</p>
                            <p className="text-gray-400 text-sm truncate">
                              {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg text-white mb-2">No Spotify Data</h3>
                <p className="text-gray-400 mb-4">
                  Connect your Spotify account to show your music preferences to potential matches
                </p>
                <Button onClick={refreshSpotifyData} loading={spotifyLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Spotify Data
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
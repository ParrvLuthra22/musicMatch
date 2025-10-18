import React, { useState, useEffect } from 'react';
import { Heart, X, Music, Users, Filter, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSpotify } from '../contexts/SpotifyContext';
import { supabase } from '../lib/supabase';
import { calculateMatchScore } from '../utils/matching';
import { Navigation } from '../components/layout/Navigation';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Discover = () => {
  const { user } = useAuth();
  const { topArtists, loading: spotifyLoading } = useSpotify();
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [user, searchTerm, genreFilter]);

  const fetchProfiles = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id);

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,top_artists.cs.{${searchTerm}}`);
      }

      if (genreFilter) {
        query = query.contains('top_genres', [genreFilter]);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get current user's profile for matching
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

      if (currentUserProfile && currentUserProfile.length > 0 && data) {
        const userProfile = currentUserProfile[0];
        // Calculate match scores and sort by relevance
        const profilesWithScores = data.map(profile => ({
          ...profile,
          matchScore: calculateMatchScore(userProfile, profile),
        })).sort((a, b) => b.matchScore - a.matchScore);

        setProfiles(profilesWithScores);
        setCurrentProfileIndex(0);
      } else {
        // No user profile found, set empty profiles
        setProfiles([]);
        setCurrentProfileIndex(0);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || currentProfileIndex >= profiles.length) return;

    const targetProfile = profiles[currentProfileIndex];
    
    try {
      // Create a match request
      await supabase
        .from('matches')
        .insert({
          user1_id: user.id,
          user2_id: targetProfile.user_id,
          match_score: targetProfile.matchScore,
          status: 'pending',
        });

      nextProfile();
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handlePass = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // Refresh profiles when we reach the end
      fetchProfiles();
    }
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

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div>
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Discover Your Music Matches</h1>
          <p className="text-gray-300">Find people who share your musical taste</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="p-4">
              <div className="space-y-4">
                <Input
                  label="Filter by Genre"
                  placeholder="e.g., pop, rock, hip-hop..."
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                />
              </div>
            </Card>
          )}
        </div>

        {/* Profile Card */}
        {currentProfile ? (
          <div className="max-w-md mx-auto">
            <Card className="overflow-hidden">
              {/* Profile Image */}
              <div className="h-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {currentProfile.avatar_url ? (
                  <img
                    src={currentProfile.avatar_url}
                    alt={currentProfile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-6xl font-bold">
                    {currentProfile.full_name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentProfile.full_name}
                  </h2>
                  <div className="flex items-center justify-center space-x-2 text-purple-400">
                    <Music className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {currentProfile.matchScore}% Match
                    </span>
                  </div>
                </div>

                {currentProfile.bio && (
                  <p className="text-gray-300 text-center">{currentProfile.bio}</p>
                )}

                {/* Top Artists */}
                {currentProfile.top_artists.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Top Artists
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.top_artists.slice(0, 6).map((artist, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded-full"
                        >
                          {artist}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Genres */}
                {currentProfile.top_genres.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <Music className="h-4 w-4 mr-2" />
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.top_genres.slice(0, 6).map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-pink-600/30 text-pink-200 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-6">
              <Button
                variant="secondary"
                size="lg"
                onClick={handlePass}
                className="rounded-full p-4"
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button
                size="lg"
                onClick={handleLike}
                className="rounded-full p-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Heart className="h-6 w-6" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No more profiles</h3>
            <p className="text-gray-400 mb-6">
              We've shown you all available matches. Try adjusting your filters or check back later.
            </p>
            <Button onClick={fetchProfiles}>
              <Search className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            {profiles.length > 0 && currentProfileIndex < profiles.length
              ? `${currentProfileIndex + 1} of ${profiles.length} profiles`
              : 'End of profiles'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Discover;
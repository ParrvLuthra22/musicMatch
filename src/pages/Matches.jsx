import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Music, Users, Heart, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getSharedInterests } from '../utils/matching';
import { Navigation } from '../components/layout/Navigation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user, activeTab]);

  const fetchMatches = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!user1_id(*),
          user2:profiles!user2_id(*)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get current user's profile for shared interests
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

      const matchesWithDetails = data.map(match => {
        const isCurrentUserFirst = match.user1_id === user.id;
        const otherUser = isCurrentUserFirst ? match.user2 : match.user1;
        
        const sharedInterests = currentUserProfile && currentUserProfile.length > 0 ? 
          getSharedInterests(currentUserProfile[0], otherUser) : 
          { genres: [], artists: [] };

        return {
          ...match,
          otherUser,
          sharedInterests,
        };
      });

      setMatches(matchesWithDetails);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchAction = async (matchId, action) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: action })
        .eq('id', matchId);

      if (error) throw error;

      // Refresh matches
      fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected':
        return <div className="h-4 w-4 bg-red-400 rounded-full" />;
      default:
        return null;
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

  return (
    <div>
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Your Music Matches</h1>
          <p className="text-gray-300">Connect with people who share your musical taste</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-lg p-1 backdrop-blur-md">
            {[
              { key: 'pending', label: 'Pending', icon: Clock },
              { key: 'accepted', label: 'Accepted', icon: CheckCircle },
              { key: 'all', label: 'All Matches', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                    activeTab === tab.key
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                {/* Profile Image */}
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative">
                  {match.otherUser.avatar_url ? (
                    <img
                      src={match.otherUser.avatar_url}
                      alt={match.otherUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-4xl font-bold">
                      {match.otherUser.full_name.charAt(0)}
                    </div>
                  )}
                  
                  {/* Match Score Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Music className="h-3 w-3" />
                    <span>{match.match_score}%</span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                    {getStatusIcon(match.status)}
                    <span className="capitalize">{match.status}</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {match.otherUser.full_name}
                    </h3>
                    {match.otherUser.bio && (
                      <p className="text-gray-300 text-sm line-clamp-2">{match.otherUser.bio}</p>
                    )}
                  </div>

                  {/* Shared Interests */}
                  <div className="space-y-2">
                    {match.sharedInterests.artists.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-1">Shared Artists</p>
                        <div className="flex flex-wrap gap-1">
                          {match.sharedInterests.artists.slice(0, 3).map((artist, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded-full"
                            >
                              {artist}
                            </span>
                          ))}
                          {match.sharedInterests.artists.length > 3 && (
                            <span className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded-full">
                              +{match.sharedInterests.artists.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {match.sharedInterests.genres.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-1">Shared Genres</p>
                        <div className="flex flex-wrap gap-1">
                          {match.sharedInterests.genres.slice(0, 3).map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-pink-600/30 text-pink-200 text-xs rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                          {match.sharedInterests.genres.length > 3 && (
                            <span className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded-full">
                              +{match.sharedInterests.genres.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {match.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleMatchAction(match.id, 'accepted')}
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMatchAction(match.id, 'rejected')}
                          className="flex-1"
                        >
                          Pass
                        </Button>
                      </>
                    )}
                    
                    {match.status === 'accepted' && (
                      <Link to={`/chat/${match.id}`} className="w-full">
                        <Button size="sm" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No matches yet</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'pending' 
                ? 'No pending matches. Keep discovering new people!'
                : activeTab === 'accepted'
                ? 'No accepted matches yet. Accept some pending matches to start chatting!'
                : 'Start discovering people to find your music matches!'
              }
            </p>
            <Link to="/discover">
              <Button>
                <Music className="h-4 w-4 mr-2" />
                Discover Matches
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
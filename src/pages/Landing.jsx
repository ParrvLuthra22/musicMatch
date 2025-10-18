import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart, MessageCircle, Users, Play, Headphones } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Music,
      title: 'Music-Based Matching',
      description: 'Connect with people who share your musical taste through Spotify integration',
    },
    {
      icon: Heart,
      title: 'Smart Algorithm',
      description: 'Our algorithm analyzes your top artists and genres to find perfect matches',
    },
    {
      icon: MessageCircle,
      title: 'Real-Time Chat',
      description: 'Start conversations instantly with your music matches',
    },
    {
      icon: Users,
      title: 'Music Communities',
      description: 'Join communities based on your favorite genres and artists',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80" />
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Music className="h-12 w-12 text-purple-400" />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Tune<span className="text-purple-400">Mate</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Find your perfect match through the universal language of music. 
              Connect with people who share your musical soul.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/discover">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Play className="mr-2 h-5 w-5" />
                    Start Discovering
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Headphones className="mr-2 h-5 w-5" />
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How TuneMate Works
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Connect your Spotify account and let our algorithm find your perfect music matches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Music Match?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of music lovers who have found meaningful connections through TuneMate
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg">
                <Music className="mr-2 h-5 w-5" />
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
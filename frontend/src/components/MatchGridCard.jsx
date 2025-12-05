import React from 'react';
import { Play, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MatchGridCard = ({ match }) => {
    const navigate = useNavigate();
    const { user, score } = match;
    const photo = user.photos?.[0] || 'https://via.placeholder.com/300';

    const handleChat = (e) => {
        e.stopPropagation();
        // Assuming conversation exists or we can navigate to it. 
        // Ideally we need conversationId. 
        // If we don't have it, we might need to find it or create it.
        // For now, let's navigate to /conversations which lists them, or if we had ID we'd go there.
        // Let's assume we navigate to /conversations for now as a fallback.
        navigate('/conversations');
    };

    return (
        <div
            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/profile/${user._id}`)}
        >
            <img
                src={photo}
                alt={user.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Match Badge */}
            <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg">
                {Math.round(score)}% Match
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 className="text-xl font-bold text-white">{user.name}, {user.age}</h3>
                <p className="text-sm text-gray-300 truncate">{user.topGenres?.[0]} • {user.topArtists?.[0]?.name}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <button
                        onClick={handleChat}
                        className="flex-1 py-2 bg-green-500 hover:bg-green-400 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <MessageCircle size={18} /> Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchGridCard;

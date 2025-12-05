import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { MessageCircle } from 'lucide-react';

const ConversationsPage = () => {
    const [conversations, setConversations] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, []);

    const getOtherParticipant = (participants) => {
        return participants.find(p => p._id !== user._id) || participants[0];
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24">
            <h1 className="text-3xl font-bold mb-8">Messages</h1>

            <div className="space-y-4">
                {conversations.length > 0 ? (
                    conversations.map(conv => {
                        const otherUser = getOtherParticipant(conv.participants);
                        return (
                            <Link
                                to={`/chat/${conv._id}`}
                                key={conv._id}
                                className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                <div className="relative">
                                    {otherUser.photos && otherUser.photos[0] ? (
                                        <img
                                            src={otherUser.photos[0]}
                                            alt={otherUser.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                                            <span className="text-xl font-bold">{otherUser.name[0]}</span>
                                        </div>
                                    )}
                                    {/* Online status indicator could go here */}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate">{otherUser.name}</h3>
                                    <p className={`text-sm truncate ${conv.lastMessage?.read ? 'text-gray-500' : 'text-white font-medium'}`}>
                                        {conv.lastMessage?.sender === user._id ? 'You: ' : ''}
                                        {conv.lastMessage?.content || 'Start chatting!'}
                                    </p>
                                </div>

                                <div className="text-xs text-gray-500 whitespace-nowrap">
                                    {conv.lastMessage?.timestamp ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-500 mt-12">
                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No conversations yet.</p>
                        <p className="text-sm">Match with people to start chatting!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationsPage;

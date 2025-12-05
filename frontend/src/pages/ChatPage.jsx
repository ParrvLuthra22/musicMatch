import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ChatContext from '../context/ChatContext';
import { Send, ArrowLeft, Music, Play, ListMusic, Plus } from 'lucide-react';
import PlaylistView from '../components/PlaylistView';
import SongSearch from '../components/SongSearch';
import { useToast } from '../context/ToastContext';

const ChatPage = () => {
    const { id: conversationId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { socket } = useContext(ChatContext);
    const { addToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [playlist, setPlaylist] = useState(null);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                // Get messages
                const msgsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(msgsRes.data);

                // Get conversation details to find other user
                // Ideally we'd have a separate endpoint or pass state, but fetching list is okay for now
                const convsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentConv = convsRes.data.find(c => c._id === conversationId);
                if (currentConv) {
                    const other = currentConv.participants.find(p => p._id !== user._id);
                    setOtherUser(other);
                }
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        };

        const fetchPlaylist = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlists/${conversationId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlaylist(data);
            } catch (error) {
                // It's okay if playlist doesn't exist yet
                if (error.response?.status !== 404) {
                    console.error('Error fetching playlist:', error);
                }
            }
        };

        fetchMessages();
        fetchPlaylist();
    }, [conversationId, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_room', conversationId);

        socket.on('receive_message', (message) => {
            if (message.conversationId === conversationId) {
                setMessages(prev => [...prev, message]);
            }
        });

        return () => {
            socket.off('receive_message');
        };
    }, [socket, conversationId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationId}/message`, {
                content: newMessage,
                type: 'text'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistically add message (though socket will also send it back, we can dedup or just wait for socket)
            // Actually, let's wait for socket or just add it if we want instant feedback.
            // The controller emits 'receive_message', so we might get a duplicate if we add it here AND listen to socket.
            // Standard practice: Add it here, and in socket listener, check if ID exists.
            // For simplicity, let's just rely on the socket event for now, or add it and ignore the socket event for self.

            // Let's just clear input and wait for socket (fast enough locally)
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleCreatePlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/playlists/create`, {
                conversationId,
                name: `TuneMate: ${user.name} & ${otherUser?.name || 'Friend'}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaylist(data);
            setShowPlaylist(true);
            addToast('Playlist created!', 'success');
        } catch (error) {
            console.error('Error creating playlist:', error);
            addToast('Failed to create playlist. Make sure you have synced your Spotify account.', 'error');
        }
    };

    const handleAddTrack = async (track) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/playlists/${playlist._id}/add-track`, {
                trackUri: track.uri,
                trackDetails: {
                    spotifyTrackId: track.spotifyTrackId,
                    name: track.name,
                    artist: track.artist,
                    albumArt: track.albumArt
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaylist(prev => ({
                ...prev,
                songs: [...prev.songs, track]
            }));

            // Send system message about added song
            await axios.post(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationId}/message`, {
                content: `Added "${track.name}" by ${track.artist} to the playlist`,
                type: 'text'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            addToast(`Added "${track.name}" to playlist`, 'success');
            setShowSearch(false);
        } catch (error) {
            console.error('Error adding track:', error);
            addToast('Failed to add track', 'error');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white relative">
            {/* Playlist Modal */}
            {showPlaylist && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md">
                        <button
                            onClick={() => setShowPlaylist(false)}
                            className="absolute -top-10 right-0 text-white/50 hover:text-white"
                        >
                            Close
                        </button>
                        <PlaylistView
                            playlist={playlist}
                            onAddTrack={() => setShowSearch(true)}
                        />
                    </div>
                </div>
            )}

            {/* Search Modal */}
            {showSearch && (
                <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <SongSearch
                        onSelect={handleAddTrack}
                        onCancel={() => setShowSearch(false)}
                    />
                </div>
            )}

            {/* Header */}
            <div className="p-4 bg-gray-900 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/conversations')} className="text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    {otherUser && (
                        <div className="flex items-center gap-3">
                            <img
                                src={otherUser.photos?.[0] || 'https://via.placeholder.com/40'}
                                alt={otherUser.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <h2 className="font-bold text-lg">{otherUser.name}</h2>
                        </div>
                    )}
                </div>

                {/* Playlist Action */}
                {playlist ? (
                    <button
                        onClick={() => setShowPlaylist(true)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-green-500 transition-colors"
                        title="View Shared Playlist"
                    >
                        <ListMusic size={24} />
                    </button>
                ) : (
                    <button
                        onClick={handleCreatePlaylist}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                    >
                        <Plus size={16} className="text-green-500" />
                        <span>Playlist</span>
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, index) => {
                    const isOwn = msg.sender._id === user.id;
                    return (
                        <div
                            key={index}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-up`}
                        >
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200'
                                }`}>
                                <p>{msg.content}</p>
                                <span className="text-[10px] opacity-70 block text-right mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2">
                <button
                    type="button"
                    className="p-3 text-gray-400 hover:text-green-500 transition-colors"
                    title="Send Song (Coming Soon)"
                >
                    <Music size={24} />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-white rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatPage;


import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ChatContext from '../context/ChatContext';
import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import SongSearch from '../components/SongSearch';
import { useToast } from '../context/ToastContext';

const ChatPage = () => {
    const { conversationId } = useParams(); // Note: route is /chat/:conversationId. In App.jsx it is :conversationId
    const { user } = useContext(AuthContext);
    const { socket } = useContext(ChatContext);
    const { addToast } = useToast();

    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChatData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                // 1. Fetch Messages
                const msgsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(msgsRes.data);

                // 2. Fetch Conversation Details (to get other user)
                // Assuming we can get single conversation or filter from list.
                // Reusing the list fetch for now since we don't have a single-get endpoint verified
                const convsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentConv = convsRes.data.find(c => c._id === conversationId);

                if (currentConv) {
                    const other = currentConv.participants.find(p => p._id !== user._id);
                    setOtherUser(other);
                }
            } catch (error) {
                console.error('Error fetching chat:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchChatData();
        }
    }, [conversationId, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        if (!socket) return;
        socket.emit('join_room', conversationId);

        const handleReceiveMessage = (message) => {
            if (message.conversationId === conversationId) {
                setMessages(prev => [...prev, message]);
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, conversationId]);

    const sendMessage = async (content, type = 'text', spotifyTrack = null) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/conversations/${conversationId}/message`, {
                content,
                type,
                spotifyTrack
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // We rely on socket to append, but can optimistically append if needed. 
            // Current socket logic works fine.
        } catch (error) {
            console.error('Error sending message:', error);
            addToast('Failed to send message', 'error');
        }
    };

    const handleSendText = (text) => {
        sendMessage(text, 'text');
    };

    const handleSendSong = (track) => {
        sendMessage(
            `Shared a song: ${track.name}`,
            'song',
            {
                id: track.spotifyTrackId || track.id,
                name: track.name,
                artist: track.artist,
                image: track.albumArt || track.image // normalized
            }
        );
        setShowSearch(false);
    };

    return (
        <div className="flex flex-col h-screen bg-bg-dark text-white font-body selection:bg-primary selection:text-black relative">

            {/* Song Search Overlay */}
            {showSearch && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    {/* Reusing existing SongSearch but could style it better if I had access to internal code. 
                         For now, assuming it works as modal content. */}
                    <div className="w-full max-w-lg bg-bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setShowSearch(false)}
                            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white"
                        >
                            Close
                        </button>
                        <SongSearch
                            onSelect={handleSendSong}
                            onCancel={() => setShowSearch(false)}
                        />
                    </div>
                </div>
            )}

            {/* Header */}
            <ChatHeader otherUser={otherUser} matchScore={null} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar bg-gradient-to-b from-bg-dark to-black">
                {/* Match Banner (Example) */}
                <div className="text-center mb-8 opacity-50">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Matched on TuneMate</p>
                    <p className="text-xs text-gray-500 mt-1">You both listen to The Weeknd</p>
                </div>

                {loading ? (
                    <div className="flex justify-center pt-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble
                            key={index}
                            message={msg}
                            isOwn={msg.sender._id === user._id}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <ChatInput
                onSendMessage={handleSendText}
                onOpenSongSearch={() => setShowSearch(true)}
            />
        </div>
    );
};

export default ChatPage;

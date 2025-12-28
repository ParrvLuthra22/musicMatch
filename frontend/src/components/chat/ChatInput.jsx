import React, { useState } from 'react';
import { Send, Music, Smile } from 'lucide-react';

const ChatInput = ({ onSendMessage, onOpenSongSearch }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="p-4 bg-bg-dark border-t border-white/5 sticky bottom-0 z-30 pb- safe-area-bottom">
            <form
                onSubmit={handleSubmit}
                className="flex items-end gap-3 max-w-4xl mx-auto"
            >
                <button
                    type="button"
                    onClick={onOpenSongSearch}
                    className="p-3 mb-1 text-gray-400 hover:text-green-500 bg-bg-card hover:bg-bg-card/80 border border-white/5 rounded-xl transition-all"
                    title="Share a Song"
                >
                    <Music size={20} />
                </button>

                <div className="flex-1 bg-bg-card border border-white/5 rounded-2xl flex items-center focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full bg-transparent text-white px-4 py-3 max-h-32 min-h-[46px] resize-none focus:outline-none text-sm md:text-base custom-scrollbar"
                        rows={1}
                    />
                    <button
                        type="button"
                        className="p-3 text-gray-500 hover:text-white transition-colors"
                    >
                        <Smile size={20} />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-3 mb-1 bg-primary text-black rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;

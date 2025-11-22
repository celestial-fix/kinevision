import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import config from '../config';

const MessagingComponent = ({ currentUserEmail, otherUserEmail, otherUserName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/messages/${currentUserEmail}`);
            if (response.ok) {
                const data = await response.json();
                // Filter messages between these two users
                const filtered = data.filter(msg =>
                    (msg.sender.email === currentUserEmail && msg.receiver.email === otherUserEmail) ||
                    (msg.sender.email === otherUserEmail && msg.receiver.email === currentUserEmail)
                );
                setMessages(filtered);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [currentUserEmail, otherUserEmail]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`${config.API_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_email: currentUserEmail,
                    receiver_email: otherUserEmail,
                    content: newMessage
                }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-semibold">{otherUserName}</h3>
                    <p className="text-xs text-slate-400">Online</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="text-center text-slate-400">Cargando mensajes...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-10">No hay mensajes aún. ¡Di hola!</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender.email === currentUserEmail;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none'
                                    }`}>
                                    <p>{msg.content}</p>
                                    <span className="text-[10px] opacity-70 block text-right mt-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default MessagingComponent;

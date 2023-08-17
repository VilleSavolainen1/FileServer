import React, { useState } from 'react';
import { getValueForKey } from '../utils';
const { v4: uuidv4 } = require('uuid');

const ChatFooter = ({ socket }: any) => {
    const [message, setMessage] = useState('');

    const handleTyping = () => {
        socket.emit('typing', `${getValueForKey('chat_user')} kirjoittaa...`);
    }

    const handleSendMessage = (e: any) => {
        e.preventDefault();
        socket.emit('send_message', {
            message: message,
            name: getValueForKey('chat_user'),
            id: uuidv4(),
            socketID: socket.id,
        });
        setMessage('');
    };
    return (
        <div className="bottomPlayer">
            <form className="chatForm" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Kirjoita viesti..."
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                />
                <button className="sendBtn">Lähetä</button>
            </form>
        </div>
    );
};

export default ChatFooter;

import React, { useState } from 'react';
import { getValueForKey } from '../utils';
import { sendIcon } from '../images';
const { v4: uuidv4 } = require('uuid');

const ChatFooter = ({ socket }: any) => {
    const [message, setMessage] = useState('');

    const handleTyping = () => {
        socket.emit('typing', `${getValueForKey('chat_user')} kirjoittaa...`);
    }

    const handleSendMessage = (e: any) => {
        e.preventDefault();
        if (message !== '') {
            const current = new Date();

            const time = current.toLocaleTimeString("fi-FI", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });
            socket.emit('send_message', {
                message: message,
                name: getValueForKey('chat_user'),
                id: uuidv4(),
                socketID: socket.id,
                time: time
            });
        }
        setMessage('');
    };
    return (
        <div className="bottomPlayer">
            <form className="chatForm" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="message"
                    autoFocus={true}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                />
                <img alt="speech" onClick={handleSendMessage} style={{ width: '40px', marginLeft: '10px', cursor: 'pointer' }} src={sendIcon}></img>
            </form>
        </div>
    );
};

export default ChatFooter;

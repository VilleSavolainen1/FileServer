import React from 'react';
import { getValueForKey } from '../utils';

const ChatBody = ({ messages, typingStatus, lastMessageRef, users }: any) => {
   
    return (
        <div className="main">

            {/*This shows messages sent from you*/}
            <div className="message__container">
                {messages.map((message: any) =>
                    message.name === getValueForKey('chat_user') ? (
                        <div className="message__chats" key={message.id}>
                            <p className="sender__name">Sinä</p>
                            <div className="message__sender">
                                <p className="message_sender_text">{message.message}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="message__chats" key={message.id}>
                            <p className={users.some((usr: any) => usr.userName === message.name) ? "sender__name" : "sender__name__offline"}>{message.name}</p>
                            <div className="message__recipient">
                                <p className="message_recipient_text">{message.message}</p>
                            </div>
                        </div>
                    )
                )}
                {/*This is triggered when a user is typing*/}
                <div className="message__status">
                    <p style={{color: 'grey', fontSize: '13px'}}>{typingStatus}</p>
                </div>
                <div style={{marginBottom: '110px'}} ref={lastMessageRef} />
            </div>
        </div>
    );
};

export default ChatBody;

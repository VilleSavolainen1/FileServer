import React from 'react';
import { deleteValueForKey } from '../utils';
import { useNavigate } from 'react-router-dom';

const ChatBar = ({ users }: any) => {

    const navigate = useNavigate();


    const handleLeaveChat = () => {
        deleteValueForKey('chat_user')
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="chat__sidebar">
                <div className="chat__users">
                    <p style={{marginLeft: '10px', color: 'white'}}>Paikalla: </p>
                    {users.map((user: any) => (
                        <p style={{color: 'grey', marginLeft: '10px'}} key={user.socketID}>{user.userName}</p>
                    ))}
                </div>
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    Poistu
                </button>
        </div>
    );
};

export default ChatBar;

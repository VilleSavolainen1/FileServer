import React from 'react'
import { storeValueForKey } from '../utils';
import ChatBody from '../components/ChatBody';
import ChatBar from '../components/ChatBar';
import ChatFooter from '../components/ChatFooter';


interface chatProps {
    socket: any
}

const Chat = ({ socket }: chatProps) => {

    const [userName, setUserName] = React.useState('')
    const [message, setMessage] = React.useState('')
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [messageReceived, setMessageReceived] = React.useState<any>([])
    const [typingStatus, setTypingStatus] = React.useState('')
    const [users, setUsers] = React.useState<any>([])

    const lastMessageRef = React.useRef<any>(null);


    const usernameChange = (e: any) => {
        setMessage('')
        setUserName(e.target.value)
    }

    React.useEffect(() => {
        socket.on('newUserResponse', (data: any) => setUsers(data));
    }, [socket]);

    const onSubmit = (e: any) => {
        e.preventDefault()
        if (userName !== '') {
            setLoggedIn(true)
            storeValueForKey('chat_user', userName)
            socket.emit('newUser', { userName, socketID: socket.id })
        } else {
            setMessage('Anna käyttäjänimi')
        }
    }


    React.useEffect((): any => {
        socket.on('receive_message', (data: any) => {
            setMessageReceived([...messageReceived, data])
        })
    }, [socket, messageReceived])

    React.useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageReceived]);

    React.useEffect(() => {
        socket.on('typingResponse', (data: any) => setTypingStatus(data));
        setTypingStatus('')
    }, [socket, typingStatus]);



    if (!loggedIn) {
        return (
            <div className="chatRoom">
                <div className="chatLog">
                    <form className="loginForm" onSubmit={onSubmit}>
                        <input id="foldernameinput" type="text" name="username" value={userName} autoFocus={true} placeholder="Nimi" onChange={usernameChange}></input>
                        <div className="blank"></div>
                        <input className="form-submit" type="submit" value="Sisään"></input>
                        <p className="errorMessage" style={{ color: 'red' }}>{message}</p>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <div className="main">
                <div className="chat">
                    <ChatBar socket={socket} users={users} />
                    <div className="chat__main">
                        <ChatBody messages={messageReceived} typingStatus={typingStatus} lastMessageRef={lastMessageRef} users={users} />
                        <ChatFooter socket={socket} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat
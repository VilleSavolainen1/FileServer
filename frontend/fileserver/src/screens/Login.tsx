import React from 'react';
import { getValueForKey, storeValueForKey } from '../utils';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

interface LoginProps {
    setHasLoggedIn: (value: boolean) => void
    isLoading: (value: boolean) => void
}

const Login = ({setHasLoggedIn, isLoading}: LoginProps) => {

    const [username, setUserName] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [message, setMessage] = React.useState('')
    const navigate = useNavigate()


    const signInUser = async () => {
        axios.post('/signin', { username: username, password: password }).then(res => {
            if (res.status === 200) {
                isLoading(true)
                storeValueForKey('access_token', res.data.token)
                setHasLoggedIn(true)
                navigate('/')
            } else {
                setMessage('Väärä käyttäjänimi tai salasana')
                setUserName('')
                setPassword('')
                isLoading(false)
            }
        }).catch(err => {
            isLoading(false)
            setMessage('Väärä käyttäjänimi tai salasana')
            setUserName('')
            setPassword('')
        })
    }


    const usernameChange = (e: any) => {
        setMessage('')
        setUserName(e.target.value)
    }

    const passwordChange = (e: any) => {
        setMessage('')
        setPassword(e.target.value)
    }

    const onSubmit = (e: any) => {
        e.preventDefault()
        if (username !== '' && password !== '') {
            signInUser()
        } else {
            setMessage('Anna käyttäjänimi ja salasana')
        }
    }



    return (
        <div className='App-login'>
            <div className="login">
                <form className="loginForm" onSubmit={onSubmit}>
                    <input id="foldernameinput" type="text" name="username" value={username} placeholder="Käyttäjänimi" onChange={usernameChange}></input>
                    <div className="blank"></div>
                    <input id="foldernameinput" type="password" name="password" value={password} placeholder="Salasana" onChange={passwordChange} ></input>
                    <div className="blank"></div>
                    <input className="form-submit" type="submit" value="Kirjaudu"></input>
                    <p className="message">{message}</p>
                </form>
            </div>
        </div>
    )
}

export default Login;
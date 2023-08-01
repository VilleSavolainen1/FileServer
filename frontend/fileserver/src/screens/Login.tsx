import React from 'react';
import { signIn } from '../services';
import { getValueForKey, storeValueForKey } from '../utils';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

const Login = () => {

    const [username, setUserName] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [message, setMessage] = React.useState('')
    const navigate = useNavigate()


    const signInUser = async () => {
        axios.post('/signin', { username: username, password: password }).then(res => {
            if (res.status === 200) {
                storeValueForKey('access_token', res.data.token)
                navigate('/')
            }
        }).catch(err => {
            console.log(err)
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
                    <input id="foldernameinput" type="text" name="username" placeholder="Käyttäjänimi" onChange={usernameChange}></input>
                    <div className="blank"></div>
                    <input id="foldernameinput" type="password" name="password" placeholder="Salasana" onChange={passwordChange} ></input>
                    <div className="blank"></div>
                    <input className="form-submit" type="submit" value="Kirjaudu" style={{ height: '28px', width: '100px' }} ></input>
                    <p className="message">{message}</p>
                </form>
            </div>
        </div>
    )
}

export default Login;
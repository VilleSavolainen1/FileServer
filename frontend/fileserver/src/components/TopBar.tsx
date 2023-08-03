import React from 'react'
import { logoutIcon } from '../images'

export interface TopBarProps {
    signOut: () => void
}

const TopBar = ({ signOut }: TopBarProps) => {
    return (
        <div className="topBar">
            <div className="topBarContent">
                <div className="logout">
                    <button className="logOutButton" onClick={signOut}>Kirjaudu ulos</button>
                    <img src={logoutIcon} alt="folder" style={{ width: '20px' }} />
                </div>
            </div>
        </div>
    )
}

export default TopBar
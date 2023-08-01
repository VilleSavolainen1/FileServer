import React from 'react'

export interface TopBarProps {
    signOut: () => void
}

const TopBar = ({ signOut }: TopBarProps) => {
    return (
        <div className="topBar">
            <div className="topBarContent">
                <button className="logOutButton" onClick={signOut}>Kirjaudu ulos</button>
            </div>
        </div>
    )
}

export default TopBar
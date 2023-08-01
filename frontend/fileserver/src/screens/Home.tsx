import { deleteValueForKey, getValueForKey } from "../utils"
import { useNavigate } from "react-router-dom"
import React from 'react'
import TopBar from "../components/TopBar";
import FoldersView from "../components/FoldersView";

const Home = () => {

    const navigate = useNavigate()

    const logOut = () => {
        deleteValueForKey('access_token')
        navigate('/login')
    }

    React.useEffect(() => {
        const token = getValueForKey('access_token')
        if (!token) {
            navigate('/login')
        }
    }, [])


    return (
        <div className="main">
            <TopBar signOut={logOut} />
            <FoldersView />
        </div>
    )
}

export default Home;
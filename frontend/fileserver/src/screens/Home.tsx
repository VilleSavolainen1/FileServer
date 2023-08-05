import { deleteValueForKey, getValueForKey } from "../utils"
import { useNavigate } from "react-router-dom"
import React from 'react'
import FoldersView from "../components/FoldersView";
import axios from "axios";
import TopBar from "../components/TopBar";
import { Folder, diskSpace } from "../types";
import { DiskSpace } from "check-disk-space";

interface homeProps {
    folders: Folder[]
    isLoading: (value: boolean) => void
    logOut: () => void
    diskSpace: diskSpace
}

const Home = ({ folders, isLoading, logOut, diskSpace }: homeProps) => {

    const navigate = useNavigate()


    React.useEffect(() => {
        const token = getValueForKey('access_token')
        if (!token) {
            navigate('/login')
        }
    }, [navigate])


    return (
        <div className="main">
            <TopBar signOut={logOut} diskSpace={diskSpace} />
            <FoldersView folders={folders}/>
        </div>
    )
}

export default Home;
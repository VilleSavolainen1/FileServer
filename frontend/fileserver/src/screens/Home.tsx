import { getValueForKey } from "../utils"
import { useNavigate } from "react-router-dom"
import React from 'react'
import FoldersView from "../components/FoldersView";
import TopBar from "../components/TopBar";
import { Folder, diskSpace } from "../types";

interface homeProps {
    folders: Folder[]
    isLoading: (value: boolean) => void
    logOut: () => void
    diskSpace: diskSpace
    createFolder: (value: string) => void
    deleteSelectedFolder: (foldername: string) => void
}

const Home = ({ folders, logOut, diskSpace, createFolder,deleteSelectedFolder }: homeProps) => {

    const navigate = useNavigate()

    React.useEffect(() => {
        const token = getValueForKey('access_token')
          if (!token) {
            navigate('/login')
          }
      }, [])

    return (
        <div className="main">
            <TopBar signOut={logOut} diskSpace={diskSpace} />
            <FoldersView folders={folders} createFolder={createFolder} deleteSelectedFolder={deleteSelectedFolder}/>
        </div>
    )
}

export default Home;
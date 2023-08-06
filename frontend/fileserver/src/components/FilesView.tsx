import React, { useRef } from 'react'
import TopBar from './TopBar';
import { useParams } from 'react-router-dom'
import { Folder, diskSpace } from '../types';
import UploadFile from './UploadFile';
import { getFileNames } from '../services';
import { getValueForKey } from '../utils';
import Loader from './Loader';


interface filesProps {
    folders: Folder[]
    isLoading: (value: boolean) => void
    logOut: () => void
    diskSpace: diskSpace
}

const FilesView = ({ folders, isLoading, logOut, diskSpace }: filesProps) => {
    const [fileNames, setFileNames] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const name = useParams().name


    const getCurrentFolderFileNames = async () => {
        setLoading(true)
        const token = getValueForKey('access_token')
        const files = await getFileNames(token)
        const data = files.data
        const currentFolderFiles = data.filter((file: any) => file.folder === name)
        setFileNames(currentFolderFiles)
        setLoading(false)
    }

    React.useEffect(() => {
        getCurrentFolderFileNames()
    }, [])




    return (
        <div className="main">
            <TopBar signOut={logOut} diskSpace={diskSpace} />
            {loading ? <Loader /> :
                <div className="foldersView">
                    <div className="foldersContent">
                        <div className="foldersHeader">
                            <h2 style={{ color: '#ffffff' }}>{name}</h2>
                        </div>
                        <div className="filesView">
                            <div>
                                <audio controls src="/files/saw.wav" />
                            </div>
                        </div>
                        <UploadFile name={name} isLoading={isLoading} />
                    </div>
                </div>}
        </div>
    )
}

export default FilesView
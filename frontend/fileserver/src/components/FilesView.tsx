import React, { useRef } from 'react'
import TopBar from './TopBar';
import { useNavigate, useParams } from 'react-router-dom'
import { Folder, diskSpace } from '../types';
import UploadFile from './UploadFile';
import { getFileNames } from '../services';
import { getValueForKey } from '../utils';
import Loader from './Loader';
import { arrowBackIcon, emptyIcon } from '../images';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';


interface filesProps {
    folders: Folder[] | undefined
    isLoading: (value: boolean) => void
    logOut: () => void
    diskSpace: diskSpace
    deleteSelectedFile: (filename: string, id: string) => void
}

const FilesView = ({ folders, isLoading, logOut, diskSpace, deleteSelectedFile }: filesProps) => {
    const [fileNames, setFileNames] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const name = useParams().foldername
    const navigate = useNavigate();

    const src = '/files/'


    const getCurrentFolderFileNames = async () => {
        setLoading(true)
        const token = getValueForKey('access_token')
        const files = await getFileNames(token)
        const data = files.data
        const currentFolderFiles = data.filter((file: any) => file.folder === name)
        setFileNames(currentFolderFiles)
        setLoading(false)
    }

    const onPressDeleteFile = (filename: string, id: string) => {
        let ask = window.confirm("Poistetaanko " + filename + "?");
        if (ask) {
            try {
                deleteSelectedFile(filename, id)
                getCurrentFolderFileNames()
            } catch (err) {
                console.log(err)
            }
        }
    }

    React.useEffect(() => {
        getCurrentFolderFileNames()
    }, [])

    const renderFiles = () => {
        if (fileNames.length || fileNames === undefined) {
            return fileNames.map((file: any) => {
                let fileType = file.file.split(".")[1]; // .txt .wav ....
                let date = new Date(file.date).toLocaleDateString('fi-Fi')
                if (fileType === 'wav' || fileType === 'mp3') {
                    return (
                        <div key={file.id} className="fileRow">
                            <p id="file-date">{file.file}</p>
                            <AudioPlayer src={src + file.file.toLowerCase()} showSkipControls={false} showJumpControls={false}
                                customAdditionalControls={[RHAP_UI.CURRENT_LEFT_TIME]} customProgressBarSection={[RHAP_UI.PROGRESS_BAR]} customVolumeControls={[]}
                                style={{ width: '200px', background: 'transparent' }} layout="horizontal" />
                            <p id="file-date">{date}</p>
                            <a href={src + file.file.toLowerCase()} download target="_self"><button className="downloadButton">Lataa</button></a>
                            <button className="deleteButton" onClick={() => onPressDeleteFile(file.file, file.id)}>Poista</button>
                        </div>
                    )
                } else {
                    return (
                        <div key={file.id} className="fileRow">
                            <p id="file-date">{file.file}</p>
                            <p id="file-date">{date}</p>
                            <button onClick={() => onPressDeleteFile(file.file, file.id)}>Poista</button>
                        </div>
                    )
                }
            })
        } else {
            return (
                <div className="emptyFolder">
                    <img src={emptyIcon}></img>
                    <h3 style={{ color: '#ffffff' }}>Tyhjä</h3>
                </div>
            )
        }
    }


    return (
        <div className="main">
            <TopBar signOut={logOut} diskSpace={diskSpace} />
            {loading ? <Loader /> :
                <div className="foldersView">
                    <div className="navigation">
                        <div className="arrowBack">
                            <img src={arrowBackIcon} onClick={() => navigate(-1)} alt="arrow" style={{ width: '30px', cursor: 'pointer' }} />
                        </div>
                    </div>
                    <div className="foldersContent">
                        <div className="foldersHeader">
                            <h1 style={{ color: '#ffffff', marginBottom: '40px' }}>{name}</h1>
                            <UploadFile name={name} isLoading={isLoading} />
                        </div>
                        <div className="filesView">
                            {renderFiles()}
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default FilesView
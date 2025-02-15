import React from 'react'
import TopBar from './TopBar';
import { useNavigate, useParams } from 'react-router-dom'
import { Folder, diskSpace } from '../types';
import UploadFile from './UploadFile';
import { getFileNames } from '../services';
import { getValueForKey } from '../utils';
import Loader from './Loader';
import { arrowBackIcon, downloadIcon, emptyIcon, fileIcon, pauseIcon, playIcon, trashIcon } from '../images';
import 'react-h5-audio-player/lib/styles.css';
import BottomPlayer from './BottomPlayer';


interface filesProps {
    folders: Folder[] | undefined
    isLoading: (value: boolean) => void
    logOut: () => void
    diskSpace: diskSpace
    deleteSelectedFile: (filename: string, id: string) => void
}

const FilesView = ({ isLoading, logOut, diskSpace, deleteSelectedFile }: filesProps) => {
    const [fileNames, setFileNames] = React.useState([])
    const [allFileNames, setAllFileNames] = React.useState([])
    const [selectedFile, setSelectedFile] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const name = useParams().foldername
    const navigate = useNavigate();

    const src = '/files/'


    const getCurrentFolderFileNames = async () => {
        setLoading(true)
        const token = getValueForKey('access_token')
        const files = await getFileNames(token)
        setAllFileNames(files.data)
        const data = files.data
        const currentFolderFiles = data.filter((file: any) => file.folder === name)
        setFileNames(currentFolderFiles)
        setLoading(false)
    }

    const onPressDeleteFile = (filename: string, id: string) => {
        setSelectedFile('')
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
        const token = getValueForKey('access_token')
        if (token) {
            getCurrentFolderFileNames()
        } else {
            navigate('/')
        }
    }, [navigate])


    const renderFiles = () => {
        if (fileNames.length || fileNames === undefined) {
            return fileNames.map((file: any) => {
                let fileType = file.file.split(/\.(?=[^\.]+$)/)[1]; // .txt .wav ....
                let date = new Date(file.date).toLocaleDateString('fi-Fi')
                if (fileType === 'wav' || fileType === 'mp3') {
                    return (
                        <div key={file.id} className="fileRow">
                            <div className="fileNameRow">
                                <p id={selectedFile === src + file.file.toLowerCase() ? "file-name-playing" : "file-name"}>{file.file}</p>
                            </div>
                            <div className="playButtons">
                                {selectedFile === src + file.file.toLowerCase() ?
                                    <img alt="pause" src={pauseIcon} style={{ width: '35px', cursor: 'pointer' }} onClick={() => setSelectedFile('')}></img>
                                    :
                                    <img alt="play" src={playIcon} style={{ width: '35px', cursor: 'pointer' }} onClick={() => setSelectedFile(src + file.file.toLowerCase())} ></img>
                                }
                            </div>
                            <p id="file-date">{date}</p>
                            <div className="fileActionButtons">
                                <a href={src + file.file.toLowerCase()} download target="_self"><img alt="download" className="downloadButton" src={downloadIcon}></img></a>
                                <img alt="trash" className="deleteButton" src={trashIcon} onClick={() => onPressDeleteFile(file.file, file.id)}></img>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={file.id} className="fileRow">
                            <div className="fileNameRow">
                                <p id="file-name">{file.file}</p>
                            </div>
                            <div className="playButtons">
                                <img alt="file" src={fileIcon} style={{ width: '20px', marginLeft: '6px' }}></img>
                            </div>
                            <p id="file-date">{date}</p>
                            <div className="fileActionButtons">
                                <a href={src + file.file.toLowerCase()} download target="_self"><img alt="download" className="downloadButton" src={downloadIcon}></img></a>
                                <img alt="trash" className="deleteButton" src={trashIcon} onClick={() => onPressDeleteFile(file.file, file.id)}></img>
                            </div>
                        </div>
                    )
                }
            })
        } else {
            return (
                <div className="emptyFolder">
                    <img alt="empty" src={emptyIcon}></img>
                    <h3 style={{ color: '#ffffff' }}>Tyhjä</h3>
                </div>
            )
        }
    }


    return (
        <div className="main">
            <TopBar signOut={logOut} diskSpace={diskSpace} />
            {loading ? <Loader /> :
                <div className="allFilesView">
                    <div className="navigation">
                        <div className="arrowBack">
                            <img src={arrowBackIcon} onClick={() => navigate(-1)} alt="arrow" style={{ width: '30px', cursor: 'pointer' }} />
                        </div>
                    </div>
                    <div className="foldersContent">
                        <div className="foldersHeader">
                            <h1 style={{ color: '#ffffff', marginBottom: '20px' }}>{name}</h1>
                            <UploadFile name={name} isLoading={isLoading} allFileNames={allFileNames} />
                        </div>
                        <div className="filesView">
                            {renderFiles()}
                        </div>
                    </div>
                </div>}
            {fileNames.length && <BottomPlayer file={selectedFile} />}
        </div>
    )
}

export default FilesView
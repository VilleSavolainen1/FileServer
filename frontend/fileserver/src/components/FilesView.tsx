import React, { useRef } from 'react'
import TopBar from './TopBar';
import { useParams } from 'react-router-dom'
import { Folder, diskSpace } from '../types';
import UploadFile from './UploadFile';
import { getFileNames } from '../services';
import { getValueForKey } from '../utils';
import Loader from './Loader';
import { emptyIcon } from '../images';


interface filesProps {
    folders: Folder[]
    isLoading: (value: boolean) => void
    logOut: () => void
    diskSpace: diskSpace
    deleteSelectedFile: (filename: string, id: string) => void
}

const FilesView = ({ folders, isLoading, logOut, diskSpace, deleteSelectedFile }: filesProps) => {
    const [fileNames, setFileNames] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const name = useParams().name

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
        console.log('FILENAME: ', filename, 'ID: ', id)
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
        if (fileNames.length) {
            return fileNames.map((file: any) => {
                console.log('FILE: ', file)
                let fileType = file.file.split(".")[1]; // .txt .wav ....
                let date = new Date(file.date).toLocaleDateString('fi-fi')
                if (fileType === 'wav') {
                    return (
                        <div key={file.id} className="fileRow">
                            <p id="file-date">{file.file}</p>
                            <audio controls src={src + file.file}></audio>
                            <p id="file-date">{date}</p>
                            <button onClick={() => onPressDeleteFile(file.file, file.id)}>Poista</button>
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
                    <div className="foldersContent">
                        <div className="foldersHeader">
                            <h2 style={{ color: '#ffffff' }}>{name}</h2>
                        </div>
                        <div className="filesView">
                        </div>
                        <UploadFile name={name} isLoading={isLoading} />
                        <div className="foldersCard">
                            {renderFiles()}
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default FilesView
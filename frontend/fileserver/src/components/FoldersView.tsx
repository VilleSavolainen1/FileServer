import React from 'react'
import { emptyIcon, folderIcon } from '../images';
import { Link } from 'react-router-dom';
import { Folder } from '../types';


interface foldersProps {
    folders: Folder[]
    createFolder: (value: string) => void
    deleteSelectedFolder: (foldername: string) => void
}


const FoldersView = ({ folders, createFolder,deleteSelectedFolder }: foldersProps) => {

    const [folderName, setFolderName] = React.useState('')

    const onChangeFolderName = (e: any) => {
        setFolderName(e.target.value)
        console.log(folderName)
    }

    const onPressCreateFolder = () => {
        console.log(folderName.length)
        if (folderName.length === 0) {
            setFolderName('')
        } else {
            createFolder(folderName)
        }
    }

    const onPressDeleteFolder = (foldername: string) => {
        let ask = window.confirm("Poistetaanko " + folderName + "?");
        if (ask) {
            deleteSelectedFolder(foldername)
        }
    }

    const renderFolders = () => {
        if (folders && folders.length > 0) {
            return folders.map(fldr => {
                return (
                    <div key={fldr.id}>
                        <div className="singleFolder">
                            <img className="folderImage" src={folderIcon} />
                            <Link className="folderName" to={`folders/${fldr.name}`}>{fldr.name}</Link>
                            <button onClick={() => onPressDeleteFolder(fldr.name)}>Poista</button>
                        </div>
                        <div className="divider"></div>
                    </div>
                )
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
        <div className="foldersView">
            <div className="foldersContent">
                <div className="foldersHeader">
                    <h2 style={{ color: '#ffffff' }}>Kansiot</h2>
                </div>
                <div className="createFolderForm">
                    <input id="foldernameinput" type="text" name="username" placeholder="Uusi kansio" onChange={onChangeFolderName}></input>
                    <button onClick={() => onPressCreateFolder()} >Luo</button>
                </div>
                <div className="foldersCard">
                    {renderFolders()}
                </div>
            </div>
        </div>
    )
}

export default FoldersView
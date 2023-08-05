import React from 'react'
import { getValueForKey } from '../utils';
import axios from 'axios';
import { emptyIcon, folderIcon } from '../images';
import { useNavigate } from "react-router-dom"
import Loader from './Loader';
import { Link } from 'react-router-dom';
import { Folder } from '../types';


interface foldersProps {
    folders: Folder[]
}

const FoldersView = ({ folders }: foldersProps) => {

    const renderFolders = () => {
        if (folders && folders.length > 0) {
            return folders.map(fldr => {
                return (
                    <div key={fldr.id}>
                        <div className="singleFolder">
                            <img className="folderImage" src={folderIcon} />
                            <Link className="folderName" to={`folders/${fldr.name}`}>{fldr.name}</Link>
                        </div>
                        <div className="divider"></div>
                    </div>
                )
            })
        } else {
            return (
                <div className="emptyFolder">
                    <img src={emptyIcon}></img>
                    <h3>Tyhjä</h3>
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
                <div className="foldersCard">
                    {renderFolders()}
                </div>
            </div>
        </div>
    )
}

export default FoldersView
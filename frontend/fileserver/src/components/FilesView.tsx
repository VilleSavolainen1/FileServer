import React from 'react'
import { deleteValueForKey, getValueForKey } from '../utils';
import axios from 'axios';
import { emptyIcon, folderIcon } from '../images';
import { useNavigate } from "react-router-dom"
import Loader from './Loader';
import TopBar from './TopBar';
import {useParams} from 'react-router-dom'
import { Folder, diskSpace } from '../types';
import { DiskSpace } from 'check-disk-space';

interface filesProps {
    folders: Folder[]
    isLoading: (value: boolean) => void
    logOut: () => void
    diskSpace: diskSpace
}

const FilesView = ({folders, isLoading, logOut, diskSpace }: filesProps) => {
    const name = useParams().name

    console.log('NAME: ', name)


    return (
        <div className="main">
            <TopBar signOut={logOut} diskSpace={diskSpace} />
        </div>
    )
}

export default FilesView
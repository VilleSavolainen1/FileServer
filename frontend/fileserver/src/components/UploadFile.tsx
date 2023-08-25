import React from 'react'
import { getValueForKey } from '../utils';
import { saveFileName, uploadManyFiles } from '../services';

interface uploadProps {
    name: string | undefined
    isLoading: (value: boolean) => void
    allFileNames: any
}

interface FileArray {
    name: string
    lastModified: number
    webkitRelativePath: string
    size: number
    type: string
}

const UploadFile = ({ name, isLoading, allFileNames }: uploadProps) => {

    //state for checking file size
    const [fileSize, setFileSize] = React.useState(true);
    // for file upload progress message
    const [fileUploadProgress, setFileUploadProgress] = React.useState(false);
    //for displaying response message
    const [fileUploadResponse, setFileUploadResponse] = React.useState(null);

    const [files, setFiles] = React.useState<any[]>([])


    const checkIfExists = async (arr: FileArray[]) => {
        for (let i = 0; i < arr.length; i++) {
            allFileNames.some((fl: any) => {
                if (fl.file === arr[i].name) {
                    window.alert(`Tiedosto ${arr[i].name} on jo olemassa`)
                    window.location.reload();
                }
            })
        }
    }

    const uploadFileHandler = async (e: any) => {
        const files = e.target.files
        await checkIfExists(files)
        setFiles(files)
    };


    const uploadFiles = (e: any) => {
        isLoading(true)
        e.preventDefault();
        const token = getValueForKey('access_token')
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            console.log(files[i])
            if (files[i].size > 137000000) {
                setFileSize(false);
                setFileUploadProgress(false);
                setFileUploadResponse(null);
                return;
            }
            saveFileName(files[i].name, name, token).then(res => {
                console.log(res)
            })
            data.append(`files`, files[i])
        }
        uploadManyFiles(data, token).then(res => {
            console.log(res)
            isLoading(false)
        }).catch(err => {
            console.log(err)
            isLoading(false)
        })
    }

    return (
        <div className="uploadFileForm">
            <form onSubmit={uploadFiles}>
                <p style={{ fontSize: '14px' }}>Lisää tiedostoja:</p>
                <div className="blank"></div>
                <input type="file" multiple onChange={uploadFileHandler} />
                <button type='submit'>Lähetä</button>
                {!fileSize && <p style={{ color: 'red' }}>Tiedoston koko ylittyy!!</p>}
                {fileUploadProgress && <p style={{ color: 'red' }}>Uploading File(s)</p>}
                {fileUploadResponse != null && <p style={{ color: 'green' }}>{fileUploadResponse}</p>}
            </form>
        </div>
    )
}

export default UploadFile
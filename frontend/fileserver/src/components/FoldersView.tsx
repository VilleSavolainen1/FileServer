import React, { CSSProperties } from 'react'
import BarLoader from "react-spinners/BarLoader";
import { getValueForKey } from '../utils';
import axios from 'axios';
import { emptyIcon, folderIcon } from '../images';

export type folder = Array<{ name: string }>

const FoldersView = () => {
    const [loading, setLoading] = React.useState(false)
    const [folders, setFolders] = React.useState<folder>([])

    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "#fffff",
    };

    const getFolders = () => {
        setLoading(true)
        const token = getValueForKey('access_token')
        const config = {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };
        axios.get('/folders', config).then(res => {
            setFolders(res.data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    React.useEffect(() => {
        getFolders()
    }, [])

    const renderFolders = () => {
        if (folders && folders.length > 0) {
            return folders.map(fldr => {
                return (
                    <div>
                        <div className="singleFolder" key={fldr.name}>
                            <img className="folderImage" src={folderIcon} />
                            <p className="folderName">{fldr.name}</p>
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
                    <h1>Kansiot</h1>
                </div>
                <div className="foldersCard">
                    {renderFolders()}
                </div>
                <BarLoader
                    color={'green'}
                    loading={loading}
                    cssOverride={override}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    )
}

export default FoldersView
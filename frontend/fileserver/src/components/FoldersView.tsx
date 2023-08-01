import React, { CSSProperties } from 'react'
import BarLoader from "react-spinners/BarLoader";



const FoldersView = () => {
    const [loading, setLoading] = React.useState(true)

    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "#fffff",
    };


    return (
        <div className="foldersView">
            <div className="foldersContent">
                <div className="foldersHeader">
                    <h1>Kansiot</h1>
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
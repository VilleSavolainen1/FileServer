import BarLoader from "react-spinners/BarLoader";
import React, { CSSProperties } from 'react'


const Loader = () => {
    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "white",
    };

    return (
        <div className="loader">
            <BarLoader
                color={'#2184FE'}
                loading={true}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}

export default Loader
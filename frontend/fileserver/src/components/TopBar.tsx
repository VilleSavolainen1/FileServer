import { logoutIcon } from '../images'
import { diskSpace } from '../types'
import ProgressBar from "@ramonak/react-progress-bar"

export interface TopBarProps {
    signOut: () => void
    diskSpace: diskSpace
}

const TopBar = ({ signOut, diskSpace }: TopBarProps) => {
    const used = diskSpace.size - diskSpace.free
    const percentage: any = (used * 100 / diskSpace.size).toFixed();

    return (
        <div className="topBar">
            <div className="topBarContent">
                <div className="diskSpace">
                    <p style={{ color: '#ffffff', fontSize: '10px', marginRight: '5px' }}>Disk:</p>
                    <div className="progressBar">
                        <ProgressBar completed={percentage} bgColor='#3D4991' borderRadius='0' height='10px' customLabel=' ' />
                    </div>
                </div>
                <div className="logout">
                    <button className="logOutButton" onClick={signOut}>Kirjaudu ulos</button>
                    <img src={logoutIcon} alt="folder" style={{ width: '20px' }} />
                </div>
            </div>
        </div>
    )
}

export default TopBar
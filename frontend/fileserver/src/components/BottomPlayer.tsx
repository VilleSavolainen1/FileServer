import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import './playerStyle.css'

interface playerProps {
    file: string
}

/* $rhap_theme-color: #868686 !default;   // Color of all buttons and volume/progress indicators
$rhap_background-color: #fff !default; // Color of the player background
$rhap_bar-color: #e4e4e4 !default;     // Color of volume and progress bar
$rhap_time-color: #333 !default;       // Font color of current time and duration
$rhap_font-family: inherit !default;
 */
const BottomPlayer = ({ file }: playerProps) => {
    return (
        <div className="bottomPlayer">
            <div className="playerControls">
            <AudioPlayer src={file} showSkipControls={false} showJumpControls={false}
                customAdditionalControls={[RHAP_UI.CURRENT_LEFT_TIME]} customProgressBarSection={[RHAP_UI.PROGRESS_BAR]} customVolumeControls={[RHAP_UI.VOLUME]}
                layout="horizontal" />
            </div>
        </div>
    )
}

export default BottomPlayer
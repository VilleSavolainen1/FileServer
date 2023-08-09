import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

interface playerProps {
    file: string
}

const BottomPlayer = ({ file }: playerProps) => {
    return (
        <div className="bottomPlayer">
            <AudioPlayer src={file} showSkipControls={false} showJumpControls={true}
                customAdditionalControls={[RHAP_UI.CURRENT_LEFT_TIME]} customProgressBarSection={[RHAP_UI.PROGRESS_BAR]} customVolumeControls={[]}
                style={{ background: 'transparent' }} layout="horizontal" />
        </div>
    )
}

export default BottomPlayer
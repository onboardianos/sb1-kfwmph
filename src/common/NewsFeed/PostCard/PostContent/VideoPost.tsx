import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, IconButton, Skeleton } from '@mui/material';
import { useRef, useState } from 'react';

const VideoPostCard = ({ item, thumbnail }: { item: Amity.File, thumbnail: Amity.File }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showControls, setShowControls] = useState(false)
    const handlePlay = () => {
        setShowControls(true)
        videoRef.current?.play()
    }

    return (
        <Box
            sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', background: 'black' }}
        >
            {!thumbnail ? (
                <Skeleton variant="rectangular" width={500} height={500} />
            ) : (
                //@ts-ignore
                <video ref={videoRef} src={item.videoUrl['720p']} style={{ width: '100%', height: 500 }} controls={showControls} />
            )}
            {showControls ? null : (
                <IconButton
                    onClick={handlePlay}
                    sx={{ position: 'absolute', color: 'white' }}
                >
                    <PlayArrowIcon fontSize="large" />
                </IconButton>
            )}
        </Box>
    );
}

export default VideoPostCard;
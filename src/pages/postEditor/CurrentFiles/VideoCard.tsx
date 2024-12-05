import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';
import ReactPlayer from 'react-player';

const AmityVideoCard = ({ video, handleRemoveVideo, height }: { video: Amity.File<'video'>, handleRemoveVideo: (video: Amity.File<'video'>) => void, height?: number | string }) => {
    const url = video.fileUrl;
    return (
        <Box position="relative" bgcolor="black">
            <Box position="absolute" top={8} right={8} zIndex={1}>
                <IconButton onClick={() => handleRemoveVideo(video)} style={{ color: 'white' }}>
                    <DeleteIcon />
                </IconButton>
            </Box>
            <ReactPlayer
                url={url}
                width="100%"
                height={height || 500}
                controls
                style={{ backgroundColor: 'black' }}
            />
        </Box>
    );
}

export default AmityVideoCard;
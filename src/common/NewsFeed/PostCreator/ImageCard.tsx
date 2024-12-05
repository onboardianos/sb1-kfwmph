import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';

const ImageCard = ({ image, handleRemoveImage, height }: { image: File, handleRemoveImage: (image: File) => void, height?: number }) => {
    const url = URL.createObjectURL(image);
    return (
        <Box position="relative" bgcolor="black" overflow="hidden">
            <img
                src={url}
                alt="image"
                style={{
                    height: height || 'auto', 
                    width: '100%',
                    objectFit: height ? 'cover' : 'contain'
                }}
            />
            <IconButton
                style={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                onClick={() => handleRemoveImage(image)}
            >
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}

export default ImageCard;
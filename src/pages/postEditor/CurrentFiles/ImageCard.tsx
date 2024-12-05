import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton } from '@mui/material';

const AmityImageCard = ({ image, handleRemoveImage, height }: { image: Amity.File<'image'>, handleRemoveImage: (image: Amity.File<'image'>) => void, height?: number }) => {
    const url = `${image.fileUrl}?size=full`;
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

export default AmityImageCard;
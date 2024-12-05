import { Fullscreen } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { useState } from 'react';

type ImagePostCardProps = {
    item: Amity.File;
    size?: string; // Cambia esto si tienes un tipo específico para IAmityImageSize
}

const ImagePostCard = ({ item, size = 'small' }: ImagePostCardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const maxHeight = 700; // Establece una altura máxima para la imagen
    const imageHeight = item.attributes.metadata.height > maxHeight ? maxHeight : item.attributes.metadata.height;

    const downloadImage = async () => {
        window.open(`${item.fileUrl}?size=full`, '_blank');
    };

    return (
        <>
            <Box onClick={() => setIsOpen(true)} sx={{ flex: 1, cursor: 'pointer' }}>
                <img
                    src={`${item.fileUrl}?size=${size}`}
                    alt="image"
                    style={{ flex: 1, height: imageHeight, width: '100%', objectFit: 'cover' }}
                />
            </Box>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth maxWidth="lg">
                <DialogActions>
                    <IconButton onClick={downloadImage}>
                        <Fullscreen />
                    </IconButton>
                    <IconButton onClick={() => setIsOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    <img
                        src={`${item.fileUrl}?size=full`}
                        alt="image"
                        style={{ flex: 1, height: imageHeight, width: '100%', objectFit: 'contain' }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ImagePostCard;
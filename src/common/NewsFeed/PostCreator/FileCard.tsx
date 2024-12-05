import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, IconButton, Typography } from '@mui/material';
import { useCallback } from 'react';

const FileCard = ({ file, handleRemoveFile }: { file: File, handleRemoveFile: () => void }) => {

    const getSizeFormatted = useCallback((size: number | null) => {
        if (!size) return '0 B';
        let sizeNumber = size;
        if (sizeNumber < 1024) {
            return `${sizeNumber} B`;
        }
        if (sizeNumber < 1024 * 1024) {
            return `${(sizeNumber / 1024).toFixed(2)} KB`;
        }
        return `${(sizeNumber / 1024 / 1024).toFixed(2)} MB`;
    }, []);

    return (
        <Box display="flex" alignItems="center" gap={2} border={1} borderColor="grey.200" borderRadius={1} p={2}>
            <InsertDriveFileIcon fontSize="large" />
            <Box flex={1} ml={2}>
                <Typography variant="body1">{file.name}</Typography>
                <Typography variant="caption" color="textSecondary">{getSizeFormatted(file.size)}</Typography>
            </Box>
            <IconButton color="primary" onClick={handleRemoveFile}>
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}

export default FileCard;
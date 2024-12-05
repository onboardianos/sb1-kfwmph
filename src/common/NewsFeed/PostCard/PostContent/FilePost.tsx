import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, IconButton, Link, Typography } from '@mui/material';

const FilePostCard = ({ item }: { item: Amity.File }) => {

    const getSizeFormatted = (size: string) => {
        let sizeNumber = parseInt(size);
        if (sizeNumber < 1024) {
            return `${sizeNumber} B`;
        }
        if (sizeNumber < 1024 * 1024) {
            return `${(sizeNumber / 1024).toFixed(2)} KB`;
        }
        return `${(sizeNumber / 1024 / 1024).toFixed(2)} MB`;
    };

    return (
        <Link href={item.fileUrl} underline="none" target="_blank" rel="noopener" width="100%">
            <Box sx={{ mx: 2, p: 2, display: 'flex', alignItems: 'center', borderRadius: 2}} border={1} borderColor="grey.200">
                <InsertDriveFileIcon fontSize="large" />
                <Box flex={1} ml={2}>
                    <Typography variant="body1">{item.attributes.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{getSizeFormatted(item.attributes.size)}</Typography>
                </Box>
                <IconButton
                    onClick={(e) => {
                        e.preventDefault();
                        window.open(item.fileUrl, '_blank');
                    }}
                    color="primary"
                >
                    <DownloadIcon />
                </IconButton>
            </Box>
        </Link>
    );
}

export default FilePostCard;

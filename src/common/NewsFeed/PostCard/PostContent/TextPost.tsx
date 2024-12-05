import { Box, Link, Typography } from '@mui/material';
import { useState } from 'react';

type TextPostProps = {
    text: string;
}

const TextPost = ({ text }: TextPostProps) => {
    const [showFullText, setShowFullText] = useState(false);

    const clipText = text.length > 250 ? text.slice(0, 250) + "..." : text;

    return (
        <Box px={2} py={2}>
            <Typography variant="body1">
                {showFullText ? text : clipText}
            </Typography>
            {!showFullText && clipText.length < text.length && (
                <Link component="button" variant="body1" color="primary" onClick={() => setShowFullText(true)}>
                    See more
                </Link>
            )}
        </Box>
    );
}

export default TextPost;

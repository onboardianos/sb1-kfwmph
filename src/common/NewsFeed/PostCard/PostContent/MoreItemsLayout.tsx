import React from 'react';
import { Box, Typography } from '@mui/material';

type MoreItemsLayoutProps = {
    children: React.ReactNode;
    label: string;
}

const MoreItemsLayout = ({ children, label }: MoreItemsLayoutProps) => {
    return (
        <Box position="relative" display="flex" flex={1} height="100%">
            {children}
            <Box
                position="absolute"
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
                bgcolor="rgba(0, 0, 0, 0.5)"
            >
                <Typography variant="h3" color="white" fontWeight="bold">
                    {label}
                </Typography>
            </Box>
        </Box>
    );
}

export default MoreItemsLayout;

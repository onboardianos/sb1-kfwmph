import { Stack, Typography } from '@mui/material'
import React from 'react'
type IIConText = {
    icon: React.ReactNode,
    text: string,
    color?: string
}
const IconText = ({
    icon,
    text,
}:IIConText) => {
     return (
        <Stack gap={1} flexDirection={"row"} alignItems={"center"}>
            {icon}
            <Typography variant='body2' color="text.secondary" fontWeight={700}>
                {text}
            </Typography>
        </Stack>
    )
} 
export default IconText
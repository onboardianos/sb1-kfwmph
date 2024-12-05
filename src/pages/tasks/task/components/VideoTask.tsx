import { Icon } from '@iconify/react';
import { Box, Divider, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { generateVideoThumbnailViaUrl } from "@rajesh896/video-thumbnails-generator";
import { useEffect, useRef, useState } from "react";
type IVideoTaskProps = {
    videoUri: string,
    title: string,
}
const VideoTask = (props: IVideoTaskProps) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null)
    const [showControls, setShowControls] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        fetchThumbnail(props.videoUri)
    }, [])

    const fetchThumbnail = (url: string) => {
        generateVideoThumbnailViaUrl(url, 3)
            .then((res) => {
                setThumbnail(res)
            })
            .catch((err: any) => {
                console.log("ERROR", err)
            })
    }

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play()
        }
        setShowControls(true)
    }

    return (
        <Stack gap={2}>
            <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
                <Icon icon="lets-icons:video" style={{ color: '#4F4F4F', fontSize: 20 }} />
                <Typography fontWeight={600} >
                    Videos
                </Typography>
            </Stack>
            <Box
                sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', px: 2 }}
                onClick={handlePlay}
            >
                {!thumbnail ? (
                    <Skeleton variant="rectangular" width={500} height={500} />
                ) : (
                    <video
                        ref={videoRef}
                        src={props.videoUri}
                        style={{ width: '100%', borderRadius: 8 }}
                        controls={true}
                        poster={thumbnail}
                    />
                )}
                {showControls ? null : (
                    <IconButton
                        onClick={handlePlay}
                        sx={{ position: 'absolute', color: 'white' }}
                    >
                        <Icon icon="lets-icons:video" style={{ color: '#4F4F4F', fontSize: 52 }} />
                    </IconButton>
                )}
            </Box>
            <Divider />
        </Stack>
    )
}

export default VideoTask
import { Paper, Skeleton, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { generateVideoThumbnailViaUrl, getVideoDurationFromVideoFile } from '@rajesh896/video-thumbnails-generator'
import { grey } from '@mui/material/colors'
import { PlayCircle } from '@mui/icons-material'
import Utilities from '@utils/utilities'

type IScenarioCard = {
    title: string,
    video: string
}

const ScenarioCard = (props: IScenarioCard) => {
    const [thumbnail, setThumbnail] = React.useState<string>("")
    const [duration, setDuration] = React.useState<string>("")

    useEffect(() => {
        getDuration()
        getThumbnail()
    }, [])

    const getDuration = async () => {
        const duration = await getVideoDurationFromVideoFile(props.video)
        let minutes = Utilities.formatTimeDuration(duration)
        setDuration(minutes)
    }

    const getThumbnail = async () => {
        const thumbnail = await generateVideoThumbnailViaUrl(props.video, 1)
        setThumbnail(thumbnail)
    }

    return (
        <Paper variant='rounded'>
            <Stack p={1} spacing={2} pb={2}>
                <Stack position={"relative"} justifyContent={"center"} alignItems={"center"} >
                    <Stack borderRadius={4} overflow={"hidden"} flex={1} width={"100%"}>
                        {thumbnail ? (
                            <img width={1000} height={450} src={thumbnail} alt={props.title} style={{
                                width: "100%",
                                height: 450,
                                objectFit: "cover",
                            }} />
                        ):<Skeleton variant="rectangular" width={"100%"} height={450} />
                        }

                    </Stack>
                    <Stack position={"absolute"} bottom={8} right={15} justifyContent={"center"} alignItems={"center"} bgcolor={grey[700]} px={1} py={0.5} borderRadius={4}>
                        <Typography variant='caption' color="white" fontWeight={700}>
                            {duration}
                        </Typography>
                    </Stack>
                    <Stack position={"absolute"} color="white">
                        <PlayCircle color='inherit' sx={{ fontSize: 64 }} />
                    </Stack>
                </Stack>
                <Stack px={1}>
                    <Typography variant='body1' fontWeight={700} textTransform={"capitalize"}>
                        {props.title.replace("_", " ")}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    )
}
export default ScenarioCard
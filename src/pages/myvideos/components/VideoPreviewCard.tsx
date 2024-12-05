import LazyThumbnail from '@common/LazyThumbnail'
import { useSession } from '@context/SessionContext'
import { ArrowBack, CalendarMonth, PlayCircle } from '@mui/icons-material'
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Modal, Paper, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { MEDIA_URL } from '@services/index'
import moment from 'moment'
import React, { useMemo } from 'react'
import ReactPlayer from 'react-player'

const VideoPreviewCard = (props: IBaseMediaAsset) => {
    const { data } = useSession()
    const uri = `${MEDIA_URL}/${props.location}?${data?.user?.tokens.internalAccess}`
    const [videoModal, setVideoModal] = React.useState(false)

    const formattedDate = useMemo(() => moment(props.created).format("MM/DD/YYYY"), [props.created])

    return (
        <>
            <Card variant='outlined'>
                <CardActionArea>
                    <CardMedia
                        sx={{ borderRadius: 4, overflow: 'hidden' }}
                        onClick={() => setVideoModal(true)}
                        >
                        <LazyThumbnail url={uri} height={200} showDuration />
                        <Box
                            sx={{
                                position: 'absolute',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontSize: '3rem',
                                opacity: 0.8,
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <PlayCircle fontSize='inherit' />
                        </Box>
                    </CardMedia>
                </CardActionArea>
                <CardContent>
                    <Stack flexDirection={"row"} gap={1}>
                        <Typography noWrap flex={1} variant='body1' fontWeight={"700"}>{props.title}</Typography>
                        <Stack flexDirection={"row"} gap={0.5} color={"GrayText"} justifyContent={"flex-end"}>
                            <CalendarMonth fontSize={"small"} color="disabled" />
                            <Typography variant='caption' fontWeight={600} color={grey[400]}>{formattedDate}</Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
            <Modal
                open={videoModal}
                onClose={() => setVideoModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ justifyContent: "center", alignItems: "center", display: "flex", margin: "auto" }}
            >
                <Paper style={{ width: "75vw", padding: 10 }} variant='rounded'>
                    <Stack flexDirection={"row"} gap={1} alignItems={"center"} mb={2}>
                        <Button variant='text' onClick={() => setVideoModal(false)}>
                            <ArrowBack />
                        </Button>
                        <Typography fontWeight={"bold"}>
                            {props.title}
                        </Typography>
                    </Stack>
                    <ReactPlayer
                        url={uri}
                        controls
                        width="100%"
                        height={700}
                        style={{
                            backgroundColor: "black",
                            borderRadius: 16,
                            overflow: "hidden"
                        }}
                        onContextMenu={(e: any) => e.preventDefault()}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: "nodownload"
                                }
                            }
                        }}

                    />
                </Paper>
            </Modal>
        </>
    )
}

export default VideoPreviewCard
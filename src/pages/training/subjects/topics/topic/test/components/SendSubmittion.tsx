import { useAppData } from '@context/AppData'
import { Refresh, SendOutlined } from '@mui/icons-material'
import { Button, Modal, Paper, Stack, Typography } from '@mui/material'
import ReviewableService from '@services/reviewableService'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom'

type ISendSubmittion = {
    videos: { uri: string, isDemo: boolean }[],
    onRetake: () => void
}

const SendSubmittion = ({ videos, onRetake }: ISendSubmittion) => {
    const navigate = useNavigate()
    const {path,pendingProgress} = useAppData()
    const {enqueueSnackbar,closeSnackbar} = useSnackbar()
    const { topic } = useAppData()
    const [currentVideo, setCurrentVideo] = React.useState<number>(0)
    const [paused, setPaused] = React.useState<boolean>(false)
    const [modalConfirm, setModalConfirm] = React.useState<boolean>(false)
    const videoRef = React.useRef<any>()
    

    const sendMediaToReview = useMutation({
        mutationFn: ({ id, files }: { id: number, files: string[] }) => ReviewableService.sendMediaToReview(id, files),
        onSuccess: () => {
            enqueueSnackbar("Video sent for review", { variant: "success",
                action: <Button sx={{color:'white'}} onClick={() => {
                    path.replace({
                        path: 'myvideos',
                        name: 'My Videos'
                    },{
                        state:{
                            tab:1
                        }
                    })
                }}>Go to My Videos</Button>
             })
            closeSnackbar('loader-send-video')
        },
        onError: (error) => {
            enqueueSnackbar("Error sending video for review "+ error.message, { variant: "error" })
            closeSnackbar('loader-send-video')
        },
        onSettled: () => {
            pendingProgress.setPendingSubmitVideos(pendingProgress.pendingSubmitVideos.filter((v) => v !== topic!.status.id))
        }
    })

    useEffect(() => {
        const handleBeforeUnload = (event: any) => {
            if (!modalConfirm) {
                event.preventDefault();
                return;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [modalConfirm]);

    const handleOnEndedVideo = () => {
        if (currentVideo + 1 < videos.length) {
            setPaused(true)
            setCurrentVideo(currentVideo + 1)
            videoRef.current.seekTo(0)
            setPaused(false)
        }

    }

    const handleSendVideos = async () => {
        if (!topic) {
            return
        }
        enqueueSnackbar("Uploading video... You can continue using the app while it uploads.", { variant: "info",key:'loader-send-video',persist:true })
        let ffiles: string[] = videos.filter((v) => v.isDemo === false).map((v) => v.uri)
        pendingProgress.setPendingSubmitVideos([...pendingProgress.pendingSubmitVideos,topic.status.id])
        sendMediaToReview.mutate({ id: topic.status.id, files: ffiles })
        navigate(`/training/subjects/topics/topic`)
    }

    const handleGoHome = () => {
        navigate(`/training/subjects/topics/topic`)
    }
    return (
        <Stack flex={1} py={4} px={2} height={"100%"} boxSizing={"content-box"} >
            <Stack borderRadius={8} overflow={"hidden"} >
                <ReactPlayer
                    ref={videoRef}
                    style={{ background: "black", flex: 1, maxHeight: "75vh" }}
                    url={`${videos[currentVideo].uri}`}
                    controls={true}
                    width={"100%"}
                    onEnded={handleOnEndedVideo}
                    playing={!paused}
                    onContextMenu={(e: any) => e.preventDefault()}
                    config={{
                        file: {
                            attributes: {
                                controlsList: "nodownload"
                            }
                        }
                    }}
                />
            </Stack>
            <Stack py={4} boxSizing={"content-box"} justifyContent={"center"} alignItems={"center"} gap={4}>
                <Stack gap={4} flexDirection={"row"}>
                    <Button
                        onClick={() => setModalConfirm(true)}
                        variant='outlined' color='error' size='large'>
                        Cancel
                    </Button>
                    <Button
                        onClick={onRetake}
                        endIcon={<Refresh />} variant='outlined' color='secondary' size='large'>
                        Retake Test
                    </Button>
                    <Button  onClick={handleSendVideos} variant='contained' size='large' endIcon={<SendOutlined />}>
                        SUBMIT FOR APPROVAL
                    </Button>
                </Stack>
                <Stack alignItems={"center"}>
                    <Typography variant='caption' color={"grey.400"} component={'span'}>
                        Click submit for approval to submit your video.
                    </Typography>
                    <Typography variant='caption' color={"grey.400"} component={'span'}>
                        Once the video is complete, your video will appear on the “Test Submission” screen.
                    </Typography>
                </Stack>

            </Stack>
            <Modal
                open={modalConfirm}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper sx={{ width: 400, borderRadius: 4 }}>
                    <Stack p={4} gap={2}>
                        <Stack>
                            <Typography textAlign={"center"} fontSize={32} fontWeight={700}>Confirm Exit</Typography>
                        </Stack>
                        <Stack>
                            <Typography fontSize={14} fontWeight={300}>
                                If you exit, the current video will be DELETED
                            </Typography>
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"center"} gap={2}>
                            <Button fullWidth variant="outlined" color="secondary" onClick={() => setModalConfirm(false)}>Cancel</Button>
                            <Button onClick={handleGoHome} fullWidth color='error' variant="contained">Yes, delete it</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Modal>
        </Stack>
    )
}
export default SendSubmittion
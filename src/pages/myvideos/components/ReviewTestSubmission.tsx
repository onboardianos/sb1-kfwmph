import { ArrowBack, CheckCircleOutline, Error, HighlightOffOutlined, SendOutlined, VideoCameraBackOutlined } from '@mui/icons-material'
import { Button, CircularProgress, Collapse, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import ReactPlayer from 'react-player'
import Rating from './Rating'
import { useAlert } from '@context/GlobalAlertContext'
import ReviewableService from '@services/reviewableService'
import VideoResponse from './VideoResponse'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useAppData } from '@context/AppData'
import { TrainingService } from '@services/trainingService'


type IReviewTestSubmission = {
    topicId: number,
    title: string,
    videos: string[],
    isReviewer: boolean,
    reviewerId: number,
    onSuccess: () => void
    onClose: () => void
}
const ReviewTestSubmission = (props: IReviewTestSubmission) => {
    const alert = useAlert()
    const { path, pendingProgress } = useAppData()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState<number>(0)
    const [currentComponent, setCurrentComponent] = React.useState<number>(0)
    const [score, setScore] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [text, setText] = React.useState<string>("")
    const [enableReview, setEnable] = React.useState(false)

    const playerRef = React.useRef<ReactPlayer>(null);

    const {
        data: instructions,
        isLoading,
    } = useQuery({
        queryKey: ['instructions'],
        queryFn: () => TrainingService.getGreatingInstructionsByTopicId(props.topicId),
        refetchOnMount: true,
        select: (data) => ({ id: data.id, instructions: data.instructions.replace(/ {2}/g, '\n \t') })
    })

    const getScoreState = (score: number) => {
        if (score <= 6) {
            return {
                state: 'FAILED',
                color: 'error.main',
                icon: <HighlightOffOutlined fontSize='small' />,
                label: `${score}/10`,

            };
        } else {
            return {
                state: 'PASSED',
                color: 'success.light',
                icon: <CheckCircleOutline fontSize='small' />,
                label: `${score}/10`,

            };
        }
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const handleSendTextResponse = async () => {
        setLoading(true)
        if (!score) {
            alert.showAlert({
                message: 'Please select a score',
                type: 'warning'
            })
            setLoading(false)
            return
        }
        let res = await ReviewableService.sendWrittenReview(props.reviewerId, { feedback: text, score: score, feedbackVideoId: null })
        if (res) {
            setLoading(false)
            props.onSuccess()
        }
    }

    const sendVideoMutation = useMutation({
        mutationFn: ({ reviwerId, mediaUrl, feedback, score, feedbackVideoId }: { reviwerId: number, mediaUrl: string, feedback: string, score: number, feedbackVideoId: null }) => ReviewableService.sendVideoResponse(reviwerId, mediaUrl, { feedback, score, feedbackVideoId }),
        onSuccess: () => {
            enqueueSnackbar("Video sent for review", {
                variant: "success",
                action: <Button sx={{ color: 'white' }} onClick={() => {
                    path.replace({
                        path: 'myvideos',
                        name: 'My Videos'
                    }, {
                        state: {
                            tab: 1
                        }
                    })
                }}>Go to test submissions</Button>
            })
            props.onSuccess()
            closeSnackbar('loader-send-video')
        },
        onError: (error) => {
            enqueueSnackbar("Error sending video for review " + error.message, { variant: "error" })
            closeSnackbar('loader-send-video')
        },
        onSettled: () => {
            pendingProgress.setPendingScoreVideos(pendingProgress.pendigScoreVideos.filter((id) => id !== props.reviewerId))
        }
    })

    const handleSendVideoResponse = async (mediaUrl: string): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                setLoading(true)
                if (!score) {
                    alert.showAlert({
                        message: 'Please select a score',
                        type: 'warning'
                    })
                    setLoading(false)
                    return
                }
                enqueueSnackbar("Uploading video... You can continue using the app while it uploads.", { variant: "info", key: 'loader-send-video', persist: true })
                sendVideoMutation.mutate({ reviwerId: props.reviewerId, mediaUrl, feedback: text, score, feedbackVideoId: null })
                pendingProgress.setPendingScoreVideos([...pendingProgress.pendigScoreVideos, props.reviewerId])
                props.onSuccess()
                resolve()

            } catch (err) {
                console.log(err)
                setLoading(false)
                reject()
            }
        })
    }

    const handlePressBack = () => {
        if(currentComponent === 3){
            setCurrentComponent(1)
            return
        }
        if (currentComponent === 0) {
            props.onClose()
        } else {
            setCurrentComponent(currentComponent - 1)
        }
    }

    const handleOnReady = () => {
        if (playerRef.current) {
            playerRef.current.getInternalPlayer().play();
        }
    }

  


    return (
        <Stack p={2} gap={2}>
            <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} position={'sticky'}>
                <Stack flexDirection={'row'} alignItems={'center'}>
                    <Button variant='text' onClick={handlePressBack} color="inherit">
                        <ArrowBack />
                    </Button>
                    <Typography variant='body1' fontWeight={"bold"}>
                        {props.title}
                    </Typography>
                </Stack>
                {score > 0 && (
                    <Stack flexDirection={"row"} gap={1} bgcolor={getScoreState(score).color} color="white" px={1} py={0.5} borderRadius={8}>
                        {getScoreState(score).icon}
                        <Typography variant='caption' color="inherit" >
                            {getScoreState(score).label}
                        </Typography>
                    </Stack>
                )}

            </Stack>
            {
                currentComponent !== 2 && (
                    <ReactPlayer
                        ref={playerRef}
                        url={props.videos[currentVideoIndex]}
                        controls
                        width="100%"
                        height={currentComponent === 0 ? 500 : 400}
                        style={{
                            backgroundColor: "black",
                            borderRadius: 16,
                            overflow: "hidden"
                        }}
                        onEnded={() => {
                            if (currentVideoIndex < props.videos.length - 1) {
                                setCurrentVideoIndex(currentVideoIndex + 1)
                            } else {
                                setEnable(true)
                            }

                        }}
                        onReady={handleOnReady}
                        onContextMenu={(e: any) => e.preventDefault()}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: "nodownload"
                                }
                            }
                        }}
                    />
                )
            }

            {
                props.isReviewer && (
                    <>
                        <Collapse in={currentComponent === 0}>
                            <Stack flexDirection={"column"} alignItems={"flex-end"} >
                                <Button
                                    disabled={!enableReview || pendingProgress.pendigScoreVideos.includes(props.reviewerId)}
                                    onClick={() => setCurrentComponent(1)} variant={"contained"} endIcon={<CheckCircleOutline />} color={"primary"}>Grade submission</Button>
                                {pendingProgress.pendigScoreVideos.includes(props.reviewerId) && (
                                    <Stack flexDirection={'row'} alignItems={'center'} >
                                        <Error color='error' fontSize='small' />
                                        <Typography color={'error'} fontSize={12}>
                                            You have already graded this submission, wait for the video uploaded.
                                        </Typography>
                                    </Stack>
                                )}

                            </Stack>
                        </Collapse>
                        <Collapse in={currentComponent === 1}>
                            <Rating
                                onPressOption={(value) => setCurrentComponent(value)}
                                selected={score}
                                setSelected={(value) => setScore(value)}
                                onCancel={() => {
                                    setCurrentComponent(0)
                                    setScore(0)
                                    props.onClose()
                                }}
                                instructions={{
                                    loading: isLoading,
                                    data: instructions?.instructions || ''
                                }}
                            />
                        </Collapse>
                        {currentComponent === 2 && (
                            <VideoResponse onChangeText={handleChangeText} onPressOption={(value) => setCurrentComponent(value)} onSubmitResponse={(mediaUrl) => handleSendVideoResponse(mediaUrl)} />
                        )}
                        {currentComponent === 3 && (
                            <Stack gap={2}>
                                <Stack>
                                    <TextField placeholder='Enter Response (Optional)' onChange={handleChangeText} variant='outlined' multiline rows={5} />
                                </Stack>
                                <Stack flexDirection={"row"} justifyContent={"center"} gap={2}>
                                    <Button
                                        onClick={() => setCurrentComponent(2)}
                                        sx={{ paddingY: 3 }}
                                        variant='outlined' endIcon={<VideoCameraBackOutlined />}>
                                        Video response
                                    </Button>
                                    <Button
                                        onClick={handleSendTextResponse} endIcon={<SendOutlined />} variant='contained' sx={{ gap: 1,paddingY: 3  }} disabled={loading}>
                                        {loading && <CircularProgress size={16} />}
                                        Submit response
                                    </Button>
                                </Stack>

                            </Stack>
                        )}
                    </>
                )
            }
        </Stack>
    )
}
export default ReviewTestSubmission
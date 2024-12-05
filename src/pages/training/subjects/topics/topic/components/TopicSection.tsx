import LazyThumbnail from '@common/LazyThumbnail'
import { useAppData } from '@context/AppData'
import { useSession } from '@context/SessionContext'
import { CheckCircle, Error, ExpandMore, HighlightOff, QueryBuilder } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Button, Modal, Paper, Skeleton, Stack, Typography } from '@mui/material'
import ReviewTestSubmission from '@pages/myvideos/components/ReviewTestSubmission'
import ScoreView from '@pages/myvideos/components/ScoreView'
import { MEDIA_URL } from '@services/index'
import ReviewableService from '@services/reviewableService'
import { useQuery } from '@tanstack/react-query'
import Utilities from '@utils/utilities'
import { useEffect, useRef, useState } from 'react'
import ReactAudioPlayer from 'react-audio-player'
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom'

const TopicSection = () => {
    const { topic, setTopic, pendingProgress } = useAppData()
    const { data } = useSession()
    const navigate = useNavigate()



    const [lastPlayed, setLastPlayed] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);

    const playerRef = useRef<ReactPlayer>(null);

    const [takeTestEnabled, setTakeTestEnabled] = useState<boolean>(false)
    const [svModal, setSvModal] = useState<boolean>(false)
    const [scoreModal, setScoreModal] = useState<boolean>(false)

    const isReviewer = data.user?.profile?.reviewer


    const review = useQuery({
        queryKey: ['reviewData', topic?.status.id, pendingProgress.pendingSubmitVideos.toString()],
        queryFn: () => ReviewableService.getMyReviewablesByProgressId(topic!.status.id),
        enabled: !!topic?.status && topic!.status.progressStatus !== "NOT_STARTED",
        refetchOnMount: true,

    })


    useEffect(() => {
        if (topic?.status.progressStatus === "STARTED") {
            setTakeTestEnabled(true)
        }
    }, [topic, data.user?.tokens.trainingAccess])


    useEffect(() => {
        let timer: any = null
        if (playing) {
            timer = setInterval(() => {
                setLastPlayed((lastPlayed) => lastPlayed + 1);
            }, 1000);
        } else {
            if (timer) {
                clearInterval(timer);
            }
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [playing]);

    const handlePlay = (audioPlayer: ReactAudioPlayer) => {
        if (playingAudio && playingAudio !== audioPlayer.audioEl.current) {
            playingAudio?.pause();
        }
        setPlayingAudio(audioPlayer.audioEl.current);
    };


    if (!data.user?.tokens) return <></>
    if (!topic) return <></>
    const getScoreState = (score: number) => {
        if (score <= 6) {
            return {
                color: 'error',
                state: 'FAILED',
                icon: <HighlightOff color='error' fontSize='small' />,
                label: `FAILED (${score}/10)`,

            };
        } else {
            return {
                color: 'success.main',
                state: 'PASSED',
                icon: <CheckCircle color='success' fontSize='small' />,
                label: `PASSED (${score}/10)`,

            };
        }
    };

    const renderButton = () => {
        if (pendingProgress.pendingSubmitVideos.includes(topic!.status.id)) {
            return (
                <Stack flexDirection={'row'} alignItems={'center'} >
                    <Error color='error' fontSize='small' />
                    <Typography color={'error'} fontSize={12}>
                        You have already submitted this test, wait for the video uploaded.
                    </Typography>
                </Stack>
            )
        }
        if (review.data?.submittedVideos) {
            let reviewData = review.data
            if (reviewData.score > 6 || reviewData.score === 0) {
                return (
                    <Button
                        onClick={() => setSvModal(true)}
                        sx={{ textTransform: "uppercase" }}
                        variant="contained" color='error'>
                        View Submitted Video
                    </Button>
                )
            } else {
                return (
                    <Button
                        onClick={() => navigate(`/training/topic/test`)}
                        sx={{ textTransform: "uppercase" }}
                        variant="contained" color='error'>
                        Retake Test
                    </Button>
                )
            }
        } else {
            return (
                <Button
                    onClick={() => navigate(`/training/topic/test`)}
                    sx={{ textTransform: "uppercase" }}
                    disabled={!takeTestEnabled}
                    variant="contained" color='primary'>
                    Take The Test
                </Button>
            )
        }
    }

    const handleOnEndVideo = () => {
        setTakeTestEnabled(true)
        if (topic.status.progressStatus === 'NOT_STARTED') {
            ReviewableService.putUpdateProgressStatus(topic.status.id, "STARTED")
            setTopic({
                ...topic!,
                status: {
                    ...topic!.status,
                    progressStatus: "STARTED"
                }
            })
        }
    }

    const handleProgress = (state: { playedSeconds: number }) => {
        if (state.playedSeconds > lastPlayed + 1) {
            playerRef.current?.seekTo(lastPlayed, 'seconds');
        }
    };


    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    if (!topic) {
        return <></>
    }

    return (
        <Stack gap={4} flex={1}>
            <Stack pt={4} gap={2}>
                <Stack>
                    <Typography variant="body2">
                        NOW PLAYING:
                    </Typography>
                    <Typography variant='h5' fontWeight={700}>
                        {topic.title}
                    </Typography>
                </Stack>
                <Stack height={500} width={"100%"} overflow={"hidden"} borderRadius={4}>
                    <ReactPlayer
                        ref={playerRef}
                        onClick={handlePlayPause}
                        url={`${MEDIA_URL}/${topic.topicVideo.location}?${data?.user.tokens.trainingAccess}`}
                        width={"100%"}
                        height={"100%"}
                        style={{ background: "black", maxWidth: "100%" }}
                        controls
                        light={<LazyThumbnail 
                            url={`${MEDIA_URL}/${topic.topicVideo.location}?${data?.user.tokens.trainingAccess}`} 
                            height={500} 
                        />}
                        playing={playing}
                        onEnded={handleOnEndVideo}
                        onProgress={handleProgress}
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
                <Stack gap={2}>
                    <Stack px={2} >
                        {!isReviewer && (
                            <Stack flexDirection={"row"}>



                                <Stack flex={1}>
                                    {review.isLoading && <Skeleton variant="text" width={300} height={40} />}
                                    {
                                        !review.isLoading &&(
                                            review.data && review.data.score > 0 ? (
                                                <Stack sx={{ cursor: "pointer" }} onClick={() => setScoreModal(true)}>
                                                    <Stack flexDirection={"row"} gap={1} paddingY={2}>
                                                        {getScoreState(review.data.score).icon}
                                                        <Typography variant='body2' fontWeight={600} color={getScoreState(review.data.score).color}>
                                                            {getScoreState(review.data.score).label}
                                                        </Typography>
                                                    </Stack>
                                                    {review.data.feedback && (
                                                        <Stack flexDirection={"row"} gap={1}>
                                                            <Typography variant='caption' color="gray">
                                                                Comments:
                                                            </Typography>
                                                            <Typography variant='caption' color="gray">
                                                                {review.data.feedback}
                                                            </Typography>
                                                        </Stack>
                                                    )}

                                                </Stack>
                                            ) : (
                                                (review.data?.submittedVideos && review.data.score === 0) ? (
                                                    <Stack flexDirection={"row"} gap={1} paddingY={2}>
                                                        <QueryBuilder fontSize='small' />
                                                        <Typography variant='body2' fontWeight={600}>
                                                            TEST UNGRADED
                                                        </Typography>
                                                    </Stack>
                                                ) : (
                                                    <Stack flexDirection={"row"} gap={1} paddingY={2}>
                                                        <QueryBuilder fontSize='small' />
                                                        <Typography variant='body2' fontWeight={600}>
                                                            UNTAKEN TEST
                                                        </Typography>
                                                    </Stack>
                                                )

                                            )
                                        )
                                    }
                                </Stack>
                                {renderButton()}

                            </Stack>
                        )}
                    </Stack>
                    {/*
                    <Stack spacing={4}>
                        <Typography fontWeight={300} variant='body2'>
                            Up Next:
                        </Typography>
                        <Grid container spacing={2}>
                            {
                                topic.testVideos.map((video, index) => (
                                    <Grid item key={`scenario-${index}`} md={3} xs={6} sm={6}>
                                        <ScenarioCard
                                            title={video.name}
                                            video={`${MEDIA_URL}/${video.location}?${data.user?.tokens.trainingAccess}`}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Stack>
                    <Accordion defaultExpanded >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="resources-content"
                            id="resoruces-header"
                        >
                            <Typography component={"span"} variant='body1' fontWeight={"bold"}>Resources</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: 0 }}>
                            <Stack flexDirection={"row"} justifyContent={"space-between"} bgcolor={"white"} p={2} borderRadius={2}>
                                <IconText icon={<AudioFileOutlined sx={{ fontSize: 20 }} />} text={`${topic.wordTracks.length} Audio files`} />
                                <Divider orientation='vertical' flexItem />
                                <IconText icon={<InsertLinkOutlined sx={{ fontSize: 20 }} />} text={"24 links to external resources"} />
                                <Divider orientation='vertical' flexItem />
                                <IconText icon={<TextSnippetOutlined sx={{ fontSize: 20 }} />} text={"24 links to external resources"} />
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                        */}
                    {
                        topic.wordTracks.length > 0 && (
                            <>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls="tracks-content"
                                        id="tracks-header"

                                    >
                                        <Typography component={"span"} variant='body1' fontWeight={"bold"}>Word Tracks</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: 0 }}>
                                        <Stack gap={2} >
                                            {
                                                data?.user.tokens.trainingAccess && topic.wordTracks.map((wordTrack: IWordTrack) => {
                                                    const audioPlayerRef = useRef<ReactAudioPlayer>(null);

                                                    return (
                                                        <Stack gap={10} key={`audio-${wordTrack.id}`} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                                            <Typography flex={1} color={"text.secondary"} fontWeight={300} variant={"body2"}>{wordTrack.text}</Typography>
                                                            <ReactAudioPlayer
                                                                ref={audioPlayerRef}
                                                                src={`${MEDIA_URL}/${wordTrack.audio.location}?${data.user?.tokens.trainingAccess}`}
                                                                controls
                                                                onPlay={() => handlePlay(audioPlayerRef.current!)}
                                                            />
                                                        </Stack>
                                                    )
                                                })
                                            }
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                            </>
                        )
                    }
                    {
                        topic.takeAways.length > 0 && (
                            <Stack gap={2}>
                                <Typography variant={"h6"}>Take aways</Typography>
                                <Stack>
                                    {
                                        topic.takeAways.map((takeAway: { id: number, details: string }) => (
                                            <Stack key={`ta-${takeAway.id}`} gap={1}>
                                                <Typography variant={"body2"}>{takeAway.details}</Typography>
                                            </Stack>
                                        ))
                                    }
                                </Stack>
                            </Stack>
                        )
                    }
                </Stack>
            </Stack>
            {review.data?.submittedVideos && (
                <>
                    <Modal
                        open={svModal}
                        onClose={() => setSvModal(false)}
                        aria-labelledby="modal-score"
                        aria-describedby="modal-score"
                        style={{ justifyContent: "center", alignItems: "center", display: "flex", margin: "auto" }}
                    >
                        <Paper style={{ width: "100vh" }} variant='rounded'>
                            <ReviewTestSubmission
                                reviewerId={review.data?.reviewerId || 0}
                                videos={Utilities.mergeVideos(topic.testVideos, review.data?.submittedVideos.map(el => `${MEDIA_URL}/${el.location}?${data.user?.tokens.privateAccess}`) || [], data.user?.tokens.trainingAccess || "")}
                                isReviewer={false}
                                onSuccess={() => setSvModal(false)}
                                onClose={() => setSvModal(false)}
                                title={topic.title}
                                topicId={topic.id}
                            />
                        </Paper>
                    </Modal>
                    <Modal
                        open={scoreModal}
                        onClose={() => setScoreModal(false)}
                        aria-labelledby="modal-score"
                        aria-describedby="modal-score"
                        style={{ justifyContent: "center", alignItems: "center", display: "flex", margin: "auto" }}
                    >
                        <Paper style={{ width: "100vh" }} variant='rounded'>
                            <ScoreView
                                topic={topic}
                                score={review.data.score}
                                textReview={review.data.feedback}
                                videoReview={review.data.feedbackVideo}
                                title={topic.title}
                                video={review.data}
                                onClose={() => setScoreModal(false)}
                            />
                        </Paper>
                    </Modal>
                </>
            )}


        </Stack>
    )
}

export default TopicSection

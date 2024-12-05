import LazyThumbnail from '@common/LazyThumbnail';
import { useSession } from '@context/SessionContext';
import { AccessTime, AccessTimeOutlined, ArrowBack, CalendarMonthOutlined, CheckCircleOutline, HighlightOffOutlined, PlayCircle } from '@mui/icons-material';
import { Avatar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Divider, Modal, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { MEDIA_URL } from '@services/index';
import ReviewableService from '@services/reviewableService';
import UserService from '@services/userService';
import { useQuery } from '@tanstack/react-query';
import Utilities from '@utils/utilities';
import moment from 'moment';
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import ReviewTestSubmission from './ReviewTestSubmission';
import ScoreView from './ScoreView';
const ReviewablePreviewCard = ({ video, topic, isReviewer, onNewEvent }: { video: IReviewable, topic: ITopics, isReviewer?: boolean, onNewEvent: () => void}) => {
    const [videosUri, setVideosUri] = React.useState<string[]>([])
    const [reviewModal, setReviewModal] = React.useState<boolean>(false)
    const [scoreModal, setScoreModal] = React.useState<boolean>(false)
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState<number>(0)
    const [fullVideos, setFullVideos] = React.useState<string[]>([])
    const playerRef = React.useRef<ReactPlayer>(null);
    const { data } = useSession()


    const senderUser = useQuery({
        queryKey: ['user', video.userId],
        queryFn: () => UserService.getProfileByUserId(video.userId),
        enabled: !!video
    })

    useEffect(() => {
        getVideoUris()
    }, [data.user?.profile?.reviewer])

    const getVideoUris = () => {
        if (!data.user?.profile?.reviewer) {
            var videos = [];
            for (let i = 0; i < video.submittedVideos.length; i++) {
                videos.push(
                    `${MEDIA_URL}/${video.submittedVideos[i].location}?${data.user?.tokens.privateAccess}`,
                );
            }
            setVideosUri(videos);
            setFullVideos(Utilities.mergeVideos(topic.testVideos, videos, data.user?.tokens.trainingAccess || ""))
        } else {
            ReviewableService.getReviewableAccess(video.id).then((response) => {
                var videos = []
                const keys = Object.keys(response);
                for (let i = 0; i < video.submittedVideos.length; i++) {
                    videos.push(
                        `${MEDIA_URL}/${video.submittedVideos[i].location
                        }?${response[`${keys[i].toString()}`]}`
                    );
                }
                setVideosUri(videos);
            });
        }
    };






    const getScoreState = (score: number) => {
        if (score === 0) {
            return {
                state: 'PENDING',
                color: 'grey.500',
                icon: <AccessTime fontSize='small' />,
                label: '',
            };
        }
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

    const scoreState = getScoreState(video.score);

    const handleClick = () => {
        setReviewModal(true)
    }
    const handleOnSuccess = () => {
        setReviewModal(false)
        onNewEvent()
    }
    const handleOnReady = () => {
        if (playerRef.current) {
            playerRef.current.getInternalPlayer().play();
        }
    }
    const onVideoEnd = () => {
        if (currentVideoIndex < fullVideos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1)
        }

    }

    return (
        <>
            <Card variant='outlined'>
                <CardActionArea onClick={handleClick}>
                    <CardMedia
                        style={{ borderRadius: 16, overflow: 'hidden' }}
                    >
                        <LazyThumbnail url={videosUri[0]} height={450} showDuration />
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
                    <Stack gap={2}>
                        <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-around"}>
                            <Stack flex={1} style={{ flexShrink: 0 }} maxWidth={isReviewer ? "100%" : "70%"}>
                                <Stack flex={1}>
                                    <Typography
                                        variant='body2'
                                        fontWeight={"bold"}
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            width: '100%',
                                            display: 'block',
                                        }}
                                    >
                                        {topic?.title}
                                    </Typography>
                                </Stack>
                                {senderUser.isSuccess && !senderUser.isLoading && isReviewer && (
                                    <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
                                        <Avatar sx={{ width: 24, height: 24 }} src={`${MEDIA_URL}/${senderUser.data?.profileImage?.location}?${data.user?.tokens.internalAccess}`} />
                                        <Typography variant='caption' fontWeight={600} color={grey[400]}>{`${senderUser.data?.firstName} ${senderUser.data?.lastName}`}</Typography>
                                    </Stack>
                                )}
                                {senderUser.isLoading && isReviewer && (
                                    <Skeleton width={"100%"} height={20} />
                                )}
                            </Stack>
                            {!isReviewer && (
                                <Stack
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setScoreModal(true)}
                                    flexDirection={"row"} gap={1} bgcolor={scoreState.color} color="white" px={1} py={0.5} borderRadius={8}>
                                    {scoreState.icon}
                                    {scoreState.label !== '' && (
                                        <Typography variant='caption' color="inherit" >
                                            {scoreState.label}
                                        </Typography>
                                    )}

                                </Stack>
                            )}
                        </Stack>
                        <Divider />
                        <Stack flexDirection={"row"} gap={1} color={"GrayText"} justifyContent={"space-between"}>
                            <Stack flexDirection={"row"}>
                                <CalendarMonthOutlined fontSize={"small"} color="disabled" />
                                {video.submittedVideos[0] && (
                                    <Typography variant='caption' fontWeight={600} color={grey[400]}>{moment(video.submittedVideos[0].created).format("MM/DD/YYYY")}</Typography>
                                )}
                            </Stack>
                            <Stack flexDirection={"row"}>
                                <AccessTimeOutlined fontSize={"small"} color="disabled" />
                                {video.submittedVideos[0] && (
                                    <Typography variant='caption' fontWeight={600} color={grey[400]}>{moment(video.submittedVideos[0].created).add(moment().utcOffset(), 'minutes').format("hh:mm A")}</Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>

                </CardContent>
            </Card>
            {
                isReviewer && (
                    <Modal
                        open={reviewModal}
                        onClose={() => setReviewModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        style={{ display: "flex", overflowY: "auto", justifyContent: "center", alignItems: "center", margin: "auto" }}
                    >
                        <Paper style={{ width: "75vw", maxHeight: "98vh", overflowY: "auto" }} variant='rounded'>
                            <ReviewTestSubmission
                                topicId={topic.id}
                                title={topic.title}
                                reviewerId={video.id}
                                videos={Utilities.mergeVideos(topic.testVideos, videosUri, data.user?.tokens.trainingAccess || "")}
                                isReviewer={isReviewer || false}
                                onSuccess={handleOnSuccess}
                                onClose={() => setReviewModal(false)}
                            />
                        </Paper>
                    </Modal>
                )
            }
            {
                !isReviewer && (
                    <Modal
                        open={reviewModal}
                        onClose={() => setReviewModal(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        style={{ justifyContent: "center", alignItems: "center", display: "flex", margin: "auto" }}
                    >
                        <Paper style={{ width: "75vw", padding: 10 }} variant='rounded'>
                            <Stack flexDirection={"row"} gap={1} alignItems={"center"} mb={2}>
                                <Button variant='text' onClick={() => setReviewModal(false)}>
                                    <ArrowBack />
                                </Button>
                                <Typography fontWeight={"bold"}>
                                    {topic.title}
                                </Typography>
                            </Stack>
                            <ReactPlayer
                                ref={playerRef}
                                url={fullVideos?.[currentVideoIndex]}
                                controls
                                width="100%"
                                height={500}
                                style={{
                                    backgroundColor: "black",
                                    borderRadius: 16,
                                    overflow: "hidden"
                                }}
                                onEnded={onVideoEnd}
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
                        </Paper>
                    </Modal>
                )
            }
            {!isReviewer && (
                <Modal
                    open={scoreModal}
                    onClose={() => setScoreModal(false)}
                    aria-labelledby="modal-score"
                    aria-describedby="modal-score"
                    style={{ justifyContent: "center", alignItems: "center", display: "flex", margin: "auto" }}
                >
                    <Paper style={{ width: "50vw" }} variant='rounded'>
                        <ScoreView
                            topic={topic}
                            score={video.score}
                            textReview={video.feedback}
                            videoReview={video?.feedbackVideo}
                            title={topic.title}
                            video={video}
                            onClose={() => setScoreModal(false)}
                        />
                    </Paper>
                </Modal>
            )}
        </>

    )
}
export default ReviewablePreviewCard
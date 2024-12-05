import { useAppData } from '@context/AppData'
import { AccessTime, ArrowBack, CheckCircleOutline, HighlightOffOutlined } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'
import { MEDIA_URL } from '@services/index'
import ReviewableService from '@services/reviewableService'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate } from 'react-router-dom'

type IScoreView = {
    score: number
    textReview?: string
    videoReview?: IBaseMediaAsset
    title: string,
    video: IReviewable
    onClose: () => void
    topic: ITopics
}
const ScoreView = (props: IScoreView) => {
    const [access, setAccess] = useState("")
    const {setTopic} = useAppData()
    const navigate = useNavigate()

    useEffect(() => {
        if (props.videoReview) {
            getAccess()
        }
    }, [props.videoReview])

    const getAccess = async () => {
        let res = await ReviewableService.getReviewableAccess(props.video.id)
        setAccess(res)
    }

    const getScoreState = (score: number) => {
        if (score === 0) {
            return {
                state: 'PENDING',
                color: 'grey.500',
                icon: <AccessTime />,
                label: 'Ungraded',
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

    return (
        <Stack p={4} gap={4}>
            <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Stack flexDirection={"row"} gap={1} alignItems={"center"}>
                    <Button variant='text' onClick={props.onClose} sx={{ p: 0, minWidth: 0 }}>
                        <ArrowBack />
                    </Button>
                    <Typography fontWeight={"bold"}>
                        {props.title}
                    </Typography>
                </Stack>
                <Stack flexDirection={"row"} alignItems={'center'} justifyContent={'center'} gap={1} bgcolor={getScoreState(props.score).color} color="white" px={1} py={0.5} borderRadius={8}>
                    {getScoreState(props.score).icon}
                    <Typography variant='caption' color="inherit" >
                        {getScoreState(props.score).label}
                    </Typography>
                </Stack>
            </Stack>
            {props.videoReview && (
                <ReactPlayer
                    url={`${MEDIA_URL}/${props.videoReview.location}?${access[Object.keys(access)[0] as any]}`}
                    controls
                    width="100%"
                    height={500}
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
            )}
            <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} gap={4}>
                {
                    props.textReview && (
                        <Stack >
                            <Typography fontWeight={"bold"}>
                                Manager Review
                            </Typography>
                            <Typography color="grey">
                                {props.textReview}
                            </Typography>
                        </Stack>
                    )
                }
                {
                    props.score <= 6 && props.score !== 0 && (
                        <Button onClick={()=>{
                            setTopic(props.topic)
                            navigate(`/training/topic/test`)
                        }} variant='contained' color='error'>
                            Retake Test
                        </Button>
                    )
                }
            </Stack>
        </Stack>
    )
}
export default ScoreView
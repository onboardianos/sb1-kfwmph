import { useAppData } from '@context/AppData'
import { useSession } from '@context/SessionContext'
import { Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { MEDIA_URL } from '@services/index'
import { TrainingService } from '@services/trainingService'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

type IPlanCard = {
    title?: string,
    img: string,
    subjects: number,
    weeks: number,
    members: number,
}

const PlanCard = (props: IPlanCard) => {
    const { path } = useAppData()
    return (
        <Card variant='outlined' onClick={() => path.push({ name: props.title || '', path: 'subjects' })}>
            <CardActionArea >
                {props.img !== "" ? (
                    <CardMedia
                        component={props.img ? 'img' : 'div'}
                        src={props.img}
                        height={200}
                        style={{ objectFit: 'cover', backgroundColor: "black", height: 200 }}

                    />
                ) : (
                    <Skeleton variant="rectangular" height={200} />

                )}

            </CardActionArea>
            <CardContent>
                <Stack gap={2} >
                    <Stack flexDirection={"row"} gap={1}>
                        <Typography flex={1} variant='body1' fontWeight={"700"}>{props.title}</Typography>
                        {/**
                         <Stack flexDirection={"row"} gap={1}>
                            <GroupsOutlined fontSize={"small"} color="disabled" />
                            <Typography variant='caption' fontWeight={600} color={"grey.300"}>{props.members}</Typography>
                        </Stack>
                         */}

                    </Stack>
                    <Divider />
                    <Stack flexDirection={"row"} gap={1} justifyContent={"space-between"}>
                        <Stack bgcolor={blue[50]} px={1} py={0.5} borderRadius={8}>
                            <Typography color={blue[500]} variant='caption' >{props.subjects} Subjects</Typography>
                        </Stack>
                        {/*
                        <Stack flexDirection={"row"} gap={1}>
                            <AccessTimeOutlined fontSize={"small"} color="disabled" />
                            <Typography variant='caption' fontWeight={600} color={"grey.300"}>{props.weeks} Weeks</Typography>
                        </Stack>
                        */}

                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    )

}

const PlanList = () => {
    const [topicRandomImage, setTopicRandomImage] = React.useState<string>('')
    const { data } = useSession()


    const query = useQuery({
        queryKey: ['plan-enrollement-list'],
        queryFn: () => TrainingService.getMyPlanEnrollment(),
    })

    useEffect(() => {
        if (query.isSuccess) {
            const topics = query.data.learningPlan.subjects
            const randomTopic = topics[Math.floor(Math.random() * topics.length)].displayImage
            if (randomTopic) {
                setTopicRandomImage(`${MEDIA_URL}/${randomTopic?.location}?${data?.user?.tokens.trainingAccess}`)
            }
        }
    }, [query.isSuccess])

    return (
        <Grid container spacing={2} width={"100%"}>
            {query.isLoading && (
                <Stack flexDirection={"row"} gap={4} flexWrap={"wrap"} p={4}>
                    <Skeleton variant="rounded" height={250} width={350} />
                    <Skeleton variant="rounded" height={250} width={350} />
                    <Skeleton variant="rounded" height={250} width={350} />
                </Stack>
            )}
            <Grid item xs={12} sm={6} md={4}>
                {!query.isLoading && query.isSuccess && (
                    <PlanCard
                        img={topicRandomImage}
                        title={query.data?.learningPlan.title}
                        subjects={query.data?.learningPlan.subjects.length || 0}
                        weeks={6}
                        members={20}
                    />
                )}

            </Grid>
        </Grid>
    )
}
export default PlanList
import TabPaper from '@common/Container/TabPaper'
import { useAppData } from '@context/AppData'
import { useSession } from '@context/SessionContext'
import { WorkspacePremium } from '@mui/icons-material'
import { Card, CardContent, CardMedia, Chip, Divider, Grid, Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { blue } from '@mui/material/colors'
import { MEDIA_URL } from '@services/index'
import { TrainingService } from '@services/trainingService'
import { useQueries } from '@tanstack/react-query'


const LeassonCard = (props: ISubject & { index: number }) => {
    const { data } = useSession()
    const appData = useAppData()
    const theme = useTheme()
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xxl'));
    const handleClick = () => {
        appData.setSubject(props)
        if (props.topics.length > 0) {
            appData.setTopic(props.topics[0])
        }
       appData.path.push({ name: props.name, path: 'topics' })
    }

    return (
        <Card onClick={handleClick} sx={{ 
                minHeight: isLargeScreen ? 400 : 300, 
                maxHeight: isLargeScreen ? 400 : 300, 
                borderRadius: 4, 
                borderWidth: 0, 
                display: 'flex', 
                flexDirection: 'column',
                cursor:"pointer" 
            }} variant='outlined'>
            <CardMedia
                sx={{ height: isLargeScreen ? 300 : 200, borderRadius: 3, margin: 1 }}
                image={`${MEDIA_URL}/${props.displayImage.location}?${data?.user?.tokens.trainingAccess}`}
            >
                <Chip sx={{ background: "#59A3DD", fontWeight: "bold", color: "white", padding: 1, marginTop: 1, marginLeft: 1 }} label={`Step ${props.index + 1}`} />

            </CardMedia>
            <CardContent >
                <Stack flex={1} gap={1} paddingX={1} >
                    <Stack flex={1} flexDirection={"row"} gap={1} justifyContent={"space-between"}>
                        <Typography noWrap fontWeight={"bold"} gutterBottom variant="body1" >
                            {props.name}
                        </Typography>
                        {/**
                         <Stack flexDirection={"row"} gap={1}>
                            <GroupsOutlined fontSize={"small"} color="disabled" />
                            <Typography variant='caption' fontWeight={600} color={"grey.300"}>{20}</Typography>
                        </Stack>
                         */}
                    </Stack>
                    <Divider />
                    <Stack flexDirection={"row"} gap={1} justifyContent={"space-between"}>
                        <Stack bgcolor={blue[50]} px={1} py={0.5} borderRadius={8}>
                            <Typography color={blue[500]} fontWeight={500} variant='caption' >{props.topics.length} topics</Typography>
                        </Stack>
                        {/*
                        <Stack flexDirection={"row"} gap={1}>
                            <AccessTimeOutlined fontSize={"small"} color="disabled" />
                            <Typography variant='caption' fontWeight={600} color={"grey.300"}>6 Weeks</Typography>
                        </Stack>
                         */}
                        
                    </Stack>
                </Stack>

            </CardContent>
        </Card>
    )
}

const PlanEnrollementList = () => {
    const queries = useQueries({
        queries: [{
            queryKey: ['plan-enrollement-list'],
            queryFn: () => TrainingService.getMyPlanEnrollment(),
        }]
    })
    if (queries[0].isLoading) {
        return (
            <Stack>
                <Stack>
                    <Skeleton width={"25%"} height={30} />
                    <Skeleton width={"20%"} height={30} />
                </Stack>
                <Grid container spacing={2}>
                    {
                        Array(10).fill(0).map((_, index) => (
                            <Grid item xs={12} md={4} key={`a-${index}`}>
                                <Skeleton key={index} width={"100%"} height={400} />
                            </Grid>
                        ))
                    }
                </Grid>

            </Stack>
        )
    }
    return (
        <TabPaper
            title={queries[0].data?.learningPlan.title || ""}
            content={[{
                content: (
                    <Grid container spacing={2} >
                        {
                            queries[0].data?.learningPlan.subjects.map((subject: ISubject, index: number) => (
                                <Grid item xs={12} md={4} key={subject.id}>
                                    <LeassonCard {...subject} index={index} />
                                </Grid>
                            ))
                        }
                    </Grid>
                ),
                title: "All"
            }]}
            initialTab={0}
            theme='primary'
            rightComponent ={(
                <Stack flexDirection={"row"} justifyContent={"center"} gap={1}>
                    <Typography variant='caption' color={"grey.400"} >
                        <WorkspacePremium fontSize='small' />
                    </Typography>
                    <Typography variant='caption' color={"grey.400"} >
                        {queries[0].data?.learningPlan.subjects.length} Steps
                    </Typography>
                </Stack>
            )}
            backButton
        />

    )
}
export default PlanEnrollementList
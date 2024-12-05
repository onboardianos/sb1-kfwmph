import TabPaper from '@common/Container/TabPaper'
import { useAppData } from '@context/AppData'
import { useSession } from '@context/SessionContext'
import { Card, CardContent, CardMedia, Divider, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { blue } from '@mui/material/colors'
import { MEDIA_URL } from '@services/index'


const TopicCard = (props: ITopics & { index: number }) => {
    const { data } = useSession()
    const appData = useAppData()
    const theme = useTheme()
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xxl'));
    console.log('isLargeScreen',theme.breakpoints)
    const handleClick = () => {
        appData.setTopic(props)
        appData.path.push({ name: props.title, path: 'topic' })
    }
    return (
        <Card onClick={handleClick} sx={{ 
                minHeight: isLargeScreen ? 400 : 300,
                maxHeight: isLargeScreen ? 400 : 300, 
                borderRadius: 4, 
                borderWidth: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: "pointer" 
            }} variant='outlined'>
            <CardMedia
                sx={{ height: isLargeScreen ? 300 : 200, borderRadius: 3, margin: 1 }}
                image={`${MEDIA_URL}/${props.displayImage.location}?${data?.user?.tokens.trainingAccess}`}
            >
            </CardMedia>
            <CardContent >
                <Stack flex={1} gap={1} paddingX={1} >
                    <Stack flex={1} flexDirection={"row"} gap={1} justifyContent={"space-between"}>
                        <Typography noWrap fontWeight={"bold"} gutterBottom variant="body1" >
                            {props.title}
                        </Typography>
                        {/**
                         * <Stack flexDirection={"row"} gap={1}>
                            <GroupsOutlined fontSize={"small"} color="disabled" />
                            <Typography variant='caption' fontWeight={600} color={"grey.300"}>{20}</Typography>
                        </Stack>
                         */}

                    </Stack>
                    <Divider />
                    <Stack flexDirection={"row"} gap={1} justifyContent={"space-between"}>
                        <Stack bgcolor={blue[50]} px={1} py={0.5} borderRadius={8}>
                            <Typography color={blue[500]} fontWeight={500} variant='caption' >{props.testVideos.length} {props.testVideos.length > 1 ? 'scenarios' : 'scenario'}</Typography>
                        </Stack>
                        {/**
                         <Stack flexDirection={"row"} gap={1}>
                            <AccessTimeOutlined fontSize={"small"} color="disabled" />
                            <Typography variant='caption' fontWeight={600} color={"grey.300"}>2 days</Typography>
                        </Stack>
                         */}

                    </Stack>
                </Stack>

            </CardContent>
        </Card>
    )
}

const TopicList = () => {
    const { subject } = useAppData()
    return (
        <TabPaper
            title={subject?.name || "All Topics"}
            content={[{
                content: (
                    <Grid container spacing={2} >
                        {
                            subject?.topics.map((topic: ITopics, index: number) => (
                                <Grid item xs={12} md={4} key={subject.id}>
                                    <TopicCard {...topic} index={index} />
                                </Grid>
                            ))
                        }
                    </Grid>
                ),
                title: "All"
            }]}
            initialTab={0}
            theme='primary'
            backButton={true}
        />

    )
}
export default TopicList
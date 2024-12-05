
import { useAppData } from '@context/AppData'
import { useSession } from '@context/SessionContext'
import { PlayCircleOutline } from '@mui/icons-material'
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { MEDIA_URL } from '@services/index'
const SubjectList = () => {
    const { subject,topic,setTopic } = useAppData()
    const { data } = useSession()
    if (subject == null) {
        return null
    }
    const handleTopicClick = (topic:ITopics) => {
        setTopic(topic)
    }
    return (
        <Stack p={1}>
            <Stack position={"relative"} borderRadius={4} overflow={"hidden"}>
                <img src={`${MEDIA_URL}/${subject?.displayImage.location}?${data?.user?.tokens?.trainingAccess}`}  width={1000} height={200} alt="subject" style={{
                    width: "100%",
                    objectFit:"cover"
                }} />
                <Stack width={"100%"} height={"100%"} bgcolor={'rgba(0,0,0,0.3)'} position={"absolute"} alignItems={"flex-start"} justifyContent={"flex-end"}>
                    <Typography pl={4} pb={2} fontWeight={"bold"} variant='body1' color={"white"}>
                        {subject?.name}
                    </Typography>
                </Stack>
            </Stack>
            <List>
                {
                    subject?.topics.map((ltopic: ITopics, index: number) => {
                        return (
                            <ListItemButton key={index}
                            onClick={()=>handleTopicClick(ltopic)}
                            selected={topic?.id === ltopic.id}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ width: 44, height: 44 }} src={`${MEDIA_URL}/${ltopic.displayImage.location}?${data.user?.tokens.trainingAccess}`} />
                                </ListItemAvatar>
                                <ListItemText sx={{fontWeight:700}} primary={ltopic.title} secondary={ltopic.description} />
                                {topic?.id !== ltopic.id && (<PlayCircleOutline sx={{color:grey[400]}} />)}
                                
                            </ListItemButton>
                        )
                    })
                }
            </List>
        </Stack>
    )
}
export default SubjectList
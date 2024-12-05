import { Stack, Typography } from '@mui/material'
import TopicSection from './components/TopicSection'
import TabPaper from '@common/Container/TabPaper'
import { useAppData } from '@context/AppData'
import { WorkspacePremium } from '@mui/icons-material'
const page = () => {
    const { topic } = useAppData()

    if (!topic) {
        return <></>
    }
    return (
        <TabPaper
            title={topic.title}
            rightComponent={(topic.testVideos.length) > 1 && (

                <Stack flexDirection={"row"} justifyContent={"center"} gap={1}>
                    <Typography variant='caption' color={"grey.400"} >
                        <WorkspacePremium fontSize='small' />
                    </Typography>
                    <Typography variant='caption' color={"grey.400"} >
                        {topic.testVideos.length - 1 } {topic.testVideos.length > 1 ? "scenarios" : "scenario"} 
                    </Typography>
                </Stack>
            )}
            content={[
                { title: "Course Information", content: <TopicSection /> },

            ]}
            initialTab={0}
            theme='primary'
            showTabs={false}
            backButton
        />

    )
}
export default page
import { PostRepository } from "@amityco/ts-sdk"
import AmityPostCard from "@common/NewsFeed/PostCard"
import CommentToolbar from "@common/NewsFeed/PostComment/toolbar"
import { useAmity } from "@context/AmityContext"
import { ArrowBack } from "@mui/icons-material"
import { Paper, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const page = () => {
    const navigation = useNavigate()
    const location = useLocation()
    const { amityIsReady } = useAmity()
    const handleBack = () => {
        navigation(-1)
    }

    const queryParams = new URLSearchParams(location.search)
    const postId = queryParams.get('postId')

    const [post, setPost] = useState<Amity.Post>()


    useEffect(() => {
        const unsubscribe = PostRepository.getPost(postId, ({
            data
        }) => {
            if (data) {
                setPost(data)
            }
        })
        return () => {
            unsubscribe()
        }
    }, [postId])

    return (
        <Stack height={"calc(100vh - 110px)"} overflow={"scroll"}>
            <Paper sx={{ borderRadius: 4, cursor: 'pointer' }} onClick={handleBack}>
                <Stack flexDirection={"row"} alignItems={"center"} gap={2} px={4} py={2}>
                    <ArrowBack />
                    <Typography fontWeight={700}>
                        Back
                    </Typography>
                </Stack>
            </Paper>
            <Stack mt={4}>
                {post && amityIsReady && (
                    <AmityPostCard post={post} showAllComments showComment={false} isSinglePost imageSize="large" />
                )}
                {post && amityIsReady && (
                    <Paper sx={{ borderRadius: 4, cursor: 'pointer' }}>
                        <Stack direction="row" p={2}>
                            <CommentToolbar post={post} />
                        </Stack>
                    </Paper>
                )}
            </Stack>
        </Stack>
    )
}
export default page
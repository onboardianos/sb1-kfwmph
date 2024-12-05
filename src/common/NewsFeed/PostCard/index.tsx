import { getPostTopic, PostRepository, subscribeTopic } from "@amityco/ts-sdk"
import { useSession } from "@context/SessionContext"
import { Delete, Edit, MoreHoriz } from "@mui/icons-material"
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Paper, Skeleton, Stack, Typography } from "@mui/material"
import { MEDIA_URL } from "@services/index"
import UserService from "@services/userService"
import { useCallback, useEffect, useState } from "react"
import FooterPost from "./FooterPost"
import PostContent from "./PostContent"
import TextPost from "./PostContent/TextPost"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAmity } from "@context/AmityContext"
import { useAppData } from "@context/AppData"
import AmityService from "@services/amityService"
import { Icon } from "@iconify/react"
import moment from "moment"
type AmityPostCardProps = {
    post: Amity.Post,
    showAllComments?: boolean,
    showComment?: boolean,
    isSinglePost?: boolean,
    imageSize?: IAmityImageSize
}

const AmityPostCard = ({ post, showAllComments, showComment, isSinglePost, imageSize }: AmityPostCardProps) => {
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { data: session } = useSession()
    const {path} = useAppData()
    const profile = session.user?.profile
    const {setCurrentPost,setRefreshNewsFeed,refreshNewsFeed} = useAmity()
    const navigation = useNavigate()
    const {
        data: user,
        isLoading: loadingUser
    } = useQuery({
        queryKey: ['profile-user', post.creator.userId],
        queryFn: () => UserService.getProfileByChatId(post.creator.userId)
    })

    const {
        data: allCommunities
    } = useQuery({
        queryKey: ['commynities', session.user?.profile?.site.id],
        queryFn: async () => {
            let { amitySiteCommunities, groupCommunity } = await AmityService.getAmityCommunities()
            let filteredSites = amitySiteCommunities.filter((community) => community.siteId === session.user?.profile?.site.id)
            return [groupCommunity, ...filteredSites]
        },
        enabled: !!session.user?.profile?.site.id
    })

    const getCommunityName = useCallback((post:Amity.Post)=>{
        const community = allCommunities?.find((community)=>community.amityId === post.targetId)
        return community?.displayName
    },[allCommunities])

    const profileImage = `${MEDIA_URL}/${user?.profileImage?.location}?${session.user?.tokens?.internalAccess}`
    useEffect(() => {
        const unsubscribe = PostRepository.getPost(post.postId,
            ({ data }) => {
                if (data) {
                    const disposer = subscribeTopic(getPostTopic(data))
                    return disposer
                }
            }
        )
        return () => {
            unsubscribe()
        }
    }, [post.postId])

    const handleDeletePost = useCallback(async () => {
        try {
            await PostRepository.deletePost(post.postId)
            setRefreshNewsFeed(!refreshNewsFeed)
        } catch (error) {
            console.error('Error deleting post', error)
        } finally {
            setConfirmDelete(false)
        }
    }, [post.postId])

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper sx={{ mb: 2 }}>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar src={profileImage} onClick={()=>{
                        path.replace({
                            name:'Profile',
                            path:'profile'
                        })
                        navigation(`/profile?chatId=${post.creator.userId}`)
                    }} />
                </ListItemAvatar>
                <ListItemText
                    primary={<Typography fontSize={16} fontWeight={600}>{post.creator.displayName}</Typography>}
                    secondary={
                        user && !loadingUser ? (
                            <Stack direction={"row"} alignItems={"center"} gap={0.5}>
                                <Typography variant="body2" fontSize={12} color="textSecondary">{user.title}</Typography>
                                <Icon icon="mdi:dot" fontSize={16} />
                                <Typography variant="body2" fontSize={12} color="textSecondary">{getCommunityName(post)}</Typography>
                            </Stack>
                        ) : (
                            <Skeleton variant="text" width={100} />
                        )
                    }
                />
                {post.creator.userId === profile?.chatId && (
                    <IconButton onClick={handleMenuOpen}>
                        <MoreHoriz />
                    </IconButton>
                )}
            </ListItem>
            <Divider />
            <Stack >
                <Stack>
                    <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        onClick={() => {
                            const queryParams = new URLSearchParams({
                                postId: post.postId
                        })
                        navigation(`/post?${queryParams.toString()}`);
                    }}>
                        {post.data.text && <TextPost text={post.data.text} />}
                        <Typography variant="body2" fontSize={12} color="grey.300" p={1}>{moment(post.createdAt).fromNow()}</Typography>
                    </Stack>
                    {post.children.length > 0 && (
                        <Stack mb={1}>
                            <PostContent children={post.children} isSinglePost={isSinglePost} imageSize={imageSize} />
                        </Stack>
                    )}

                </Stack>
                <FooterPost post={post} showAllComments={showAllComments} showComment={showComment} />
            </Stack>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    setCurrentPost(post)
                    navigation('/postEditor')
                }}>
                    <Edit fontSize="small" sx={{ mr: 2 }} />
                    Edit Post
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    setConfirmDelete(true);
                }}>
                    <Delete fontSize="small" color="error" sx={{ mr: 2 }} />
                    <Typography color="error">Delete Post</Typography>
                </MenuItem>
            </Menu>
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
            >
                <DialogTitle>Delete Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this post?
                        <Typography color="error">This action cannot be reversed. Deleted data cannot be recovered.</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeletePost} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AmityPostCard
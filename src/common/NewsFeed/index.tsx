import { PostRepository } from "@amityco/ts-sdk"
import { useAmity } from "@context/AmityContext"
import { useSession } from "@context/SessionContext"
import { Newspaper } from "@mui/icons-material"
import { Stack, Typography } from "@mui/material"
import AmityService from "@services/amityService"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import AmityPostCard from "./PostCard"
import PostCardSkeleton from "./PostCard/skeleton"
import PostCreator from "./PostCreator"

type INewsFeed = {
    targetType: Amity.PostTargetType
}
const unsuscribers: Amity.Unsubscriber[] = []
const NewsFeed = ({ targetType }: INewsFeed) => {
    const [posts, setPosts] = useState<Amity.Post[]>([])
    const [loading, setLoading] = useState(true)
    const { refreshNewsFeed, setRefreshNewsFeed } = useAmity()
    const hasMorePost = useRef<boolean>(true)
    const nextPage = useRef<() => void>()
    const [communityIds, setCommunityIds] = useState<string[]>([])
    const { data: session } = useSession()

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
    useEffect(() => {
        if (allCommunities) {
            setCommunityIds(allCommunities.map((community) => community.amityId))
        }
    }, [allCommunities])
    useEffect(() => {
        communityIds.forEach((communityId) => {
            const communityPostsParam: Amity.PostLiveCollection = {
                targetId: communityId,
                targetType: targetType,
                sortBy: 'lastCreated'
            };

            const unsubscribe = PostRepository.getPosts(communityPostsParam,
                ({ data, onNextPage, hasNextPage, loading, error }) => {
                    if (error) {
                        console.error('Error on getPosts', error)
                        setLoading(false)
                        return
                    }
                    if (loading) {
                        setLoading(true)
                    }
                    if (data) {
                        setPosts(prev => [...data,...prev])
                        setLoading(false)
                        setRefreshNewsFeed(false)
                    }
                    hasMorePost.current = !!hasNextPage
                    if (hasNextPage) {
                        nextPage.current = onNextPage
                    }
                }
                
            )
            unsuscribers.push(unsubscribe)
        })
        return () => {
            unsuscribers.forEach((unsubscribe) => {
                unsubscribe()
            })
        }
    }, [refreshNewsFeed, targetType, setRefreshNewsFeed, communityIds])

    useEffect(() => {
        setPosts(prev => prev.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }, [posts])

    return (
        <Stack paddingX={4} sx={{ height: 'calc(100vh - 110px)' }} overflow={'scroll'}>
            <PostCreator />
            {loading ?
                Array.from({ length: 3 }).map((_, index) => (
                    <PostCardSkeleton key={index} />
                ))
                :
                posts.map((post, index) => (
                    <AmityPostCard key={`${post.postId}-${index}`} post={post} showComment={true} imageSize="full" />
                ))
            }
            {
                !loading && posts.length === 0 && (
                    <Stack alignItems={'center'} justifyContent={'center'} height={'100%'}>
                        <Newspaper sx={{ fontSize: '100px', color: 'grey.300' }} />
                        <Typography variant="h6" textAlign={'center'} color={'grey.300'}>
                            No posts published yet
                        </Typography>
                    </Stack>
                )
            }
        </Stack>
    )
}

export default NewsFeed
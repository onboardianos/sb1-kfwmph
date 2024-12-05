import { Grid, Pagination, Skeleton, Stack, Typography } from '@mui/material'
import MediaService from '@services/mediaService'
import { useQuery } from '@tanstack/react-query'
import { memo, useState } from 'react'
import VideoPreviewCard from '../components/VideoPreviewCard'
import { useSession } from '@context/SessionContext'
const MyVideos = () => {
    const session = useSession()
    const [page, setPage] = useState(1)
    const pageSize = 6

    const { data, isLoading } = useQuery({
        queryKey: ['my-videos',session],
        queryFn: () => MediaService.getMyMediaAssets(),
        select: (data) => data.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    })

    const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize)

    const VideoPreviewCardMemo = memo(VideoPreviewCard)


    return (
        <Stack gap={8} flex={1}>
            <Grid container spacing={2}>
                {!isLoading && data?.length === 0 && (
                    <Grid item xs={12}>
                        <Typography color="lightgray" align="center">No videos found</Typography>
                    </Grid>
                )}
                {isLoading && (
                    Array.from({ length: 9 }).map((_, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Skeleton variant="rectangular" width={"100%"} height={200} />
                        </Grid>
                    ))
                )}
                {
                    paginatedData?.map((item) => (
                        <Grid item xs={12} md={4} key={`video-${item.id}`}>
                            <VideoPreviewCardMemo {...item} />
                        </Grid>
                    ))
                }
            </Grid>
            <Stack justifyContent={'center'} alignItems={'center'}>
                <Pagination 
                    count={Math.ceil((data?.length ?? 1 )/ pageSize)} 
                    color="primary"
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    />
            </Stack>
        </Stack>
    )
}
export default MyVideos
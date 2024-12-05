import { useSession } from '@context/SessionContext';
import { Grid, Pagination, Skeleton, Stack } from '@mui/material';
import ReviewableService from '@services/reviewableService';
import { TrainingService } from '@services/trainingService';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import ReviewablePreviewCard from '../components/ReviewablePreviewCard';

const MemoReviewablePreviewCard = React.memo(ReviewablePreviewCard)
const MySubmissions = () => {
    const session = useSession()
    const isReviewer = session.data.user?.profile?.reviewer
    const [page, setPage] = useState(1)
    const pageSize = 4

    const { data, isLoading, isSuccess, refetch } = useQuery({
        queryKey: ['mySubmissions', session],
        queryFn: () => {
            if (isReviewer) {
                return ReviewableService.getMyPendingReviewables()
            } else {
                return ReviewableService.getMyReviewablesTestSubmission()
            }
        },
        select: (data) => data.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()),
        refetchOnMount: true
    })

    const topicsData = useQuery({
        queryKey: ['topics'],
        queryFn: () => TrainingService.getMyPlanEnrollment(),
        select: (data) => data.learningPlan.subjects.map((subject) => subject.topics).flat()
    })

    const onNewEvent = () => {
        refetch()
    }

    const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize)

    return (
        <Stack paddingY={4}>
            <Grid container spacing={2}>
                {(isLoading || topicsData.isLoading) && (
                    Array.from({ length: 9 }).map((_, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Skeleton variant="rectangular" width={"100%"} height={200} />
                        </Grid>
                    ))
                )}
                {isSuccess && topicsData.isSuccess &&
                    paginatedData?.map((item) => {
                        let find = topicsData.data.find((topic) => topic.id === item.topicId)
                        if (!find) {
                            return <></>
                        }
                        return (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <MemoReviewablePreviewCard
                                    isReviewer={isReviewer}
                                    onNewEvent={onNewEvent}
                                    video={item}
                                    topic={find!} />
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Stack justifyContent={'center'} alignItems={'center'} mt={4}>
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
export default MySubmissions
import { Paper, Skeleton, Stack } from "@mui/material"

const PostCardSkeleton = () => {
    return (
        <Paper sx={{ marginTop: 2, marginBottom: 2 }}>
            <Stack padding={2} gap={2}>
                <Stack flexDirection={"row"} gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Stack width={'100%'} gap={2}>
                        <Skeleton variant="rectangular" width={'100%'} height={10} />
                        <Skeleton variant="rectangular" width={'40%'} height={10} />
                    </Stack>
                </Stack>
                <Skeleton variant="rectangular" width={'100%'} height={200} />
                <Skeleton variant="rectangular" width={'100%'} height={50} />
            </Stack>
        </Paper>
    )
}

export default PostCardSkeleton
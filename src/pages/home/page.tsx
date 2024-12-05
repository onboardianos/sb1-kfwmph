import NewsFeed from '@common/NewsFeed';
import { useAmity } from '@context/AmityContext';
import { useSession } from '@context/SessionContext';
import { Skeleton, Stack } from '@mui/material';
import AmityService from '@services/amityService';
import { MEDIA_URL } from '@services/index';
import { useQuery } from '@tanstack/react-query';
const page = () => {
    const { data } = useSession()
    const id = data.user?.profile?.chatId
    const { amityIsReady } = useAmity()
    useQuery({
        queryKey: ['update-amity-user', id],
        queryFn: async () => {
            if (!data.user?.profile?.profileImage || !id) return 'No data changed'
            let res = await AmityService.changeAvatarUrlImage(id, `${MEDIA_URL}/${data.user?.profile?.profileImage?.location}?${data.user?.tokens.internalAccess}`)
            return res
        },
        enabled: !!id
    })

    if (!id) {
        return (
            <Stack>
                <Skeleton variant="rectangular" width={"100^"} height={200} />
            </Stack>
        )
    }
    return (
        <Stack flexDirection={"row"} height={"100%"}>
            <Stack flex={1} height={"100%"}>
                {amityIsReady && (
                    <NewsFeed
                        targetType={'community'}
                    />
                )}

            </Stack>
        </Stack>
    )
}
export default page
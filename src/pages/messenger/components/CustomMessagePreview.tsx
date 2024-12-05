import { useSession } from "@context/SessionContext";
import { Icon } from '@iconify/react';
import { Avatar, Badge, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import ChatService from "@services/chatService";
import { MEDIA_URL } from "@services/index";
import { useQuery } from "@tanstack/react-query";
import { ChannelPreviewUIComponentProps, DefaultStreamChatGenerics } from "stream-chat-react";

const CustomMessagePreview = (props: ChannelPreviewUIComponentProps<DefaultStreamChatGenerics>) => {
    const { data } = useSession();
    const myChatId = data.user?.profile?.chatId
    const {
        data: user,
        isLoading: isLoadingUser,
    } = useQuery({
        queryKey: ["chatProfile", props.channel.id],
        queryFn: async () => {
            const query = await props.channel.queryMembers({
                id: { $ne: myChatId! }
            });
            const member = query.members[0]
            if (!member) return null;
            return ChatService.getProfileByChatId(member.user_id!);
        },
        enabled: !!myChatId
    })
    
    const userImage = `${MEDIA_URL}/${user?.profileImage?.location}?${data.user?.tokens.internalAccess}`
    const isGroup = props.channel.data?.groupName !== "" && props.channel.data?.groupName !== undefined
    return (
        <Stack
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: grey[100]
                }
            }}
            onClick={() => {
                props.setActiveChannel?.(props.channel)
            }}
            bgcolor={props.active ? 'primary.100' : 'transparent'}
            direction={'row'}
            alignItems={'center'}
            gap={2}
            marginY={2}
            marginX={2}
            p={1}
            borderRadius={2}
        >
            {
                isLoadingUser && <Skeleton variant="circular" width={40} height={40} />
            }
            {
                !isLoadingUser && (
                    !isGroup ? (
                        <Avatar src={userImage} sx={{ width: 40, height: 40 }}>
                            {user?.firstName.charAt(0)}
                        </Avatar>
                    ) : (
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <Stack p={0.6} bgcolor='primary.main' borderRadius={'100%'} sx={{ borderColor: 'white', borderWidth: 2, borderStyle: 'solid' }}>
                                    <Icon icon="fluent:people-community-12-filled" color="#FFFFFF" />
                                </Stack>
                            }
                        >
                            <Avatar src={'/img/logo.png'} sx={{ width: 40, height: 40 }} />
                        </Badge>
                    )

                )
            }
            <Stack justifyContent={'flex-start'} alignItems={'flex-start'} gap={1}  >
                <Typography flex={1} fontSize={16} fontWeight={600} color={'black'}>
                    {isGroup ? `${props.channel.data?.groupName}` : `${user?.firstName || ""} ${user?.lastName || ""}`}
                </Typography>
            </Stack>
            {(props.unread || 0) > 0  && (
                <Chip label={props.unread} color={'primary'} sx={{
                    m: 0,
                    background: '#FF5964',
                    width: 24,
                    height: 24,
                    padding:0,
                    '& .MuiChip-label': {
                        p: 0,
                        m: 0,
                        fontSize: 8
                    }
                }} />)}


        </Stack>
    )
}
export default CustomMessagePreview;


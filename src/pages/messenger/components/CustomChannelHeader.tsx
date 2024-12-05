import { useSession } from "@context/SessionContext";
import { Menu } from "@mui/icons-material";
import { Avatar, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import ChatService from "@services/chatService";
import { MEDIA_URL } from "@services/index";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useChannelStateContext } from "stream-chat-react";

type CustomChannelHeaderProps = {
    onPressDetails:()=>void
}

const CustomChannelHeader = ({onPressDetails}:CustomChannelHeaderProps) => {
    const channelState = useChannelStateContext()
    const channel = channelState.channel
    const { data } = useSession();
    const myChatId = data.user?.profile?.chatId

    const {
        data: user,
        isLoading: isLoadingUser,
    } = useQuery({
        queryKey: ["chatProfile", channel.cid],
        queryFn: async () => {
            const query = await channel.queryMembers({
                id: { $ne: myChatId! }
            });
            const member = query.members[0]
            if (!member) return null;
            return ChatService.getProfileByChatId(member.user_id!);
        },
        enabled: !!myChatId
    })
    const {
        data:member
    } = useQuery({
        queryKey:["chatMember"],
        queryFn:async()=>{
            const query = await channel.queryMembers({
                id: { $ne: myChatId! }
            });
            const member = query.members[0]
            if (!member) return null;
            return member
        },
        enabled:!!channel
    })
    const userImage = `${MEDIA_URL}/${user?.profileImage?.location}?${data.user?.tokens.internalAccess}`
    const isGroup = channel.data?.groupName !== "" && channel.data?.groupName !== undefined
    return (
        <Stack flexDirection={"row"} p={2} justifyContent={'space-between'}>
            <Stack flexDirection={"row"}  gap={2}>
                <Avatar src={isGroup ? '/img/logo.png' : userImage} sx={{width:48,height:48}}>
                    {user?.firstName.charAt(0)}
                </Avatar>
                <Stack>
                    {isGroup ? (
                        <Typography fontWeight={600} color={'black'}>
                            {`${channel.data?.groupName}`}
                        </Typography>
                    ) : (
                        isLoadingUser ? (
                            <Skeleton variant="text" width={200} height={14} />
                        ) : (
                            <Typography fontWeight={600} color={'black'}>
                                {`${user?.firstName} ${user?.lastName}`}
                            </Typography>
                        )
                    )}
                    <Typography fontSize={12} fontWeight={300} color={'GrayText'}>
                        {isGroup ? `${channel.data?.member_count  ?? 1} members` : !member?.user?.online ? `Last seen ${moment(member?.user?.last_active).fromNow()}` : "Online"}
                    </Typography>
                </Stack>
            </Stack>
            <IconButton onClick={onPressDetails}>
                <Menu />
            </IconButton>
        </Stack>
    )
}
export default CustomChannelHeader;

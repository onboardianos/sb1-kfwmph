import { useSession } from "@context/SessionContext";
import { Avatar, Skeleton, Stack, Typography } from "@mui/material";
import ChatService from "@services/chatService";
import { MEDIA_URL } from "@services/index";
import { useQuery } from "@tanstack/react-query";
import { Channel } from "stream-chat";
import { DefaultStreamChatGenerics, SearchResultItemProps } from "stream-chat-react";

const CustomSearchResultItem = (props: SearchResultItemProps<DefaultStreamChatGenerics>) => {
    let channel = props.result as Channel
    const {data} = useSession()

    if (props.result.type === 'user' || !channel) {
        return <></>
    }
    const myChatId = data?.user?.profile?.chatId
    const isGroup = channel.data?.groupName !== "" && channel.data?.groupName !== undefined
    const theOtherUser = Object.values(channel.state.members).find(member => member.user_id !== myChatId)
    const {user:otherUser} = channel.state.members[theOtherUser?.user_id || ""]

    const {isLoading: isLoadingUser, data: user} = useQuery({
        queryKey: ['user', otherUser?.id],
        queryFn: () => ChatService.getProfileByChatId(otherUser?.id!),
        enabled: !!otherUser?.id
    })
 
    const handleClick = () => { 
        props.selectResult(props.result)
    }
    return (
        <Stack 
            onClick={handleClick}
            sx={{
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: "#f0f0f0"
                }
            }}
            flexDirection={"row"} gap={2} alignItems={"center"} p={2}>
            <Avatar src={isGroup ? '/img/logo.png' : `${MEDIA_URL}/${user?.profileImage?.location}?${data.user?.tokens.internalAccess}`} />
            <Stack>
               <Typography fontWeight={600}>
                {isGroup && `${channel.data?.groupName}`}
                {!isGroup && !isLoadingUser && `${user?.firstName} ${user?.lastName}`}
                {!isGroup && isLoadingUser && <Skeleton variant="text" width={100} height={20} />}

               </Typography>
            </Stack>
        </Stack>
    )
}
export default CustomSearchResultItem;

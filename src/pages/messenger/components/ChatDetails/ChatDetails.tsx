import { useSession } from "@context/SessionContext"
import { Icon } from "@iconify/react"
import { CloseOutlined } from "@mui/icons-material"
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Modal, Paper, Skeleton, Stack, Typography } from "@mui/material"
import ChatService from "@services/chatService"
import DirectoryService from "@services/directoryService"
import { MEDIA_URL } from "@services/index"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useChannelStateContext } from "stream-chat-react"
import NewGroup from "../NewChatsForms/NewGoup"
import MemberList from "./MemberList"
import IconDetail from "./IconDetail"

type ChatDetailsProps = {
    isOpen: boolean,
    onClose: () => void
    maxHeight?: string
}

const ChatDetails = ({ isOpen, maxHeight }: ChatDetailsProps) => {
    const { channel } = useChannelStateContext()
    const { data } = useSession();
    const [editChat, setEditChat] = useState(false)
    
    const myChatId = data.user?.profile?.chatId

    const [confirmDelete, setConfirmDelete] = useState(false)

    const isGroup = channel.data?.groupName !== "" && channel.data?.groupName as boolean

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
        data: contacts
    } = useQuery({
        queryKey: ["contacts"],
        queryFn: () => DirectoryService.getMyContacts(),
        select: (data) => data.filter(contact => channel.state.members[contact.chatId] === undefined)
    })

    const deleteMutate = useMutation({
        mutationKey: ["deleteChat"],
        mutationFn: async () => {
            channel.delete()
        },
        onSuccess: () => {
            setConfirmDelete(false)
        }
    })
    const hideMutate = useMutation({
        mutationKey: ["hideChat"],
        mutationFn: async () => {
            channel.hide()
        },
        onSuccess: () => {
            setConfirmDelete(false)
        }
    })

    const meAsMember = channel.state.members[data.user?.profile?.chatId!]

    const { mutate } = useMutation({
        mutationKey: ["editChat"],
        mutationFn: async ({ groupName, selectedContacts }: { groupName: string, selectedContacts: IContact[] }) => {
            if (groupName !== channel.data?.groupName) {
                channel.updatePartial({
                    set: {
                        groupName
                    }
                })
            }
            if (selectedContacts.length > 0) {
                channel.addMembers(selectedContacts.map(contact => contact.chatId))
            }
        },
        onSuccess: () => {
            setEditChat(false)
        }
    })

    const onEdit = (groupName: string, selectedContacts: IContact[]) => {
        mutate({ groupName, selectedContacts })
    }
    return (
        <Paper sx={{ width: isOpen ? "45%" : 0, transition: "width 0.3s", boxShadow: "none", borderRadius: 4, overflowX: 'hidden', maxHeight: maxHeight || 'unset', position: 'relative', display:'flex', flexDirection:'column' }}>
            <Stack>
                <Stack px={2} p={2} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography fontSize={18} fontWeight={600} color={'black'} >
                        {isGroup ? "Group info" : "Chat details"}
                    </Typography>
                    {isGroup && (meAsMember.role === 'owner' || meAsMember.role === 'moderator') && (
                        <IconButton size="small" onClick={() => setEditChat(true)} >
                            <Icon icon="tabler:dots" />
                        </IconButton>
                    )}
                </Stack>
                <Divider />
                <Stack gap={2} alignItems={"center"} pt={2}>
                    <Avatar
                        sx={{ width: 80, height: 80 }}
                        src={isGroup ? '/img/logo.png' : `${MEDIA_URL}/${user?.profileImage?.location}?${data.user?.tokens.internalAccess}`} />
                    <Stack flex={1} alignItems={"center"} px={4}>
                        {isLoadingUser && <Skeleton variant="text" width={200} height={14} />}
                        {
                            !isLoadingUser && (
                                <Typography fontWeight={600} fontSize={20} >
                                    {isGroup ? `${channel.data?.groupName}` : `${user?.firstName} ${user?.lastName}`}
                                </Typography>
                            )
                        }
                        <Typography fontSize={14} color={'text.secondary'} >
                            {isGroup ? `${channel.data?.member_count} members` : isLoadingUser ? <Skeleton variant="text" width={200} height={14} /> : `${user?.title}`}
                        </Typography>
                    </Stack>
                </Stack>
                {
                    !isLoadingUser && user && !isGroup && (
                        <>
                            <Stack p={2} flex={1}>
                                {user.email && <IconDetail title="Email address" description={user.email} showDivider={user.phone ? true : false} />}
                                {user.phone && <IconDetail title="Phone number" description={user.phone} showDivider={false} />}
                            </Stack>
                        </>
                    )}
            </Stack>
            {!isGroup && (
                <Divider sx={{ borderBottom: '4px solid #EFF2F5' }} />
            )}
            <Stack p={2} flex={1} justifyContent={"space-between"}>
                <Stack gap={2} >
                    {isLoadingUser && !isGroup && (
                        <Stack p={2}>
                            <Skeleton variant="text" width={200} height={14} />
                        </Stack>
                    )}
                    {!isGroup && !isLoadingUser && (
                        <Stack>
                            <Typography fontWeight={600} color={'black'} >
                                {`Bio`}
                            </Typography>
                            <Typography fontWeight={300} color={'GrayText'} >
                                {user?.bio && user.bio.length > 500 ? `${user.bio.slice(0, 500)}...` : user?.bio}
                            </Typography>
                        </Stack>
                    )}
                    {isGroup && (
                        <MemberList />
                    )}
                </Stack>
                {
                    meAsMember.role === 'owner' && isGroup && (
                        <Button
                            sx={{
                                bgcolor: "#FFE5E7",
                                color: "#FF5964",
                                justifyContent: "flex-start",
                                textTransform: "none",
                                fontWeight: 400,
                                fontSize: 16,
                                paddingY: 1,
                                marginTop: 2,
                            }}
                            onClick={() => setConfirmDelete(true)}
                            color="secondary" startIcon={<Icon icon="tabler:trash-filled" />}>
                            Delete group
                        </Button>
                    )
                }
            </Stack>
            {isLoadingUser && !isGroup && <Skeleton width={"100%"} height={100} variant="rounded" />}
            {!isGroup && (
                <Divider sx={{ borderBottom: '4px solid #EFF2F5' }} />
            )}
            {isLoadingUser && !isGroup && (
                <Skeleton width={"100%"} height={100} variant="rounded" />
            )}
            {!isLoadingUser && !isGroup && (
                <Stack p={2} gap={4} flex={1}>
                    <Stack flex={1}>
                        <Typography fontWeight={600}>
                            Site Location
                        </Typography>
                        <Typography fontWeight={300} color={'GrayText'}>
                            {`${user?.site.name}`}
                        </Typography>
                    </Stack>
                    <Button
                        sx={{
                            bgcolor: "#FFE5E7",
                            color: "#FF5964",
                            justifyContent: "flex-start",
                            textTransform: "none",
                            fontWeight: 400,
                            fontSize: 16,
                            paddingY: 1,
                            marginTop:2
                        }}
                        onClick={() => hideMutate.mutate()}
                        color="secondary" startIcon={<Icon icon="tabler:trash-filled" />}>
                        Delete chat
                    </Button>
                </Stack>
            )}
            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>
                    Delete chat
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this chat?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>
                        Cancel
                    </Button>
                    <Button color='error' onClick={() => deleteMutate.mutate()}>
                        Yes, delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Modal open={editChat} onClose={() => setEditChat(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper sx={{ width: 400, borderRadius: 4 }}>
                    <Stack>
                        <Stack p={2} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <Typography fontWeight={600} fontSize={16}>
                                Edit chat
                            </Typography>
                            <IconButton onClick={() => setEditChat(false)}>
                                <CloseOutlined fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Divider />
                        <Stack p={2}>
                            <NewGroup
                                contacts={contacts || []}
                                initialGroupName={channel.data?.groupName as string}
                                onEdit={onEdit}
                            />
                        </Stack>
                    </Stack>
                </Paper>
            </Modal>
        </Paper>
    )
}

export default ChatDetails
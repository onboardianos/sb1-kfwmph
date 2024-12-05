import { useSession } from "@context/SessionContext"
import { Icon } from '@iconify/react'
import { MoreVert } from "@mui/icons-material"
import { Avatar, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from "@mui/material"
import ChatService from "@services/chatService"
import { MEDIA_URL } from "@services/index"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { ChannelMemberResponse } from "stream-chat"
import { DefaultStreamChatGenerics, useChannelStateContext, useChatContext } from "stream-chat-react"
const MemberList = () => {
    const { channel } = useChannelStateContext()
    const [showMembers, setShowMembers] = useState(Object.values(channel.state.members).length < 5 ? Object.values(channel.state.members).length : 5)

    const showAllMembers = () => {
        setShowMembers(Object.values(channel.state.members).length)
    }
    const showLessMembers = () => {
        setShowMembers(5)
    }

    return (
        <Stack>
            <Stack
                sx={{
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                }}
                bgcolor={'grey.200'} flexDirection={'row'} justifyContent={'space-between'} p={1.2} alignItems={'center'}>
                <Typography fontWeight={600}>
                    Members
                </Typography>
                {/**
                 * <IconButton>
                    <Icon icon="iconamoon:search-light"
                        color="#292D32"
                        fontSize={20}
                    />
                </IconButton>
                 */}

            </Stack>
            <Stack sx={{
                border: '1px #EFEEF6 solid',
                borderTop: 0
            }}
                gap={2}
                p={2}
            >
                {
                    Object.values(channel.state.members).slice(0, showMembers).map((member) => (
                        <Member key={member.user_id} member={member} showOptions />
                    ))
                }
                {showMembers !== Object.values(channel.state.members).length && (
                    showMembers < Object.values(channel.state.members).length ? (
                        <Button onClick={showAllMembers}>
                            See All
                        </Button>
                    ) : (
                        <Button onClick={showLessMembers}>
                            See Less
                        </Button>
                    )
                )
                }
            </Stack>
        </Stack>
    )
}

const Member = ({ member, showOptions }: { member: ChannelMemberResponse<DefaultStreamChatGenerics>, showOptions: boolean }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { channel } = useChannelStateContext()
    const { client, setActiveChannel } = useChatContext()
    const open = Boolean(anchorEl);
    const { data: session } = useSession()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { data } = useSession()
    const {
        data: user
    } = useQuery({
        queryKey: ["user", member.user_id],
        queryFn: async () => {
            return await ChatService.getProfileByChatId(member.user_id!)
        },
        enabled: !!member.user_id,
    })
    const isNotMe = member.user_id !== data.user?.profile?.chatId

    const removeMember = () => {
        channel.removeMembers([member.user_id!])
    }

    const promoteToModerator = async () => {
        await channel.removeMembers([member.user_id!])
        await channel.addMembers([
            {
                user_id: member.user_id!,
                channel_role: 'channel_moderator'
            }
        ])
    }
    const sendDirectMessage = (chatId: string) => {
        if (!session.user?.profile?.chatId) return; 
        const newChannel = client.channel('messaging', {
            members: [session.user.profile.chatId, chatId],
            team: client.user?.teams?.[0] // adding team to the channel
        })
        newChannel.create()
        setActiveChannel(newChannel)
    }

    const demoteToMember = async () => {
        await channel.removeMembers([member.user_id!])
        await channel.addMembers([member.user_id!])
    }
    return (
        <Stack flexDirection={"row"} gap={2} alignItems={'center'}>
            <Avatar src={`${MEDIA_URL}/${user?.profileImage?.location}?${data.user?.tokens.internalAccess}`} />
            <Stack flex={1}>
                <Typography fontSize={14} fontWeight={600}>
                    {`${member.user?.first_name} ${member.user?.last_name}`}
                </Typography>
                {/*
                 <Typography fontSize={12} color="GrayText">
                    {member.role}
                </Typography>
                 */}

            </Stack>
            {
                showOptions && isNotMe && (
                    <IconButton onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                )
            }
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {[
                    member.role === 'member' && (
                        <MenuItem onClick={promoteToModerator} key="promote">
                            <ListItemIcon>
                                <Icon icon="flowbite:user-settings-outline" fontSize={24} />
                            </ListItemIcon>
                            <ListItemText sx={{ '& span': { fontWeight: 400 } }}>Promote to moderator</ListItemText>
                        </MenuItem>
                    ),
                    member.role === 'member' && (
                        <MenuItem onClick={removeMember} key="remove">
                            <ListItemIcon>
                                <Icon icon="flowbite:user-remove-outline" fontSize={24} />
                            </ListItemIcon>
                            <ListItemText sx={{ '& span': { fontWeight: 400 } }}>Remove from chat</ListItemText>
                        </MenuItem>
                    ),
                    member.role === 'moderator' && (
                        <MenuItem onClick={demoteToMember} key="demote">
                            <ListItemIcon>
                                <Icon icon="flowbite:user-settings-outline" fontSize={24} />
                            </ListItemIcon>
                            <ListItemText sx={{ '& span': { fontWeight: 400 } }}>Demote to member</ListItemText>
                        </MenuItem>
                    ),
                    <MenuItem onClick={() => sendDirectMessage(member.user_id!)} key="message">
                        <ListItemIcon>
                            <Icon icon="flowbite:message-dots-outline" fontSize={20} />
                        </ListItemIcon>
                        <ListItemText sx={{ '& span': { fontWeight: 400 } }}>Send message</ListItemText>
                    </MenuItem>
                ]}
            </Menu>
        </Stack>
    )
}

export default MemberList
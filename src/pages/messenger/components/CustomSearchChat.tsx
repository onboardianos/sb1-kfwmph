import { Icon } from "@iconify/react";
import { CloseOutlined, SearchOutlined } from "@mui/icons-material";
import { Divider, IconButton, Modal, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import DirectoryService from "@services/directoryService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Channel } from "stream-chat";
import { ChannelSearchProps, DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import NewChat from "./NewChatsForms/NewChat";
import NewGroup from "./NewChatsForms/NewGoup";

const CustomSearchChat = (props: ChannelSearchProps<DefaultStreamChatGenerics> & { filter: 'all' | 'unread', setFilter: (filter: 'all' | 'unread') => void }) => {
    const [newChat, setNewChat] = useState(false)
    const [tab, setTab] = useState(0)
    const { setActiveChannel } = useChatContext()

    const {
        data: contacts
    } = useQuery({
        queryKey: ["contacts"],
        queryFn: () => DirectoryService.getMyContacts()
    })

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onSearch?.(e)

    }

    const onSuccess = (channel: Channel<DefaultStreamChatGenerics>) => {
        setActiveChannel(channel)
        setNewChat(false)
    }

    return (
        <Stack px={3} pt={4} pb={1} gap={1}>
            <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography fontWeight={600} color={'black'} fontSize={18}>
                    Chats
                </Typography>
                <IconButton onClick={() => setNewChat(true)}>
                    <Icon icon="fluent:chat-add-32-regular"
                        fontSize={20}
                    />
                </IconButton>
            </Stack>
            {/*
            <Stack flexDirection={"row"} gap={2}>
                <Chip 
                    label="All" onClick={() => props.setFilter('all')}
                    variant={props.filter === 'all' ? 'filled' : 'outlined'}
                    color={props.filter === 'all' ? 'secondary' : 'default'}
                    sx={{
                        paddingY:2.5
                    }}
                    />
                <Chip 
                    label="Unread" 
                    onClick={() => props.setFilter('unread')} 
                    variant={props.filter === 'unread' ? 'filled' : 'outlined'}
                    color={props.filter === 'unread' ? 'secondary' : 'default'}
                    sx={{
                        paddingY:2.5
                    }}
                />
            </Stack>*/}
            <Stack>
                <TextField
                    onChange={handleOnChange}
                    InputProps={{
                        startAdornment: <SearchOutlined fontSize="small" color="disabled" sx={{ mr: 1 }} />
                    }}
                    placeholder="Search communities" size="small" />
            </Stack>
            <Divider />

            <Modal open={newChat} onClose={() => setNewChat(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper sx={{ width: 650, borderRadius: 2 }}>
                    <Stack>
                        <Stack p={2} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            <Typography fontWeight={600} fontSize={16}>
                                Start new chat
                            </Typography>
                            <IconButton onClick={() => setNewChat(false)}>
                                <CloseOutlined fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Divider />
                        <Stack p={2}>
                            <Tabs
                                variant="fullWidth"
                                value={tab} onChange={(_, value) => setTab(value)}>
                                <Tab label="New chat" />
                                <Tab label="New group" />
                            </Tabs>
                            <Stack pt={4}>
                                {tab === 0 && <NewChat contacts={contacts || []} onSuccess={onSuccess} />}
                                {tab === 1 && <NewGroup contacts={contacts || []} onSuccess={onSuccess} />}
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Modal>
        </Stack>
    )
}
export default CustomSearchChat;
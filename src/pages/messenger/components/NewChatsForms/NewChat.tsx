import { useSession } from "@context/SessionContext";
import { Search, SearchOutlined } from "@mui/icons-material";
import { Avatar, Button, CircularProgress, Collapse, Stack, TextField, Typography } from "@mui/material";
import { MEDIA_URL } from "@services/index";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Channel } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import ContactItem from "../ContactItem";

type INewChat = {
    contacts: IContact[],
    onSuccess:(channel:Channel<DefaultStreamChatGenerics>)=>void
}

const NewChat = ({ contacts,onSuccess }: INewChat) => {
    const [search, setSearch] = useState<string>("");
    const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
    const { data } = useSession()
    const { client: streamClient } = useChatContext()
    const filteredContacts = contacts.filter((contact) => {
        if (search.length > 0) {
            if (contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
                contact.lastName.toLowerCase().includes(search.toLowerCase()) ||
                contact.title.toLowerCase().includes(search.toLowerCase())
            ) {
                return contact;
            }
        }
    });
    const { mutate, isPending } = useMutation({
        mutationKey: ["createChat"],
        mutationFn: async () => {
            if (data.user?.profile && streamClient.user) {
                const channel = streamClient.channel("messaging", {
                    members: [selectedContact?.chatId!, data.user!.profile.chatId!],
                    team: streamClient.user?.teams?.[0]
                })
                await channel.create()
                return channel
            }
            throw new Error("User not logged in")
        },
        onSuccess: (data) => {
            onSuccess(data)
        },

    })



    return (
        <Stack gap={1} minHeight={300} flex={1}>
            <Stack gap={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Select user
                </Typography>
                <TextField
                    id="search-input"
                    placeholder="Search user"
                    name="search"
                    autoComplete={"off"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: <SearchOutlined fontSize="small" color="disabled" sx={{ mr: 1 }} />,
                        sx:{paddingY:1}
                    }}
                />
            </Stack>
            <Stack>
                <Typography fontSize={12} fontWeight={600} color="GrayText">
                    {`Results (${filteredContacts.length})`}
                </Typography>
                {
                    filteredContacts.length === 0 && (
                        <Stack
                            height={250}
                            justifyContent={"center"}
                            alignItems={"center"}
                            gap={1} py={4}
                            color="GrayText">
                            <Search />
                            <Typography color='inherit' fontSize={14}>
                                No results found
                            </Typography>
                        </Stack>
                    )
                }
                {
                    filteredContacts.length > 0 && (
                        <Stack minHeight={250} maxHeight={300} overflow={"auto"}>
                            {filteredContacts.map((contact) => (
                                <ContactItem key={contact.id} contact={contact} onPress={setSelectedContact} />
                            ))}
                        </Stack>
                    )
                }
            </Stack>
            <Collapse in={!!selectedContact}>
                <Stack flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
                    <Avatar src={`${MEDIA_URL}/${selectedContact?.profileImage}?${data.user?.tokens.internalAccess}`} />
                </Stack>
            </Collapse>

            <Button
                onClick={() => mutate()}
                sx={{ gap: 2 }}
                variant="contained" disabled={!selectedContact || isPending}>
                {isPending && <CircularProgress size={16} />}
                Create chat
            </Button>
        </Stack >
    )
}
export default NewChat;
import { useSession } from "@context/SessionContext";
import { Close, Search, SearchOutlined } from "@mui/icons-material";
import { Avatar, AvatarGroup, Badge, Button, CircularProgress, Collapse, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Channel } from "stream-chat";
import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
import ContactItem from "../ContactItem";
import { MEDIA_URL } from "@services/index";

type INewGroup = {
    contacts: IContact[],
    onSuccess?: (channel: Channel<DefaultStreamChatGenerics>) => void
    initialGroupName?: string
    onEdit?: (groupName: string, selectedContacts: IContact[]) => void
}
const NewGroup = ({ contacts, onSuccess, initialGroupName, onEdit }: INewGroup) => {
    const [groupName, setGroupName] = useState<string>(initialGroupName || "");
    const [search, setSearch] = useState<string>("");
    const [selectedContact, setSelectedContact] = useState<IContact[]>([]);
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
        mutationKey: ["createGroupChat"],
        mutationFn: async () => {
            if (data.user?.profile && streamClient.user) {
                try {
                    const name = Date.now() + "-groupName"
                    const channel = streamClient.channel("messaging", name, {
                        members: [...selectedContact.map(contact => contact.chatId!), data.user!.profile.chatId!],
                        team: streamClient.user?.teams?.[0],
                        groupName: groupName
                    })
                    await channel.create()
                    return channel
                } catch (error) {
                    console.log(error)
                    throw new Error("Error creating group chat")
                }
            }
            throw new Error("User not logged in")
        },
        onSuccess: (data) => {
            onSuccess && onSuccess(data)
        },

    })

    const handleSelectContact = (contact: IContact) => {
        if (selectedContact.find(c => c.id === contact.id)) {
            setSelectedContact(selectedContact.filter(c => c.id !== contact.id))
        } else {
            setSelectedContact([...selectedContact, contact])
        }
    }

    const handleRemoveContact = (contact: IContact) => {
        setSelectedContact(selectedContact.filter(c => c.id !== contact.id))
    }

    return (
        <Stack gap={1} minHeight={300} flex={1}>
            <Stack gap={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Group name
                </Typography>
                <TextField
                    id="search-input"
                    placeholder="Group name"
                    name="groupName"
                    autoComplete={"off"}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    size="small"
                    InputProps={{
                        sx:{paddingY:1}
                    }}
                />
            </Stack>
            <Stack gap={1}>
                <Typography fontSize={14} fontWeight={600}>
                    {onEdit ? "Add new users" : "Select user"}
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
                                <ContactItem key={contact.id} contact={contact} onPress={handleSelectContact} />
                            ))}
                        </Stack>
                    )
                }
            </Stack>
            <Collapse in={selectedContact.length > 0}>
                <Stack justifyContent={"center"} alignItems={"center"}>
                    <AvatarGroup total={selectedContact.length} >
                        {selectedContact.slice(0, 10).map((contact) => (
                            <ContactAvatar key={contact.id} contact={contact} access={data.user?.tokens.internalAccess!} onPress={handleRemoveContact} />
                        ))}
                    </AvatarGroup>
                </Stack>
            </Collapse>
            {
                onEdit ? (
                    <Button
                        onClick={() =>onEdit(groupName, selectedContact)}
                        sx={{ gap: 2 }}
                        variant="contained" disabled={groupName.length === 0} >
                        {isPending && <CircularProgress size={16} />}
                        Save
                    </Button>
                ) : (
                    <Button
                        onClick={() => mutate()}
                        sx={{ gap: 2 }}
                        variant="contained" disabled={selectedContact.length === 0 || isPending || groupName.length === 0} >
                        {isPending && <CircularProgress size={16} />}
                        Create group chat
                    </Button>
                )
            }
        </Stack >
    )
}

const ContactAvatar = ({ contact, access, onPress }: { contact: IContact, access: string, onPress: (contact: IContact) => void }) => {
    const [showClose, setShowClose] = useState(false)
    return (
        <Badge key={contact.id} sx={{ position: 'relative' }}>
            <Avatar
                onMouseEnter={() => setShowClose(true)}
                onMouseLeave={() => setShowClose(false)}
                src={`${MEDIA_URL}/${contact.profileImage}?${access}`} />
            <Stack
                position={'absolute'}
                display={showClose ? 'flex' : 'none'}
                justifyContent={'center'}
                alignItems={'center'}
                top={0} right={0} width={45} height={45} borderRadius={'50%'}
                sx={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    setShowClose(true);
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                    setShowClose(false);
                }}
                onClick={() => onPress(contact)}
            >
                <Close sx={{
                    color: 'white',
                    cursor: 'pointer',
                }} onClick={(e) => {
                    e.stopPropagation();
                    onPress(contact)
                }} />
            </Stack>
        </Badge>
    )
}
export default NewGroup;
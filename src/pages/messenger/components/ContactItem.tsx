import { useSession } from "@context/SessionContext"
import { Avatar, Stack, Typography } from "@mui/material"
import { grey } from "@mui/material/colors"
import { MEDIA_URL } from "@services/index"

type IContactItem = {
    contact: IContact,
    onPress: (contact: IContact) => void
}
const ContactItem = ({ contact, onPress }: IContactItem) => {
    const { data } = useSession()
    return (
        <Stack
            onClick={() => onPress(contact)}
            sx={{ cursor: "pointer", "&:hover": { backgroundColor: grey[100] } }}
            flexDirection={"row"} gap={1} alignItems={"center"} py={2} px={1} borderRadius={1}>
            <Avatar src={`${MEDIA_URL}/${contact.profileImage}?${data.user?.tokens.internalAccess}`} />
            <Stack>
                <Typography fontSize={14} fontWeight={600}>
                    {contact.firstName} {contact.lastName}
                </Typography>
                <Typography fontSize={12} color="GrayText">
                    {contact.title}
                </Typography>
            </Stack>
        </Stack>
    )
}

export default ContactItem

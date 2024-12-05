import { Icon } from "@iconify/react"
import { IconButton, Stack, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
type IconDetailProps = {
    title: string,
    description: string,
    showDivider?: boolean
}
const IconDetail = ({ title, description, showDivider = true }: IconDetailProps) => {
    const snackbar = useSnackbar()
    const handleCopy = () => {
        navigator.clipboard.writeText(description)
        snackbar.enqueueSnackbar("Copied to clipboard", { variant: "success", autoHideDuration: 1000 })
    }
    return (
        <Stack
            direction={"row"} alignItems={"center"} justifyContent={"space-between"} sx={{ cursor: "pointer" }} gap={2}>
            <Stack flex={1} borderBottom={showDivider ? "1px solid #EFF2F5" : "none"} py={2} overflow={"hidden"} >
                <Typography fontSize={14} fontWeight={300} >{title}</Typography>
                <Typography fontSize={18} fontWeight={600}>{description}</Typography>
            </Stack>
            <IconButton
                onClick={handleCopy}
                sx={{
                    bgcolor:'grey.A100',
                    padding:1.5
                }}
            >
                <Icon icon="gravity-ui:copy"
                    color='#ACACAD'
                    fontSize={16}
                />
            </IconButton>
        </Stack>
    )
}

export default IconDetail;
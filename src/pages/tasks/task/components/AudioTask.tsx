import { Icon } from "@iconify/react"
import { ArrowBack } from "@mui/icons-material"
import { Box, Button, Modal, Paper, Stack, Typography } from "@mui/material"
import { useState } from "react"

type IAudioTaskProps = {
    uri: string,
    title: string,
}
const AudioTask = (props: IAudioTaskProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Stack gap={2} onClick={() => setIsOpen(true)} sx={{ cursor: 'pointer' }}>
                <Stack flexDirection={"row"} alignItems={"center"} gap={0.5}>
                    <Icon icon="solar:soundwave-square-line-duotone" style={{ color: '#4F4F4F', fontSize: 20 }} />
                    <Typography fontWeight={600} >
                        Audios
                    </Typography>
                </Stack>
                <Stack gap={1}>
                    <Typography fontWeight={600} fontSize={12} color='primary.main' >
                        {props.title}
                    </Typography>
                    <Box width={'100%'} height={150} bgcolor={'primary.main'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={2} >
                        <Icon icon="mdi-light:link" fontSize={64} color="white" />
                    </Box>
                </Stack>
            </Stack>
            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ justifyContent: "center", alignItems: "center", display: "flex", margin: "auto" }}
            >
                <Paper style={{ width: "75vw", padding: 10 }} variant='rounded'>
                    <Stack flexDirection={"row"} gap={1} alignItems={"center"} mb={2}>
                        <Button variant='text' onClick={() => setIsOpen(false)}>
                            <ArrowBack />
                        </Button>
                        <Typography fontWeight={"bold"}>
                            {props.title}
                        </Typography>
                    </Stack>
                    <audio src={props.uri} controls={true} />
                </Paper>
            </Modal>
        </>
    )
}

export default AudioTask
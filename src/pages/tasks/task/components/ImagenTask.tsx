import { Icon } from "@iconify/react"
import { ArrowBack } from "@mui/icons-material"
import { Button, Modal, Paper, Stack, Typography } from "@mui/material"
import { useState } from "react"

type IImagenTaskProps = {
    uri: string,
    title: string,
}
const ImagenTask = (props: IImagenTaskProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Stack gap={2} onClick={() => setIsOpen(true)} sx={{ cursor: 'pointer' }}>
                <Stack flexDirection={"row"} alignItems={"center"} gap={0.5}>
                    <Icon icon="mage:image" style={{ color: '#4F4F4F', fontSize: 20 }} />
                    <Typography fontWeight={600} >
                        Images
                    </Typography>
                </Stack>
                <Stack gap={1}>
                    <Typography fontWeight={600} fontSize={12} color='primary.main' >
                        {props.title}
                    </Typography>
                    <img src={props.uri} alt={props.title} width={'50%'} height={200} style={{ objectFit: 'contain', borderRadius: 8, backgroundColor: 'white' }} />
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
                    <img
                        src={props.uri}
                        width="100%"
                        height={700}
                        style={{
                            backgroundColor: "black",
                            borderRadius: 16,
                            overflow: "hidden",
                            objectFit: "contain"
                        }}
                    />
                </Paper>
            </Modal>
        </>
    )
}

export default ImagenTask
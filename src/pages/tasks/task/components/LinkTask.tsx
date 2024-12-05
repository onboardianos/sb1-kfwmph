import PDFViewer from "@common/PDFViewer"
import { Box, Divider, Modal, Skeleton, Stack, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { getLinkPreview } from "link-preview-js"
import { useState } from "react"
import { Document, Page } from "react-pdf"

import { Icon } from "@iconify/react"
type ILinkTask = {
    type: 'weblink' | 'document',
    title: string,
    url: string,
}

const LinkTask = (props: ILinkTask) => {
    const [open, setOpen] = useState(false)

    const {
        data: webLinkData,
        isLoading: webLinkLoading,
    } = useQuery({
        queryKey: ['web-link', props.url],
        queryFn: () => getLinkPreview(props.url),
        enabled: props.type === 'weblink'
    })
    const getIconByType = () => {
        if (props.type === 'weblink') {
            return <Icon icon="mdi-light:link" fontSize={24} />
        } else {
            return <Icon icon="solar:document-outline" fontSize={24} />
        }
    }

    const handleGoToLink = () => {
        window.open(props.url, '_blank')
    }
    const handleClick = () => {
        if (props.type === 'document') {
            setOpen(true)
        } else {
            handleGoToLink()
        }
    }


    return (
        <Stack gap={2}>
            <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
                {getIconByType()}
                <Typography fontWeight={600} >
                    {props.type === 'weblink' ? 'Links' : 'Documents'}
                </Typography>
            </Stack>
            <Stack gap={1} onClick={handleClick} sx={{ cursor: 'pointer' }}>
                <Typography fontWeight={600} fontSize={12} color='primary.main' >
                    {props.type === 'weblink' && webLinkData && 'title' in webLinkData ? webLinkData.title : props.title}
                </Typography>
                <Box bgcolor={'black'} borderRadius={2} width={'50%'} >
                    {webLinkLoading && <Skeleton variant="rectangular" width={'100%'} height={150} />}
                    {props.type === 'weblink' && webLinkData && 'images' in webLinkData && webLinkData.images.length > 0 && (
                        <img src={webLinkData.images[0]} alt="web-link" width={'100%'} />
                    )}
                    {props.type === 'weblink' && webLinkData && 'images' in webLinkData && webLinkData.images.length === 0 && (
                        <Box width={'100%'} height={150} bgcolor={'primary.main'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={2} >
                            <Icon icon="mdi-light:link" fontSize={64} color="white" />
                        </Box>
                    )}
                    {props.type === 'document' && (
                        <Stack width={'100%'} height={150} overflow={'hidden'} borderRadius={2}>
                            <Document
                                file={props.url}
                            >
                                <Page pageNumber={1} width={300} />
                            </Document>
                        </Stack>
                    )}

                </Box>
            </Stack>
            <Divider />
            <Modal
                open={open}
                onClose={() => setOpen(false)}>
                <Stack >
                    <PDFViewer document={props.url} onClose={() => setOpen(false)} />
                </Stack>
            </Modal>

        </Stack>
    )
}

export default LinkTask
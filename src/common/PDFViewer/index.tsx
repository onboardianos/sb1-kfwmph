import { ChevronLeft, ChevronRight, Close, Download, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Document, Page } from "react-pdf";

type IPDFViewer = {
    document: string,
    onClose: () => void,
    open: boolean,
    setOpen: (open: boolean) => void,
    title: string

}
const PDFViewer = ({ document, onClose, open, setOpen, title }: IPDFViewer) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => {
        setZoom(zoom + 0.5);
    }
    const handleZoomOut = () => {
        setZoom(zoom - 0.5);
    }

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }
    const openLink = () => {
        window.open(document, '_blank');
    }
    return (
        <Dialog
            open={open}
            maxWidth={'lg'}
            fullWidth
            onClose={() => setOpen(false)}>
            <DialogTitle>
                <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="h6">{title}</Typography>
                    <Stack flexDirection={'row'} gap={1}>
                        <IconButton size="large" onClick={handleZoomIn}>
                            <ZoomIn />
                        </IconButton>
                        <IconButton size="large" onClick={handleZoomOut}>
                            <ZoomOut />
                        </IconButton>
                        <IconButton size="large" onClick={openLink}>
                            <Download />
                        </IconButton>
                        <IconButton onClick={onClose} size="large">
                            <Close />
                        </IconButton>

                    </Stack>
                </Stack>

            </DialogTitle>
            <DialogContent dividers>
                <Stack width={'100%'} height={'100%'} alignItems={'center'} justifyContent={'center'} bgcolor={'grey.300'}>
                    <Document
                        file={document}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber}
                            scale={zoom}

                        />
                    </Document>
                </Stack>
                <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'} position={'sticky'} bottom={0} left={0} right={0} >
                    <IconButton onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>
                        <ChevronLeft />
                    </IconButton>
                    {pageNumber} / {numPages}
                    <IconButton onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === numPages}>
                        <ChevronRight />
                    </IconButton>
                </Stack>
            </DialogContent>
        </Dialog >
    );

}

export default PDFViewer
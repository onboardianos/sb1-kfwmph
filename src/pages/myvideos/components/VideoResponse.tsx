import { VideoPreview } from '@common/RecordingVideo/RecordingVideo';
import { EditOutlined, PauseOutlined, PlayArrowOutlined, SendOutlined, StopCircleOutlined, VideoCameraBackOutlined } from '@mui/icons-material';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder-2';
import ReactPlayer from 'react-player';
import ysFixWebmDuration from 'fix-webm-duration';

type IVideoResponse = {
    onPressOption: (option: number) => void
    onSubmitResponse: (mediaUrl: string) => Promise<void>
    onChangeText: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}
const VideoResponse = (props: IVideoResponse) => {
    const { mediaBlobUrl, status, startRecording, stopRecording, previewStream, pauseRecording, resumeRecording } = useReactMediaRecorder({ video: true, audio: true, blobPropertyBag: { type: 'video/webm' } });
    const [loading, setLoading] = React.useState<boolean>(false)
    const [fixedBlobUrl, setFixedBlobUrl] = React.useState<string>("")
    const [isPaused, setIsPaused] = React.useState<boolean>(false)

    const durationMs = useRef(0);


    useEffect(() => {
        const interval = setInterval(() => {
            if (status === "recording" && !isPaused) {
                durationMs.current += 1000
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [status, isPaused])

    useEffect(() => {
        if (status === "stopped" && mediaBlobUrl) {
            handleRecordingEnd()
        }
    }, [status, mediaBlobUrl])


    const handleRecordingEnd = async () => {
        console.log(mediaBlobUrl)
        const response = await fetch(mediaBlobUrl!);
        const blob = await response.blob();
        let blobFixed = await ysFixWebmDuration(blob, durationMs.current);
        const fixedBlobUrl = URL.createObjectURL(blobFixed);
        setFixedBlobUrl(fixedBlobUrl)
    }
    const handleSendVideoResponse = async () => {
        try {
            setLoading(true)
            await props.onSubmitResponse(fixedBlobUrl)
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }

    }

    if (status === "stopped" && mediaBlobUrl) {
        return (
            <Stack gap={4}>
                <ReactPlayer
                    style={{ background: "black", borderRadius: 16, overflow: "hidden" }}
                    url={fixedBlobUrl}
                    width={"100%"}
                    height={500}
                    controls={true}
                    onContextMenu={(e: any) => e.preventDefault()}
                    config={{
                        file: {
                            attributes: {
                                controlsList: "nodownload"
                            }
                        }
                    }}

                />
                <Stack>
                    <TextField placeholder='Enter Response (Optional)' onChange={props.onChangeText} variant='outlined' multiline rows={5} />
                </Stack>
                <Stack flexDirection={"row"} justifyContent={"center"} gap={4}>
                    <Button
                        onClick={() => props.onPressOption(3)}
                        variant='outlined' endIcon={<EditOutlined />}>
                        Written response
                    </Button>
                    <Button onClick={handleSendVideoResponse} endIcon={<SendOutlined />} variant='contained' sx={{ gap: 1 }} disabled={loading}>
                        {loading && <CircularProgress size={16} />}
                        Submit response
                    </Button>
                </Stack>
            </Stack>
        )
    }

    if (status === "idle") {
        return (
            <Stack gap={4}>
                <Stack bgcolor={"black"} width={"100%"} height={500} borderRadius={6} />
                <Button
                    onClick={startRecording} sx={{ alignSelf: "center",paddingY: 3 }} endIcon={<VideoCameraBackOutlined />} variant='contained' color='error'>
                    Start Recording
                </Button>
            </Stack>
        )
    }
    if (status === "acquiring_media") {
        return (
            <Stack bgcolor={"black"} width={"100%"} height={500} borderRadius={6} />
        )
    }
    const handlePause = () => {
        if (isPaused) {
            resumeRecording()
        } else {
            pauseRecording()
        }
        setIsPaused(!isPaused)
    }
    return (
        <Stack gap={4}>
            <Stack borderRadius={4} overflow={"hidden"}>
                <VideoPreview controls={false} stream={previewStream} height='500px' onRecordEnd={stopRecording} isPaused={isPaused} />
            </Stack>
            <Stack flexDirection={"row"} justifyContent={"center"} gap={2}>
                <Button
                    sx={{paddingY:3}} 
                    onClick={handlePause} variant='outlined' color='error' endIcon={isPaused ? <PlayArrowOutlined /> : <PauseOutlined />}>
                    {isPaused ? "Resume" : "Pause"} Recording
                </Button>
                <Button
                    sx={{paddingY:3}} 
                    onClick={stopRecording} variant='contained' color="error" endIcon={<StopCircleOutlined />}>
                    Stop Recording
                </Button>
            </Stack>
        </Stack>
    )
}
export default VideoResponse
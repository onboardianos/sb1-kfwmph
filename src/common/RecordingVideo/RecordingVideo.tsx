import { RadioButtonChecked, StopCircle } from '@mui/icons-material';
import { Button, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder-2';
import ysFixWebmDuration from 'fix-webm-duration';

type IRecordingVideo = {
    autoRecording: boolean,
    onRecordingEnd: (uri: string) => void
}
type ICountDownView = {
    onCountDownEnd: () => void
}

const RecordingVideo = (props: IRecordingVideo) => {
    const { mediaBlobUrl, status, startRecording, stopRecording, previewStream } = useReactMediaRecorder({ video: true,audio:true, blobPropertyBag: { type: 'video/webm' } });
    const durationMs = useRef(0);
    useEffect(() => {
        if (status === "stopped" && mediaBlobUrl) {
            handleRecordingEnd()
        }
    }, [status, mediaBlobUrl])

    const handleRecordingEnd = async () => {
        const response = await fetch(mediaBlobUrl!);
        const blob = await response.blob();
        let blobFixed = await ysFixWebmDuration(blob, durationMs.current);
        const fixedBlobUrl = URL.createObjectURL(blobFixed);
        props.onRecordingEnd(fixedBlobUrl)
    }

    if (status === "idle" && props.autoRecording) {
        return <CountDownView onCountDownEnd={startRecording} />
    }
    if (status === "acquiring_media") {
        <Stack justifyContent={"center"} alignItems={"center"} bgcolor={"black"} color={"white"} width={500} height={500}>
            <Typography variant="h4" fontWeight={"bold"} textAlign={"center"}>Setting up your camera.</Typography>
        </Stack>
    }
    return (
        <VideoPreview stream={previewStream} onRecordEnd={(msTime: number) => {
            durationMs.current = msTime;
            stopRecording()
        }} />
    )
}

const CountDownView = ({ onCountDownEnd }: ICountDownView) => {
    const [count, setCount] = React.useState(3)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(count - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [count])

    useEffect(() => {
        if (count === 0) {
            onCountDownEnd()
        }
    }, [count])

    return (
        <Stack justifyContent={"center"} alignItems={"center"} bgcolor={"black"} color={"white"} width={"100%"} height={"100vh"}>
            <Typography variant="h1" fontWeight={"bold"} textAlign={"center"}>{count}</Typography>
        </Stack>
    )
}

export const VideoPreview = ({ stream, onRecordEnd, controls = true, height = "100vh", isPaused = false }: { stream: MediaStream | null, onRecordEnd: (msTime: number) => void, controls?: boolean, height?: string, isPaused?: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [time, setTime] = React.useState({ minutes: 0, seconds: 0 });

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setTime(prevTime => {
                    const newSeconds = prevTime.seconds + 1;
                    const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
                    return { minutes: newMinutes, seconds: newSeconds % 60 };
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused]);

    if (!stream) {
        return null;
    }


    return (
        <Stack justifyContent={"center"} alignItems={"center"} position={"relative"} width={"100%"} height={height} bgcolor={"black"} >
            <video ref={videoRef} width={"100%"} height={"100%"} autoPlay />
            <Stack sx={{
                position: "absolute",
                top: 0,
                left: 30,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                paddingX: 2,
                paddingY: 1,
                borderRadius: 10,
                margin: 2,
                zIndex: 100
            }} flexDirection={"row"} justifyContent={"center"} alignItems={"center"} gap={2}>
                <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
                    <RadioButtonChecked color={"error"} />
                    <Typography color="white" variant="body1" fontWeight={"bold"}>REC</Typography>
                </Stack>
                <Divider orientation='vertical' color='white' flexItem />
                <Typography color="white" variant="body1" fontWeight={"bold"}>
                    {String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
                </Typography>
            </Stack>
            {controls && (
                <Button onClick={() => {
                    onRecordEnd(time.minutes * 60 * 1000 + time.seconds * 1000);
                }} endIcon={<StopCircle />} sx={{ position: "absolute", bottom: 40 }} size='large' color='error' variant='contained'>
                    STOP RECORDING
                </Button>
            )}

        </Stack>
    )
}

export default RecordingVideo
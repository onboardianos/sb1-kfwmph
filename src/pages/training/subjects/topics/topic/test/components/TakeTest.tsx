import { Stack } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import SendSubmittion from './SendSubmittion'
import { useAppData } from '@context/AppData'
import { MEDIA_URL } from '@services/index'
import RecordingVideo from '@common/RecordingVideo/RecordingVideo'


type ITakeTest = {
    trainingAccess?: string
}
enum Status {
    PLAYING_VIDEO,
    RECORDING_VIDEO,
    SEND_SUBMITTION
}
const TakeTest = ({ trainingAccess }: ITakeTest) => {
    const { topic } = useAppData()
    const [currentVideo, setCurrentVideo] = React.useState<number>(0)
    const [status, setStatus] = React.useState<Status>(Status.PLAYING_VIDEO)
    const [recorderVideos, setRecorderVideos] = React.useState<{ uri: string, isDemo: boolean }[]>([])

    const [lastPlayed, setLastPlayed] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const playerRef = useRef<ReactPlayer>(null);


    useEffect(() => {
        let timer: any = null
        if (playing) {
            timer = setInterval(() => {
                setLastPlayed((lastPlayed) => lastPlayed + 1);
            }, 1000);
        } else {
            if (timer) {
                clearInterval(timer);
            }
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [playing]);

    const handleOnEndedVideo = () => {
        if (topic == null) return
        setRecorderVideos((prev) => [...prev, {
            uri: `${MEDIA_URL}/${topic.testVideos[currentVideo].location}?${trainingAccess}`,
            isDemo: true
        }])
        if (topic.testVideos.length === 1) {
            setStatus(Status.RECORDING_VIDEO)
        } else {
            if (currentVideo === 0) {
                if (currentVideo + 1 < topic.testVideos.length) {
                    setCurrentVideo(currentVideo + 1)
                }
            } else {
                setStatus(Status.RECORDING_VIDEO)
            }
        }

    }

    if (topic == null || !trainingAccess) return null

    const handleOnEndRecorded = (uri?: string) => {
        if (uri) {
            setRecorderVideos((prev) => [...prev, {
                uri: uri,
                isDemo: false
            }])
        }
        if (currentVideo + 1 < topic.testVideos.length) {
            setCurrentVideo(currentVideo + 1)
            setStatus(Status.PLAYING_VIDEO)
        }
        if (currentVideo + 1 === topic.testVideos.length) {
            setStatus(Status.SEND_SUBMITTION)
        }
    }

    const handleProgress = (state: { playedSeconds: number }) => {
        if (state.playedSeconds > lastPlayed + 1) {
            playerRef.current?.seekTo(lastPlayed, 'seconds');
        }
    };


    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handleOnReady = () => {
        if (playerRef.current) {
            playerRef.current.getInternalPlayer().play();
        }
    }

    const retakeTest = () => {
        setRecorderVideos([])
        setCurrentVideo(0)
        setStatus(Status.PLAYING_VIDEO)
    }
    return (

        <Stack flex={1}>
            {status === Status.PLAYING_VIDEO && (
                <ReactPlayer
                    key={topic.testVideos[currentVideo].location} // Agrega esta línea
                    ref={playerRef}
                    style={{ background: "black" }}
                    url={`${MEDIA_URL}/${topic.testVideos[currentVideo].location}?${trainingAccess}`}
                    width={"100%"}
                    height={'100vh'}
                    controls={true}
                    onEnded={handleOnEndedVideo}
                    playing={playing}
                    onPlay={handlePlayPause}
                    onPause={handlePlayPause}
                    onProgress={handleProgress}
                    onReady={handleOnReady}
                    onContextMenu={(e: any) => e.preventDefault()}
                    config={{
                        file: {
                            attributes: {
                                controlsList: "nodownload"
                            }
                        }
                    }}
                />
            )}
            {status === Status.RECORDING_VIDEO && (
                <RecordingVideo autoRecording onRecordingEnd={handleOnEndRecorded} />
            )}
            {status === Status.SEND_SUBMITTION && (
                <SendSubmittion onRetake={retakeTest} videos={recorderVideos} />
            )}

        </Stack>
    )
}
export default TakeTest
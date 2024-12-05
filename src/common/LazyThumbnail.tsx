import { Skeleton, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { generateVideoThumbnailViaUrl } from '@rajesh896/video-thumbnails-generator';
import React, { useEffect, useState, useRef } from 'react';

interface LazyThumbnailProps {
    url: string;
    height?: number;
    showDuration?: boolean;
    seconds?: number;
}

const LazyThumbnail: React.FC<LazyThumbnailProps> = ({ url, height = 200, showDuration = false, seconds = 1 }) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible && !thumbnail) {
            generateVideoThumbnailViaUrl(url, seconds)
                .then((res) => {
                    setThumbnail(res);
                })
                .catch((err: any) => {
                    console.log("ERROR", err);
                });
        }
    }, [isVisible, url, thumbnail]);

    useEffect(() => {
        if (isVisible && showDuration && duration === null) {
            const video = document.createElement('video');
            video.src = url;
            video.onloadedmetadata = () => {
                setDuration(video.duration);
            };
        }
    }, [isVisible, url, showDuration, duration]);

    const getFormattedDuration = (duration: number): string => {
        if (isNaN(duration) || duration < 0) {
            return '00:00';
        }

        const date = new Date(duration * 1000);

        if (isNaN(date.getTime())) {
            return '00:00';
        }

        return date.toISOString().slice(14, 19);
    }


    return (
        <div ref={observerRef}>
            {thumbnail ? (
                <div style={{ position: 'relative' }}>
                    <img src={thumbnail} alt="Thumbnail" style={{ width: '100%', height, objectFit: "cover" }} />
                    {showDuration && duration !== null && (
                        <Stack position={"absolute"} bottom={15} right={15} justifyContent={"center"} alignItems={"center"} bgcolor={grey[700]} px={1} py={0.5} borderRadius={4}>
                            <Typography variant='caption' color="white" fontWeight={700}>
                                {getFormattedDuration(duration)}
                            </Typography>
                        </Stack>

                    )}
                </div>
            ) : (
                <Skeleton variant="rectangular" width={"100%"} height={height} />
            )}
        </div>
    );
};

export default LazyThumbnail;
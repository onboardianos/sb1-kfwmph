import { FileRepository, PollRepository, PostRepository } from '@amityco/ts-sdk';
import { Box, Grid, List, ListItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import FilePostCard from './FilePost';
import ImagePostCard from './ImagePost';
import MoreItemsLayout from './MoreItemsLayout';
import PoolCard from './PoolPost';
import VideoPostCard from './VideoPost';

type PostContentProps = {
    children: string[];
    isSinglePost?: boolean;
    imageSize?: IAmityImageSize;
};
const disposers: Amity.Unsubscriber[] = [];
const PostContent = ({ children, isSinglePost, imageSize }: PostContentProps) => {
    const [files, setFiles] = useState<Amity.File[]>([]);
    const [thumbnails, setThumbnails] = useState<Amity.File[]>([]);
    const [poll, setPoll] = useState<Amity.Poll>();

    useEffect(() => {
        return () => {
            disposers.forEach((unsubscribe) => unsubscribe());
        };
    }, [children]);



    useQuery({
        queryKey: ['children',children],
        queryFn: async () => {
            await Promise.all(children.map(child =>getChildenData(child, disposers)))
            return {}
        },
        refetchOnMount:true
    })

    const getChildenData = (child: string, disposers: Amity.Unsubscriber[]) => {
        let unsubscribe = PostRepository.getPost(child, ({ data }) => {
            if (data) {
                let dataPost = data;
                if (dataPost.dataType === 'image' || dataPost.dataType === 'file') {
                    getFile(dataPost.data.fileId);
                }
                if (dataPost.dataType === 'video') {
                    getFile(dataPost.data.videoFileId.original);
                    getThumbnail(dataPost.data.thumbnailFileId);
                }
                if (dataPost.dataType === 'poll') {
                    getPoll(dataPost.data.pollId);
                }
            }
        });
        disposers.push(unsubscribe);
    };

    const getFile = async (fileId: string) => {
        let fileResponse = await FileRepository.getFile(fileId);
        let file = 'data' in fileResponse ? fileResponse.data : fileResponse;
        setFiles((prev) => [...prev, file]);

    };

    const getThumbnail = async (fileId: string) => {
        let fileResponse = await FileRepository.getFile(fileId);
        let file = 'data' in fileResponse ? fileResponse.data : fileResponse;
        setThumbnails((prev) => [...prev, file]);
    };

    const getPoll = async (pollId: string) => {
        let unsubscribe = PollRepository.getPoll(pollId, ({ data }) => {
            if (data) {
                setPoll(data);
            }
        });
        disposers.push(unsubscribe);
    };

    const renderFileItem = ({ item, index }: { item: Amity.File, index: number }): React.ReactNode => {
        if (item) {
            if (item.type === 'image') {
                return <ImagePostCard key={item.fileId} item={item} size={imageSize} />;
            }
            if (item.type === 'file') {
                return <FilePostCard key={item.fileId} item={item} />;
            }
            if (item.type === 'video' && thumbnails.length > 0) {
                return <VideoPostCard key={item.fileId} item={item} thumbnail={thumbnails[index]} />;
            }
        }
        return null;
    };

    const renderFileItemHome = ({ item, index }: { item: Amity.File, index: number }): React.ReactNode => {
        if (index < 3) {
            if (item.type === 'image') {
                return <ImagePostCard key={item.fileId} item={item} size={imageSize} />;
            }
            if (item.type === 'file') {
                return <FilePostCard key={item.fileId} item={item} />;
            }
            if (item.type === 'video' && thumbnails.length > 0) {
                return <VideoPostCard key={item.fileId} item={item}  thumbnail={thumbnails[index]} />;
            }
        }
        if (index === 3 && (item.type === 'video' || item.type === 'image')) {
            if (files.length > 4) {
                if (item.type === 'image') {
                    return (
                        <MoreItemsLayout key={item.fileId} label={`+${mediaFiles.length - 4}`}>
                            <ImagePostCard item={item} size={imageSize} />
                        </MoreItemsLayout>
                    );
                }
                if (item.type === 'video' && thumbnails.length > 0) {
                    return (
                        <MoreItemsLayout key={item.fileId} label={`+${mediaFiles.length - 4}`}>
                            <VideoPostCard item={item}  thumbnail={thumbnails[index]} />
                        </MoreItemsLayout>
                    );
                }
            } else {
                if (item.type === 'image') {
                    return <ImagePostCard key={item.fileId} item={item} size={imageSize} />;
                }
                if (item.type === 'video' && thumbnails.length > 0) {
                    return <VideoPostCard key={item.fileId} item={item}  thumbnail={thumbnails[index]} />;
                }
            }
        } else {
            if (item.type === 'file') {
                return <FilePostCard key={item.fileId} item={item} />;
            }
        }
        return null;
    };

    const renderPoll = useMemo(() => {
        if (poll) {
            return <PoolCard poll={poll} />;
        }
    }, [poll]);

    const mediaFiles = files.filter(file => file.type === 'image' || file.type === 'video');

    return (
        <Box>
            {mediaFiles.length > 0 ? (
                <Grid container>
                    {mediaFiles.map((file, index) => (
                        <Grid item xs={isSinglePost || mediaFiles.length === 1 ? 12 : 6} key={file.fileId}>
                            {isSinglePost ? renderFileItem({ item: file, index }) : renderFileItemHome({ item: file, index })}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <List>
                    {files.map((file, index) => (
                        <ListItem key={file.fileId}>
                            {renderFileItem({ item: file, index })}
                        </ListItem>
                    ))}
                </List>
            )}
            {renderPoll}
        </Box>
    );
};

export default PostContent;
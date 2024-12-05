import { PostRepository } from '@amityco/ts-sdk';
import { useSession } from '@context/SessionContext';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Avatar, Box, Button, CircularProgress, Divider, IconButton, MenuItem, Modal, Select, Skeleton, Stack, TextField, Typography } from '@mui/material';
import AmityService from '@services/amityService';
import { MEDIA_URL } from '@services/index';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { memo, useCallback, useRef, useState } from 'react';
import FileCard from './FileCard';
import ImageCard from './ImageCard';
import PollForm from './PoolForm';
import VideoCard from './VideoCard';
import { useSnackbar } from 'notistack';

const VideoCardMemo = memo(VideoCard)
const PostCreator = () => {
    const [text, setText] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [pollModal, setPollModal] = useState<boolean>(false);
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const [selectedCommunity, setSelectedCommunity] = useState<string>();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const session = useSession()
    const toast = useSnackbar()

    const {
        data: allCommunities,
        isLoading: allCommunitiesLoading
    } = useQuery({
        queryKey: ['all-communities', session.data.user?.profile?.site.id],
        queryFn: async () => {
            const communities = await AmityService.getAmityCommunities()
            setSelectedCommunity(communities.groupCommunity.amityId)
            let filteredSites = communities.amitySiteCommunities.filter((community) => community.siteId === session.data.user?.profile?.site.id)
            return [communities.groupCommunity, ...filteredSites]
        },
        refetchOnMount: true,
        enabled: !!session.data.user?.profile?.site.id
    })

    const postMutation = useMutation({
        mutationFn: async () => {
            try {
                if (selectedCommunity === undefined) {
                    toast.enqueueSnackbar('Please select a community', { variant: 'error' })
                    return
                }
                setPostLoading(true)
                const media = images.concat(videos)
                const uploadedMedias: IUploadedMedia[] = []
                for (const m of media) {
                    const uploadedMedia = await AmityService.uploadMedia(m)
                    uploadedMedias.push(uploadedMedia)
                }
                for (const f of files) {
                    const uploadedFile = await AmityService.uploadFile(f)
                    uploadedMedias.push(uploadedFile)
                }
                const newPost = {
                    data: {
                        text: text,
                    },
                    attachments: uploadedMedias,
                    targetId: selectedCommunity,
                    targetType: 'community',
                }
                await PostRepository.createPost(newPost)
            } catch (error) {
                return error
            }
        },
        onSuccess: () => {
            setText('')
            setImages([])
            setVideos([])
            setFiles([])
            toast.enqueueSnackbar('Post created successfully', { variant: 'success' })

        },
        onError: (error) => {
            console.log(error)
            toast.enqueueSnackbar('Failed to create post', { variant: 'error' })
        },
        onSettled: () => {
            setPostLoading(false)
        }
    })

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }, []);


    const handleRemoveVideo = useCallback((video: File) => {
        setVideos((prev) => prev.filter((v) => v !== video));
    }, []);

    const handleRemoveImage = useCallback((image: File) => {
        setImages((prev) => prev.filter((i) => i !== image));
    }, []);

    const handleRemoveFile = useCallback((file: File) => {
        setFiles((prev) => prev.filter((f) => f !== file));
    }, []);

    const postPoll = useCallback(async (poll: Amity.Poll) => {
        try {
            setPollModal(false);
            setPostLoading(true);
            const newPost = {
                data: {
                    text: poll.question,
                    pollId: poll.pollId,
                },
                dataType: 'poll',
                targetId: selectedCommunity,
                targetType: 'community',
            };
            await PostRepository.createPost(newPost);
            setPostLoading(false);
        } catch (error) {
            console.log(error);
            setPostLoading(false);
        }
    }, [selectedCommunity]);

    const handleClickImage = useCallback((type: 'photo' | 'video') => {
        if (type === 'photo') {
            imageInputRef.current?.click();
        } else {
            videoInputRef.current?.click();
        }
    }, []);

    const handleClickFile = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleSelectImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setImages(prev => [...prev, ...files]);
    }, []);
    const handleSelectVideo = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setVideos(prev => [...prev, ...files]);
    }, []);
    const handleSelectFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setFiles(prev => [...prev, ...files]);
    }, []);
    const acceptJustDocumentsTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const myProfile = `${MEDIA_URL}/${session.data.user?.profile?.profileImage?.location}?${session.data.user?.tokens.internalAccess}`
    return (
        <Box p={2} bgcolor="white" mb={4} borderRadius={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" spacing={2}>
                    <Avatar src={myProfile} />
                    <Stack>
                        <Typography variant="body1" fontWeight="bold">{`${session.data.user?.profile?.firstName} ${session.data.user?.profile?.lastName}`}</Typography>
                        <Typography variant="caption" color="text.secondary">{session.data.user?.profile?.title}</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        {allCommunitiesLoading && <Skeleton variant="rectangular" width={200} height={50} />}
                        {!allCommunitiesLoading && allCommunities && (
                            <Select
                                defaultValue={selectedCommunity}
                                value={selectedCommunity}
                                onChange={(event) => setSelectedCommunity(event.target.value as string)}
                                displayEmpty={false}
                                fullWidth
                            >
                                {allCommunities?.map((community) => (
                                    <MenuItem key={community!.amityId} value={community!.amityId}>
                                        {community!.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </Box>
                </Stack>
            </Box>
            <Divider />
            <Box mt={2}>
                <TextField
                    fullWidth
                    value={text}
                    multiline
                    variant="outlined"
                    placeholder="What's on your mind?"
                    onChange={handleTextChange}
                />
                <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
                    <Box display="flex" alignItems="center" mt={2} gap={2}>
                        <input ref={imageInputRef} type="file" accept="image/*" multiple name='images' style={{ display: 'none' }} onChange={handleSelectImage} />
                        <input ref={videoInputRef} type="file" accept="video/*" multiple name='videos' style={{ display: 'none' }} onChange={handleSelectVideo} />
                        <input ref={fileInputRef} type="file" accept={acceptJustDocumentsTypes.join(',')} multiple name='files' style={{ display: 'none' }} onChange={handleSelectFile} />
                        <IconButton color="primary" onClick={() => handleClickImage('photo')} disabled={videos.length > 0 || files.length > 0}>
                            <ImageIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleClickImage('video')} disabled={images.length > 0 || files.length > 0}>
                            <VideoLibraryIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={handleClickFile} disabled={images.length > 0 || videos.length > 0}>
                            <InsertDriveFileIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => setPollModal(true)}>
                            <BarChartIcon />
                        </IconButton>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={(text.length === 0 && images.length === 0) || selectedCommunity === undefined || postLoading}
                        onClick={() => postMutation.mutate()}
                        startIcon={postLoading && <CircularProgress size={20} />}
                    >
                        Post
                    </Button>
                </Stack>
            </Box>
            <Box mt={2}>
                {files.length > 0 && (
                    <Box>
                        {files.map((file, index) => (
                            <FileCard key={`file-${index}`} file={file} handleRemoveFile={() => handleRemoveFile(file)} />
                        ))}
                    </Box>
                )}
                {images.concat(videos).length <= 1 ? (
                    <>
                        {images.length > 0 && (
                            <ImageCard image={images[0]} handleRemoveImage={handleRemoveImage} />
                        )}
                        {videos.length > 0 && (
                            <VideoCardMemo video={videos[0]} handleRemoveVideo={handleRemoveVideo} />
                        )}
                    </>
                ) : (
                    <Box display="flex" flexWrap="wrap">
                        {images.concat(videos).map((item, index) => (
                            item.type.includes('video') ? (
                                <VideoCardMemo key={index} video={item} handleRemoveVideo={handleRemoveVideo} />
                            ) : (
                                <ImageCard key={index} image={item} handleRemoveImage={handleRemoveImage} />
                            )
                        ))}
                    </Box>
                )}
            </Box>
            <Modal open={pollModal}
                sx={{
                    overflowY: 'scroll'
                }}
                onClose={() => setPollModal(false)} >
                <Box p={2} bgcolor="background.paper" boxShadow={24} mx="auto" mt={5} maxWidth={500}>
                    <IconButton onClick={() => setPollModal(false)} style={{ float: 'right' }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" mb={2}>Create Poll</Typography>
                    <PollForm onCancel={() => setPollModal(false)} onSubmit={postPoll} />
                </Box>
            </Modal>
        </Box>
    );
};

export default React.memo(PostCreator);
import { FileRepository, PostRepository } from '@amityco/ts-sdk';
import FileCard from '@common/NewsFeed/PostCreator/FileCard';
import ImageCard from '@common/NewsFeed/PostCreator/ImageCard';
import VideoCard from '@common/NewsFeed/PostCreator/VideoCard';
import { useAmity } from '@context/AmityContext';
import { useSession } from '@context/SessionContext';
import { ArrowBack } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Avatar, Box, Button, CircularProgress, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import AmityService from '@services/amityService';
import { MEDIA_URL } from '@services/index';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AmityFileCard from './CurrentFiles/FileCard';
import AmityImageCard from './CurrentFiles/ImageCard';
import AmityVideoCard from './CurrentFiles/VideoCard';

const AmityVideoCardMemo = memo(AmityVideoCard)
const AmityImageCardMemo = memo(AmityImageCard)
const AmityFileCardMemo = memo(AmityFileCard)
const VideoCardMemo = memo(VideoCard)
const page = () => {
    const navigate = useNavigate()
    const { currentPost } = useAmity()
    const children = currentPost?.children
    const [text, setText] = useState<string>('');
    const [currentImages, setCurrentImages] = useState<Amity.File<'image'>[]>([]);
    const [currentVideos, setCurrentVideos] = useState<Amity.File<'video'>[]>([]);
    const [currentFiles, setCurrentFiles] = useState<Amity.File<'file'>[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [postLoading, setPostLoading] = useState<boolean>(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const session = useSession()
    const toast = useSnackbar()


    useQuery({
        queryKey: ['children',children],
        queryFn: async () => {
            await Promise.all(children.map((child: string) => getChildrenPost(child)))
            return {}
        },
        refetchOnMount:true
    })

    useEffect(() => {
        if (currentPost) {
            setText(currentPost.data.text)
        }
    }, [currentPost])

    const getChildrenPost = useCallback(async (child: string) => {
        const unsubscribe = PostRepository.getPost(child, ({ data }) => {
            if (data) {
                if (data.dataType === 'image') {
                    getFile(data.data.fileId, 'image');
                }
                if (data.dataType === 'video') {
                    getFile(data.data.videoFileId.original, 'video');
                }
                if (data.dataType === 'file') {
                    getFile(data.data.fileId, 'file');
                }
                if (data.dataType === 'poll') {
                    navigate(-1)
                    toast.enqueueSnackbar('You cannot edit a post with a poll', { variant: 'warning' })
                }
            }
        })
        return () => unsubscribe()
    }, [])

    const getFile = useCallback(async (fileId: string, type: 'image' | 'video' | 'file') => {
        const res = await FileRepository.getFile(fileId)
        const file = 'data' in res ? res.data : res;

        if (type === 'image') {
            const imageFile: Amity.File<"image"> = file as Amity.File<"image">;
            setCurrentImages((prev) => [...prev, imageFile]);
        }
        if (type === 'video') {
            const videoFile: Amity.File<"video"> = file as Amity.File<"video">;
            setCurrentVideos((prev) => [...prev, videoFile])
        }
        if (type === 'file') {
            const mfile: Amity.File<'file'> = file as Amity.File<'file'>;
            setCurrentFiles((prev) => [...prev, mfile])
        }
    }, [])

    const postMutation = useMutation({
        mutationFn: async () => {
            try {
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
                    attachments: uploadedMedias.concat(
                        currentFiles.map((f) => ({
                            fileId: f.fileId,
                            type: f.type
                        }))
                    ).concat(
                        currentImages.map((i) => ({
                            fileId: i.fileId,
                            type: i.type
                        })))
                        .concat(
                            currentVideos.map((v) => ({
                                fileId: v.fileId,
                                type: v.type
                            }))
                        )
                    ,
                    targetType: 'community',
                }
                await PostRepository.editPost(currentPost.postId, newPost)
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
            navigate(-1)

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

    const handleRemoveAmityFile = useCallback((file: Amity.File<'file'>) => {
        setCurrentFiles((prev) => prev.filter((f) => f !== file));
    }, []);
    const handleRemoveAmityImage = useCallback((image: Amity.File<'image'>) => {
        setCurrentImages((prev) => prev.filter((i) => i !== image));
    }, []);
    const handleRemoveAmityVideo = useCallback((video: Amity.File<'video'>) => {
        setCurrentVideos((prev) => prev.filter((v) => v !== video));
    }, []);
    const acceptJustDocumentsTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const myProfile = `${MEDIA_URL}/${session.data.user?.profile?.profileImage?.location}?${session.data.user?.tokens.internalAccess}`
    const handleBack = () => {
        navigate(-1)
    }
    console.log(currentImages.length)
    return (
        <Stack height={"calc(100vh - 110px)"} overflow={"auto"} gap={2}>
            <Paper sx={{ borderRadius: 4, cursor: 'pointer' }} onClick={handleBack}>
                <Stack flexDirection={"row"} alignItems={"center"} gap={2} px={4} py={2}>
                    <ArrowBack />
                    <Typography fontWeight={700}>
                        Back
                    </Typography>
                </Stack>
            </Paper>
            <Box p={2} bgcolor="white" mb={4} borderRadius={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Stack direction="row" spacing={2}>
                        <Avatar src={myProfile} />
                        <Stack>
                            <Typography variant="body1" fontWeight="bold">{`${session.data.user?.profile?.firstName} ${session.data.user?.profile?.lastName}`}</Typography>
                            <Typography variant="caption" color="text.secondary">{session.data.user?.profile?.title}</Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Divider />
                <Box mt={2}>
                    <TextField
                        fullWidth
                        multiline
                        value={text}
                        variant="outlined"
                        placeholder="What's on your mind?"
                        onChange={handleTextChange}
                    />
                    <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
                        <Box display="flex" alignItems="center" mt={2} gap={2}>
                            <input ref={imageInputRef} type="file" accept="image/*" multiple name='images' style={{ display: 'none' }} onChange={handleSelectImage} />
                            <input ref={videoInputRef} type="file" accept="video/*" multiple name='videos' style={{ display: 'none' }} onChange={handleSelectVideo} />
                            <input ref={fileInputRef} type="file" accept={acceptJustDocumentsTypes.join(',')} multiple name='files' style={{ display: 'none' }} onChange={handleSelectFile} />
                            <IconButton color="primary" onClick={() => handleClickImage('photo')} disabled={videos.length > 0 || files.length > 0 || currentVideos.length > 0 || currentFiles.length > 0}>
                                <ImageIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={() => handleClickImage('video')} disabled={images.length > 0 || files.length > 0 || currentImages.length > 0 || currentFiles.length > 0}>
                                <VideoLibraryIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={handleClickFile} disabled={images.length > 0 || videos.length > 0 || currentImages.length > 0 || currentVideos.length > 0}>
                                <InsertDriveFileIcon />
                            </IconButton>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={(text.length === 0 && images.length === 0) || postLoading}
                            onClick={() => postMutation.mutate()}
                            startIcon={postLoading && <CircularProgress size={20} />}
                        >
                            Save
                        </Button>
                    </Stack>
                </Box>
                <Box mt={2}>
                    {(files.length > 0 || currentFiles.length > 0) && (
                        <Box>
                            {files.map((file, index) => (
                                <FileCard key={`file-${index}`} file={file} handleRemoveFile={() => handleRemoveFile(file)} />
                            ))}
                            {currentFiles.map((file, index) => (
                                <AmityFileCardMemo key={`file-${index}`} file={file} handleRemoveFile={() => handleRemoveAmityFile(file)} />
                            ))}
                        </Box>
                    )}
                    <Box display="flex" flexWrap="wrap">
                        {images.map((item, index) => (
                            <ImageCard key={index} image={item} handleRemoveImage={handleRemoveImage} />
                        ))}
                        {videos.map((item, index) => (
                            <VideoCardMemo key={index} video={item} handleRemoveVideo={handleRemoveVideo} />
                        ))}
                        {currentImages.map((item, index) => (
                            <AmityImageCardMemo key={index} image={item} handleRemoveImage={() => handleRemoveAmityImage(item)} />
                        ))}
                        {currentVideos.map((item, index) => (
                            <AmityVideoCardMemo key={index} video={item} handleRemoveVideo={() => handleRemoveAmityVideo(item)} />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Stack>
    );
}

export default page
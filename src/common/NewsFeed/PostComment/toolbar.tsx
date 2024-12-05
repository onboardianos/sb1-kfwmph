import React, { useState, useCallback, useMemo } from 'react';
import { Avatar, Box, Button, TextField, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { CommentRepository } from '@amityco/ts-sdk';
import { MEDIA_URL } from '@services/index';
import { useSession } from '@context/SessionContext';

type Props = {
    post: Amity.Post<Amity.PostContentType>,
    parentId?: string
}

const CommentToolbar: React.FC<Props> = React.memo((props) => {
    const [comment, setComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const session = useSession();
    const profile = session.data.user?.profile;
    const handleSend = useCallback(async () => {
        try {
            setLoading(true);
            const newComment = {
                data: {
                    text: comment,
                },
                referenceId: props.post.postId,
                referenceType: 'post' as Amity.CommentReferenceType,
                ...(props.parentId && { parentId: props.parentId })
            };
            await CommentRepository.createComment(newComment);
            setComment('');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [comment, props.post.postId, props.parentId]);

    const avatarSource = useMemo(() => ({
        src: profile?.profileImage?.location 
            ? `${MEDIA_URL}/${profile?.profileImage?.location}?${session.data.user?.tokens.internalAccess}` 
            : ''
    }), [profile?.profileImage?.location, session.data.user?.tokens.internalAccess]);

    return (
        <Box display="flex" alignItems="center" width="100%" mb={2}>
            <Avatar src={avatarSource.src} />
            <Box display="flex" flex={1} ml={2} alignItems="center" gap={2}>
                <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={loading}
                />
                <Button
                    onClick={handleSend}
                    disabled={loading}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
});


export default CommentToolbar;

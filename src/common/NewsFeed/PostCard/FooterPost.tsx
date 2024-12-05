import { CommentRepository, CommunityRepository, getCommunityTopic, ReactionRepository, subscribeTopic, SubscriptionLevels } from "@amityco/ts-sdk";
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CommentItem from "../PostComment";
import CommentToolbar from "../PostComment/toolbar";

type FooterPostProps = {
    post: Amity.Post<Amity.PostContentType>,
    showAllComments?: boolean,
    showComment?: boolean
}

const FooterPost = ({ post, showAllComments, showComment }: FooterPostProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [lastComment, setLastComment] = useState<Amity.Comment[]>([]);
    const [loadingLike, setLoadingLike] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);

    useEffect(() => {
        setIsLiked(post.myReactions?.includes('like'));
    }, [post.myReactions]);

    const likeOrUnlikePost = useCallback(async () => {
        setLoadingLike(true);
        try {
            if (!isLiked) {
                setIsLiked(true);
                await ReactionRepository.addReaction("post", post._id, 'like');
            } else {
                setIsLiked(false);
                await ReactionRepository.removeReaction("post", post._id, 'like');
            }
        } catch (error) {
            console.error('Error toggling like', error);
        } finally {
            setLoadingLike(false);
        }
    }, [isLiked, post._id]);

    useEffect(() => {
        if (isReplyOpen) {
            setIsCommentOpen(false);
        }
    }, [isReplyOpen]);

    useEffect(() => {
        const disposers: Amity.Unsubscriber[] = [];
        const unsubscribe = CommentRepository.getComments({
            referenceId: post._id,
            referenceType: 'post',
            sortBy: 'lastCreated',
            limit: showAllComments ? 20 : 2
        }, ({ data }) => {
            if (data) {
                setLastComment(data);
                const unsubscribeCommunity = CommunityRepository.getCommunity(post.targetId, (community) => {
                    if (community) {
                        disposers.push(subscribeTopic(getCommunityTopic(community.data, SubscriptionLevels.COMMENT)));
                    }
                });
                disposers.push(unsubscribeCommunity);
            }
        });
        disposers.push(unsubscribe);
        return () => {
            disposers.forEach(disposer => disposer());
        };
    }, [post._id, post.targetId, showAllComments]);

    return (
        <Box px={2}>
            <Box display="flex" alignItems="center" mb={1}>
                {post.reactionsCount > 0 && (
                    <Typography color="textSecondary" variant="body2">
                        {post.reactionsCount} {post.reactionsCount === 1 ? 'like' : 'likes'}
                    </Typography>
                )}
                {post.commentsCount > 0 && (
                    <Typography color="textSecondary" variant="body2" ml={2}>
                        {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
                    </Typography>
                )}
            </Box>
            <Divider />
            <Box display="flex" alignItems="center" mt={1} gap={2}>
                <Button
                    onClick={likeOrUnlikePost}
                    startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                    disabled={loadingLike}
                >
                    {isLiked ? 'Liked' : 'Like'}
                </Button>
                {showComment && (
                    <Button
                        onClick={() => {
                            setIsCommentOpen(!isCommentOpen);
                            setIsReplyOpen(false);
                        }}
                        startIcon={<CommentIcon />}
                    >
                        Comment
                    </Button>
                )}
            </Box>
            <Divider sx={{ mb: 2}} />
            {showAllComments ? (
                lastComment.map((comment) => (
                    <CommentItem key={comment.createdAt} comment={comment} post={post} showReply={isReplyOpen} setShowReply={setIsReplyOpen} />
                ))
            ) : lastComment.length > 0 && <CommentItem comment={lastComment[0]} post={post} showReply={isReplyOpen} setShowReply={setIsReplyOpen} />}
            {isCommentOpen && <CommentToolbar post={post} />}
        </Box>
    );
};

export default FooterPost;
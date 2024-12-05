import { CommentRepository, CommunityRepository, getCommentTopic, getCommunityTopic, ReactionRepository, subscribeTopic, SubscriptionLevels } from "@amityco/ts-sdk";
import { useSession } from "@context/SessionContext";
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Avatar, Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import { blue } from "@mui/material/colors";
import { MEDIA_URL } from "@services/index";
import UserService from "@services/userService";
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import CommentToolbar from "./toolbar";

type CommentItemProps = {
    comment: Amity.Comment,
    post: Amity.Post<Amity.PostContentType>,
    showReply: boolean,
    setShowReply: (showReply: boolean) => void,
    isReply?: boolean
}

const CommentItem = ({ comment, post, showReply, setShowReply, isReply }: CommentItemProps) => {
    const [owner, setOwner] = useState<IMyProfile>();
    const [loading, setLoading] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);
    const [observer, setObserver] = useState<Amity.Comment>();
    const [profileImage, setProfileImage] = useState<string>();
    const [replies, setReplies] = useState<Amity.Comment[]>([]);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [isLikedByMe, setIsLikedByMe] = useState(false);
    const [showReplyState, setShowReplyState] = useState<{ [key: string]: boolean }>({});
    const session = useSession();

    useEffect(() => {
        setIsLikedByMe(comment.myReactions?.includes('like') || false);
    }, [comment.myReactions]);

    const toggleShowReply = (commentId: string) => {
        setShowReplyState(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const getUserByUserId = useCallback(async () => {
        setLoading(true);
        try {
            const user = await UserService.getProfileByChatId(comment.userId);
            if (user) {
                setOwner(user);
                setProfileImage(user?.profileImage?.location ? `${MEDIA_URL}/${user?.profileImage?.location}?${session.data.user?.tokens.internalAccess}` : '');
            }
        } catch (error) {
            console.error('Error fetching user profile', error);
        } finally {
            setLoading(false);
        }
    }, [comment.userId, session.data.user?.tokens.internalAccess]);

    useEffect(() => {
        getUserByUserId();
        const disposers: Amity.Unsubscriber[] = [];
        const unsubscribe = CommentRepository.getComment(comment.commentId, ({ data }) => {
            if (data) {
                disposers.push(subscribeTopic(getCommentTopic(data)));
                setObserver(data);
            }
        });
        disposers.push(unsubscribe);
        return () => {
            disposers.forEach(disposer => disposer());
        };
    }, [getUserByUserId, comment.commentId]);

    const likeOrUnlikePost = useCallback(async () => {
        setLoadingLike(true);
        try {
            if (!isLikedByMe) {
                setIsLikedByMe(true);
                await ReactionRepository.addReaction("comment", comment.commentId, 'like');
            } else {
                setIsLikedByMe(false);
                await ReactionRepository.removeReaction("comment", comment.commentId, 'like');
            }
        } catch (error) {
            console.error('Error toggling like', error);
        } finally {
            setLoadingLike(false);
        }
    }, [isLikedByMe, comment.commentId]);

    useEffect(() => {
        const disposers: Amity.Unsubscriber[] = [];
        const unsubscribe = CommentRepository.getComments({
            referenceId: post.postId,
            referenceType: 'post',
            parentId: comment.commentId,
            limit: 10,
            sortBy: 'lastCreated'
        }, ({ data }) => {
            if (data) {
                setReplies(data);
                const communityUnsubscribe = CommunityRepository.getCommunity(post.targetId, ({ data: community }) => {
                    if (community) {
                        disposers.push(subscribeTopic(getCommunityTopic(community, SubscriptionLevels.COMMENT)));
                    }
                });
                disposers.push(communityUnsubscribe);
            }
        });
        disposers.push(unsubscribe);
        return () => {
            disposers.forEach(disposer => disposer());
        };
    }, [post.postId, post.targetId, comment.commentId]);

    const getText = comment.data as { text: string };

    return (
        <Box display="flex" flexDirection="column" mb={2} >
            <Box display="flex" mb={1}>
                <Avatar src={profileImage} alt="" />
                <Box ml={2} flex={1}>
                    <Box display="flex" alignItems="center">
                        {loading ? (
                            <Skeleton variant="text" width={100} height={20} />
                        ) : (
                            owner && <Typography variant="body2">{`${owner?.firstName} ${owner?.lastName}`}</Typography>
                        )}
                        <Typography variant="caption" color="textSecondary" ml={1}>
                            {moment(comment.createdAt).fromNow()}
                        </Typography>
                    </Box>
                    <Box bgcolor={blue[50]} p={1} borderRadius={1} mt={1} width="90%">
                        <Typography variant="body2">{getText.text}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1}>
                        <IconButton onClick={likeOrUnlikePost} disabled={loadingLike}>
                            {isLikedByMe ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                        </IconButton>
                        {comment.reactionsCount > 0 && (
                            <Typography variant="body2" color="primary" ml={1}>
                                {comment.reactionsCount}
                            </Typography>
                        )}
                        <IconButton onClick={() => toggleShowReply(isReply ? comment.parentId ?? comment.commentId : comment.commentId)}>
                            <CommentIcon />
                        </IconButton>
                        {observer && observer.childrenNumber > 0 && (
                            <Typography variant="body2" color="primary" ml={1}>
                                {comment.childrenNumber}
                            </Typography>
                        )}
                    </Box>
                    {comment.childrenNumber > 0 && !showAllReplies && (
                        <Button onClick={() => setShowAllReplies(true)} size="small" color="primary">
                            See all {comment.childrenNumber} replies
                        </Button>
                    )}
                    {showReplyState[isReply ? comment.parentId ?? comment.commentId : comment.commentId] && (
                        <CommentToolbar key={comment.commentId} post={post} parentId={comment.commentId} />
                    )}

                    {showAllReplies && (
                        <Box ml={2}>
                            {replies.map((reply) => (
                                <CommentItem key={reply.commentId} comment={reply} post={post} showReply={showReply} setShowReply={setShowReply} isReply={true} />
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};


export default CommentItem;
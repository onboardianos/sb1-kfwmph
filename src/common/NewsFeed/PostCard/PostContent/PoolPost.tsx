import { PollRepository } from '@amityco/ts-sdk';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';

type PoolCardProps = {
    poll: Amity.Poll;
}

const PoolCard: React.FC<PoolCardProps> = ({ poll }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<Amity.PollAnswer[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isVoted, setIsVoted] = useState(false);

    const handleSelectAnswer = (answer: Amity.PollAnswer) => {
        if (poll.answerType === 'single') {
            setSelectedAnswer([answer]);
        } else {
            setSelectedAnswer([...selectedAnswer, answer]);
        }
    };

    const handleVote = async () => {
        try {
            setLoading(true);
            await PollRepository.votePoll(poll.pollId, selectedAnswer.map(a => a.id));
            setIsVoted(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (poll.isVoted) {
            setDisabled(true);
            setIsVoted(true);
        }
    }, [poll.isVoted]);

    return (
        <Box mx={2} my={2}>
            {!poll.isVoted && (
                <Typography color="textSecondary">
                    {poll.answerType === 'single' ? 'Select an answer' : 'Select multiple answers'}
                </Typography>
            )}
            {poll.answers.map(answer => (
                <Box
                    key={answer.id}
                    sx={{
                        my: 1,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: answer.isVotedByUser || selectedAnswer.some(a => a.id === answer.id) ? blue[50] : 'white',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: poll.isVoted ? 'default' : 'pointer'
                    }}
                    onClick={() => !poll.isVoted && handleSelectAnswer(answer)}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={answer.isVotedByUser || selectedAnswer.some(a => a.id === answer.id)}
                                disabled={poll.isVoted}
                                color="primary"
                            />
                        }
                        label={<Typography>{answer.data}</Typography>}
                    />
                    {poll.isVoted && (
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 'auto' }}>
                            {answer.voteCount} votes
                        </Typography>
                    )}
                </Box>
            ))}
            <Stack direction="row" justifyContent="space-between">
                {poll.closedAt && (
                    <Typography variant="caption" color="textSecondary">
                        Closed at {new Date(poll.closedAt).toLocaleDateString()}
                    </Typography>
                )}
                {!isVoted && (
                    <Button
                        onClick={handleVote}
                        disabled={disabled}
                        variant="contained"
                        color="primary"
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        Vote
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

export default PoolCard;

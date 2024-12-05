import { PollRepository } from '@amityco/ts-sdk';
import { Box, Button, CircularProgress, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

type PollFormProps = {
    onCancel: () => void;
    onSubmit: (poll: Amity.Poll) => void;
    poll?: Amity.Poll;
}

const PollForm = ({ onCancel, onSubmit, poll }: PollFormProps) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [selectionType, setSelectionType] = useState<Amity.PollAnswerType>('single');
    const [loading, setLoading] = useState(false);
    const snackbar = useSnackbar()
    useEffect(() => {
        if (poll) {
            setQuestion(poll.question);
            setOptions(poll.answers.map((answer) => answer.data));
            setSelectionType(poll.answerType);
        }
    }, [poll]);

    const handleOptionChange = (text: string, index: number) => {
        const newOptions = [...options];
        newOptions[index] = text;
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (question.length === 0) {
                snackbar.enqueueSnackbar('Question is required', { variant: 'warning' });
                return;
            }
            if (options.length < 2) {
                snackbar.enqueueSnackbar('Options are required', { variant: 'warning' });
                return;
            }
            if (options.some((option) => option.length === 0)) {
                snackbar.enqueueSnackbar('Options are required', { variant: 'warning' });
                return;
            }
            const newPoll = {
                question,
                answerType: selectionType,
                answers: options.map((option) => ({
                    data: option,
                    dataType: 'text'
                })) as Pick<Amity.PollAnswer, 'data' | 'dataType'>[]
            };
            let poll = await PollRepository.createPoll(newPoll);
            setLoading(false);
            onSubmit(poll.data);
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack p={2} gap={2}>
            <Box>
                <InputLabel>Question</InputLabel>

                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="What is your question?"
                        onChange={(e) => setQuestion(e.target.value)}
                        inputProps={{ maxLength: 500 }}
                        helperText={`${question.length} / 500`}

                    />
                </FormControl>
            </Box>
            <Box>
                <InputLabel>Options</InputLabel>
                <FormHelperText>Create at least 2 options</FormHelperText>

                <FormControl fullWidth>
                    {options.map((option, index) => (
                        <TextField
                            key={index}
                            fullWidth
                            variant="outlined"
                            placeholder="Option"
                            value={option}
                            onChange={(e) => handleOptionChange(e.target.value, index)}
                            margin="normal"
                        />
                    ))}
                    <Button variant="outlined" onClick={() => setOptions([...options, ''])}>Add Option</Button>
                </FormControl>
            </Box>
            <Divider />
            <Box mt={2}>
                <InputLabel>Selection Type</InputLabel>
                <FormHelperText>Choose how users can select options</FormHelperText>

                <FormControl fullWidth>
                    <Select
                        value={selectionType}
                        onChange={(e) => setSelectionType(e.target.value as Amity.PollAnswerType)}
                    >
                        <MenuItem value="single">Single Selection</MenuItem>
                        <MenuItem value="multiple">Multiple Selection</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="outlined" onClick={onCancel} sx={{ mr: 2 }}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Create'}
                </Button>
            </Box>
        </Stack>
    );
}

export default PollForm;
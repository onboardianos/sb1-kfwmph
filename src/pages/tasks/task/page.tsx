import { useAppData } from "@context/AppData";
import { useAlert } from "@context/GlobalAlertContext";
import { useSession } from "@context/SessionContext";
import { Icon } from "@iconify/react";
import { Info } from "@mui/icons-material";
import { Box, Button, Modal, Paper, Skeleton, Stack, Typography } from "@mui/material";
import DocumentService from "@services/documentService";
import { MEDIA_URL } from "@services/index";
import TasksService from "@services/taskService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AudioTask from "./components/AudioTask";
import ImagenTask from "./components/ImagenTask";
import LinkTask from "./components/LinkTask";
import VideoTask from "./components/VideoTask";

const Page = () => {
    const { tasks, lastTaskTab } = useAppData()
    const { task } = tasks
    const session = useSession()
    const navigate = useNavigate()
    const [modalConfirm, setModalConfirm] = useState(false)
    const alert = useAlert()

    const onSuccess = () => {
        setModalConfirm(false)
        alert.showAlert({
            message: 'Task marked as completed',
            type: 'success'
        })
        navigate('/tasks', { state: { taskTab: lastTaskTab.id } })
    }

    const document = useQuery({
        queryKey: ['fetchDocument', task?.task.documentId],
        queryFn: () => DocumentService.getDocumentById(task!.task.documentId),
        enabled: !!task?.task.documentId,
        refetchOnMount: true,
    })

    const completeMutation = useMutation({
        mutationKey: ['completeTask'],
        mutationFn: (staks: Task) => TasksService.completeTask(staks),
        onSuccess: onSuccess
    })


    const onCompleteConfirm = () => {
        completeMutation.mutate(task!)
    }
    const getBackGroundGradient = () => {
        if (task?.task.completionType === 'CONFIRM') {
            return 'linear-gradient(to right, #AD46FB, #4A3CE1)'
        }
        if (task?.task.completionType === 'ACCEPT') {
            return 'linear-gradient(to bottom, #ED0889, #FA5B6B)'
        }
        if (task?.task.completionType === 'COMPLETE') {
            return 'linear-gradient(to bottom, #02A2F1, #005BFE)'
        }
    }
    const renderCompleteInstruction = () => {
        switch (task?.task.completionType) {
            case 'COMPLETE':
                return (
                    <>
                        <Typography fontSize={24} fontWeight={600}>
                            By clicking “{task?.task.completionType}”:
                        </Typography>
                        <Typography fontSize={24} fontWeight={200}>
                            You are stating you have fully understood and completed what was required explained in the instructions.
                        </Typography>
                        <ul>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    If you did not complete the requirements explained in the instructions do not mark this task as complete.
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    If you disagree or have questions because you don't understand, do not mark this task as complete.
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    If you have questions, get with your supervisor before marking as completed.
                                </Typography>
                            </li>
                        </ul>
                        <Typography fontSize={18} fontWeight={200}>
                            If you have completed all the requirements for this task mark “confirm”, and proceed to next task.
                        </Typography>
                    </>
                )
            case 'ACCEPT':
                return (
                    <>
                        <Typography fontSize={24} fontWeight={600}>
                            By clicking “{task?.task.completionType}”:
                        </Typography>
                        <ul>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    You confirm that you have read, understand, and fully agree to adhere to the listed requirements and prohibitions listed out in this task, videos, documents, links, or any additional resources you were instructed to review in this task.
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    This acknowledgment serves as your commitment to uphold the standards expected and to act in compliance with our company policies and applicable laws.
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    Please ensure you have fully understood all the instructions, requirements and expectations before proceeding.
                                </Typography>
                            </li>
                        </ul>
                        <Typography fontSize={18} fontWeight={200}>
                            If you accept, mark “confirm” and proceed to next task.
                        </Typography>
                    </>
                )
            case 'CONFIRM':
                return (
                    <>
                        <Typography fontSize={24} fontWeight={600}>
                            By clicking “{task?.task.completionType}”:
                        </Typography>
                        <ul>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    You are stating you have viewed, read, or watched the assigned content and fully understand it.
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    If you have any questions or need clarification, please discuss them with your supervisor before marking the task as complete.
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={18} fontWeight={200}>
                                    This ensures that all information is clear and that you fully comprehend it.
                                </Typography>
                            </li>
                        </ul>
                        <Typography fontSize={18} fontWeight={200}>
                            To confirm you understand and acknowledge what was shared in this task, mark “confirm” and proceed to next task.
                        </Typography>
                    </>
                )
        }
    }
    return (
        <Stack gap={4} height={{md:'70vh',sm:'100%',xxl:'80vh'}} >
            <Paper variant='flat' sx={{
                background: "#EEF2F5", 
                borderRadius: 4, 
                padding: 3, 
                flex: 1, 
                overflow:'hidden'                
            }}>
                <Stack flexDirection={{sm:'column',md:'row'}} gap={4} height={'100%'} overflow={'scroll'} >
                    <Stack gap={2} flex={1} position={{sm:'static',md:'sticky'}} top={0} >
                        <Stack gap={4}>
                            <Typography fontSize={24} fontWeight={700}>
                                {task?.task.title}
                            </Typography>
                        </Stack>
                        <Box bgcolor={'primary.50'} px={3} py={4} borderRadius={4}>
                            <Typography fontSize={18} fontWeight={300}>
                                {task?.task.description}
                            </Typography>
                        </Box>
                        <Stack spacing={2} flex={1}>
                            <Stack flex={1}>
                                <Stack gap={4}>
                                    <Stack gap={2}>
                                        <Stack direction={'row'} gap={1} alignItems={'center'}>
                                            <Info color={"info"} />
                                            <Typography fontWeight={500} fontSize={24}>
                                                Instructions
                                            </Typography>
                                        </Stack>
                                        <Box bgcolor={'white'} px={3} py={4} borderRadius={4}>
                                            {task?.task.instructions.split('\n').map((text) => (
                                                <Typography fontSize={18} fontWeight={400}>
                                                    {text}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack gap={2} flex={1}>
                        <Typography fontSize={24} fontWeight={600} alignSelf={'center'}>
                            Resources to Review
                        </Typography>
                        <Stack bgcolor={'#E6E6E6'} borderRadius={4} p={3} gap={1} >
                            {
                                task?.task.video && (
                                    <>
                                        <VideoTask videoUri={`${MEDIA_URL}/${task.task.video.location}?${session.data.user?.tokens.internalAccess}`} title={task.task.video.title} />
                                    </>
                                )
                            }
                            {
                                task?.task.weblink && (
                                    <>
                                        <LinkTask type="weblink" title={'Web Link'} url={task.task.weblink} />
                                    </>
                                )
                            }
                            {
                                document.data && !document.isLoading && (
                                    <>
                                        <LinkTask type="document" title={document.data.title} url={`${MEDIA_URL}/${document.data.location}?${session.data.user?.tokens.internalAccess}`} />
                                    </>
                                )
                            }
                            {
                                task?.task.audio && (
                                    <>
                                        <AudioTask uri={`${MEDIA_URL}/${task.task.audio}?${session.data.user?.tokens.internalAccess}`} title={task.task.audio.title} />
                                    </>
                                )
                            }
                            {
                                document.isLoading && (
                                    <Skeleton variant="rectangular" width={'100%'} height={150} />
                                )
                            }
                            {
                                task?.task.image && (
                                    <ImagenTask uri={`${MEDIA_URL}/${task.task.image.location}?${session.data.user?.tokens.internalAccess}`} title={task.task.image.title} />
                                )
                            }
                            <Stack mt={4} justifyContent={"center"} gap={1}>
                                <Typography fontSize={14} fontWeight={600} textAlign={"center"}
                                    sx={{
                                        background: getBackGroundGradient(),
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {`Click “${task?.task.completionType}” to Finish Task`}
                                </Typography>
                                <Stack flexDirection={'row'} gap={2} justifyContent={"center"}>
                                    <Button
                                        disabled={task?.completed}
                                        sx={{
                                            fontSize: 16,
                                            height: 56,
                                            background: getBackGroundGradient(),
                                            '&:disabled': {
                                                color: 'white',
                                                opacity: 0.5
                                            }
                                        }}
                                        onClick={() => setModalConfirm(true)} variant="contained" startIcon={<Icon icon="material-symbols:check" />}>
                                        {task?.task.completionType}
                                    </Button>
                                </Stack>

                            </Stack>
                        </Stack>

                    </Stack>
                </Stack>
            </Paper>

            <Modal
                open={modalConfirm}
                onClose={() => { }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper sx={{ width: 700, borderRadius: 4 }}>
                    <Stack p={4} gap={2}>
                        <Stack>
                            <Typography textAlign={"center"} fontSize={32} fontWeight={700}>Warning</Typography>
                        </Stack>
                        <Stack>
                            {renderCompleteInstruction()}
                        </Stack>
                        <Stack flexDirection={"row"} justifyContent={"center"} gap={2}>
                            <Button fullWidth variant="outlined" color="error" onClick={() => setModalConfirm(false)}>Cancel</Button>
                            <Button onClick={onCompleteConfirm} fullWidth variant="contained">{task?.task.completionType}</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Modal>
        </Stack>
    )
}

export default Page;
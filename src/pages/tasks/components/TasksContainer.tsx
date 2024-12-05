import { Skeleton, Stack, Typography } from '@mui/material'
import TaskItem from './TaskItem'

type ITaskContainer = {
    tasks: Task[],
    isOverdue?: boolean,
    isLoading?: boolean,
}

const HeaderTitle = ({ text }: { text: string }) => {
    return (
        <Typography color="#A6A6A6" fontSize={12}>
            {text}
        </Typography>
    )
}

const TasksContainer = (props: ITaskContainer) => {
    return (
        <Stack height={"55vh"} overflow={'auto'}>
            <Stack flexDirection={'row'} borderBottom={"1px lightgray solid"} pb={2}>
                <Stack flex={1} >
                    <HeaderTitle text="S/N" />
                </Stack>
                <Stack flex={5}>
                    <HeaderTitle text="Task Title" />
                </Stack>
                {props.isOverdue && (
                    <Stack flex={2} />
                )}
                
                <Stack flex={1} alignItems={"flex-end"} pr={3}>
                    <HeaderTitle text="Status" />
                </Stack>
            </Stack>
            <Stack>
                {props.isLoading ? (
                    <Stack gap={2}>
                        <Skeleton variant="rectangular" width={'100%'} height={50} />
                        <Skeleton variant="rectangular" width={'100%'} height={50} />
                        <Skeleton variant="rectangular" width={'100%'} height={50} />
                    </Stack>
                ) : (
                    props.tasks.map((task, index) => (
                        <TaskItem key={task.id} task={task} index={index+1} isOverdue={props.isOverdue} />
                    ))
                )}
                {!props.isLoading && props.tasks.length === 0 && (
                    <Stack height={'100%'} justifyContent={'center'} alignItems={'center'} mt={8}>
                        <Typography fontSize={12} fontWeight={400} color={'#A6A6A6'} >
                            No tasks found
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}
export default TasksContainer
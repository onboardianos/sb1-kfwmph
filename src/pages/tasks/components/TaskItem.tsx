import { useAppData } from "@context/AppData"
import { BusinessCenterSharp, CheckCircleOutline, CorporateFare } from "@mui/icons-material"
import { Stack, Typography } from "@mui/material"
import moment from "moment"

type ITaskItem = {
    task: Task
    index: number
    isOverdue?: boolean
}
const TaskItem = (props: ITaskItem) => {
    const { path, tasks } = useAppData()
    const getStatusText = () => {
        if (props.isOverdue) {
            return `Overdue by ${moment().diff(moment(props.task.dueDate), 'd')} days`
        }
        return ""
    }
    return (
        <Stack
            style={{ cursor: "pointer" }}
            onClick={() => {
                tasks.setTask(props.task)
                path.push({
                    name: props.task.task.title,
                    path: "task",
                })
            }}
            flexDirection={"row"} alignItems={"center"} py={2} pr={4}>
            <Stack fontSize={14} flex={1} fontWeight={600} >
                {props.index}
            </Stack>
            <Stack flex={5}>
                <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
                    {
                        props.task.task.taskType === "SITE" ? <BusinessCenterSharp color="info" /> : <CorporateFare color="info" />
                    }
                    <Typography fontSize={14} fontWeight={600}>{props.task.task.title}</Typography>
                </Stack>
            </Stack>
            {props.isOverdue && (
                <Stack flex={2}>
                    <Typography fontSize={14} color={props.isOverdue ? "red" : "GrayText"} >{getStatusText()}</Typography>
                </Stack>
            )}

            <Stack flex={1} alignItems={"flex-end"}>
                <CheckCircleOutline color={props.task.completed ? "success" : "disabled"} />
            </Stack>

        </Stack>
    )
}

export default TaskItem
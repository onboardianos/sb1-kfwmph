import TabPaper from '@common/Container/TabPaper';
import { useAppData } from '@context/AppData';
import { Stack } from '@mui/material';
import TasksService from '@services/taskService';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TasksContainer from './components/TasksContainer';


const page = () => {
    const {tasks,lastTaskTab} = useAppData()
    const {selectedDate} = tasks
    const [allTasks, setAllTasks] = useState<Record<string, Task[]>>({});
    const [daySelectedTasks, setDaySelectedTasks] = useState<Task[]>([]);
    const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const location = useLocation()
    const [isLoading,setIsLoading] = useState(false)
    useEffect(() => {
        getSelectedDayTasks()
    }, [allTasks,selectedDate])

    useEffect(()=>{
        getOverdueTasks()
        getCompletedTasks()
    },[allTasks])

    const getOverdueTasks = () => {
        const currentDate = moment()
        const overdueTasks = Object.values(allTasks).reduce((acc, tasks) => {
            return acc.concat(tasks.filter(task => moment(currentDate).isAfter(task.dueDate, 'd') && !task.completed));
        }, []);
        setOverdueTasks(overdueTasks);
    }

    const getCompletedTasks = () => {
        const completedTasks = Object.values(allTasks).reduce((acc, tasks) => {
            return acc.concat(tasks.filter(task => task.completed));
        }, []);
        setCompletedTasks(completedTasks);
    }
    
    const getSelectedDayTasks = () => {
        //filter selected day tasks
        const selectedDayTasks = Object.values(allTasks).reduce((acc, tasks) => {
            return acc.concat(tasks.filter(task => moment(selectedDate).isSame(task.dueDate, 'd')));
        }, []);
        setDaySelectedTasks(selectedDayTasks.filter(task => !task.completed));
    }

    const fetchTasks = async () => {
        setIsLoading(true)
        try {

            let res = await TasksService.getTasks();
            setAllTasks(res);
            return res;
        } catch (error) {
            console.log(error)
            return {}
        } finally {
            setIsLoading(false)
        }
    }


    useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
        refetchOnMount: true,
    })
    const initialTab = location.state?.taskTab || 0
    return (
        <Stack flexDirection={"row"}>
            <TabPaper
                title='Tasks'
                subtitle={selectedDate.format('MMMM Do, YYYY')}
                initialTab={initialTab}
                theme='secondary'
                showTabs
                content={[
                    {
                        title: "Current Tasks",
                        content: <TasksContainer tasks={daySelectedTasks} isLoading={isLoading} />,
                        onClick: ()=>lastTaskTab.setLastTaskTab(0)
                    },
                    {
                        title: 'Completed Tasks',
                        content: <TasksContainer tasks={completedTasks} isLoading={isLoading} />,
                        onClick: ()=>lastTaskTab.setLastTaskTab(1)
                    },
                    {
                        title: 'Overdue Tasks',
                        content: <TasksContainer tasks={overdueTasks } isOverdue isLoading={isLoading} />,
                        onClick:()=>lastTaskTab.setLastTaskTab(2)
                    }
                ]}
            />
        </Stack>
    )
}
export default page
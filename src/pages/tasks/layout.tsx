import { useAppData } from '@context/AppData';
import { Paper, Stack } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import TasksService from '@services/taskService';
import { useQuery } from '@tanstack/react-query';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CalendarDate from './components/CalendarDate';

const Layout: React.FC = () => {
    const { tasks } = useAppData()
    const pathname = useLocation().pathname
    const navigate = useNavigate()
    const { setSelectedDate: setGlobalSelectedDate } = tasks
    const [selectedDate, setSelectedDate] = useState<Moment>(moment())
    const [markedDates, setMarkedDates] = useState<string[]>([]);
    const [dueDates, setDueDates] = useState<Record<string, boolean>>({});

    const getCalendarSlots = async () => {
    try {
        let allTasks = await TasksService.getTasks();
        const currentDate = moment()
        const overdueDates: Record<string, boolean> = {};
        const markedDatesSet = new Set<string>();

        Object.values(allTasks).forEach(tasks => {
            tasks.forEach(task => {
                const isOverdue = moment(currentDate).isAfter(task.dueDate, 'd') && !task.completed;
                if (isOverdue) {
                    overdueDates[task.dueDate] = true;
                    markedDatesSet.add(task.dueDate);
                }
                const isAvailable = moment(currentDate).isBefore(task.dueDate, 'd') && !task.completed;
                if (isAvailable) {
                    markedDatesSet.add(task.dueDate);
                }
            });
        });

        const filteredTasks: Record<string, Task[]> = {};

        if (allTasks) {
            Object.keys(allTasks).forEach((key) => {
                const tasks = allTasks[key].filter(task => moment(currentDate).isSameOrBefore(task.dueDate, 'd') && !task.completed);
                if (tasks.length > 0) {
                    filteredTasks[key] = tasks;
                }
            });
            setMarkedDates(Array.from(markedDatesSet));
            setDueDates(overdueDates);
            return {};
        }

    } catch (error) {
        console.log(error);
        return {};
    }
};

    useQuery({
        queryKey: ['slots'],
        queryFn: getCalendarSlots,
        refetchOnMount: true,
    })

    return (
        <Stack flex={1} py={2} px={3} flexDirection={{md:"row",xs:'column'}} gap={2} height={'100%'}>
            <Stack flex={1} height={'100%'}>
                <Outlet />
            </Stack>
            {pathname === '/tasks' && (
                <Stack>
                    <Paper variant='flat' sx={{ background: "#EFF2F5", borderRadius: 4 }} >
                        <DateCalendar
                            value={selectedDate}
                            defaultValue={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date)
                                setGlobalSelectedDate(date)
                                if (pathname !== '/tasks') {
                                    navigate('/tasks')
                                }
                            }}
                            slots={{
                                day: CalendarDate
                            }}
                            slotProps={{
                                day: {
                                    highlightedDays: markedDates,
                                    dueDates: dueDates
                                } as any,
                            }}
                        />
                    </Paper>
                </Stack>
            )}
        </Stack>
    );
};

export default Layout;
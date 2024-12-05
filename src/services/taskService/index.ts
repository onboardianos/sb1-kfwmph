import moment from 'moment';
import { BASE_URL } from "..";
import AwsService from "../awsService";

const getTasks = (): Promise<Record<string, Task[]>> => {
    return new Promise(async (resolve, reject) => {
        try {
            let userAuth = await AwsService.getAwsToken();
            let headers = {
                headers: {
                    Authorization: `${userAuth}`,
                },
            };
            let siteList = await fetch(`${BASE_URL}/my/tasks/site`, headers).then((response) => response.json());
            let groupList = await fetch(`${BASE_URL}/my/tasks/group`, headers).then((response) => response.json());
            let lists: Task[] = siteList.concat(groupList);
            lists.forEach((task) => {
                const dueDate = moment(task.created).add(task.task.daysToComplete, 'days').format('YYYY-MM-DD');
                task.dueDate = dueDate;
            });

            // Group elements by dueDate (ignoring time)
            const groupedLists = lists.reduce((groups: any, task) => {
                const dueDate = task.dueDate;
                if (!groups[dueDate]) {
                    groups[dueDate] = [];
                }
                groups[dueDate].push(task);
                return groups;
            }, {});

            resolve(groupedLists);
        } catch (error) {
            reject({ error });
        }
    });
};

const completeTask = (task: Task): Promise<Task> => {
    return new Promise(async (resolve, reject) => {
        try {
            let userAuth = await AwsService.getAwsToken();
            let headers = {
                headers: {
                    Authorization: `${userAuth}`,
                },
            };

            let endpoint = "";
            if (task.task.taskType === "SITE") {
                endpoint = `${BASE_URL}/my/tasks/site/${task.id}/setComplete`;
            } else {
                endpoint = `${BASE_URL}/my/tasks/group/${task.id}/setComplete`;
            }

            let response = await fetch(endpoint, headers).then((response) => response.json());
            resolve(response);
        } catch (error) {
            reject({ error });
        }
    });
};


const TasksService = {
  getTasks,
  completeTask
};

export default TasksService;

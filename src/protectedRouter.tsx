import HomeLayout from "@pages/home/layout";
import Home from "@pages/home/page";
import MainLayout from "@pages/layout";
import MessengerLayout from '@pages/messenger/layout';
import Messenger from "@pages/messenger/page";
import MyVideos from "@pages/myvideos/page";
import TaskLayout from "@pages/tasks/layout";
import Tasks from "@pages/tasks/page";
import Task from "@pages/tasks/task/page";
import Training from '@pages/training/page';
import Subjects from '@pages/training/subjects/page';
import Topics from '@pages/training/subjects/topics/page';
import Topic from '@pages/training/subjects/topics/topic/page';
import Test from '@pages/training/subjects/topics/topic/test/page';
import Post from '@pages/post/page';
import PostEditor from '@pages/postEditor/page';
import Profile from '@pages/profile/page';
import ProfileLayout from '@pages/profile/layout';
const protectedRouter = [
    {
        
        path: "home",
        element: <HomeLayout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            // otras rutas que deben estar dentro de MainLayout
        ],
    },
    {
        path:"post",
        element:<HomeLayout showBreadcrumbs={false} />,
        children:[{
            path:"",
            element:<Post />
        }]
    },
    {
        path:"postEditor",
        element:<HomeLayout showBreadcrumbs={false} />,
        children:[{
            path:"",
            element:<PostEditor />
        }]
    },
    {
        path:"profile",
        element:<ProfileLayout />,
        children:[{
            path:"",
            element:<Profile />
        }]
    },
    //Training routes
    {
        path: "training",
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <Training />,
            },
            {
                path: "subjects",
                element: <Subjects />,
            },
            {
                path: "subjects/topics",
                element: <Topics />,
            },
            {
                path: "subjects/topics/topic",
                element: <Topic />
            }
        ],
    },
    {
        path: "training/topic/test",
        element: <Test />,
    },
    //My videos routes
    {
        path:"myvideos",
        element:<MainLayout />,
        children:[{
            path:"",
            element:<MyVideos />
        }]
    },
    {
        path:"tasks",
        element:<MainLayout />,
        children:[{
            path:"",
            element:<TaskLayout />,
            children:[{
                path:"",
                element:<Tasks />
            },{
                path:"task",
                element:<Task />
            }]
        }]
    },
    {
        path:"messenger",
        element:<MessengerLayout />,
        children:[{
            path:"",
            element:<Messenger />
        }]
    }
];

export default protectedRouter;
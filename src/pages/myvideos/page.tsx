import TabPaper, { ITabPaper } from '@common/Container/TabPaper';
import MySubmissions from './tabs/MySubmissions';
import MyVideos from './tabs/MyVideos';
import React from 'react';
import { useLocation } from 'react-router-dom';
const page = () => {
    const {state} = useLocation();
    const MemoTabPaper = React.memo(TabPaper)
    const initialTab = state?.tab || 0
    const content: ITabPaper = {
        title: "My Videos",
        content: [
            {
                title: "My Videos",
                content: <MyVideos />
            },
            {
                title: "Test Submissions",
                content: <MySubmissions />
            }
        ],
        initialTab,
        theme: "secondary",
    }

    return (
        <MemoTabPaper {...content} showTabs />
    )
}
export default page
import TabPaper from '@common/Container/TabPaper';
import PlanList from './components/PlanList';
import React from 'react';

const MemoTabPaper = React.memo(TabPaper)   
const page = () => {
    return (
        <MemoTabPaper
            title='Modules'
            content={[{
                title: 'All',
                content: <PlanList />
            }]}
            initialTab={0}
            theme='secondary'
            showTabs={false}
        />
    )
}
export default page
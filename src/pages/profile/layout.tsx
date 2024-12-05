
import Navbar from '@common/Navigation/Navbar';
import Sidebar from '@common/Navigation/Sidebar';
import { useSession } from '@context/SessionContext';
import { Stack } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

type HomeLayoutProps = {
    showBreadcrumbs?: boolean
}
const Layout: React.FC<HomeLayoutProps> = ({showBreadcrumbs}) => {
    const { data } = useSession()

    if (!data.user?.amity || !data.user?.profile) {
        return (<></>)
    }

    return (

        <Stack flexDirection={"row"} sx={{ minHeight: "100vh" }}>
            <Sidebar />
            <Stack flex={1}>
                <Navbar breadcrumb={showBreadcrumbs}/>
                <Stack py={2} px={3} height={"100%"}>
                    <Outlet />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Layout;

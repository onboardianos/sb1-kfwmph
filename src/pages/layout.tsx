
import Navbar from '@common/Navigation/Navbar';
import Sidebar from '@common/Navigation/Sidebar';
import { useSession } from '@context/SessionContext';
import { Stack } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
const Layout: React.FC = () => {
    const { data } = useSession()

    if (!data.user?.amity || !data.user?.profile) {
        return (<></>)
    }

    return (

        <Stack flexDirection={"row"} sx={{ minHeight: "100vh" }} flex={1}>
            <Sidebar />
            <Stack flex={1}>
                <Navbar />
                <Stack py={2} px={{xs:1,md:3}} flex={1}>
                    <Outlet />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Layout;

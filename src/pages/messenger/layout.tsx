
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

        <Stack flexDirection={"row"} sx={{ minHeight: "100vh" }}>
            <Sidebar flat />
            <Stack flex={1}>
                <Navbar breadcrumb={false} flat/>
                <Stack height={"100%"} padding={2} sx={{backgroundColor:'grey.A100', borderTopLeftRadius:32}}>
                    <Outlet />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Layout;

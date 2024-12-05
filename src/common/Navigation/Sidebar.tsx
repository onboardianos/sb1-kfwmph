import { Client } from '@amityco/ts-sdk'
import { useAppData } from '@context/AppData'
import { useSession } from '@context/SessionContext'
import { Icon } from '@iconify/react'
import { Logout } from '@mui/icons-material'
import { Badge, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material'
import { red } from '@mui/material/colors'
import { signOut } from 'aws-amplify/auth'
import { useLocation, useNavigate } from 'react-router-dom'
type ISidebar = {
    flat?: boolean
}
const Sidebar = ({ flat }: ISidebar) => {
    const pathName = useLocation().pathname
    const { badges } = useAppData()
    const navigate = useNavigate()
    const { path, sidebar } = useAppData()
    const {logout} = useSession()
    const handleLogOut = () => {
        signOut().then(() => {
            Client.logout()
            logout()
            navigate('/')
        });
    }
    const sideWidth = sidebar.isOpen ? "15vw" : "3vw"
    const sidePadding = sidebar.isOpen ? 2 : 4
    const showText = sidebar.isOpen
    const sideStyle = {
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
        gap: 4
    }
    const image = sidebar.isOpen ? <img src={"/img/brand.svg"} alt="onboardian" style={{ width: "65%" }} /> : <img src={'/img/logo.png'} alt="onboardian-logo" style={{ width: "100%", maxWidth: 64 }} />

    const primaryColor = '#00498B'
    const black = '#262626'


    return (
        <Paper sx={{ ...flat && { boxShadow: 'unset' } }} >
            <Stack
                style={{ transition: 'width 0.5s' }} py={2} px={sidePadding} gap={4} width={sideWidth} minWidth={44} >
                <Stack alignItems={"flex-start"} justifyContent={"center"}>
                    {image}
                </Stack>
                <Stack gap={2} >
                    <nav aria-label="main mailbox folders" >
                        <List sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
                            <Stack flex={4} px={1}>
                                <ListItem disablePadding>
                                    <ListItemButton sx={{
                                        justifyContent: "center",
                                        alignItems: "center",

                                    }} onClick={() => navigate("/home")} selected={pathName === "/home"}>
                                        <ListItemIcon sx={{ minWidth: sidebar.isOpen ? 54 : 0 }}>
                                            <Icon icon="solar:home-2-bold" fontSize={20} style={{ color: pathName === "/home" ? primaryColor : black }} />
                                        </ListItemIcon>
                                        {showText && <ListItemText primary="Home" />}
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton sx={sideStyle} onClick={() => {
                                        path.replace({
                                            name: "Messenger",
                                            path: "messenger"
                                        })
                                    }} selected={pathName.includes("messenger")}>
                                        <ListItemIcon sx={{ minWidth: 0 }}>
                                            <Badge
                                                variant='dot'
                                                color='secondary'
                                                invisible={badges.get.chats === 0}
                                            >
                                                <Icon icon="streamline:chat-two-bubbles-oval-solid"
                                                    fontSize={20}
                                                    color={pathName.includes("messenger") ? primaryColor : black} />
                                            </Badge>
                                        </ListItemIcon>
                                        {showText && <ListItemText primary="Messenger" sx={{marginLeft: "2px"}} />}
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton sx={sideStyle} onClick={() => path.replace({
                                        name: "Tasks",
                                        path: "tasks"
                                    })} selected={pathName.includes("tasks")}>
                                        <ListItemIcon sx={{ minWidth: 0 }}>
                                            <Icon icon="solar:calendar-bold"
                                                fontSize={22}
                                                color={pathName.includes("tasks") ? primaryColor : black}
                                            />
                                        </ListItemIcon>
                                        {showText && <ListItemText primary="Tasks" />}
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton sx={sideStyle} onClick={() => path.replace({
                                        name: "My Videos",
                                        path: "myvideos"
                                    })} selected={pathName === "/myvideos"}>
                                        <ListItemIcon sx={{ minWidth: 0 }}>
                                            <Icon icon="heroicons-solid:play"
                                                fontSize={22}
                                                color={pathName.includes("myvideos") ? primaryColor : black}
                                            />
                                        </ListItemIcon>
                                        {showText && <ListItemText primary="My Videos" />}
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton sx={sideStyle} onClick={() => path.replace({
                                        name: "Training",
                                        path: "training"
                                    })} selected={pathName.includes("/training")}>
                                        <ListItemIcon sx={{ minWidth: 0 }}>
                                            <Icon icon="solar:medal-ribbons-star-bold"
                                                fontSize={22}
                                                color={pathName.includes("/training") ? primaryColor : black}
                                            />
                                        </ListItemIcon>
                                        {showText && <ListItemText primary="Training" />}
                                    </ListItemButton>
                                </ListItem>
                                {/* <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Notifications />
                                    </ListItemIcon>
                                    <ListItemText primary="Notifications" />
                                </ListItemButton>
                            </ListItem> */}
                                {/* <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Notifications />
                                    </ListItemIcon>
                                    <ListItemText primary="Widgets" />
                                </ListItemButton>
                            </ListItem> */}
                                {/* <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Notifications />
                                    </ListItemIcon>
                                    <ListItemText primary="Team" />
                                </ListItemButton>
                            </ListItem> */}
                                <ListItem disablePadding>
                                    <ListItemButton sx={sideStyle}>
                                        <ListItemIcon sx={{ minWidth: 0 }}>
                                            <Icon icon="solar:bell-bold"
                                                fontSize={21}
                                                color={pathName.includes("/notifications") ? primaryColor : black}
                                            />
                                        </ListItemIcon>
                                        {showText && <ListItemText primary="Notifications" />}
                                    </ListItemButton>
                                </ListItem>
                                {/* <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Notifications />
                                    </ListItemIcon>
                                    <ListItemText primary="Success Tracking" />
                                </ListItemButton>
                            </ListItem> */}
                            </Stack>
                            <Stack flex={0} gap={2} mt="auto" px={1}>
                                <ListItem disablePadding >
                                    <ListItemButton sx={sideStyle} onClick={handleLogOut}>
                                        <ListItemIcon sx={{ minWidth: 0 }}>
                                            <Logout sx={{ color: red[600] }} />
                                        </ListItemIcon>
                                        {showText && <ListItemText primary="Logout" />}
                                    </ListItemButton>
                                </ListItem>
                            </Stack>

                        </List>
                    </nav>

                </Stack>
            </Stack>
        </Paper>
    )
}
export default Sidebar

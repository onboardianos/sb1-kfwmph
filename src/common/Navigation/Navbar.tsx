
import { useAppData } from '@context/AppData';
import { useSession } from '@context/SessionContext';
import { ArrowBack, Menu } from '@mui/icons-material';
import { Avatar, Breadcrumbs, Button, IconButton, Link, Paper, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { MEDIA_URL } from '@services/index';
import { useLocation, useNavigate } from 'react-router-dom';

type INavbar = {
    breadcrumb?: boolean,
    flat?: boolean
}

const Navbar = ({breadcrumb = true,flat}:INavbar) => {
    const { data } = useSession()
    const { path, sidebar,lastTaskTab } = useAppData()
    const location = useLocation()
    const navigate = useNavigate();


    const routeNameMapping = path.route.reduce((acc: any, route) => {
        acc[route.path] = route.name;
        return acc;
    }, {});
    const pathArray = location.pathname.split("/");

    const title = routeNameMapping[pathArray[pathArray.length - 1]] || pathArray[pathArray.length - 1];
    return (
        <>
            <Paper
                id='main-navbar' 
                sx={{ 
                    ...flat &&{boxShadow:'unset'},
             }}>
                <Stack flexDirection={"row"} alignItems={"center"} pr={10} py={2}>
                    <IconButton onClick={sidebar.toggle}>
                        <Menu />
                    </IconButton>
                    <Stack flex={1} flexDirection={"row"} justifyContent={"flex-end"} alignItems={"center"} gap={2} sx={{cursor:'pointer'}} onClick={()=>{
                        path.replace({
                            name:'My Profile',
                            path:'profile'
                        })
                        navigate('/profile')
                    }}>
                        <Avatar src={`${MEDIA_URL}/${data.user?.profile?.profileImage?.location}?${data.user?.tokens.internalAccess}`} sx={{ width: 44, height: 44 }} />
                        <Typography fontWeight={700}>
                            {data.user?.profile?.firstName}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
            {location.pathname !== "/home" && breadcrumb &&(
                <Stack mx={8} pt={4} gap={2}>
                    {
                        location.pathname === "/tasks/task" && (
                            <Stack justifyContent={'flex-start'} flexDirection={'row'}>
                                <Button
                                    onClick={() => navigate("/tasks",{state:{taskTab:lastTaskTab.id}})}
                                    color="inherit"
                                    startIcon={<ArrowBack />}>
                                    Back
                                </Button>
                            </Stack>
                        )
                    }
                    <Breadcrumbs>
                        {
                            pathArray.map((item, index) => {
                                // Reemplazar '/' con 'Home'
                                if (index === 0 && item === '') {
                                    item = 'Home';
                                }

                                // Reemplazar la ruta con el nombre correspondiente si existe
                                const name = routeNameMapping[item] || item;

                                // Construir la ruta a la que queremos redirigir
                                const pathTo = `${pathArray.slice(0, index + 1).join("/")}`;

                                return (
                                    <Link
                                        key={`path-${index}`}
                                        onClick={() => navigate(pathTo)}
                                        style={{
                                            textDecoration: 'none',
                                            color: index === pathArray.length - 1 ? grey[700] : grey[400],
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {name}
                                    </Link>
                                );
                            })
                        }
                    </Breadcrumbs>
                    <Typography flex={1} flexWrap={"wrap"} variant='h4' letterSpacing={1.1} fontWeight={700}>
                        {title}
                    </Typography>
                </Stack>
            )}

        </>
    )
}
export default Navbar
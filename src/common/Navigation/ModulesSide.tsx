import { Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

type IModuleItem = {
    title: string,
    colors: string[],
    iconUri: string,
    redirect:string
}

export const ModuleItem = (props:IModuleItem) => {
    const navigate = useNavigate()
    return (
        <Stack
            onClick={()=>navigate(props.redirect)}
            height={96}
            borderRadius={2} 
            position={"relative"}
            overflow={"hidden"}
            justifyContent={"center"}
            sx={{ background: `linear-gradient(0deg, ${props.colors[0]} 0%, ${props.colors[1]} 100%)`,cursor:"pointer" }} >
            <Stack px={4} py={2} width={60}>
                <Typography lineHeight={1.2} color="white" fontWeight={"300"} variant={"h6"}>{props.title}</Typography>
            </Stack>
            <img style={{position:'absolute',bottom:0,right:4}} src={props.iconUri} width={96} height={96} alt={props.title}/>
        </Stack>
    )
}

const ModulesSide = () => {
     return (
        <Paper >
            <Stack py={2} px={2} gap={4}>
                <Stack>
                    <Typography lineHeight={1} variant={"h6"}>Modules</Typography>
                    <Typography color={"gray"} variant={"caption"}>Explore our modules</Typography>
                </Stack>
                <Stack gap={1}>
                    <ModuleItem redirect='training' title="Training Path" colors={["#0157FF","#03A3F2"]} iconUri='/img/modules/training-path.svg'/>
                    <ModuleItem redirect='map' title="Internal Company" colors={["#ED048B","#FB6368"]} iconUri='/img/modules/internal-company.svg'/>
                    <ModuleItem redirect='resources' title="Resouce Center" colors={["#B246FC","#3C3BDD"]} iconUri='/img/modules/resource-center.svg'/>
                    <ModuleItem redirect='progress' title="Success Tracking" colors={["#03CD86","#03CD5E"]} iconUri='/img/modules/success-tracking.svg'/>
                </Stack>
            </Stack>
        </Paper>
    )
} 
export default ModulesSide

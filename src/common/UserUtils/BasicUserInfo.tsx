import { Avatar, Skeleton, Stack, Typography } from '@mui/material';


type IBasicUserInfo = {
    avatar?: string,
    name?: string,
    title?: string
}
const BasicUserInfo = (props: IBasicUserInfo) => {
    if (!props.avatar || !props.name || !props.title) {
        return (
            <Stack justifyContent={"center"} alignItems={"center"}>
                <Skeleton sx={{width:64,height:64}} variant='circular'></Skeleton>
                <Skeleton variant='text' width={"50%"}></Skeleton>
                <Skeleton variant='text' width={"25%"}></Skeleton>
            </Stack>
        )
    }

    return (
        <Stack justifyContent={"center"} alignItems={"center"}>
            <Avatar src={props.avatar} alt={props.name} sx={{ width: 80, height: 80 }} />
            <Stack alignItems={"center"}>
                <Typography fontWeight={"bold"} variant={"body1"}>{props.name}</Typography>
                <Typography color="gray" variant={"caption"}>{props.title}</Typography>
            </Stack>
        </Stack>
    )
}
export default BasicUserInfo
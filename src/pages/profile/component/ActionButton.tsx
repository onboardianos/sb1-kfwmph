import { Button, Paper, Stack, Typography } from "@mui/material"

type IActionButton = {
    icon: any,
    label: string,
    value?: string,
    buttonLabel: string,
    onClick?: () => void
}

const ActionButton = (props: IActionButton) => {
    return (
        <Paper variant='flat' sx={{ background: "#EFF2F5", borderRadius: 4, padding: 3, flex: 1 }}>
            <Stack gap={2}>
                <Stack>
                    <Typography fontWeight={600}>
                        {props.label}
                    </Typography>
                    <Typography fontWeight={200} color={'grey.400'}>
                        {props.value || 'No available'}
                    </Typography>
                </Stack>
                {props.value && props.onClick && (
                    <Stack flexDirection={'row'} >
                        <Button variant="contained" color="primary" startIcon={props.icon} onClick={props.onClick}>
                            {props.buttonLabel}
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Paper>

    )
}

export default ActionButton
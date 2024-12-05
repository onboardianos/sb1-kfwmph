import { EditOutlined, VideoCameraBackOutlined } from '@mui/icons-material'
import { Button, Collapse, Skeleton, Stack, Typography } from '@mui/material'
import { green, red, yellow } from '@mui/material/colors'

type IRating = {
    selected: number
    setSelected: (value: number) => void
    onPressOption: (value: number) => void
    onCancel: () => void
    instructions: {
        loading?: boolean
        data: string
    }
}
const Rating = ({ selected, setSelected, onPressOption, onCancel, instructions }: IRating) => {

    return (
        <Stack gap={2}>
            <Stack display={"none"} direction={"row"} justifyContent={"flex-end"}>
                <Button
                    onClick={onCancel}
                    color='error' variant='contained'>
                    Cancel
                </Button>
            </Stack>
            <Stack py={1} gap={2}>
                <Typography variant='body1' fontWeight={"bold"} color='text.secondary'>Instructions</Typography>
                <Stack fontWeight={200} gap={1}>
                    {
                        instructions.loading && (
                            <Skeleton variant='text' />
                        )
                    }
                    {!instructions.loading && instructions.data.split('\n').map((text) => (
                        <Typography fontSize={16}>
                            {text}
                        </Typography>
                    ))}

                </Stack>
            </Stack>
            <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                bgcolor={"grey.100"}
                p={2}
                borderRadius={4}
            >
                {[...Array(10)].map((_, index) => (
                    <Stack
                        onClick={() => setSelected(index + 1)}
                        key={index + 1}
                        sx={{
                            width: 70,
                            height: 70,
                            justifyContent: 'center',
                            backgroundColor: selected === index + 1 ? index + 1 < 5 ? red[700] : index + 1 < 8 ? yellow[700] : green[700] : 'transparent',
                            alignItems: 'center',
                            borderRadius: 2,
                            cursor: 'pointer',
                            ':hover': {
                                transform: 'scale(1.1)',
                                transition: 'all 0.2s ease-in-out'
                            },
                            transform: selected === index + 1 ? 'scale(1.1)' : 'scale(1)',
                            border: `1px solid ${index + 1 ? index + 1 < 5 ? red[700] : index + 1 < 8 ? yellow[700] : green[700] : 'transparent'}`
                        }}
                    >
                        <Typography variant='h6' color={selected === index + 1 ? "white" : index + 1 < 5 ? red[700] : index + 1 < 8 ? yellow[700] : green[700]}>{index + 1}</Typography>
                    </Stack>
                ))}
            </Stack>
            <Collapse in={selected > 0}>
                <Stack flexDirection={"row"} justifyContent={"center"} gap={4} mb={2}>
                    <Button
                        onClick={() => onPressOption(2)}
                        sx={{paddingY:3}}
                        variant='outlined' endIcon={<VideoCameraBackOutlined />}>

                        Video response
                    </Button>
                    <Button
                        onClick={() => onPressOption(3)}
                        sx={{paddingY:3}}
                        variant='outlined' endIcon={<EditOutlined />}>
                        Written response
                    </Button>
                </Stack>
            </Collapse>
        </Stack>
    )
}
export default Rating
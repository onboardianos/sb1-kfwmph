
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Stack, Typography } from '@mui/material';

const InfoLogin = () => {
 
    return (
        <Stack
            gap={12}
            position={"relative"}
            borderRadius={4}
            justifyContent={"center"}
            alignItems={"center"}
            width={"25vw"}
            display={{xs: "none", md: "flex"}}
        >
            <Stack
                position={"absolute"}
                top={0}
                left={0}
                width={"100%"}
                height={"100%"}
                borderRadius={4}
                sx={{
                    backgroundImage: 'url(img/mesh-gradient.jpeg)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            />
            <Stack
                position={"absolute"}
                top={0}
                left={0}
                width={"100%"}
                height={"100%"}
                borderRadius={4}
                sx={{
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Ajusta la opacidad según tus necesidades
                }}
            />
            <Stack alignItems={"center"} px={4} zIndex={1}>
                <Typography variant={"h3"} color="white" fontWeight={"bold"}>
                    All-In-One
                </Typography>
                <Typography variant={"h3"} color={"white"} fontWeight={"bold"}>
                    Onboarding
                </Typography>
                <Typography pt={2} color="white" variant='body2' fontWeight={"light"} textAlign={"center"}>
                    The Human-Centric Operating System Helping Dealers Elevate Performance & Streamline Success
                </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"flex-end"} justifyItems={"flex-end"} color={"white"}>
                <Button
                    onClick={() => window.open('https://www.onboardian.com/', '_blank')}
                    color="inherit"
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{
                        position: 'relative',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        border: '1.5px solid rgba(255,255,255,0.5)',
                        padding: '16px 32px',
                        borderRadius: "32px",
                        textTransform: 'none',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(10px)', // Aplica el desenfoque al fondo del botón
                    }}
                >
                    Learn More
                </Button>
            </Stack>
        </Stack>
    )
}
export default InfoLogin
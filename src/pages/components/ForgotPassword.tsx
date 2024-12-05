import { Button, CircularProgress, Divider, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Component } from "@pages/page";
import { useState } from "react";
import { resetPassword } from 'aws-amplify/auth';


type IForgotPassword = {
    handleChangeComponent: (component: Component,email:string) => void
}

const ForgotPassword = (props: IForgotPassword) => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleGetCode = async () => {
        setLoading(true)
        resetPassword({
            username: email
        }).then(() => {
            props.handleChangeComponent(Component.VERIFY_CODE,email)
        }).catch((error) => {
            console.log(error)
        }).finally(() => setLoading(false))

    }

    return (
        <Stack
            gap={4} py={4} px={4} flex={1} direction="column" justifyContent="space-between" // Añade estas propiedades
        >
            <Stack>
                <img src={"/img/brand.svg"} width={200} height={100} alt="brand-image" />
                <Stack>
                    <Typography variant={"h4"} fontWeight={"bold"}>
                        Forgot your password?
                    </Typography>
                    <Typography color={"GrayText"} fontWeight={"light"}>
                        Enter your email to reset your password
                    </Typography>
                </Stack>
            </Stack>
            <Stack gap={2}>
                <FormControl>
                    <FormLabel htmlFor="email-field">Email</FormLabel>
                    <TextField onChange={handleEmailChange} id="email-field" placeholder='Enter your email' variant="outlined" />
                </FormControl>
                <Button sx={{ boxShadow: 'none' }} disabled={loading} onClick={handleGetCode} type="submit" variant="contained" color="primary">
                    {loading && <CircularProgress size={16} />}
                    Reset password
                </Button>
            </Stack>
            <Stack gap={2} justifySelf={"flex-end"}>
                <Divider />

                <Typography textAlign={"center"} color={grey[500]} fontWeight={"light"} variant='body1'>
                    Already have an account?
                </Typography>
                <Button
                    onClick={() => props.handleChangeComponent(Component.LOGIN,"")}
                    color="inherit">
                    Go back to login
                </Button>
            </Stack>
        </Stack>
    )
}

export default ForgotPassword;
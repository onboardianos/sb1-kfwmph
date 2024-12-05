
import { useAlert } from '@context/GlobalAlertContext';
import { useSession } from '@context/SessionContext';
import { Button, CircularProgress, Divider, FormControl, FormHelperText, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Component } from '@pages/page';
import UserService from '@services/userService';
import { fetchAuthSession, signIn } from 'aws-amplify/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ILoginForm = {
    handleChangeComponent: (component: Component,username:string) => void
}
const LoginForm = (props:ILoginForm) => {
    const alert = useAlert()
    const session = useSession()
    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const login = await signIn({ username: email, password: password });
            if (login.isSignedIn) {
                const res = await fetchAuthSession();
                if (res.tokens) {
                    const token = res.tokens.accessToken.toString();
                    const profile = await UserService.getMyProfileAuth(token);
                    const tokens = await UserService.getMyAutorizeMediaAuth(token);
                    const amity = await UserService.getAmityAccess(token);
                    const user = {
                        profile,
                        tokens: {
                            ...tokens,
                            accessToken: token
                        },
                        amity: {
                            clientKey: amity.clientKey,
                            userToken: amity.userToken
                        }
                    };
                    session.setUser(user);
                    session.setStatus("authenticated");
                    navigate("/home"); // Redirigir después de actualizar el estado de autenticación
                }
            }
        } catch (err: any) {
            console.log(err);
            alert.showAlert({
                type: "error",
                message: err.message
            });
            setLoading(false);
        }
    };

    return (
        <Stack gap={4} py={4} px={4} flex={1}>
            <Stack sx={{
                gap: {
                    xs: 10,
                    md: 2
                }
            }}>
                <Stack flexDirection={"row"} sx={{
                    justifyContent: {
                        xs: "center",
                        md: "flex-start"
                    },
                }}>
                <img id="logo" src={"/img/logo.png"} width={40} height={40}  alt="brand-image"  />
                </Stack>
                <Stack>
                    <Typography>
                        Welcome to
                    </Typography>
                    <Typography variant={"h4"} fontWeight={"bold"}>
                        Onboardian
                    </Typography>
                </Stack>
            </Stack>
            <Stack gap={2}>
                <FormControl>
                    <FormLabel htmlFor="email-field">Username</FormLabel>
                    <TextField onChange={handleEmailChange} id="email-field" placeholder='Username' variant="outlined" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password-field">Password</FormLabel>
                    <TextField type='password' onChange={handlePasswordChange} id="password-field"  placeholder='Password' variant="outlined" />
                    <FormHelperText id="my-helper-text">We'll never share your password</FormHelperText>
                </FormControl>
                <Button sx={{boxShadow:'none'}}  disabled={loading} onClick={handleSignIn} type="submit" variant="contained" color="primary">
                    {loading && <CircularProgress size={16}/>}
                    Login
                </Button>
                
                <Divider />
                <Stack gap={2}>
                    <Typography textAlign={"center"} color={grey[500]} fontWeight={"light"} variant='body1'>
                        Forgot your password?
                    </Typography>
                    <Button
                        onClick={() => props.handleChangeComponent(Component.FORGOT_PASSWORD,email)} 
                        color="inherit">
                        Reset password?
                    </Button>
                </Stack>
            </Stack>

        </Stack>
    );
};

export default LoginForm;

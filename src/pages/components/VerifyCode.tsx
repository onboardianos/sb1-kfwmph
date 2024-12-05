import { Button, CircularProgress, Divider, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Component } from "@pages/page";
import { useEffect, useState } from "react";
import { confirmResetPassword } from 'aws-amplify/auth';
import { useAlert } from "@context/GlobalAlertContext";


type IVerifyCode = {
    handleChangeComponent: (component: Component) => void
    username: string
}

const VerifyCode = (props: IVerifyCode) => {
    const alert = useAlert()
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [arePasswordsEqual, setArePasswordsEqual] = useState(false)

    useEffect(() => {
        verifyIfPasswordsAreEqual()
    }, [newPassword, confirmPassword])

    const hadleConfirmPassword = async () => {
        setLoading(true)
        confirmResetPassword({
            username: props.username,
            newPassword: newPassword,
            confirmationCode: code,
        }).then(() => {
            alert.showAlert({
                message: "Password changed successfully",
                type: "success"
            })
            props.handleChangeComponent(Component.LOGIN)
            
        }
        ).catch((error) => {
            console.log(error)
            alert.showAlert({
                message: error.message,
                type: "error"
            })
        }).finally(() => setLoading(false))

    }

    const verifyIfPasswordsAreEqual = () => {
        setArePasswordsEqual(newPassword !== confirmPassword)
    }

    return (
        <Stack
            gap={4} py={4} px={4} flex={1} direction="column" justifyContent="space-between" // Añade estas propiedades
        >
            <Stack>
                <img src={"/img/brand.svg"} width={200} height={100} alt="brand-image" />
                <Stack>
                    <Typography variant={"h4"} fontWeight={"bold"}>
                        Confirm your password
                    </Typography>
                    <Typography color={"GrayText"} fontWeight={"light"}>
                        Enter your code and new password
                    </Typography>
                </Stack>
            </Stack>
            <Stack gap={2}>
                <FormControl>
                    <FormLabel htmlFor="code-field">Code</FormLabel>
                    <TextField onChange={(event) => setCode(event.target.value)} id="code-field" placeholder='Enter your code' variant="outlined" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password-field">Password</FormLabel>
                    <TextField
                        error={arePasswordsEqual}
                        type='password' onChange={(event) => setNewPassword(event.target.value)} id="password-field" placeholder='Enter your new password' variant="outlined" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="confirm-password-field">Confirm Password</FormLabel>
                    <TextField
                        error={arePasswordsEqual}
                        type='password' id="confirm-password-field" placeholder='Confirm your new password' variant="outlined"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                </FormControl>
                <Stack>
                    <Typography fontSize={10} color={"GrayText"} fontWeight={"light"}>
                        Password must be at least 8 characters long
                    </Typography>
                    <Typography fontSize={10} color={"GrayText"} fontWeight={"light"}>
                        Password must contain at least one number
                    </Typography>
                    <Typography fontSize={10} color={"GrayText"} fontWeight={"light"}>
                        Password must contain at least one special character
                    </Typography>

                </Stack>
                <Button
                     
                    sx={{ boxShadow: 'none' }} disabled={loading || arePasswordsEqual} onClick={hadleConfirmPassword} type="submit" variant="contained" color="primary">
                    {loading && <CircularProgress size={16} />}
                    Confirm password
                </Button>
            </Stack>
            <Stack gap={2} justifySelf={"flex-end"}>
                <Divider />

                <Typography textAlign={"center"} color={grey[500]} fontWeight={"light"} variant='body1'>
                    Already have an account?
                </Typography>
                <Button
                    onClick={() => props.handleChangeComponent(Component.LOGIN)}
                    color="inherit">
                    Go back to login
                </Button>
            </Stack>
        </Stack>
    )
}

export default VerifyCode;
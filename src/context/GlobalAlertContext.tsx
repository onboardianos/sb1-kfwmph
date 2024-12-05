import React, { createContext, useContext, useState } from 'react';
import { Alert, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type AlertContextType = {
    showAlert: (message: IAlertSettings) => void;
};

type IAlertSettings = {
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
    duration?: number;
}

export const GlobalAlertContext = createContext<AlertContextType>({
    showAlert: () => { },
});

export const GlobalAlertProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [alertMessage, setAlertMessage] = useState<IAlertSettings | null>(null);
    const [isShowAlert, setShowAlert] = useState<boolean>(false)

    const showAlert = (message: IAlertSettings) => {
        setShowAlert(true)
        setAlertMessage(message);
        setTimeout(() => {
            setShowAlert(false)
        }, message.duration || 5000);
    };

    return (
        <GlobalAlertContext.Provider value={{ showAlert }}>
            <Box sx={{ width: '100%' }}>
                <Collapse in={isShowAlert}>
                    <Alert
                        severity={alertMessage?.type || "info"}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setShowAlert(false)
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        {alertMessage?.message || "This is a success alert — check it out!"}
                    </Alert>
                </Collapse>
            </Box>
            {children}

        </GlobalAlertContext.Provider>
    );
};

export const useAlert = () => {
    return useContext(GlobalAlertContext);
}
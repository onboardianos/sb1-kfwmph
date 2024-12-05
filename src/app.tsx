import { GlobalAlertProvider } from '@context/GlobalAlertContext';
import { ThemeProvider } from "@emotion/react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Amplify } from "aws-amplify";
import { SnackbarProvider } from 'notistack';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useLocation, useNavigate } from 'react-router-dom';
import 'stream-chat-react/dist/css/v2/index.css';
import { AppDataProvider } from "./context/AppData";
import { SessionProvider } from './context/SessionContext';
import theme from "./theme";
import { awsConfig } from "./utils/awsconfig";
import Wrapper from './wrapper';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }
    }
})


Amplify.configure(awsConfig)
const App = () => {
    const navigate = useNavigate();
    const location = useLocation();



    return (
        <ThemeProvider theme={theme}>
            <SessionProvider >
                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                        <AppDataProvider navigate={navigate} location={location}>
                            <GlobalAlertProvider>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <Wrapper />
                                </LocalizationProvider>
                            </GlobalAlertProvider>
                        </AppDataProvider>
                    </SnackbarProvider>
                </QueryClientProvider>

            </SessionProvider>
        </ThemeProvider>
    )
}

export default App
import { useAlert } from "@context/GlobalAlertContext"
import { useSession } from "@context/SessionContext"
import { Stack } from "@mui/material"
import { useEffect } from "react"
import TakeTest from "./components/TakeTest"

const page = () => {
    const {data} = useSession()
    const alert = useAlert()
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                stream.getTracks().forEach(track => track.stop()); 
            })
            .catch((_) => {
                console.log(_)
                alert.showAlert({
                    message: "Please allow access to your camera and microphone from the browser settings.",
                    type: "error",
                    duration: 10000
                })
            });
    }, []);
    return(
        <Stack height={"100vh"}>
            <TakeTest trainingAccess={data.user?.tokens.trainingAccess} />
        </Stack>
    )
}
export default page
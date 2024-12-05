import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirector = ({ to }: { to: string }) => {
    const navigate = useNavigate();
    useEffect(() => {
        window.location.reload()
        navigate(to);
    }, [to, navigate]);
    return <></>;
}

export default Redirector;
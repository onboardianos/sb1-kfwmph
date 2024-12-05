import Redirector from "@common/Redirector";
import { useAppData } from "@context/AppData";
import { useSession } from "@context/SessionContext";
import { Stack, Typography } from "@mui/material";
import UserService from "@services/userService";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { Chat, useCreateChatClient } from 'stream-chat-react';
import protectedRouter from './protectedRouter';
import router from './router';
import { STREAM_API_KEY } from "./services";
import { AmityProvider } from "@context/AmityContext";

type ProtectedWrapperProps = {
    streamToken: string;
    chatId: string;
}

const Wrapper = () => {
    const { data: localSession } = useSession();
    const routing = useRoutes(router);

    const {
        data: session,
        isLoading: loadingSession,
        error,
    } = useQuery({
        queryKey: ['session', localSession?.user?.tokens],
        queryFn: () => getCurrentUser(),
    });
    const {
        data: streamToken,
        isLoading: loadingStreamToken,
    } = useQuery({
        queryKey: ['stream-token', localSession?.user?.profile?.chatId],
        queryFn: () => UserService.getStreamToken(),
        enabled: !!session
    });

    useEffect(() => {
        if (error) {
            signOut()
                .then(() => {
                    localStorage.clear();
                })
                .catch(() => {
                    localStorage.clear();
                });
        }
    }, [error]);

    if (loadingSession || loadingStreamToken) return <Loader />;
    return (
        <>
            {(!error && session) ? (
                (streamToken && localSession?.user?.profile?.chatId) ?
                    <ProtectedWrapper streamToken={streamToken} chatId={localSession?.user?.profile?.chatId} /> : <ResetStore />
            ) : (
                routing
            )}
        </>
    );
}

const Loader = () => {
    return (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100vh"} gap={2}>
            <img src={"/img/logo.png"} className="pulse-animation" alt="onboardian" style={{ width: "100px", height: "100px" }} />
            <Typography color={'GrayText'} fontSize={14}>
                Loading...
            </Typography>
        </Stack>
    );
}

//component to reset the store in case of local storage is corrupted
export const ResetStore = () => {
    const [redirect, setRedirect] = useState(false);
    useEffect(() => {
        signOut()
            .then(() => {
                setRedirect(true);
            })
            .catch((error) => {
                console.error(error);
                setRedirect(true);
            });
    }, []);
    if (redirect) return <Redirector to="/" />;
    return <></>;
}

const ProtectedWrapper = (props: ProtectedWrapperProps) => {
    const protectedRouting = useRoutes(protectedRouter);
    const { badges } = useAppData();
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const streamClient = useCreateChatClient({
        apiKey: STREAM_API_KEY,
        tokenOrProvider: props.streamToken,
        userData: {
            id: props.chatId,
        },
    });


    useEffect(() => {
        if (path === "/") {
            navigate("/home");
        }
    }, [path]);

    useEffect(() => {
        if (streamClient) {
            let unreadEvent = streamClient.on(event => {
                if (event.total_unread_count !== undefined) {
                    if (event.total_unread_count > 0) {
                        badges.set.chats(event.total_unread_count || 0);
                    }
                    if (event.total_unread_count <= 0) {
                        badges.set.chats(0);
                    }
                }
            });
            return () => {
                unreadEvent.unsubscribe();
            };
        }
    }, [streamClient]);

    if (!streamClient) {
        return <></>;
    }
    return (
        <Chat client={streamClient}>
            <AmityProvider>
                {protectedRouting}
            </AmityProvider>
        </Chat>
    );
}

export default Wrapper;
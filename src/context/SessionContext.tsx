import React, { createContext, useState, useEffect, PropsWithChildren } from 'react';

interface IUser {
    profile: IMyProfile | null,
    tokens: IMyTokens,
    amity: {
        clientKey: string,
        userToken: string
    }
}

type Status = 'authenticated' | 'unauthenticated';
interface ISessionContext {
    data: {
        user: IUser | null,
        status: Status,
    },
    setUser: (user: IUser) => void
    updateProfile: (profile: IMyProfile) => void
    setStatus: (value: Status) => void
    logout: () => void
}

const SessionContext = createContext<ISessionContext>({
    data: {
        user: null,
        status: 'unauthenticated',
    },
    setUser: () => { },
    updateProfile: () => { },
    setStatus: () => { },
    logout: () => { }
});

const SessionProvider = ({ children }: PropsWithChildren) => {

    const [user, setUser] = useState<IUser | null>(null);
    const [status, setStatus] = useState<Status>('unauthenticated');


    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        const savedStatus = localStorage.getItem('status')?.toString();
        if (savedStatus) {
            setStatus(savedStatus as Status);
        }

    }, []);

    const saveUser = (user: IUser) => {
        setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
    }
    const saveStatus = (status: Status) => {
        setStatus(status);
        localStorage.setItem('status', status);
    }

    const updateProfile = (profile: IMyProfile) => {
        saveUser({ ...user, profile, tokens: user?.tokens!, amity: user?.amity! })
    }

    const logout = () => {
        setUser(null);
        setStatus('unauthenticated');
        localStorage.clear();
    }

    return (
        <SessionContext.Provider value={{
            data: {
                user,
                status,
            }, setUser: saveUser, setStatus: saveStatus, logout, updateProfile
        }}>
            {children}
        </SessionContext.Provider>
    );
};

const useSession = () => {
    return React.useContext(SessionContext);
};

export { SessionProvider, useSession };

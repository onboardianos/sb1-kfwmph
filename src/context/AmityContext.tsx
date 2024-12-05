import { Client } from '@amityco/ts-sdk'
import AmityService from '@services/amityService'
import UserService from '@services/userService'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from './AppData'
import { useSession } from './SessionContext'
interface AmityContextProps {
    client: Amity.Client,
    amityIsReady: boolean,
    refreshNewsFeed: boolean,
    setRefreshNewsFeed: (value: boolean) => void,
    currentPost: Amity.Post | undefined,
    setCurrentPost: (post: Amity.Post) => void
}

const AmityContext = createContext<AmityContextProps>({
    client: {} as Amity.Client,
    amityIsReady: false,
    refreshNewsFeed: false,
    setRefreshNewsFeed: () => { },
    currentPost: undefined,
    setCurrentPost: () => { }
})

const AmityProvider = ({ children }: { children: React.ReactNode }) => {
    const client = useRef<Amity.Client>()
    const session = useSession()
    const appData = useAppData()
    const [amityIsReady, setAmityIsReady] = useState(false)
    const [refreshNewsFeed, setRefreshNewsFeed] = useState(false)
    const [currentPost, setCurrentPost] = useState<Amity.Post>()
    const navigate = useNavigate()
    useEffect(() => {
        if (session.data.user?.tokens) {
            createAmityClient()
        }
        
    }, [session.data.user?.tokens])

    const sessionHandler: Amity.SessionHandler = {
        sessionWillRenewAccessToken(renewal: Amity.AccessTokenRenewal) {
            renewal.renew();
        },
    };

    const createAmityClient = async () => {
        try {
            let profile = await UserService.getMyProfileAuth(session.data.user?.tokens?.accessToken!)
            let userChatId = profile.chatId
            let amityCommunities = await AmityService.getAmityCommunitiesAuth(session.data.user?.tokens?.accessToken!)
            let ac = {
                groupCommunity: amityCommunities.groupCommunity,
                amitySiteCommunities: amityCommunities.amitySiteCommunities.filter((community)=>community.siteId === profile.site.id)
            }
            appData.communities.set(ac)
            let displayName = `${profile.firstName || ''} ${profile.lastName || ''}`
            let amityKeys = await AmityService.getAmityConfigAuth(session.data.user?.tokens?.accessToken!)
            client.current = Client.createClient(amityKeys.clientKey, 'us')
            let login = await Client.login({
                userId: userChatId,
                authToken: amityKeys.userToken.replace(/\\\"/g, '').replace(/\"/g, ''),
                displayName: displayName,
            }, sessionHandler)
            if (login) {
                setAmityIsReady(true)
            }

        } catch (error) {
            console.log("Amity login error", error)
            navigate('/')
        }
    }

    //This is to user for ui kit prebuid
    /*const getAuthToken = async () => {
        let amityKeys = await AmityService.getAmityConfigAuth(session.data.user?.tokens?.accessToken!)
        return amityKeys.userToken.replace(/\\\"/g, '').replace(/\"/g, '')
    }*/
    return (
        <AmityContext.Provider value={{
            client: client.current!,
            amityIsReady,
            refreshNewsFeed,
            setRefreshNewsFeed,
            currentPost,
            setCurrentPost
        }}>
            {/*<>
                <AmityUiKitProvider
                    key={session.data.user?.amity.clientKey}
                    apiKey={session.data.user?.amity.clientKey}
                    userId={session.data.user?.profile?.chatId}
                    displayName={`${session.data.user?.profile?.firstName || ''} ${session.data.user?.profile?.lastName || ''}`}
                    apiRegion={'us'}
                    getAuthToken={getAuthToken}
                >
                    {children}

                </AmityUiKitProvider>
            </>*/}
            {children}
        </AmityContext.Provider>

    )

}

const useAmity = () => {
    return useContext(AmityContext)
}

export { AmityProvider, useAmity }

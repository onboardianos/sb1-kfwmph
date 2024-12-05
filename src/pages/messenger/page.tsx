import { useSession } from "@context/SessionContext";
import { Stack } from "@mui/material";
import { useCallback, useState } from "react";
import {
    Channel,
    ChannelList,
    ChannelSearchFunctionParams,
    DefaultStreamChatGenerics,
    MessageInput,
    MessageList,
    Thread,
    useChatContext,
    Window
} from 'stream-chat-react';
import ChatDetails from "./components/ChatDetails/ChatDetails";
import CustomChannelHeader from "./components/CustomChannelHeader";
import CustomMessagePreview from "./components/CustomMessagePreview";
import CustomSearchChat from "./components/CustomSearchChat";
import CustomSearchResultItem from "./components/CustomSearchResultItem";

const Page = () => {
    const { data } = useSession();
    const [showDetails, setShowDetails] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const { client } = useChatContext()
    const newSearchFunction = async (params: ChannelSearchFunctionParams<DefaultStreamChatGenerics>, event: React.BaseSyntheticEvent) => {
        params.setSearching(true)
        let searchValue = event.target.value
        let myChannels = await client.queryChannels({
            members: {
                $in: [data.user?.profile?.chatId!]
            }
        })
        let filteredChannels = myChannels.filter((channel) => {
            if (channel.data?.groupName) {
                let groupName = channel.data.groupName as string
                return groupName.toLowerCase().includes(searchValue.toLowerCase())
            } else {
                const members = Object.values(channel.state.members);
                console.log(members)
                for (const member of members) {
                    const { user } = member;
                    let fullName = user?.first_name + " " + user?.last_name;
                    if (
                        (user?.first_name && (user.first_name as string).toLowerCase().includes(searchValue.toLowerCase())) ||
                        (user?.last_name && (user.last_name as string).toLowerCase().includes(searchValue.toLowerCase())) ||
                        (fullName.toLowerCase().includes(searchValue.toLowerCase()))
                    ) {
                        return true;
                    }
                }
                return false;
            }
        })
        params.setQuery(searchValue)
        params.setResults(filteredChannels)
        params.setSearching(false)
    }
    const getOptimaHeigth = useCallback(() => {
        let nav = document.getElementById('main-navbar')
        if (nav) {
            let navHeight = nav.offsetHeight + 32
            return {
                height: `calc(100vh - ${navHeight}px)`
            }
        }
        return {
            height: '80vh'
        }
    }, [])

    return (
        <Stack>
            <Stack flexDirection={"row"} gap={1}>
                <Stack flex={1} maxWidth={"25%"} borderRadius={4} overflow={'scroll'} sx={{ ...getOptimaHeigth() }}>
                    <ChannelList
                        sort={{
                            last_message_at: -1
                        }}
                        filters={{
                            members: {
                                $in: [data.user?.profile?.chatId!],
                            },
                            ...(filter === 'unread' ? {
                                unread: {
                                    $gt: 0
                                }
                            } : {})
                        }}
                        options={{
                            state: true,
                            watch: true

                        }}
                        Preview={CustomMessagePreview}
                        showChannelSearch
                        additionalChannelSearchProps={{
                            SearchBar: (props) => <CustomSearchChat {...props} filter={filter} setFilter={setFilter} />,
                            searchFunction: (params, event) => {
                                return newSearchFunction(params, event);
                            },
                            SearchResultItem: CustomSearchResultItem,
                            searchForChannels: true
                        }}
                    />
                </Stack>
                <Stack flex={1} bgcolor={'primary.100'} overflow={'scroll'} sx={{ ...getOptimaHeigth() }}>
                    <Channel>
                        <Window>
                            <CustomChannelHeader onPressDetails={() => setShowDetails(!showDetails)} />
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread />

                        <ChatDetails onClose={() => setShowDetails(false)} isOpen={showDetails} maxHeight={getOptimaHeigth().height} />

                    </Channel>
                </Stack>

            </Stack>
        </Stack>
    );
}
export default Page;
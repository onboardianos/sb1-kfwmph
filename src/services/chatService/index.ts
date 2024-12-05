import AwsService from "@services/awsService";
import { BASE_URL } from "..";

const getProfileByChatId = async(chatId:string):Promise<IMyProfile>=>{
    const token = await AwsService.getAwsToken();
    let res = await fetch(`${BASE_URL}/my/chatProfile/${chatId}`,{
        headers:{
            'Authorization':token
        }
    })
    if(!res.ok){
        throw new Error("Failed to fetch chat profile")
    }
    return await res.json()
}

const ChatService = {
    getProfileByChatId
}
export default ChatService;
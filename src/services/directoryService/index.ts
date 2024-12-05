import AwsService from "@services/awsService";
import { BASE_URL } from ".."

const getMyContacts = async():Promise<IContact[]>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/contacts`,{
        headers:{
            'Authorization':token
        }
    })
    if(!res.ok){
        throw new Error("Failed to fetch my contacts")
    }
    return await res.json()
}

const DirectoryService = {
    getMyContacts
}
export default DirectoryService;
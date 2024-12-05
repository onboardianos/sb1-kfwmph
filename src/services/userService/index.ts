import AwsService from '@services/awsService';
import { BASE_URL } from '../index';

const getMyProfileAuth = async(token:string):Promise<IMyProfile>=>{
    const res = await fetch(`${BASE_URL}/my/profile`,{
        headers:{
            'Authorization':`Bearer ${token}`
        },
        method:"GET"
    })
    if(!res.ok){
        throw new Error("Failed to fetch profile")
    }
    return await res.json()
}
const getMyProfile = async():Promise<IMyProfile>=>{
    let token = await AwsService.getAwsToken()
    return await getMyProfileAuth(token.replace('Bearer ', ''))
}

const getMyAutorizeMediaAuth = async(token:string):Promise<IMyTokens>=>{
    const res = await fetch(`${BASE_URL}/authorize/media`,{
        headers:{
            'Authorization':`Bearer ${token}`
        },
        method:"GET"
    })
    if(!res.ok){
        throw new Error("Failed to fetch autorize media")
    }
    return await res.json()
}
const getMyAutorizeMedia = async():Promise<IMyTokens>=>{
    let token = await AwsService.getAwsToken()
    return await getMyAutorizeMediaAuth(token.replace('Bearer ', ''))
}

const getAmityAccess = async(token:string):Promise<IAmity>=>{
    const res = await fetch(`${BASE_URL}/my/social/config`,{
        headers:{
            'Authorization':`Bearer ${token}`
        },
        method:"GET"
    })
    if(!res.ok){
        console.log("Failed to fetch amity access");
        //throw new Error("Failed to fetch amity access")
        return {
            userToken: "",
            clientKey: ""
        };
    }
    return await res.json()
}
const getProfileByUserId = async(userId:number):Promise<IMyProfile>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/profiles/${userId}`,{
        headers:{
            'Authorization':token
        }
    })  
    if(!res.ok){
        throw new Error('Failed to fetch profile');
    }
    return await res.json();
}
const getStreamToken = async():Promise<string>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/authorize/chat`,{
        headers:{
            'Authorization':token
        }
    })
    if(!res.ok){
        throw new Error('Failed to fetch stream token');
    }
    return await res.text()
}

const getProfileByChatId = async(userId:string):Promise<IMyProfile>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/chatProfile/${userId}`,{
        headers:{
            'Authorization':token
        }
    })
    if(!res.ok){
        throw new Error('Failed to fetch profile');
    }
    return await res.json();
}
const upadateProfileBio = async(bio:string):Promise<IMyProfile>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/profile/updateDetails`,{
        headers:{
            'Authorization':token,
            'Content-Type':'application/json'
        },
        method:"PUT",
        body:JSON.stringify({bio})
    })
    if(!res.ok){
        throw new Error('Failed to update profile');
    }
    return await res.json();
}

const updateProfileImage = async(image:File):Promise<IMyProfile>=>{
    const token = await AwsService.getAwsToken();
    const fileName = `${Date.now()}-${image.name}` || "profile_image";
    const res = await fetch(`${BASE_URL}/my/profile/imageUpload`,{
        headers:{
            'Authorization':token,
            'Content-Type':'text/plain'
        },
        method:"POST",
        body:fileName
    })
    if(!res.ok){
        throw new Error('Failed to upload profile image');
    }
    const dataUpload = await res.json() as IUploadResponse;

    const resUploadProfileImage = await fetch(dataUpload.uploadUrl,{
        method:"PUT",
        headers:{
            'Content-Type':image.type
        },
        body:image
    })
    if(!resUploadProfileImage.ok){
        throw new Error('Failed to upload profile image');
    }
    const resUpdateProfileImage = await fetch(`${BASE_URL}/my/profile/image`,{
        headers:{
            'Authorization':token,
            'Content-Type':'application/json'
        },
        method:"POST",
        body:JSON.stringify(dataUpload.mediaAsset.id)
    })
    if(!resUpdateProfileImage.ok){
        throw new Error('Failed to update profile image');
    }
    const data = await resUpdateProfileImage.json();
    console.log('data',data)
    return data;
}

const UserService = {
    getMyProfileAuth,
    getMyAutorizeMediaAuth,
    getAmityAccess,
    getProfileByUserId,
    getStreamToken,
    getMyProfile,
    getMyAutorizeMedia,
    getProfileByChatId,
    upadateProfileBio,
    updateProfileImage
}

export default UserService;
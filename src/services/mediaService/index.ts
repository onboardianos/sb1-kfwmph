import { BASE_URL } from "..";
import AwsService from "../awsService";

const uploadMedia = async (url:string,file:File):Promise<boolean> =>{
    const res = await fetch(url,{
        method:'PUT',
        body:file,
        headers:{
            'Content-Type':file.type
        }
    })
    if(!res.ok){
        throw new Error('Failed to fetch my plan enrollments');
    }
    return true
}

const getMyMediaAssets=async(hideTraining:boolean = true):Promise<IMediaAssetExtended[]>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/mediaAssets?hideTraining=${hideTraining}`,{
        headers:{
            'Authorization':token
        }
    })
    if(!res.ok){
        throw new Error('Failed to fetch my media assets');
    }
    let data = await res.json() as IMediaAssetExtended[];
    let filter = data.filter((asset)=>asset.visibility==='PUBLIC' && asset.mediaType==='VIDEO').sort((a,b)=>new Date(b.created).getTime()-new Date(a.created).getTime())
    return filter 

}

const MediaService = {
    uploadMedia,
    getMyMediaAssets
}
export default MediaService
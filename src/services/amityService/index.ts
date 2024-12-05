import { FileRepository, PostContentType, UserRepository } from '@amityco/ts-sdk'
import AwsService from '@services/awsService'
import { BASE_URL } from '..'

const changeAvatarUrlImage = async (userId: string, avatarUrl: string) => {
    let userInfo = await UserRepository.getUserByIds([userId])
    if (!userInfo)
        throw new Error('User not found')
    let user = userInfo.data[0]
    if (!user)
        throw new Error('User not found')
    if (user.avatarCustomUrl !== avatarUrl) {
        var updatedUser = await UserRepository.updateUser(userId!, {
            avatarCustomUrl: avatarUrl
        })
        return updatedUser
    }
    return userInfo
}
const getAmityCommunities = async (): Promise<AmityCommunities> => {
    let token = await AwsService.getAwsToken()
    let res = await fetch(`${BASE_URL}/my/social/communities`, {
        headers: {
            'Authorization': token
        }
    })
    if (!res.ok) {
        throw new Error("Failed to fetch communities")
    }
    return await res.json()
}
const getAmityCommunitiesAuth = async (token: string): Promise<AmityCommunities> => {
    const res = await fetch(`${BASE_URL}/my/social/communities`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: "GET"
    })
    if (!res.ok) {
        throw new Error("Failed to fetch communities")
    }
    return await res.json()
}
const getAmityConfig = async (): Promise<IAmityKeys> => {
    let token = await AwsService.getAwsToken()
    const res = await fetch(`${BASE_URL}/my/social/config`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: "GET"
    })
    if (!res.ok) {
        throw new Error("Failed to fetch Amity config")
    }
    return await res.json()
}
const getAmityConfigAuth = async (token: string): Promise<IAmityKeys> => {
    const res = await fetch(`${BASE_URL}/my/social/config`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: "GET"
    })
    if (!res.ok) {
        throw new Error("Failed to fetch Amity config")
    }
    return await res.json()
}

const uploadMedia = async (media: File): Promise<IUploadedMedia> => {
    const formData = new FormData()
    formData.append("files", media)
    if (media.type?.includes('image')) {
        const { data: image } = await FileRepository.uploadImage(formData)
        return { type: PostContentType.IMAGE, fileId: image[0].fileId }
    }
    if (media.type?.includes('video')) {
        const { data: video } = await FileRepository.uploadVideo(formData)
        return { type: PostContentType.VIDEO, fileId: video[0].fileId }
    }
    throw new Error("Invalid media type")

}
const uploadFile = async (media: File): Promise<IUploadedMedia> => {
    try{
    const formData = new FormData()
    formData.append("files", media)
    const { data: file } = await FileRepository.uploadFile(formData)
        return { type: PostContentType.FILE, fileId: file[0].fileId }
    } catch (error) {
        console.log(error)
        throw error
    }
}
const AmityService = {
    changeAvatarUrlImage,
    getAmityCommunities,
    getAmityConfig,
    getAmityConfigAuth,
    getAmityCommunitiesAuth,
    uploadMedia,
    uploadFile
}

export default AmityService
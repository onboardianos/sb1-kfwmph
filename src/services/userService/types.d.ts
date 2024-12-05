type IMyProfile = {
    id: number;
    employeeId: string;
    email: string;
    userName: string;
    site: {
        id: number;
        name: string;
        group: {
            id: number;
            name: string;
        };
        image: {
            id: number;
            title: string;
            created: string;
            mediaType: string;
            visibility: string;
            location: string;
        };
    };
    firstName: string;
    lastName: string;
    created: string;
    updated: string;
    title: string;
    phone: string;
    socialMediaAccounts: {
        id: number;
        accountLink: string;
        type: string;
    }[];
    subordinates: any[];
    mentees: any[];
    chatId: string;
    reviewer: boolean;
    profileImage: {
        id: number;
        title: string;
        created: string;
        mediaType: string;
        visibility: string;
        location?: string;
    };
    bio: string;
    hiredDate: string;
}

type IMyTokens = {
    expires: number;
    privateAccess: string;
    internalAccess: string;
    trainingAccess: string;
    accessToken: string
}

type IProgress = {
    id: number,
    topicId: number,
    progressStatus: IReviewableStatus
}

type IAmity = {
    clientKey: string,
    userToken: string
}
type IUploadResponse = {
    uploadUrl: string;
    mediaAsset: IBaseMediaAsset;
}


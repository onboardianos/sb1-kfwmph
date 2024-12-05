import Utilities from "@utils/utilities";
import { BASE_URL } from "..";
import AwsService from "../awsService";
import MediaService from "../mediaService";
import { TrainingService } from "../trainingService";

const createReviewableUrl = async (name: string): Promise<IMediaAsset> => {
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/reviewableVideo`, {
        headers: {
            'Authorization': token
        },
        method: 'POST',
        body: name
    })
    if (!res.ok) {
        throw new Error('Failed to fetch my plan enrollments');
    }
    return res.json();
}


const sendMediaToReview = async (progressId: number, filesUris: string[]) => {
    try {
        const token = await AwsService.getAwsToken();
        const files: File[] = [];
        for (const uri of filesUris) {
            const response = await fetch(uri);
            const blob = await response.blob();
            const mp4Blob = await Utilities.convertWebmToMp4(blob);
            const file = new File([mp4Blob], generateUniqueName(mp4Blob.type), { type: mp4Blob.type });
            files.push(file);
        }
        const reviewablesData: IMediaAsset[] = []
        for (const file of files) {
            const mediaAsset = await createReviewableUrl(file.name);
            reviewablesData.push(mediaAsset);
            await MediaService.uploadMedia(mediaAsset.uploadUrl, file);
        }
        const res = await fetch(`${BASE_URL}/my/progress/${progressId}/reviewables`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ mediaAssetIds: reviewablesData.map((r) => r.mediaAsset.id) })
        })
        if (!res.ok) {
            throw new Error('Failed to fetch my plan enrollments');
        }
        return res.json();
    } catch (e) {
        console.log(e)
        throw new Error('Failed to send media to review ' + e);
    }
}

const sendVideoResponse = async (reviewableId: number, fileUri: string, data: IFeedbackData) => {
    try {
        const token = await AwsService.getAwsToken();
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const mp4Blob = await Utilities.convertWebmToMp4(blob);
        const file = new File([mp4Blob], generateUniqueName(mp4Blob.type), { type: mp4Blob.type, endings: "transparent" });

        const mediaAsset = await createReviewableUrl(file.name);
        await MediaService.uploadMedia(mediaAsset.uploadUrl, file);
        data.feedbackVideoId = mediaAsset.mediaAsset.id;

        const res = await fetch(`${BASE_URL}/my/reviewables/${reviewableId}/feedback`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            throw new Error('Failed to send video response');
        }
        return res.json();
    } catch (e) {
        console.log(e)
        throw new Error('Failed to send video response ' + e);
    }
}

const getMyReviewablesTestSubmission = async (): Promise<IReviewable[]> => {
    const token = await AwsService.getAwsToken();
    const progressRes = await TrainingService.getMyProgress()
    const reviewables: IReviewable[] = []
    const submittedCompletedTopics = progressRes.filter(p => p.progressStatus === 'COMPLETED' || p.progressStatus === 'SUBMITTED')

    for (const progress of submittedCompletedTopics) {
        const res = await fetch(`${BASE_URL}/my/progress/${progress.id}/reviewables`, {
            headers: {
                'Authorization': token
            }
        })

        if (!res.ok) {
            throw new Error('Failed to fetch my progress reviewables');
        }
        let d = await res.json() as any[]
        reviewables.push(d[d.length - 1])
    }
    return reviewables.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

const getMyReviewablesByProgressId = async (progressId: number): Promise<IReviewable> => {
    const token = await AwsService.getAwsToken();

    const res = await fetch(`${BASE_URL}/my/progress/${progressId}/reviewables`, {
        headers: {
            'Authorization': token
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch my progress reviewables');
    }
    let json = await res.json() as IReviewable[]
    if (json.length === 0) {
        throw new Error('Failed to fetch my progress reviewables');

    }
    return json[json.length -1]
}


const getMyPendingReviewables = async (): Promise<IReviewable[]> => {
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/reviewables`, {
        headers: {
            'Authorization': token
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch my pending reviewables');
    }
    let data = await res.json() as IReviewable[]
    let filter = data.filter(
        (p) => !(p.feedback || p.feedbackVideo),
    );

    return filter.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}

const generateUniqueName = (format: string): string => {
    const type = format.split('/')[1];
    const timestamp = Date.now();
    return `${timestamp}.${type}`;
};

const sendWrittenReview = async (reviewableId: number, data: IFeedbackData): Promise<IReviewable> => {
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/reviewables/${reviewableId}/feedback`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        throw new Error('Failed to send written review');
    }
    return res.json();
}

const getReviewableAccess = async (reviewableId: number) => {
    const token = await AwsService.getAwsToken();

    let res = await fetch(`${BASE_URL}/my/reviewables/${reviewableId}/access`, {
        headers: {
            'Authorization': token
        },
        method: 'GET'
    });
    if (!res.ok) {
        throw new Error('Failed to get reviewable access');
    }
    return res.json();

};

const putUpdateProgressStatus = async (progressId: number, status: IReviewableStatus) => {
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/progress/${progressId}/status`, {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: `"${status}"`
    })

    if (!res.ok) {
        throw new Error('Failed to update progress status');
    }
    return res.json();


}




const ReviewableService = {
    createReviewableUrl,
    sendMediaToReview,
    getMyReviewablesTestSubmission,
    getMyPendingReviewables,
    sendWrittenReview,
    getMyReviewablesByProgressId,
    getReviewableAccess,
    putUpdateProgressStatus,
    sendVideoResponse,
}

export default ReviewableService;
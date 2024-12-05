type IReviewableStatus = 'NOT_STARTED' | 'STARTED' | 'SUBMITTED' | 'SUBMITTED_RETRY' | 'COMPLETED';

type IReviewable = {
    id: number;
    topicId: number;
    userId: number;
    created: string;
    updated: string;
    reviewerId: number,
    submittedVideos: IBaseMediaAsset[];
    score: number;
    feedback: string;
    feedbackVideo: IBaseMediaAsset;
    completed: boolean;
};

type IFeedbackData = {
    score:number,
    feedbackVideoId:number|null,
    feedback:string
}
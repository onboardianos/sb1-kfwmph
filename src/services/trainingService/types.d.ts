type IWordTrack = {
    id: number;
    name: string;
    text: string;
    description: string;
    audio: {
        id: number;
        location: string;
    };
};

type ITopicVideo = {
    id: number;
    location: string;
    type: string;
    name: string;
    description: string;
};

type ITestVideo = {
    id: number;
    location: string;
    type: string;
    name: string;
    description: string;
}

type ITopics = {
    id: number;
    title: string;
    description: string;
    wordTracks: IWordTrack[];
    topicVideo: ITopicVideo;
    testVideos: ITestVideo[];
    displayImage: {
        location: string;
    }
    takeAways:{
        id: number;
        details: string;
    }[];
    status:IProgress
};

type ISubject = {
    id: number;
    name: string;
    description: string;
    topics: ITopics[];
    displayImage: {
        location: string;
    }
};

type ILearningPlan = {
    id: number;
    title: string;
    description: string;
    subjects: ISubject[];
};

type IPlanEnrollment = {
    id: number,
    learningPlan: ILearningPlan,
    closed: boolean,
};

type IGreatingInstruction = {
    id:0,
    instructions:string
}


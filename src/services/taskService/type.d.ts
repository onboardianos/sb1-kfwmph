type Task = {
    id: number;
    completed: boolean;
    userId: number;
    created: string;
    updated: string;
    task: TaskDetails;
    groupTaskGroupAssignmentId: number;
    dueDate: string;
};

type TaskDetails = {
    id: number;
    taskArea: string;
    title: string;
    description: string;
    documentId: number;
    weblink: string;
    audio: AudioDetails;
    video: VideoDetails;
    image: ImageDetails;
    ownerEntityId: number;
    taskType: string;
    daysToComplete: number;
    completionType: "ACCEPT"|"CONFIRM"|"COMPLETE";
    instructions: string;
};

type AudioDetails = {
    id: number;
    title: string;
    created: string;
    mediaType: string;
    visibility: string;
    location: string;
    userId: number;
    verified: boolean;
};

type VideoDetails = {
    id: number;
    title: string;
    created: string;
    mediaType: string;
    visibility: string;
    location: string;
    userId: number;
    verified: boolean;
};

type ImageDetails = {
    id: number;
    title: string;
    created: string;
    mediaType: string;
    visibility: string;
    location: string;
    userId: number;
    verified: boolean;
};

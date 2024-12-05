import { BASE_URL } from ".."
import AwsService from "../awsService";

const getMyPlanEnrollment = async ():Promise<IPlanEnrollment>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/planEnrollment`,{
        headers:{
            'Authorization':token
        }
    })    
    if(!res.ok){
        throw new Error('Failed to fetch my plan enrollments');
    }
    const progress = await getMyProgress();
    const plan:IPlanEnrollment = await res.json();

    plan.learningPlan.subjects.forEach(subject=>{
        subject.topics.forEach(topic=>{
            if(progress.find(p=>p.topicId === topic.id)){
            topic.status = progress.find(p=>p.topicId === topic.id)!;
            }else{
                throw new Error('Failed to fetch my progress');
            }
        })
    })

    return plan
}

const getMyProgress = async ():Promise<IProgress[]>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/progress`,{
        headers:{
            'Authorization':token
        }
    })
    if(!res.ok){
        throw new Error('Failed to fetch my progress');
    }
    return res.json();
}

const getGreatingInstructionsByTopicId = async (topicId:number):Promise<IGreatingInstruction>=>{
    const token = await AwsService.getAwsToken();
    const res = await fetch(`${BASE_URL}/my/topics/${topicId}/gradingInstruction`,{
        headers:{
            'Authorization':token
        }
    })    
    if(!res.ok){
        throw new Error('Failed to fetch getGreatingInstructionsByTopicId');
    }
    
    return res.json();
}

export const TrainingService = {
    getMyPlanEnrollment,
    getMyProgress,
    getGreatingInstructionsByTopicId
}
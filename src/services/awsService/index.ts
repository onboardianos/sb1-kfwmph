import { fetchAuthSession } from 'aws-amplify/auth';

const getAwsToken = async (): Promise<string> => {
  const { accessToken } = (await fetchAuthSession({forceRefresh:true})).tokens ?? {};
  return accessToken?.toString() ? `Bearer ${accessToken?.toString()}` : '';
}


const AwsService = {
  getAwsToken
}

export default AwsService;
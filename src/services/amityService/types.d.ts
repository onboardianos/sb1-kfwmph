type GroupCommunity = {
  id: number;
  amityId: string;
  communityId: string;
  displayName: string;
  channelId: string;
  path: string;
};

type AmitySiteCommunity = {
  id: number;
  siteId: number;
  amityId: string;
  communityId: string;
  displayName: string;
  channelId: string;
  path: string;
};

type AmityCommunities = {
  groupCommunity: GroupCommunity;
  amitySiteCommunities: AmitySiteCommunity[];
};

interface IAmityKeys {
    clientKey: string
    userToken: string
}
interface IUploadedMedia {
  type: PostContentType,
  fileId: string
}
type IAmityImageSize = 'small' | 'medium' | 'large' | 'full'

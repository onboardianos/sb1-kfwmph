type IBaseMediaAsset = {
    id: number;
    title: string;
    created: string;
    mediaType: "IMAGE" | "VIDEO" | "AUDIO";
    visibility: "PUBLIC" | "PRIVATE" | "INTERNAL";
    location: string;
}
type IMediaAsset = {
    uploadUrl: string;
    mediaAsset: IBaseMediaAsset
};

type IMediaAssetExtended = IBaseMediaAsset & { verified: boolean; };
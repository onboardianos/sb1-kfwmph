import { useSession } from "@context/SessionContext"
import { Icon } from "@iconify/react"
import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Slider, Stack, Typography } from "@mui/material"
import { MEDIA_URL } from "@services/index"
import UserService from "@services/userService"
import { useMutation } from "@tanstack/react-query"
import Utilities from "@utils/utilities"
import { useSnackbar } from "notistack"
import { useRef, useState } from "react"
import Cropper, { Area } from 'react-easy-crop'

type IProfileImageEditor = {
    profile: IMyProfile,
    onClose: () => void,
    open: boolean,
    onSuccess: () => void
}

const ProfileImageFragment = ({ profile, image, setImage, onChangeComponent }: { profile: IMyProfile, image: File | null, setImage: (image: File | null) => void, onChangeComponent: (component: "info" | "edit") => void }) => {
    const session = useSession()
    const fileInputRef = useRef<HTMLInputElement>(null)
    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
            <Avatar src={image ? URL.createObjectURL(image) : `${MEDIA_URL}/${profile?.profileImage.location}?${session.data.user?.tokens.internalAccess}`} sx={{ width: 256, height: 256 }} />
            <Stack flexDirection={'row'} gap={2} color={'white'}>
                <Button
                    startIcon={<Icon icon="lucide:crop" />}
                    onClick={() => onChangeComponent("edit")}
                    variant="contained" color="inherit" sx={{ borderRadius: 2 }} >
                    Edit
                </Button>
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<Icon icon="icon-park-outline:add-picture" />}
                    variant="contained" color="inherit" sx={{ borderRadius: 2 }} >
                    Add
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
            </Stack>
        </Box>
    )
}

const ProfileImageEditFragment = ({ src, onChangeComponent, onSave }: { src: string, onChangeComponent: (component: "info" | "edit") => void, onSave: (image: File) => void }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (croppedAreaPixels) {
                const croppedImage = await Utilities.getCroppedImg(src, croppedAreaPixels,);
                onSave(croppedImage);
                onChangeComponent("info")
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Stack justifyContent={'center'} alignItems={'center'} gap={2}>
            <Stack ref={containerRef} position={'relative'} justifyContent={'center'} alignItems={'center'} width={400} height={400} borderRadius={100} overflow={'hidden'}>
                <Cropper
                    image={src}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropSize={{ width: 350, height: 350 }}
                    onCropChange={setCrop}
                    onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                    onZoomChange={setZoom}
                    cropShape="round"
                    showGrid={false}
                />
            </Stack>
            <Stack width={'100%'}>
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(_, zoom) => setZoom(zoom as number)}
                />
            </Stack>
            <Stack flexDirection={'row'} gap={2} mt={2}>
                <Button variant="contained" color="secondary"
                    onClick={() => onChangeComponent("info")}
                >
                    Cancel
                </Button>
                <Button variant="contained" color="primary"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    Save
                </Button>
            </Stack>
        </Stack >
    )
}

const ProfileImageEditor = ({ profile, onClose, open, onSuccess }: IProfileImageEditor) => {
    const [component, setComponent] = useState<"info" | "edit">("info")
    const [image, setImage] = useState<File | null>(null)
    const session = useSession()
    const [loading, setLoading] = useState(false)
    const snackbar = useSnackbar()

    const { mutate: updateProfile } = useMutation({
        mutationFn: () => UserService.updateProfileImage(image!),
        onSuccess: (data) => {
            onClose()
            onSuccess()
            session.updateProfile(data)
            snackbar.enqueueSnackbar("Profile image updated", { variant: "success", autoHideDuration: 1000 })
        },
        onError: () => {
            snackbar.enqueueSnackbar("Failed to update profile image", { variant: "error" })
        },
        onSettled: () => {
            setLoading(false)
        }
    })
    const handleUpdateProfile = () => {
        setLoading(true)
        if (image) {
            updateProfile()
        }
    }
    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle >
                <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                        <IconButton onClick={onClose}>
                            <Icon icon="eva:arrow-back-fill" />
                        </IconButton>
                        <Typography fontWeight={600}>Edit Profile Picture</Typography>
                    </Stack>
                    {component === "info" && (
                        <Button
                            disabled={loading || !image}
                            variant="contained" color="primary" sx={{ borderRadius: 2 }}
                            onClick={handleUpdateProfile}
                            startIcon={loading && <CircularProgress size={20} />}
                        >
                            Save
                        </Button>
                    )}
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                {component === "info" && <ProfileImageFragment profile={profile} image={image} setImage={setImage} onChangeComponent={setComponent} />}
                {component === "edit" && <ProfileImageEditFragment
                    src={image ? URL.createObjectURL(image) : `${MEDIA_URL}/${profile?.profileImage.location}?${session.data.user?.tokens.internalAccess}`}
                    onChangeComponent={setComponent}
                    onSave={setImage}
                />}
            </DialogContent>
        </Dialog>
    )
}
export default ProfileImageEditor
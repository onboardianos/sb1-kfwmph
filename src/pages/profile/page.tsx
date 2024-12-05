import { useSession } from "@context/SessionContext"
import { Icon } from '@iconify/react'
import { Avatar, Badge, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material"
import { MEDIA_URL } from "@services/index"
import UserService from "@services/userService"
import { useMutation, useQuery } from "@tanstack/react-query"
import moment from "moment"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ActionButton from "./component/ActionButton"
import ProfileImageEditor from "./component/ProfileImageEditor"
const page = () => {
    const location = useLocation()
    const session = useSession()
    const queryParams = new URLSearchParams(location.search)
    const userId: string | null = queryParams.get('userId')
    const chatId: string | null = queryParams.get('chatId')
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [bioLoading, setBioLoading] = useState(false)
    const onClose = () => setOpen(false)
    const [openImageEditor, setOpenImageEditor] = useState(false)
    const onCloseImageEditor = () => setOpenImageEditor(false)
    const snackbar = useSnackbar()
    const isMyProfile = userId === `${session.data.user?.profile?.id}` || chatId === `${session.data.user?.profile?.chatId}` || (!userId && !chatId)
    const {
        data: profile,
        isLoading: profileLoading,
        refetch: refetchProfile
    } = useQuery({
        queryKey: ['profile', userId, chatId],
        queryFn: () => {
            if (userId) {
                return UserService.getProfileByUserId(parseInt(userId))
            }
            if (chatId) {
                return UserService.getProfileByChatId(chatId)
            }
            return UserService.getMyProfile()
        }
    })
    const { mutate: updateBio } = useMutation({
        mutationFn: () => {
            setBioLoading(true)
            return UserService.upadateProfileBio(text)
        },
        onSuccess: () => {
            snackbar.enqueueSnackbar('Bio updated successfully', { variant: 'success' })
            refetchProfile()
            setOpen(false)
        },
        onError: (error) => {
            snackbar.enqueueSnackbar(error.message, { variant: 'error' })
        },
        onSettled: () => {
            setBioLoading(false)
        }
    })
    useEffect(() => {
        if (profile) {
            setText(profile.bio)
        }
    }, [profile])

    const handleEmailButton = async () => {
        try {
            window.location.href = `mailto:${profile?.email}`
        } catch (error) {
            snackbar.enqueueSnackbar(JSON.stringify(error), { variant: 'error' })
        }
    }
    const handleCallButton = () => {
        window.location.href = `tel:${profile?.phone}`
    }
    return (
        <Stack gap={2}>
            <Paper variant='flat' sx={{ background: "#EFF2F5", borderRadius: 4, padding: 3, flex: 1 }}>
                <Stack gap={2}>
                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                        <Stack flexDirection={'row'} gap={2} alignItems={'center'}>
                            <Badge
                                onClick={() => setOpenImageEditor(true)}
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Icon icon="fluent:edit-48-filled" />
                                }
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        width: 28,
                                        height: 28,
                                        borderRadius: '100%',
                                        display: isMyProfile ? 'block' : 'none'
                                    },

                                }}
                            >
                                <Avatar
                                    src={`${MEDIA_URL}/${profile?.profileImage.location}?${session.data.user?.tokens.internalAccess}`} sx={{ width: 72, height: 72, bgcolor: '#FFFFFF', cursor: 'pointer' }} />
                            </Badge>
                            {profileLoading ? (
                                <>
                                    <Skeleton variant="text" width={300} height={72} />
                                    <Skeleton variant="text" width={150} height={72} />
                                </>
                            ) : (
                                <Stack>
                                    <Typography fontWeight={700} variant='h6'>{`${profile?.firstName} ${profile?.lastName}`}</Typography>
                                    <Typography fontWeight={300} fontSize={12} color={'grey.300'}>{profile?.title}</Typography>
                                </Stack>
                            )}
                        </Stack>
                        {profileLoading ? (
                            <>
                                <Skeleton variant="text" width={300} height={72} />
                                <Skeleton variant="text" width={150} height={72} />
                            </>
                        ) : (
                            <Stack>
                                <Typography fontWeight={700} variant='h6'>Employee Since</Typography>
                                <Typography fontWeight={300} fontSize={12} color={'grey.300'}>
                                    {moment(profile?.hiredDate).format('Do MMMM YYYY')}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                    <Divider />
                    <Stack>
                        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography fontWeight={600}>
                                About me
                            </Typography>
                            {isMyProfile && (
                                <IconButton onClick={() => setOpen(true)}>
                                    <Icon icon="fluent:edit-48-filled" />
                                </IconButton>
                            )}
                        </Stack>
                        {profileLoading ? (
                            <>
                                <Skeleton variant="text" width={'100%'} height={70} />
                                <Skeleton variant="text" width={'100%'} height={70} />
                            </>
                        ) : (
                            <Typography fontWeight={200} color={'text.secondary'}>
                                {profile && profile!.bio.length > 0 ? profile?.bio : 'No bio yet'}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </Paper>
            {profileLoading ? (
                <Stack flexDirection={'row'} gap={2}>
                    <Skeleton width={'100%'} height={150} />
                    <Skeleton width={'100%'} height={150} />
                    <Skeleton width={'100%'} height={150} />
                </Stack>
            ) : (
                <Stack flexDirection={'row'} gap={2}>
                    <ActionButton icon={<Icon icon="mage:email-fill" />} label="Email" value={profile?.email} onClick={handleEmailButton} buttonLabel="Send Email" />
                    <ActionButton icon={<Icon icon="line-md:phone-filled" />} label="Mobile" value={profile?.phone} onClick={handleCallButton} buttonLabel="Call" />
                    <ActionButton icon={<Icon icon="tabler:location-filled" />} label="Location" value={profile?.site.name} buttonLabel="Directions" />
                </Stack>
            )}

            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{ borderRadius: 4 }} PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={onClose}>
                        <Icon icon="eva:arrow-back-fill" />
                    </IconButton>
                    <Typography fontWeight={600}>Edit profile</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography fontWeight={600} sx={{ mt: 4 }}>Add Bio</Typography>
                    <TextField
                        multiline
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={6}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end">
                        <Typography variant="body2" color="textSecondary">
                            {text.length}/3000
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: 4, py: 2 }}>
                    <Button onClick={onClose} variant="contained" color="error" sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button onClick={() => updateBio()} variant="contained" color="primary" sx={{ borderRadius: 2 }}
                        disabled={bioLoading}
                        startIcon={bioLoading ? <CircularProgress size={20} /> : null}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {profile && <ProfileImageEditor profile={profile} open={openImageEditor} onClose={onCloseImageEditor} onSuccess={refetchProfile} />}
        </Stack>
    )
}
export default page
import { useAppData } from '@context/AppData'
import { ArrowBack } from '@mui/icons-material'
import { Chip, Divider, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export type ITabPaper = {
    title: string,
    subtitle?: string,
    content: {
        title: string,
        content: React.ReactNode,
        onClick?: () => void
    }[],
    initialTab: number,
    theme: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    rightComponent?: React.ReactNode,
    secondComponent?: React.ReactNode,
    showTabs?: boolean,
    backButton?: boolean
}

const TabPaper = (props: ITabPaper) => {
    const [tab, setTab] = React.useState(props.initialTab)
    const navigate = useNavigate()
    const {path} = useAppData()

    const handleGoBack = () => {
        if (path.route.length > 1) {
            // Navega al penúltimo elemento en el array 'path'
            path.pop()
        } else {
            // Si no hay un 'path' anterior, puedes navegar a una ruta por defecto
            navigate("/");
        }
    }

    const handleOnClickChip = useCallback((index: number,callback?:()=>void) => {
        setTab(index)
        callback && callback()
    },[])
    return (
        <Stack gap={4} flex={1} >
            <Stack flexDirection={"row"} gap={2}>
                <Paper variant='flat' sx={{ background: "#EFF2F5", borderRadius: props.subtitle ? 4 : 16, padding: 3, flex: 1 }}>
                    <Stack gap={2} flex={1}>
                        {props.subtitle && (
                            <Typography variant='body1' letterSpacing={1.1} fontWeight={700}>
                                {props.subtitle}
                            </Typography>
                        )}
                        <Stack flexDirection={"row"} pb={2} justifyContent={"space-between"} alignItems={"center"} px={1}>
                            {props.backButton && (
                                <IconButton onClick={handleGoBack}>
                                    <ArrowBack />
                                </IconButton>
                            )}
                            {props.showTabs && (
                                <Stack flexDirection={"row"} gap={1} flex={1}>
                                    {props.content.map((item, index) => (
                                        <Chip variant={tab === index ? "filled" : "outlined"} key={index} label={item.title} onClick={() =>handleOnClickChip(index,item.onClick)}
                                            color={props.theme}
                                        />
                                    ))}
                                </Stack>
                            )}

                            {
                                <Stack justifySelf={"flex-end"}>
                                    {props.rightComponent}
                                </Stack>
                            }
                        </Stack>
                    </Stack>

                    <Divider />
                    <Stack gap={2} mt={2}>
                        {props.content[tab].content}
                    </Stack>
                </Paper>
                {props.secondComponent}
            </Stack>
        </Stack>
    )
}
export default memo(TabPaper)
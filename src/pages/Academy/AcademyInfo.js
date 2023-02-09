import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowRight from '@mui/icons-material/ArrowRight';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Settings from '@mui/icons-material/Settings';
import People from '@mui/icons-material/People';

import { Link as RouterLink } from 'react-router-dom';

const FireNav = styled(List)({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});

export default function AcademyInfo({ academy }) {
    function ChildList() {
        // if (!academy.length) return
        const keys = Object.keys(academy) // ['address', 'admins[]', 'bankAccount', 'id',name, registDT, tel]
        const childList = []

        for (let i = 0; i < keys.length; i += 6) {
            const key = keys[i] // 각각의 키
            const value = academy[key] // 각각의 키에 해당하는 각각의 값
            childList.push({ key: value, label: value })
        }
        const list =
            <>
                <ListItemButton
                    key={'address'}
                    sx={{ py: 0, minHeight: 32, color: '' }}
                >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                        <BusinessIcon />

                        {'주소'}
                    </ListItemIcon>
                    <ListItemText
                        primary={academy.address}
                        primaryTypographyProps={{ fontSize: 21, fontWeight: 'medium' }}
                    />
                </ListItemButton>
                <ListItemButton
                    key={'tel'}
                    sx={{ py: 0, minHeight: 32, color: '' }}
                >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                        <LocalPhoneIcon />

                        <People />
                        {'전화  '}
                    </ListItemIcon>
                    <ListItemText
                        primary={academy.tel}
                        primaryTypographyProps={{ fontSize: 21, fontWeight: 'medium' }}
                    />
                </ListItemButton>
                <ListItemButton
                    key={'계좌'}
                    sx={{ py: 0, minHeight: 32, color: '' }}
                >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                        <AccountBalanceWalletIcon />

                        {'계좌  '}
                    </ListItemIcon>
                    <ListItemText
                        primary={academy.bankAccount}
                        primaryTypographyProps={{ fontSize: 21, fontWeight: 'medium' }}
                    />
                </ListItemButton>
                {academy.admins?.map((item, index) => (
                    <ListItemButton
                        key={item}
                        sx={{ py: 0, minHeight: 32, color: '' }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>
                            <People />
                            {`관리자_ ${index + 1}`}
                        </ListItemIcon>
                        <ListItemText
                            primary={item}
                            primaryTypographyProps={{ fontSize: 21, fontWeight: 'medium' }}
                        />
                    </ListItemButton>
                ))}


            </>
        return list
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <ThemeProvider
                theme={createTheme({
                    components: {
                        MuiListItemButton: {
                            defaultProps: {
                                disableTouchRipple: true,
                            },
                        },
                    },
                    palette: {
                        // mode: 'dark',
                        // primary: { main: 'rgb(102, 157, 246)' },
                        // background: { paper: 'rgb(5, 30, 52)' },
                    },
                })}
            >
                <Paper elevation={0} sx={{ width: '100%', height: '100%' }}>
                    <FireNav component="nav" disablePadding>
                        <ListItemButton component="a" href="#customized-list" sx={{ gap: 2 }}>
                            {/* <ListItemIcon sx={{ fontSize: 30 }}>🔥</ListItemIcon> */}
                            <ProfileImgWrap>
                                <img src={`${academy?.image !== '' ? academy.image : '/static/mock-images/avatars/avatar_default.jpg'}`} alt="academy img" />
                            </ProfileImgWrap>
                            <ListItemText
                                sx={{ my: 0 }}
                                primary={academy?.name}
                                primaryTypographyProps={{
                                    fontSize: 30,
                                    fontWeight: 'medium',
                                    letterSpacing: 0,
                                }}
                            />

                        </ListItemButton>
                        <Divider />
                        <ListItem component="div" disablePadding>
                            <ListItemButton sx={{ height: 56 }}
                            >
                                <ListItemText
                                    primary="학원정보 수정하기"
                                    primaryTypographyProps={{
                                        color: 'primary',
                                        fontWeight: 'medium',
                                        variant: 'body2',
                                    }}
                                />
                            </ListItemButton>
                            <Tooltip title="학원 정보 수정">
                                <IconButton
                                    component={RouterLink} to="add"
                                    size="large"
                                    sx={{
                                        '& svg': {
                                            // color: 'rgba(255,255,255,0.8)',
                                            transition: '0.2s',
                                            transform: 'translateX(0) rotate(0)',
                                        },
                                        '&:hover, &:focus': {
                                            bgcolor: 'unset',
                                            '& svg:first-of-type': {
                                                transform: 'translateX(-4px) rotate(-20deg)',
                                            },
                                            '& svg:last-of-type': {
                                                right: 0,
                                                opacity: 1,
                                            },
                                        },
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            height: '80%',
                                            display: 'block',
                                            left: 0,
                                            width: '1px',
                                            bgcolor: 'divider',
                                        },
                                    }}
                                >
                                    <Settings />
                                    <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                        <Divider />
                        <Box
                            sx={{
                                // bgcolor:'rgba(71, 98, 130, 0.2)',
                                pb:  2
                            }}
                        >
                            <ChildList />
                        </Box>
                    </FireNav>
                </Paper>
            </ThemeProvider>
        </Box>
    );
}


const ProfileImgWrap = styled('div')`
  display: flex;
  justify-content: center;
  overflow: hidden;
  
  & > img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    /* width: 100%; */
  }
`
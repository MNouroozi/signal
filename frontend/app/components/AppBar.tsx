import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Button,
    Switch,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// تایپ event برای TypeScript
const ResponsiveAppBar = () => {
    const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr'); // جهت زبان
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light'); // حالت تم

    // تغییر زبان
    const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setAnchorElLang(event.currentTarget);
    };

    const handleCloseLangMenu = (lang: string) => {
        setDirection(lang === 'فارسی' ? 'rtl' : 'ltr'); // تغییر جهت صفحه بر اساس زبان
        setAnchorElLang(null);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // تغییر تم
    const handleThemeToggle = () => {
        setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // تنظیم تم
    const theme = createTheme({
        direction: direction, // تنظیم جهت
        palette: {
            mode: themeMode, // تغییر حالت تم
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#e0e0e0',
            },
            background: {
                default: '#f4f6f8',
                paper: '#ffffff',
            },
            text: {
                primary: '#333333',
                secondary: '#555555',
            },
            action: {
                hover: 'rgba(25, 118, 210, 0.08)', // رنگ hover برای دکمه‌ها
                selected: 'rgba(25, 118, 210, 0.16)', // رنگ selected برای دکمه‌ها
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '4px',
                        textTransform: 'none',
                        padding: '6px 16px',
                        backgroundColor: '#1976d2', // پس‌زمینه رنگی برای دکمه‌ها
                        color: '#fff', // رنگ متن سفید
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // سایه ملایم برای دکمه‌ها
                        '&:hover': {
                            backgroundColor: '#1565c0', // تغییر رنگ در hover
                            color: '#fff', // رنگ متن در hover
                        },
                        '&:active': {
                            backgroundColor: '#0d47a1', // رنگ فعال دکمه
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        color: '#1976d2', // رنگ ایکون‌ها
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)', // رنگ hover برای ایکون‌ها
                        },
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar
                position="sticky"
                sx={{
                    background: 'linear-gradient(90deg, #e0e0e0, #ffffff)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1300,
                    minHeight: 56,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                    {/* لوگو یا عنوان */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            color: '#333',
                            cursor: 'pointer',
                        }}
                    >
                        MyApp
                    </Typography>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* انتخاب زبان */}
                        <IconButton
                            size="large"
                            aria-controls="language-menu"
                            aria-haspopup="true"
                            onClick={handleOpenLangMenu}
                            color="inherit"
                        >
                            <LanguageIcon />
                        </IconButton>
                        <Menu
                            id="language-menu"
                            anchorEl={anchorElLang}
                            keepMounted
                            open={Boolean(anchorElLang)}
                            onClose={() => setAnchorElLang(null)}
                        >
                            <MenuItem onClick={() => handleCloseLangMenu('English')}>English</MenuItem>
                            <MenuItem onClick={() => handleCloseLangMenu('فارسی')}>فارسی</MenuItem>
                            <MenuItem onClick={() => handleCloseLangMenu('Español')}>Español</MenuItem>
                        </Menu>

                        {/* دکمه تغییر تم */}
                        <IconButton
                            size="large"
                            onClick={handleThemeToggle}
                            color="inherit"
                        >
                            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                        </IconButton>

                        {/* دکمه ورود/ثبت نام */}
                        <IconButton
                            size="large"
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={handleOpenUserMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="user-menu"
                            anchorEl={anchorElUser}
                            keepMounted
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>Login</MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>Register</MenuItem>
                        </Menu>

                        {/* دکمه‌های اضافی */}
                        <Button variant="contained" color="primary" sx={{ ml: 2 }}>
                            Call to Action
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default ResponsiveAppBar;

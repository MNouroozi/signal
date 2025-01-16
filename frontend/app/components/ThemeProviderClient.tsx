"use client";
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Button, Select, MenuItem, SelectChangeEvent, Typography, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem as DropdownMenuItem } from "@mui/material";
import { Brightness4, Brightness7, AccountCircle } from "@mui/icons-material";

const ThemeProviderClient = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [user] = useState({ name: "John Doe", avatar: "/path/to/avatar.jpg" }); // نمونه اطلاعات کاربر

    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    const handleLanguageChange = (event: SelectChangeEvent<"ltr" | "rtl">) => {
        setDirection(event.target.value as "ltr" | "rtl");
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
        direction,
    });

    useEffect(() => {
        const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(userPrefersDark);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div dir={direction}>
                <AppBar position="static">
                    <Toolbar
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Signal
                        </Typography>

                        <Button
                            onClick={toggleDarkMode}
                            startIcon={darkMode ? <Brightness7 /> : <Brightness4 />}
                            variant="outlined"
                        >
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </Button>

                        <Select
                            value={direction}
                            onChange={handleLanguageChange}
                            style={{ marginLeft: "1rem" }}
                        >
                            <MenuItem value="ltr">English</MenuItem>
                            <MenuItem value="rtl">فارسی</MenuItem>
                        </Select>

                    </Toolbar>
                </AppBar>
                {children}
            </div>
        </ThemeProvider>
    );
};

export default ThemeProviderClient;

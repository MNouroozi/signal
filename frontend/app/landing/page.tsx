'use client';

import React from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import { FaRegHandshake, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';

const LandingPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                backgroundImage: 'url(/output.gif)',  // مسیر تصویر پس‌زمینه
                backgroundSize: '100% 100%', // استرچ کردن تصویر
                backgroundPosition: 'center',
                flexDirection: 'column',
                p: 2,
            }}
        >
            {/* Welcome Text */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    mb: 4,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                }}
            >
                Welcome to MyApp
            </Typography>
            <Typography
                variant="h5"
                sx={{
                    color: 'white',
                    textAlign: 'center',
                    mb: 6,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                }}
            >
                A beautiful and easy-to-use application to get things done.
            </Typography>

            {/* Action Button */}
            <Link href="/signin">
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1rem',
                        p: 2,
                        bgcolor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                    }}
                >
                    <FaSignInAlt style={{ marginRight: 8 }} />
                    Login
                </Button>
            </Link>
        </Box>
    );
};

export default LandingPage;

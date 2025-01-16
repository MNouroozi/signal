"use client"; // app/landing/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSignInAlt } from 'react-icons/fa';
import { Box, Button, Paper, TextField, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('http://localhost:4000/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            console.log('User signed up successfully');
            router.push('/dashboard/users');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left Side Image */}
            <Box
                sx={{
                    flex: 1,
                    backgroundImage: 'url(./01.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: { xs: 'none', md: 'block' },
                }}
            />

            {/* Right Side Sign Up Form */}
            <Box
                component={Paper}
                elevation={6}
                square
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        Create Your Account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                            startIcon={<FaSignInAlt />}
                        >
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link href="/signin" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                    Log In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SignUpPage;

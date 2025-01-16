"use client"; // app/landing/page.tsx
import React, { useState } from "react";
import Link from "next/link";
import {
    Button,
    TextField,
    Typography,
    Box,
    Paper,
    Alert,
    CircularProgress,
} from "@mui/material";
import { FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        setError(null);
        setLoading(true);

        // Simulate login process
        setTimeout(() => {
            console.log("Logging in with:", email, password);
            setLoading(false);
        }, 2000);
    };

    return (
        <Box sx={{
            display: "flex", height: "100vh", flex: 1,
            backgroundImage: 'url(/01.png)',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.8,
        }}>
            <Paper
                elevation={6}
                sx={{
                    width: { xs: "100%", sm: "60%", md: "40%" },
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 4,
                }}
            >
                <Typography component="h1" variant="h5">
                    Login to Signal Dashboard
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    noValidate
                    onSubmit={handleLogin}
                    sx={{ mt: 1, width: "100%" }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FaSignInAlt />}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </Button>

                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;

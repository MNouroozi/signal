import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

// Define the expected response structure
interface ErrorResponse {
  message: string;
}

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState(''); // Added username state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar('I love snacks.');
  };

  const handleClickVariant = (variant: VariantType) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('This is a success message!', { variant });
  };

  const handleSignUp = async () => {
    if (!name) {
      setErrorMessage('Username is required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/signup', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        router.push('/login');
      } else {
        setErrorMessage('Failed to sign up. Please try again.');
      }
    } catch (error) {
      const axiosError = error as AxiosError; // Type the error as AxiosError

      // Check if there's a response and a message
      const errorResponse = axiosError.response?.data as ErrorResponse;
      const errorMessage = errorResponse?.message || 'Something went wrong. Please try again.';
      setErrorMessage(errorMessage);
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} height="100vh">
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: 4,
            py: 6,
            backgroundColor: 'white',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Sign Up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Username"
                name="name"
                autoComplete="username"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {errorMessage && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {errorMessage}
                </Typography>
              )}

              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignUp}
              >
                Sign Up
              </Button>

              <Box display="flex" justifyContent="center">
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </SnackbarProvider>
  );
}

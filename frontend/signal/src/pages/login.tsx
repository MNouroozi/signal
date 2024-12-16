import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:4000/api/v1/login', { email, password });
      
      if (response.status === 200) {
        const token = response.data.token; 
        sessionStorage.setItem('token', token);

        router.push('/dashboard');
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      // Handle unexpected errors
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} height="100vh">
      {/* Left background image (optional, uncomment to use) */}
      {/* <Box
        sx={{
          flex: 1,
          backgroundImage: 'url(/login-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', sm: 'block' },
        }}
      /> */}

      {/* Login form */}
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
            Login
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
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
              onClick={handleLogin}
            >
              Login
            </Button>
            <Box display="flex" justifyContent="space-between">
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
  
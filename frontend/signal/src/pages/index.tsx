import * as React from 'react';
import { Button, Typography, Container, AppBar, Toolbar, Box } from '@mui/material';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', position: 'relative' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#333' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome to signal application
          </Typography>
          <Button color="inherit"  onClick={handleLogin}>
            Login
          </Button>
          <Button color="inherit" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container
        maxWidth="sm"
        sx={{
          mt: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <Typography variant="h6" component="animate" gutterBottom color="black">
          Welcome to signal application
        </Typography>
      </Container>
    </Box>
  );
}

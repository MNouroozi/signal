import * as React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 3,
        py: 2,
        bgcolor: 'background.paper',
        position: 'fixed',
        width: '100%',
        bottom: 0,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 Signal dashboard. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

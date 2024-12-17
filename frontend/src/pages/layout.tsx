import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
 
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box display="flex">
      <Box flex={1} p={3}>
        {children}
      </Box>
    </Box>
  );
}

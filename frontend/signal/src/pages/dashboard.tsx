import * as React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Footer from '../components/Footer';
import UsersTable from '../components/Users'; // Import the UsersTable component
import { useState } from 'react';
import ChatAudio from '@/components/ChatAudio';
import AudioList from '@/components/AudioList';
const drawerWidth = 240;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const isMobile = useMediaQuery('(max-width:600px)'); // Detects if the screen width is 600px or less

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    if (isMobile) setMobileOpen(false); // Close drawer on mobile after selecting item
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'UserManagement':
        return ( 
          <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'normal' 
          }}
        >
        <UsersTable />
        </Box>
        )
        
      case 'ChatAudio':
        return( 
          <Box 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <ChatAudio/>
        </Box>
        )
        
      case 'AudioList':
        return (
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <AudioList/>
          </Box>
        );
      case 'Form3':
        return (
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <Typography variant="h4">Form 3 Page</Typography>
          </Box>
        );
      default:
        return (
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}
          >
            <Typography variant="h4">Welcome to signal dashboard</Typography>
          </Box>
        );
    }
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Typography variant="h6" sx={{ p: 2 }}>
        Menu
      </Typography>
      <List>
        {['UserManagement', 'ChatAudio', 'AudioList', 'Form3','Logout'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleItemClick(text)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      
      {/* AppBar for top navigation */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Signal dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ display: 'flex', flex: 1, mt: 8 }}> 
        {/* Sidebar Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {renderContent()}
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

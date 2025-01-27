import DashboardIcon from '@mui/icons-material/Dashboard';
import InterpreterModeSharpIcon from '@mui/icons-material/InterpreterModeSharp';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { Navigation } from '@toolpad/core/AppProvider';

export const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'Device management',
        title: 'Device Management',
        icon: <DashboardIcon />,
    },
    {
        segment: 'user management',
        title: 'User Management',
        icon: <InterpreterModeSharpIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'sales',
                title: 'Sales',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'traffic',
                title: 'Traffic',
                icon: <DescriptionIcon />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
];
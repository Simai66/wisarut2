import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useTheme,
    useMediaQuery,
    Avatar,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    DarkMode,
    LightMode,
    Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import { NAV_ITEMS, ROUTES } from '@/config/routes';

/**
 * Main navigation bar component
 */
export const Navbar = () => {
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { user, isAuthenticated, isAdmin, signIn, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useUIStore();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleMenuClose();
        await logout();
    };

    const isActive = (path: string) => location.pathname === path;

    const navLinks = (
        <>
            {NAV_ITEMS.map((item) => (
                <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                        color: 'text.primary',
                        position: 'relative',
                        mx: 1,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 6,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isActive(item.path) ? '60%' : '0%',
                            height: '2px',
                            backgroundColor: 'primary.main',
                            transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                            width: '60%',
                        },
                    }}
                >
                    {item.label}
                </Button>
            ))}
            {isAdmin && (
                <Button
                    component={RouterLink}
                    to={ROUTES.ADMIN}
                    sx={{
                        color: 'text.primary',
                        mx: 1,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 6,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isActive(ROUTES.ADMIN) ? '60%' : '0%',
                            height: '2px',
                            backgroundColor: 'primary.main',
                            transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                            width: '60%',
                        },
                    }}
                >
                    Admin
                </Button>
            )}
        </>
    );

    const mobileDrawer = (
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 320,
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                    <Close />
                </IconButton>
            </Box>
            <List>
                {NAV_ITEMS.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={() => setDrawerOpen(false)}
                            selected={isActive(item.path)}
                        >
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    variant: 'h6',
                                    sx: { fontWeight: isActive(item.path) ? 600 : 400 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isAdmin && (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={ROUTES.ADMIN}
                            onClick={() => setDrawerOpen(false)}
                            selected={isActive(ROUTES.ADMIN)}
                        >
                            <ListItemText
                                primary="Admin"
                                primaryTypographyProps={{
                                    variant: 'h6',
                                    sx: { fontWeight: isActive(ROUTES.ADMIN) ? 600 : 400 },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                )}
                <Divider sx={{ my: 2 }} />
                <ListItem>
                    {isAuthenticated ? (
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                setDrawerOpen(false);
                                logout();
                            }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                setDrawerOpen(false);
                                signIn();
                            }}
                        >
                            Sign In
                        </Button>
                    )}
                </ListItem>
            </List>
        </Drawer>
    );

    return (
        <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            component={motion.header}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo */}
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'text.primary',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        fontSize: '1.25rem',
                    }}
                >
                    PHOTO GALLERY
                </Typography>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {navLinks}

                        {/* Dark Mode Toggle */}
                        <IconButton onClick={toggleDarkMode} sx={{ ml: 2 }}>
                            {darkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>

                        {/* User Menu or Sign In */}
                        {isAuthenticated ? (
                            <>
                                <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                                    <Avatar
                                        src={user?.photoURL ?? undefined}
                                        alt={user?.displayName ?? 'User'}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem disabled>
                                        <Typography variant="body2">{user?.email}</Typography>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => signIn()}
                                sx={{ ml: 2 }}
                            >
                                Sign In
                            </Button>
                        )}
                    </Box>
                )}

                {/* Mobile Navigation */}
                {isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={toggleDarkMode}>
                            {darkMode ? <LightMode /> : <DarkMode />}
                        </IconButton>
                        <IconButton onClick={() => setDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                )}
            </Toolbar>
            {mobileDrawer}
        </AppBar>
    );
};

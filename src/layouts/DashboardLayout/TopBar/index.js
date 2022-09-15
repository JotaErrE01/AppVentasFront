import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  SvgIcon
} from '@material-ui/core';
import { Menu as MenuIcon } from 'react-feather';
import Logo from 'src/components/Logo';
import { THEMES } from 'src/constants';
import Account from './Account';
import Contacts from './Contacts';
import Notifications from './Notifications';
import SearchBar from './SearchBar';
import Settings from './Settings';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...theme.name === THEMES.LIGHT ? {
      boxShadow: 'none',
     
    } : {},
    ...theme.name === THEMES.ONE_DARK ? {
      backgroundColor: theme.palette.background.default
    } : {}
  },
  toolbar: {
    minHeight: 64
  },
  menuLogo:{
    height:42,
    width:42
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} {...rest} >
        <Toolbar className={classes.toolbar}>
            <Hidden lgUp>
            <IconButton color="inherit" onClick={onMobileNavOpen} >
                    <SvgIcon fontSize="small">
                        <MenuIcon />
                    </SvgIcon>
                </IconButton>
            </Hidden>
            <Hidden mdDown>
                <RouterLink to="/afp/ventas">
                    <Logo  src="/static/logos/genesis_logo_blue.svg"/>
                </RouterLink>
            </Hidden>
            <Box ml={2} flexGrow={1} />
            <SearchBar />
            <Notifications />
            
           
            <Box ml={2}>
                <Account />
            </Box>
        </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

TopBar.defaultProps = {
  onMobileNavOpen: () => {}
};

export default TopBar;

import React, {
  useRef,
  useState
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Avatar,
  Box,
  ButtonBase,
  Hidden,
  Menu,
  MenuItem,
  Typography,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/contextapi/hooks/useAuth';
import DebugDialog from 'src/components/common/DebugDialog';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1),
    backgroundColor:theme.palette.primary.contrastText,
    color:theme.palette.primary.main,

  },
  popover: {
    width: 200
  }
}));

const Account = () => {
  const classes = useStyles();
  const history = useHistory();
  const ref = useRef(null);
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setOpen] = useState(false);

  const name = user.name;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      history.push('/');
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Unable to logout', {
        variant: 'error'
      });
    }
  };

  return (
    <>

    <DebugDialog data={user}/>
      <Box
        display="flex"
        alignItems="center"
        component={ButtonBase}
        onClick={handleOpen}
        ref={ref}
        borderRadius={9}
        padding={.9}
      >
        <Avatar
          alt="User"
          className={classes.avatar}
        >
          {name[0]}
        </Avatar>
        <Hidden smDown>
          <Typography  variant="h6"  color="inherit"  >
            {name} 
          </Typography>
        </Hidden>
      </Box>
      <Menu
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom',horizontal: 'center' }}
        keepMounted
        PaperProps={{ className: classes.popover }}
        getContentAnchorEl={null}
        anchorEl={ref.current}
        open={isOpen}
      >

        <MenuItem onClick={handleLogout}>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </>
  );
}

export default Account;

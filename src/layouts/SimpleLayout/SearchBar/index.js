import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  SvgIcon,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon, XCircle as XIcon} from 'react-feather';
import HandleSearch from './HandleSearch';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 500,
    maxWidth: '100%'
  },
  icon: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
	}
}));

const SearchBar = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [newSearch, setNewSearch] = useState(false);


  const handleOpen = () => {
    setOpen(true);
    setNewSearch(true);
  };

  const handleClose = () => setOpen(false);
  return (
    <>
        <IconButton
          color="inherit"
          onClick={handleOpen}
        >
          <SvgIcon>
            <SearchIcon className={classes.icon} />
          </SvgIcon>
        </IconButton>
      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        ModalProps={{ BackdropProps: { invisible: true } }}
        onClose={handleClose}
        open={isOpen}
        variant="temporary"
      >
        <PerfectScrollbar options={{ suppressScrollX: true }}>
            <Box mt={4} p={3}>
              <HandleSearch onChange={() => { }}/>
            </Box>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
};

export default SearchBar;

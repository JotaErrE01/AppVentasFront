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
import axios from 'src/utils/axios_old';
import HandleSearch from './HandleSearch';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 500,
    maxWidth: '100%'
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
    setNewSearch(true)

  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Tooltip title="Search">
        <IconButton
          color="inherit"
          onClick={handleOpen}
        >
          <SvgIcon fontSize="small">
            <SearchIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>


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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    view: {
        maxHeight:'100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.2em',
        overflowY:'scroll',

        '& .MuiFormControl-root': {
            padding: '0 0 1.5em 0',
        },
      
     

    }
}));

export default function AjustesAside({
    togglePhone,
    setTogglePhone,
    asideBody 
}) {
    const classes = useStyles();

    const toggleDrawer = ( open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setTogglePhone(open)

    };


    return (
        <>

                <React.Fragment >
              
                    <SwipeableDrawer
                        anchor='right'
                        open={togglePhone}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                    >

                        <Box className={classes.view}>
                            {asideBody}
                        </Box>


                    </SwipeableDrawer>
                </React.Fragment>
        
        </>
    );
}

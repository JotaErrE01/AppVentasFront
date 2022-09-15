import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    view: {
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.2em',
        overflowY: 'scroll',

        '& .MuiFormControl-root': {
            padding: '0 0 1.5em 0',
        },



    }
}));

export default function AjustesAside({
    open,
    toggle,
    children
}) {
    const classes = useStyles();

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        toggle(open)
    };

    return (
        <>



            <SwipeableDrawer
                anchor='right'
                open={open&&true}
                onClose={() => toggle(false)}
                onOpen={() => toggle(true)}
            >

                <Box className={classes.view}>
                    {children}
                </Box>


            </SwipeableDrawer>


        </>
    );
}

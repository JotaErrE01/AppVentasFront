import React, { useEffect } from 'react';
import NProgress from 'nprogress';
import {
    Box,
    LinearProgress,
    makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {

        backgroundColor: theme.palette.background.default,

        position: 'absolute',
        left: '0px',
        top: '0px',
        zIndex: '-1'
    }
}));

const LoadingFull = () => {
    const classes = useStyles();

    useEffect(() => {
        NProgress.start();

        return () => {
            NProgress.done();
        };
    }, []);

    return (
        <div className={classes.root}>
            <Box width={400}>
                <LinearProgress />
            </Box>
        </div>
    );
};

export default LoadingFull;

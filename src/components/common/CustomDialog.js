import React from 'react'
import {  Box, Container, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import {CardContent } from '@material-ui/core';
import {
    X as CloseIcon
} from 'react-feather';
import TitleDescription from '../TitleDescription';

const useStyles = makeStyles((theme) => ({
    view: {
      
        position: 'absolute',
        zIndex: 3,
        width:'100vw',
        height:'100vh',
        backgroundColor: 'black',
        padding:'3em'
    },

    dialog: {
        borderRadius: '9pt',
        backgroundColor: "#FFFFFF",
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        width: '100%'
    },
}));

const CustomDialog = ({ open, children, onClose, title }) => {
    const classes = useStyles();
    return (
        <div 
            style={{ visibility: (!open) && 'hidden' }}
            className={classes.view}
        >


            <div className={classes.dialog}>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Box ml={3}>
                        <Typography variant="h3">
                            { title }
                        </Typography>
                    </Box>

                    <IconButton onClick={() => onClose()}>
                        <CloseIcon />
                    </IconButton>


                </div>



                <CardContent className={classes.content}>
                    {children}
                </CardContent>
            </div>
        </div>
    )
}

export default CustomDialog;

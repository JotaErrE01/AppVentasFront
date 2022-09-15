import React from 'react'
import {  Box, IconButton, makeStyles } from '@material-ui/core';
import { Card, CardContent } from '@material-ui/core';
import {
    X as CloseIcon
} from 'react-feather';

const useStyles = makeStyles((theme) => ({
    container: {
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        position: 'absolute',

        backgroundColor: 'rgba(0,0,0,0.3)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',

        justifyContent: 'center'

    },

    peerShotCard: {

        backgroundColor: '#000000',
    },
    peershotImageContainer: {
        minWidth: '100w',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems:'center',

        padding: 0, overflowX: 'scroll',
        [theme.breakpoints.down("sm")]: {
            width: '100vw',
        },
        [theme.breakpoints.up("sm")]: {
            width: '80vw',
        },
        [theme.breakpoints.up("md")]: {
            width: '80vw',
        },
    },
}));

const CustomModal = ({ hide, children, onClose }) => {
    const classes = useStyles();
    return (
        <Box

            id="custom_modal"
            style={{ visibility: hide && 'hidden' }}
            className={classes.container}>
            <Card className={classes.peerShotCard}>



                <div style={{
                    display:'flex',
                    justifyContent:'flex-end',
                    width:'100%',
                    backgroundColor:'#000000'
                }}>                
                
                <div style={{
                    position: 'absolute',
                    zIndex: 3,
                    
                }}>
                    <IconButton onClick={() => onClose()} color="primary">
                        <CloseIcon style={{color:'#ffffff'}} />
                    </IconButton>
                    </div>
                </div>




                <CardContent className={classes.peershotImageContainer}>

                    {children}
                </CardContent>
            </Card>
        </Box>
    )
}

export default CustomModal

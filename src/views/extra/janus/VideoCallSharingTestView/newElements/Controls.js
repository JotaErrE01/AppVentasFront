
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, DialogActions, DialogTitle, TextField, Grid, DialogContent, Dialog, IconButton, withStyles, Typography, InputAdornment, List, ListItem, ListItemText } from '@material-ui/core';


import ScreenShareRoundedIcon from '@material-ui/icons/ScreenShareRounded';
import StopScreenShareRoundedIcon from '@material-ui/icons/StopScreenShareRounded';
import { AspectRatioRounded, CallEndRounded, CloseRounded, ExpandLessRounded, ExpandMoreRounded, MenuRounded, MicOffRounded, MicOutlined, MicRounded, OpenInBrowser, OpenInBrowserRounded, SettingsRounded, VideocamOffRounded, VideocamRounded, VolumeUpRounded } from '@material-ui/icons';

import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { ChevronDown, ChevronUp, X } from 'react-feather';


const ColorButton = withStyles((theme) => ({
    root: {
        display: 'flex',
        margin: '.3em .3em',
        color: "#ffffff",
        backgroundColor: theme.palette.bgs.azn_light,
        '&:hover': {
            backgroundColor: theme.palette.bgs.azn_dark
        },
        "& svg": {
            height: '.9em',
            width: '.9em'

        },
        "&:disabled": {
            color: "#ffffff",
            backgroundColor: "#708196"
        }
    },


}))(IconButton);

const RedButton = withStyles((theme) => ({
    root: {
        display: 'flex',
        margin: '.3em .3em',

        color: "#ffffff",
        backgroundColor: "#FA3E3E",
        '&:hover': {
            backgroundColor: "#FA3E3E"
        },
        "& svg": {
            height: '.9em',
            width: '.9em'
        },
        "&:disabled": {
            color: "#ffffff",
            backgroundColor: '#f46969'
        }
    },
}))(IconButton);





const useStyles = makeStyles((theme) => ({
    enterCall: {
        height: '20vh',
        backgroundColor: 'red'
    },



    buttonsView: {
        // left: 0,
        // position: 'fixed',
        // zIndex: 3,
        padding: '.9em',
        maxWidth: '100vw',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '3em'
    },

    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
        zIndex: 3
    },
    buttonsContainer: {
        // backgroundColor: 'white',
        // boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        // transition: ' all 0.3s cubic-bezier(.25,.8,.25,1)',
        // borderRadius: '9999em',
        // marginButton: '.9em',
        display: 'flex',
    }


}));



const Controls = (
    {

        // CALL SETTINGS
        lockDevices,
        callSettingsDialog,
        setCallSettingsDialog,
        runSettings,

        // ACTION_VIDEO_TOGGLE
        videoDisabled,
        videoToggle,
        videoCb,

        //ACTION_AUDIO_TOGGLE
        micDisabled,
        micToggle,
        micCb,

        //ACTTION HANGUP
        hangUpCb,
        hangUpDisabled,

        //SHARING
        sharingDisabled,
        sharingHidden,
        sharingCb,
        stopSharingHidden,
        stopSharingCb,


        //MENU
        menu,
        menuCb,
        onSharePdf,
        //pdfShare


        //PLUGINS

        pluginVRReady,
        deviceInputAudio,
        deviceOutputAudio,
        deviceInputVideo,


    }

) => {


    const classes = useStyles();

    const [openSharing, setOpenSharing] = useState(false);

    const handleScreen=()=>{
        !(sharingDisabled || sharingHidden) ? sharingCb() : stopSharingCb();
        setOpenSharing(false);
    }

    const handlePdf=()=>{
        onSharePdf();
        setOpenSharing(false);

    }



    const handleSettings = () => {
        setCallSettingsDialog({ dialog: true, callReady: false })
    }

    const closeSettings = () => {
        setCallSettingsDialog({ dialog: false, callReady: false })
    }

    return (

        <>

            <Dialog open={openSharing} onClose={() => setOpenSharing(false)}>
                <List>
                    <ListItem button disabled={sharingDisabled||sharingHidden} onClick={handleScreen}>
                        <ListItemText>Compartir pantalla</ListItemText>
                    </ListItem>
                    <ListItem button onClick={handlePdf}>
                        <ListItemText>Compartir archivo</ListItemText>

                    </ListItem>
                    <ListItem button onClick={handleScreen}>
                        <ListItemText>Dejar de compartir</ListItemText>

                    </ListItem>
                </List>

            </Dialog>


            <div className={classes.buttonsView}>
                <div className={classes.buttonsContainer}>
                    <ColorButton color="secondary" onClick={handleSettings} >
                        <SettingsRounded />
                    </ColorButton>

                    <ColorButton color="secondary" onClick={() => videoCb()} disabled={videoDisabled}>
                        {videoToggle ? <VideocamRounded /> : <VideocamOffRounded />}
                    </ColorButton>

                    <ColorButton color="secondary" onClick={() => micCb()} disabled={micDisabled}>
                        {micToggle ? <MicRounded /> : <MicOffRounded />}
                    </ColorButton>

                    <ColorButton
                        color="secondary"

                        onClick={() => setOpenSharing(true)}
                    // onClick={!(sharingDisabled || sharingHidden) ? sharingCb : stopSharingCb} 
                    // disabled={sharingDisabled||sharingHidden}>

                    >
                        {
                            stopSharingHidden ? <ScreenShareRoundedIcon /> : <StopScreenShareRoundedIcon />
                        }
                    </ColorButton>

                    <RedButton onClick={hangUpCb} disabled={hangUpDisabled}>
                        <CallEndRounded />
                    </RedButton>

                    <ColorButton color="secondary" onClick={menuCb}>
                        {
                            menu === 0 ? <CloseRounded /> : <MenuRounded />
                        }
                    </ColorButton>

                </div>
            </div>





            <Dialog open={callSettingsDialog.dialog} onClose={closeSettings}>

                <>
                    <DialogTitle>
                        <Typography variant="h4">
                            {
                            callSettingsDialog && callSettingsDialog.callReady ?
                            "Antes de entrar":"Guardar ajustes."
                                
                            }
                        </Typography>
                        <IconButton color="secondary" className={classes.closeButton}
                            onClick={
                                () => setCallSettingsDialog({
                                    dialog: false,
                                    callReady: false,
                                })
                            }>
                            <X />
                        </IconButton>
                    </DialogTitle>


                    <DialogContent>


                        <Grid hidden={!pluginVRReady} container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="optionVideoIn"
                                    id="optionVideoIn"
                                    select
                                    SelectProps={{ native: true }}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VideocamRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                >

                                    {deviceInputVideo.map((option) => (
                                        <option key={option.id} value={option.id}
                                        >
                                            {option.viewValue}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}
                            >

                                <TextField
                                    fullWidth
                                    name="optionAudioIn"
                                    id="optionAudioIn"
                                    select
                                    SelectProps={{ native: true }}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MicOutlined />
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    {deviceInputAudio.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.viewValue}
                                        </option>
                                    ))}

                                </TextField>
                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="optionAudioOut"
                                    id="optionAudioOut"
                                    select
                                    SelectProps={{ native: true }}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VolumeUpRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    {deviceOutputAudio.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.viewValue}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>



                        </Grid>


                    </DialogContent>





                    <ButtonGrid>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="button"
                            onClick={
                                () => setCallSettingsDialog({
                                    dialog: false,
                                    callReady: false,
                                })
                            }>
                            Cancelar
                        </Button>



                        <Button
                            // disabled={lockDevices}
                            color="primary"
                            type="button"
                            variant="outlined"
                            onClick={() => runSettings()}>

                            {
                                callSettingsDialog && callSettingsDialog.callReady
                                    ? 'Entrar'
                                    : 'Guardar'

                            }
                        </Button>






                    </ButtonGrid>




                </>

            </Dialog>

        </>
    )

}


export default Controls;



const ButtonGrid = styled.div`
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    align-content:center;
    margin:1.2em;

    button {

       height:6vh;
       width:50%;
       margin:.3em;

    }

`

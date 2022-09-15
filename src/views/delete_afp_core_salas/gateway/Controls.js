
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, DialogActions, DialogTitle, TextField, Grid, DialogContent, Dialog, IconButton, withStyles } from '@material-ui/core';
import {
    Settings,
    Video as VideoIcon,
    VideoOff as VideoOffIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    X,
    VideoOff
} from 'react-feather';

import ScreenShareRoundedIcon from '@material-ui/icons/ScreenShareRounded';
import StopScreenShareRoundedIcon from '@material-ui/icons/StopScreenShareRounded';



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
            height:'.6em',
            width:'.6em'

          },
          "&:disabled": {
            backgroundColor: theme.palette.bgs.fb_gray,
          }


    },
}))(IconButton);





const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    buttonsView: {
        bottom: '.9em',
        left: 0,
        position: 'fixed',

        // width: '100vw',


        padding: '0 .9em',
        maxWidth: '100vw',

        width: '100vw',

        display: 'flex',
        justifyContent:'center'


    },
    buttonsContainer: {

        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        transition: ' all 0.3s cubic-bezier(.25,.8,.25,1)',
        borderRadius: '9999em',
        marginButton: '.9em',

        display: 'flex',

      

        maxWidth: '100%',

        overflow: 'auto',


    }
}));



const Controls = (
    {

        pluginVRReady,
        deviceInputAudio,
        deviceOutputAudio,
        deviceInputVideo,



        toggleVideo,
        toggleAudio,
        userVisible,
        toggleShare,

        clickToggleVideo,
        clickToggleAudio,
        clickUserVisibility,
        clickChangeDevice,
        clickShare,
        userReciveSharing
        

    }

) => {


    const classes = useStyles();


    const [openSettings, setOpenSettings] = useState(false);

    const handleSave = () => {
        setOpenSettings(false);
        clickChangeDevice();
    }

    return (

        <>

            <div hidden={!pluginVRReady} className={classes.buttonsView}>
                <div className={classes.buttonsContainer}>
                    <ColorButton color="secondary" onClick={() => setOpenSettings(true)} >
                        <Settings />
                    </ColorButton>

                    <ColorButton color="secondary" onClick={() => clickToggleVideo()}>
                        {toggleVideo ? <VideoIcon /> : <VideoOffIcon />}
                    </ColorButton>
                    <ColorButton color="secondary" onClick={() => clickToggleAudio()}>
                        {toggleAudio ? <MicIcon /> : <MicOffIcon />}
                    </ColorButton>
                    <ColorButton color="secondary" onClick={() => clickUserVisibility()}>
                        {userVisible ? <EyeIcon /> : <EyeOffIcon />}
                    </ColorButton>


                    <ColorButton color="secondary" onClick={() => clickShare()} disabled={userReciveSharing}>
                        {toggleShare ? <ScreenShareRoundedIcon /> : <StopScreenShareRoundedIcon />}
                    </ColorButton>

                </div>
            </div>



            <Dialog open={openSettings} onClose={() => setOpenSettings(false)}>
                <DialogTitle>

                    Sala de reuniones

                    <IconButton color="secondary" className={classes.closeButton} onClick={() => setOpenSettings(false)}>
                        <X />
                    </IconButton>

                </DialogTitle>
                <DialogContent>
                    <Grid hidden={!pluginVRReady} container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="optionAudioIn"
                                id="optionAudioIn"
                                label="Microfono"
                                select
                                SelectProps={{ native: true }}

                            >
                                {deviceInputAudio.map((option) => (
                                    <option
                                        key={option.id}
                                        value={option.id}
                                    >
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
                                label="Parlantes"
                                select
                                SelectProps={{ native: true }}

                            >
                                {deviceOutputAudio.map((option) => (
                                    <option
                                        key={option.id}
                                        value={option.id}
                                    >
                                        {option.viewValue}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="optionVideoIn"
                                id="optionVideoIn"
                                label="Cámara"
                                select
                                SelectProps={{ native: true }}

                            >

                                {deviceInputVideo.map((option) => (
                                    <option
                                        key={option.id}
                                        value={option.id}
                                    >
                                        {option.viewValue}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>


                <DialogActions style={{ marginTop: '1.2em' }}>

                    <Button
                        color="primary"
                        size="large"
                        type="button"

                        onClick={() => setOpenSettings(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        size="large"
                        type="button"
                        variant="contained"
                        onClick={handleSave}
                    >
                        Guardar
                    </Button>
                </DialogActions>

            </Dialog>

        </>
    )

}


export default Controls;


//  <div id="screenmenu">
//                 <Button
//                     hidden={userReciveSharing || userSharing}
//                     color="secondary"
//                     disabled={!pluginSHReady}
//                     size="large"
//                     type="button"
//                     variant="contained"
//                     onClick={() => shareScreen(Janus.randomString(12))}
//                 >
//                     Compartir
//             </Button>
//             <Button
//                     hidden={!userSharing || userReciveSharing}
//                     color="secondary"
//                     size="large"
//                     type="button"
//                     variant="contained"
//                     onClick={() => clickUnPublish()}
//             >
//                     Dejar de compartir
//                 </Button>
//             </div>



{/* :::::::: CONTROL_ENCENDER_AUDIO ::::::  */ }

{/* <Button
                        color="secondary"
                        size="large"
                        type="button"
                        variant="contained"
                        onClick={() => clickToggleAudio()}
                    >
                        {toggleAudio ? 'Mute' : 'UnMute'}
                    </Button> */}
{/* :::::::: CONTROL_ENCENDER_AUDIO ::::::  */ }

{/* <Button
                        color="secondary"
                        size="large"
                        type="button"
                        variant="contained"
                        onClick={() => clickToggleVideo()}
                    >
                        {toggleVideo ? 'Disable video' : 'Enable video'}
                    </Button> */}
{/* :::::::: CONTROL_ENCENDER_AUDIO ::::::  */ }

{/* <Button
                        color="secondary"
                        disabled={false}
                        size="large"
                        type="button"
                        variant="contained"
                        onClick={() => clickUserVisibility()}
                    >
                        {(userVisible) ? 'Ser Invisible' : 'Ser Visible'}
                    </Button> */}



{/* :::::::::::::: VIDEO_REMOTO VIDEO_REMOTO :::::::::::::: */ }

{/* <div id="video_local">
                    <div hidden={viewVideoRejected}>
                        <div hidden={!userVisible}>
                            <video id="videoLocal" ref={streamLocal.refStream} width='80' height='80' autoPlay playsInline muted="muted" />
                        </div>
                        <div hidden={!viewNoWebcam}>
                            <div>
                                <h3>No disponible Webcam</h3>
                            </div>
                        </div>

                        <div hidden={!viewVideoRejected}>
                            <div>
                                <h3>Su video no podra ser mostrado con los demas</h3>
                            </div>
                        </div>
                    </div>
                </div> */}

{/* :::::::::::::: VIDEO_REMOTO VIDEO_REMOTO :::::::::::::: */ }

{/* <div id="videos_remotos" style={{backgroundColor:'#FAFA', borderRadius:'3pt'}}>
               
                    {
                        streamArr.map((item, index) =>
                            <div hidden={!item.viewRemoto}  id={"divVideoremonto_" + index}>
                                <h3>Remoto :{item.nameUserJoin}</h3>
                                <div hidden={!item.viewRemoteVideo}>
                                    <video id={"videoRemoto_" + index} ref={item.refStream} width='80' height='80' autoPlay playsInline />
                                </div>
                                <div hidden={item.viewRemoto}>
                                    <h3>{messageNoViewVideo}</h3>
                                </div>
                            </div>
                        )
                    }
                </div> */}




import React , {useState} from 'react'
import { Button, DialogActions, DialogTitle, TextField, Grid, DialogContent, Dialog, IconButton, withStyles, Typography, InputAdornment, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { X } from 'react-feather';
import { MicOutlined, VideocamRounded, VolumeUpOutlined } from '@material-ui/icons';
import styled from 'styled-components';




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
const AntesDeEntrar = ({
    deviceInputAudio, deviceOutputAudio,deviceInputVideo,
    setCallSettingsDialog,callSettingsDialog,
    
    clickChangeDevice,


}) => {

   const [open, setOpen] = useState(true);

   const classes = useStyles();


   const go =()=>{
    clickChangeDevice();
    setOpen(false)

   }
   return (
      
        <Dialog open={open} onClose={()=>setOpen(false)}>

        <>
            <DialogTitle>
                <Typography variant="h4">
                    Antes de entrar
                </Typography>
                <IconButton color="secondary" className={classes.closeButton}
                    onClick={()=>setOpen(false)}>
                    <X/>
                </IconButton>
            </DialogTitle>


            <DialogContent>


                <Grid container spacing={2}>
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
                                        <VolumeUpOutlined />
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
                    onClick={()=>setOpen(false)}>
                    Cancelar
                </Button>



                <Button
                    // disabled={lockDevices}
                    color="primary"
                    type="button"
                    variant="outlined"
                    onClick={()=>go()}>
Entrar
                </Button>






            </ButtonGrid>




        </>

    </Dialog>

    )
}

export default AntesDeEntrar



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

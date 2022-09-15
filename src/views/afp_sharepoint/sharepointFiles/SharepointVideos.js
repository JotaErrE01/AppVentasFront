import { Button, Card, CardActions, CardMedia, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Pause, PlayArrow } from '@material-ui/icons';
import React, { useRef, useState } from 'react';
import { palette } from 'src/theme';
import styled from 'styled-components';

const useStyles = makeStyles({
    root: {
        borderRadius: '9pt'
    },
    media: {
        minWidth: '100%',
        minheight: '100%',
        height: 'auto'
    },
    actionView: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

const RenderVideo = (props) => {

    const ref = useRef(props.ref);
    const [playing, setPlaying] = useState(false);
    const classes = useStyles();

    const handlePlayVideo = () => {
        ref.current.play();
        setPlaying(true);
    }
    const handlePause = () => {
        ref.current.pause();
        setPlaying(false);
    }

    return (
        <Card className={classes.root}>
            <CardMedia className={classes.media}>
                <video
                    src={props.src}
                    ref={ref}
                    style={{ width: '100%', height: '100%' }}
                    loop
                    playsInline
                >
                    <source type="video/mp4" />
                </video>
            </CardMedia>

            <CardActions className={classes.actionView}>
                <Typography variant="h6">{props.title}</Typography>
                <div className={classes.actions}>
                    {
                        playing ? 
                        <IconButton size="small" color="primary" onClick={() => handlePause()}>
                            <Pause />
                        </IconButton>
                            :
                            <IconButton size="small" color="primary" onClick={() => handlePlayVideo()}>
                                <PlayArrow />
                            </IconButton>
                    }

                </div>

            </CardActions>

        </Card>

    )


}


const SharepointVideos = () => {

    const ref_a = useRef(null);
    const ref_b = useRef(null);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
                <RenderVideo src="/videos/CARGA_PROSPECTOS.mp4" title="Carga de Prospectos" ref={ref_a} />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
                <RenderVideo src="/videos/GESTION_DE_VENTAS.mp4" title="Seguimiento de prospecto" ref={ref_b} />
            </Grid>
        </Grid>
    );
}



export default SharepointVideos

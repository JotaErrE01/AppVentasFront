import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { Container } from '@material-ui/core'


import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    iconG: {
        '& > * >': {
            margin: theme.spacing(1),
        },
    },
    iconFab: {
        position: 'absolute',
        bottom: '3em',
        right: '1em',
    },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
    children,
}) {
    const classes = useStyles();
    const history = useHistory();

    const handleClose =()=>{
        history.push('/afp/actividad')
    }
    
    return (
        <div >

            <Dialog fullScreen open={true} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h3" className={classes.title}>
                            Nueva actividad
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {
                    children
                }
            </Dialog>

        </div>
    );
}

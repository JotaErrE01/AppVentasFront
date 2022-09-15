import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SaveIcon from '@material-ui/icons/Save';
import {
    Crop as ScreenShotIcon,
    Upload as UploaIcon
} from 'react-feather';

import EditIcon from '@material-ui/icons/Edit';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';


const barHeight ="56";

const useStyles = makeStyles((theme) => ({

    speedDial: {
 
    },
}));


export default function SpeedDialControls({
    snapshotHidden,
    snapshotCb,
    pdfHidden,
    pdfCb,
}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);

    const handleVisibility = () => {
        setHidden((prevHidden) => !prevHidden);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <SpeedDial
                ariaLabel="SpeedDial openIcon example"
                className={classes.speedDial}
                hidden={hidden}
                icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}

            >

                {
                    !snapshotHidden &&
                    <SpeedDialAction

                        icon={<ScreenShotIcon />}
                        tooltipTitle='Capturar documento'
                        onClick={snapshotCb}
                    />
                }

                {
                    !pdfHidden &&
                    <SpeedDialAction

                        icon={<PictureAsPdfIcon />}
                        tooltipTitle='Compartir PDF'
                        onClick={pdfCb}
                    />
                }







            </SpeedDial>
        </div>
    );
}
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { DialogActions, DialogContent, DialogContentText, Divider } from '@material-ui/core';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});



export default function SimpleDialogDemo({
    dialogActividadEnd,
    setDialogActividadEnd,
    name,
    guardarFase,


}) {


    const onSave = (value) => {
        guardarFase()
        setDialogActividadEnd(false);

    };

    const onClose = (value) => {
        setDialogActividadEnd(false);
    };

    return (
        <div>
            <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={dialogActividadEnd}>


                <DialogContent>
                    <Typography variant="h5">
                        DESEA MOVER A {name} A FASE "CALIFICADO"
                    </Typography>
                </DialogContent>

                <Divider />

                <DialogActions>
                    <Button autoFocus onClick={onClose} color="primary">
                        No toavía
                    </Button>
                    <Button onClick={onSave} color="primary">
                        Si, continuar
                     </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

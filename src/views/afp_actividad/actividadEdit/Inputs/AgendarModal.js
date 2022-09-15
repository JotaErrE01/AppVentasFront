import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
export default function AgendarModal({ validate, setValidate, agendarCb }) {
    const [open, setOpen] = React.useState(true);


    return (
        <div>

            <Dialog
                open={validate}
                onClose={() => setValidate(!validate)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">

                    <Typography variant="h4">
                        ¿Está seguro que desea continuar?
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant="p">
                            {validate}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setValidate(false)} color="primary">
                        Cancelar
                 </Button>
                    <Button onClick={agendarCb}
                        variant="contained" color="primary"
                    >
                        Continuar
            </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

AgendarModal.propTypes = {
    dialog: PropTypes.string,
    agendarCb: PropTypes.func,
};

import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Grid, Select, Slide, Typography, TextField, Divider, useMediaQuery, useTheme, IconButton, InputAdornment }
    from '@material-ui/core';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ModalDelete = ({
    open,
    setOpen,
    onSubmit

}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            // fullScreen={fullScreen}

        >
            <DialogContent>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h5">
                            ¿ Está seguro de querer eliminar prospecto ?
                        </Typography>
                    </Grid>
                </Grid>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleClose} color="primary"
                    onClick={onSubmit}

                >
                    Eliminar
                 </Button>
            </DialogActions>


        </Dialog>
    )
}

export default ModalDelete;

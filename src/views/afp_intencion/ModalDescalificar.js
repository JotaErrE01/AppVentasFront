import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Grid, Select, Slide, Typography, TextField, Divider }
    from '@material-ui/core';
import Buttons from 'src/components/common/Buttons';
import { Alert } from '@material-ui/lab';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const ModalDescalificar = ({
    onDescalificarSave,
    dialogDescalificar,
    setDialogdescalificar,
    motivosCatalogo
}) => {


    const [loadDescalificar, setLoadDescalificar] = useState({
        intencion_motivo_id: null,
        intencion_motivo_observacion: null
    })


    const handleClose = () => {
        setDialogdescalificar(false)
    }

    const handleSave = () => {
        onDescalificarSave(loadDescalificar);
    }



    return (

        <Dialog
            open={dialogDescalificar}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >


            <DialogContent>



                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Alert severity="error">
                            Por favor utilice esta opción con discreción.
                        </Alert>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Por favor elija un motivo
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                                Motivo
                            </InputLabel>
                            <Select
                                fullWidth
                                native
                                value={loadDescalificar.motivo}
                                onChange={(event) =>
                                    setLoadDescalificar({
                                        ...loadDescalificar,
                                        intencion_motivo_id: event.target.value
                                    })}
                                label="pick_motivo"
                            >
                                <option aria-label="None" value="" />
                                {
                                    motivosCatalogo &&
                                    motivosCatalogo.length &&
                                    motivosCatalogo.map(item => (
                                        <option value={item.id}>{item.title}</option>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id=""
                            label="Observación"
                            multiline
                            variant="outlined"
                            rowsMax={4}
                            rows={4}
                            fullWidth
                            value={loadDescalificar.intencion_motivo_observacion}
                            onChange={(e) =>
                                setLoadDescalificar({
                                    ...loadDescalificar,
                                    intencion_motivo_observacion: e.target.value
                                })
                            }
                        />

                    </Grid>
                </Grid>
            </DialogContent>

            <Divider/>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Buttons onClick={handleSave} color="primary">
                    Eliminar
                </Buttons>
            </DialogActions>
        </Dialog>
    )
}

export default ModalDescalificar

import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Grid, Select, Slide, Typography, TextField, Divider, List, ListItem, ListItemText, ListItemSecondaryAction }
    from '@material-ui/core';
import Buttons from 'src/components/common/Buttons';
import { Alert } from '@material-ui/lab';
import { set } from 'lodash';
import { ContactPhoneRounded, SearchRounded } from '@material-ui/icons';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const ModalActividadVincular = ({
    open,
    setOpen,
    onSubmit,
    actividadesAloneArr
}) => {


    const [loadDescalificar, setLoadDescalificar] = useState({
        intencion_motivo_id: null,
        intencion_motivo_observacion: null
    });

    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('md');


    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = (actividad_id) => {
        onSubmit(actividad_id);
    }



    return (

        <>

            <Button color="secondary" endIcon={<SearchRounded />} onClick={() => setOpen(true)}>
                Buscar Actividad
            </Button>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >


                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography>Actividades sin asignar</Typography>
                        </Grid>
                    </Grid>

                    <List>
                        {
                            !actividadesAloneArr.length ?
                                <ListItem>
                                    <ListItemText primary='No hay actividades disponibles'></ListItemText>

                                </ListItem>

                                :
                                actividadesAloneArr.map(item => {
                                    return (
                                        <ListItem>
                                            <ListItemText primary={item.celular_cliente}>

                                            </ListItemText>
                                            <ListItemSecondaryAction>
                                                <Button onClick={() => handleSave(item.id)}>
                                                    Asignar
                                            </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>);
                                })
                        }


                    </List>


                </DialogContent>

                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default ModalActividadVincular

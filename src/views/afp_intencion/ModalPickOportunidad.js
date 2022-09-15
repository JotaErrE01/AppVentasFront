import { Dialog, List, ListItem, Grid, ListItemText, Slide, CardActions, Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import JSONTree from 'react-json-tree';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function ModalPickOportunidad({

    dialogOporunidad,
    setDialogOportunidad,

    dialogActividadEnd,
    setDialogActividadEnd,

    guardarOportunidad,


    oportunidadCatalogo,
    intencionId,

}) {
    const [payload, setPayload] = useState(false);
    return (
        <Dialog open={dialogOporunidad} onClose={() => setDialogOportunidad(false)} TransitionComponent={Transition} fullWidth={true}>
            {
                payload && (
                    <List>
                        <RenderItem item={payload} handleItem={() => { }} />
                        <ListItem style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant='h5'>
                                ¿ Está seguro de continuar ?
                            </Typography>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => setPayload(false)}>
                                    Cancelar
                                </Button>
                                <Button size="small" color="primary" onClick={() => guardarOportunidad(intencionId, payload.id)}>
                                    Confimar
                                </Button>
                            </CardActions>
                        </ListItem>

                    </List>
                )
            }
            <List>
                {
                    !payload
                    && oportunidadCatalogo.map(item => <RenderItem item={item} handleItem={() => setPayload(item)} />)
                }
            </List>
        </Dialog>
    )
}


const RenderItem = ({ item, handleItem }) => {

    const { monto_aporte, monto_soluciona, monto_itp, monto_aee } = item.aporte || 0;


    let suman = monto_aporte + monto_soluciona + monto_itp + monto_aee
    suman = suman.toFixed(2)
    return (
        <ListItem button onClick={handleItem}>

            <Grid container spacing={3}>

                <Grid item xs={1}>
                    <ListItemText primary={item.id} />
                </Grid>
                <Grid item xs={6}>
                    <ListItemText primary={item.nombre_cuenta} secondary={item.cod_ced_cliente} />
                </Grid>
                <Grid item xs={3}>
                    <ListItemText primary={item.fondo_descripcion} />
                </Grid>
                <Grid item xs={2}>
                    <ListItemText primary="Monto" secondary={`$ ${suman}`} />
                </Grid>

            </Grid>

        </ListItem>
    )

}
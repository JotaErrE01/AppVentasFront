import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


import {
  Box,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Slide,
  CardHeader
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { OpenInNewRounded } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import { X } from 'react-feather';
import Buttons from 'src/components/common/Buttons';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paper: {
    background: theme.palette.primary.contrastText,
  },
  item: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3)
  },

  element_1: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'flex-start'
  },
  element_2: {
    display: 'flex',
    padding: theme.spacing(1),
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
}));

const GestionUi = ({
  grabbed,
  setGrabbed,
  setDialogOportunidad,
  fasesCatalogo,
  setDialogdescalificar,
  children

}) => {
  const classes = useStyles();

  const { fases_id, id } = grabbed;
  const fase = fasesCatalogo.find(item => item.id === fases_id)

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleClose = () => {
    setGrabbed(false)
  }

  return (

    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
        <Typography variant="h4" className={classes.title}>
            Seguimiento intención: {grabbed.id}

          </Typography>

       


          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <X />
          </IconButton>
        </Toolbar>

      </AppBar>

      <Grid container >
        <Grid item xs={6} className={classes.element_1}>
          <CardHeader title={fase.title} subheader="FASE" />
        </Grid>
        <Grid item xs={6} className={classes.element_2}>
          <Buttons onClick={() => setDialogdescalificar(true)} color="inherit">
            DESCALIFICAR
          </Buttons>
        </Grid>
      </Grid>

      <Divider />

      {
        grabbed && grabbed.oportunidadesArr && grabbed.oportunidadesArr.length
          ? grabbed.oportunidadesArr.map(item => {
            const { nombre_cuenta, fondo_descripcion, cod_ced_cliente } = item || 0;
            return (
              <Grid container >
                <Grid item xs={6} className={classes.element_1}>
                  <CardHeader title={`TITULAR: ${nombre_cuenta}`} subheader={`cedula ${cod_ced_cliente}`} />
                </Grid>
                <Grid item xs={6} className={classes.element_2}>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Box display="flex">
                        <Box m={1}>
                          <Button color="secondary"
                            endIcon={<OpenInNewRounded />}
                            variant="contained"
                            to={`/afp/crm/oportunidad/mantenimientoOportunidad/${item.id}`}
                            component={RouterLink}
                            target="_blank"
                          >
                            Ver
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
          }) :
          <Grid container >
            <Grid item xs={6} className={classes.element_1}>
              <CardHeader title="No tiene un contrato, todavía" subheader="Contrato" />
            </Grid>
            <Grid item xs={6} className={classes.element_2}>
              <Grid container justify="flex-end">
                <Grid item>
                  <Box display="flex">
                    <Box m={1}>
                      <Button color="secondary" variant="contained" onClick={() => setDialogOportunidad(true)} variant="outlined">
                        Asignar
                      </Button>
                    </Box>
                    <Box m={1}>
                      <Button color="secondary"
                        endIcon={<OpenInNewRounded />}
                        variant="contained"
                        to={`/afp/crm/oportunidad/opciones/loadIntencion/${grabbed.id}`}
                        component={RouterLink}
                        target="_blank"
                      >
                        Nuevo
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

      }









      {children}

    </>



  )



}

export default GestionUi;





const RedButton = withStyles((theme) => ({
  root: {
    display: 'flex',
    color: "#ffffff",
    backgroundColor: "#FA3E3E",
    width: '4.5em',
    '&:hover': {
      backgroundColor: "#FA3E3E"
    },
    "& svg": {
      height: '.6em',
      width: '.em'
    },
    "&:disabled": {

    }
  },
}))(Button);



{/* <ListItem className={classes.item} >
            <ListItemText primary="Fase" />
            {
              grabbed ?
                <ListItemSecondaryAction>
                  <FormControl variant="outlined" className={classes.formControl} size="small">
                    <InputLabel htmlFor="outlined-age-native-simple">Fase</InputLabel>
                    <Select
                      native
                      value={fases_id}
                      onChange={(event) => guardarFase({ id: id, fase_id: event.target.value })}
                      label="pick_fase"
                    >
                      <option aria-label="None" value="" />
                      {
                        fasesCatalogo.map(item => (
                          <option value={item.id}>{item.title}</option>
                        ))
                      }
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
                : <></>
            }
          </ListItem> */}


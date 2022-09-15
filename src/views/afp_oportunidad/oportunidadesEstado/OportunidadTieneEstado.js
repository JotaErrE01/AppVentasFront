import React, { useState, useEffect } from 'react'
import { Card, CardContent, IconButton, Grid, Typography, TextField, CardActions, Button, CircularProgress } from '@material-ui/core'

import { XCircle as ErrorIcon, CheckCircle as SuccessIcon, Circle as DefaultIcon } from 'react-feather'

import { makeStyles } from '@material-ui/core/styles';

import useAuth from 'src/contextapi/hooks/useAuth';
import { useSelector } from 'src/store';
import { Alert } from '@material-ui/lab';
import JSONTree from 'react-json-tree';
import { useDispatch } from 'react-redux';
import { reprocesarAlta } from 'src/slices/oportunidad';
import { useLocation, useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const OportunidadTieneEstado = ({

  /// DATA
  opCatalogoEstados,
  estados,

  // CONSTS
  idOportunidad,


  //HANDLERS
  payload,
  setPayload,
  handleStatus,
  sendStatus,

  // NOT REQUIRED
  onValidateOportunidad,
  loadingValidate,

  locked
}) => {

  const classes = useStyles();

  const [contenido, setContenido] = useState('');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { adjuntosCheckList, archivosAdjuntos, Oportunidad: oportunidad } = useSelector((state) => state.cliente);
  const { current_status } = useSelector((state) => state.oportunidad);

  // const isReadyRevisar = (adjuntosCheckList, archivosAdjuntos) => {
  //   if (adjuntosCheckList.length === archivosAdjuntos) {

  //   }
  // };
  // const test = isReadyRevisar(adjuntosCheckList, archivosAdjuntos);

  const loadAttempt = (oportunidad_estado_id, oportunidad_id) => {
    setPayload({
      oportunidad_estado_id: oportunidad_estado_id,
      oportunidad_id: oportunidad_id,
      contenido: contenido,
      excepcion: '',
    }
    )
  }


  useEffect(() => {
    if (contenido.length) {
      setPayload({ ...payload, contenido })
    }
  }, [contenido])



  const { user } = useAuth();
  const { permisos } = user;

  const endorse_sale = permisos.find(item => item.guard === "endorse_sale");
  const aprobador_supervisor = permisos.find(item => item.guard === "sales_reports")
  const [isLoading, setIsLoading] = useState(false);

  const [alerts, setAlerts] = useState(null)


  console.log(estados);

  return (

    <Grid container spacing={3} direction="column">

      <Grid item >
        <Card >
          <CardContent>
            <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3} style={{ position: 'relative' }}>
              {
                estados.map(item => (
                  <Grid
                    item style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => setAlerts(item.content_estado)}
                      variant="contained" style={{
                        color:
                          item.codigo == '' ? '#fafafa' :
                            item.codigo == 'default' ? '#263238' :
                              item.codigo == 'success' ? '#20c997' :
                                item.codigo == 'error' && '#d63384'
                      }}>
                      {
                        item.codigo === 'error' ? <ErrorIcon /> :
                          item.codigo == 'success' ? <SuccessIcon /> :
                            <DefaultIcon />
                      }
                    </IconButton>
                    <Typography variant="subtitle2" display="block" gutterBottom>
                      {item.contenido}
                    </Typography>

                    {
                      item.codigo === 'error' && item.contenido === 'alta' &&
                      (
                        isLoading ?
                          <CircularProgress style={{ position: 'absolute', bottom: 0, right: 30 }} size={20} /> :
                          <Button
                            onClick={() => {
                              setIsLoading(true);
                              dispatch(reprocesarAlta({id: item?.id, idOportunidad}, setIsLoading, enqueueSnackbar));
                            }}
                            style={{ position: 'absolute', bottom: 0, right: 10 }}
                          >
                            Reprocesar Alta
                          </Button>
                      )
                    }
                  </Grid>
                ))
              }
            </Grid>
          </CardContent>

          {/* {
            aprobador_supervisor && current_status && current_status.oportunidad_estado_id == 15 &&
            <CardActions style={{ justifyContent: 'flex-end' }}>
              <Button disabled={locked} onClick={() => loadAttempt(17, idOportunidad)} size="small" color="primary">
                Rechazar
              </Button>

              <Button disabled={locked || oportunidad.regularizarEmpresa} onClick={() => loadAttempt(16, idOportunidad)} size="small" color="primary" >
                Autorizar
              </Button>
            </CardActions>
          } */}

          {
            !payload && endorse_sale ?
              <CardActions style={{ justifyContent: 'flex-end' }}>
                <Button disabled={locked} onClick={() => loadAttempt(6, idOportunidad)} size="small" color="primary">
                  Rechazar
                </Button>

                <Button disabled={locked || oportunidad.regularizarEmpresa} onClick={() => loadAttempt(5, idOportunidad)} size="small" color="primary" >
                  Autorizar
                </Button>
                {
                  oportunidad.regularizarEmpresa && onValidateOportunidad &&
                  <Button
                    onClick={() => onValidateOportunidad(idOportunidad)} size="small" color="primary"
                    endIcon={loadingValidate && <CircularProgress size={20} />}>
                    Validar
                  </Button>
                }
              </CardActions>
              : <CardActions style={{ justifyContent: 'flex-end' }}>
                {
                  onValidateOportunidad && current_status
                  && (current_status.oportunidad_estado_id === 8
                    || current_status.oportunidad_estado_id === 13)

                  &&
                  <Button onClick={() => onValidateOportunidad(idOportunidad)} size="small" color="primary" endIcon={loadingValidate && <CircularProgress size={20} />}>
                    Validar
                  </Button>
                }
              </CardActions>
          }

        </Card>
      </Grid>


      {
        alerts &&
        <Grid item>
          <Card >
            <CardContent>
              {alerts.map(item => (
                item.codigoError == 'NO_ERROR'
                  ? <Alert severity="success">No hay errores</Alert>
                  : item.codigoError == 'EIA000'
                    ? <Alert severity="warning">{item.codigoError} - {item.descripcion}</Alert>
                    : <Alert severity="error">{item.codigoError} - {item.descripcion}</Alert>

              ))
              }
            </CardContent>
          </Card>
        </Grid>

      }



      {
        payload &&

        <Grid item>

          <Card>
            <TextField
              id="filled-multiline-static"
              label="Motivo"
              value={contenido}
              onChange={
                e => setContenido(e.target.value)
              }
              multiline
              rows={4}
              defaultValue="Default Value"
              variant="filled"
              style={{ width: '100%' }}
            />


            <CardActions style={{ justifyContent: 'flex-end' }}>
              <Button onClick={() => setPayload(false)} size="small" color="primary">
                Cancelar
              </Button>

              <Button onClick={() => handleStatus(payload)} size="small" color="primary">
                Guardar
              </Button>

            </CardActions>

          </Card>



        </Grid>
      }
    </Grid>

  )
}

export default OportunidadTieneEstado


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  sumary: {
    margin: 0
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));



// <Accordion expanded={payload ? true : false}>
// <AccordionSummary className={classes.sumary} >
//   <Grid
//     container
//     direction="row"
//     justify="flex-start"
//     alignItems="center"
//     spacing={3}
//   >
//     <CardHeader title="Status"></CardHeader>

//     {
//       _oportunidadEstados.map(item => (
//         <Grid item style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <IconButton
//             onClick={() => loadAttempt(item.id, item.contenido, idOportunidad)}
//             variant="contained" color={item.checked ? 'secondary' : 'default'}>
//             <CheckCircleIcon />
//           </IconButton>

//           <Typography variant="subtitle2" display="block" gutterBottom>
//             {item.contenido}
//           </Typography>

//         </Grid>
//       ))
//     }
//   </Grid>




// </AccordionSummary>
// <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }}>

//   <TextField
//     id="outlined-multiline-static"
//     label="Observación"
//     multiline
//     rows={4}
//     defaultValue="Default Value"
//     variant="outlined"
//     value={contenido}
//     onChange={e => setContenido(e.target.value)}
//     style={{ width: '100%' }}
//   />


//   <CardActions>
//     <Button onClick={() => setPayload(false)} variant="secondary">Cancelar</Button>
//     <Button variant="primary">Guardar</Button>

//   </CardActions>


// </AccordionDetails>
// </Accordion>


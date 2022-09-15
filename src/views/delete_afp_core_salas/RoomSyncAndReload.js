import React, {
  useState,
  useEffect
} from 'react';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Paper,
  Portal,
  Typography,
  makeStyles,
  LinearProgress,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Container,
  CircularProgress
} from '@material-ui/core';
import useSettings from 'src/contextapi/hooks/useSettings';
import useAuth from 'src/contextapi/hooks/useAuth';
import { useSnackbar } from 'notistack';
import { buildSalasCore, getSalaCore, getSalasCore } from 'src/slices/coreSala';
import { useDispatch, useSelector } from 'src/store';
import { ToastContainer, toast } from 'react-toastify';
import { Alert } from '@material-ui/lab';


const RoomSyncAndReload = () => {
  const [isOpen, setOpen] = useState(true);


  const classes = useStyles();
  const { user } = useAuth();


  const dispatch = useDispatch();


  const coreSala = useSelector(state => state.coreSala);

  const { buildResult, buildingSala } = coreSala;

  const { user_salas, salas } = buildResult;
  const {
    all: allUserSalas,
    created: allCreated,
    updated: allUpdated,
    deleted: allDeleted
  } = user_salas || {};

  const callBackSala = ()=>{
   dispatch(getSalasCore())

  }



  const handleBuildsala = (cedula) => {
    dispatch(buildSalasCore(callBackSala))
  }


  return (

    <Card className={classes.root}>





      <CardContent>
        {
          allUpdated && allUpdated.length ?
            <Box pb={1}>
              <Alert severity="success">Se actualizaron  <strong> {allUpdated && allUpdated.length} </strong> personas de su sala.</Alert>
            </Box> : <></>
        }

        {
          allCreated && allCreated.length ?
            <Box pb={1}>
              <Alert severity="success">Se añadieron <strong> {allCreated && allCreated.length} </strong> personas a su sala.</Alert>
            </Box> : <></>

        }

        {
          allDeleted && allDeleted.length ?
            <Box pb={1}>
              <Alert severity="success">Se eliminaron <strong> {allDeleted && allDeleted.length} </strong> personas de su sala.</Alert>
            </Box> : <></>
        }



        <Box pb={3}>

          <Typography gutterBottom variant="h5" component="h2">
            Actualización de salas de venta.
            </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            Presione actualizar para sincronizar nuevos integrantes de su sala de ventas.
            </Typography>
        </Box>



      </CardContent>

      <CardActions>
        <Button size="small" color="primary"
          disabled={buildingSala}
          onClick={buildingSala ? () => { } : () => handleBuildsala(user.numero_identificacion)}
          startIcon={buildingSala ? <CircularProgress size={18} /> : false}
        >
          {buildingSala ? 'Actualizando' : 'Actualizar'}
        </Button>
      </CardActions>









    </Card>


  )




};

export default RoomSyncAndReload;
const useStyles = makeStyles({
  root: {
  },
  view: {
    display: 'flex',
    flexDirection: 'column',
  },

  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  media: {
    maxHeight: '12em'
  },
});
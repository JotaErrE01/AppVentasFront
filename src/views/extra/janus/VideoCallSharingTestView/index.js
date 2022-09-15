import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import _ from 'lodash';

//REDUX
import { useSelector } from "react-redux";
import { useDispatch } from 'src/store';
import { setJanusScripts } from 'src/slices/janus';
import { getConferenciaByUser } from 'src/slices/conferencias';
import { useSnackbar } from 'notistack';

//CUSTOM HOOK
import useAuth from 'src/contextapi/hooks/useAuth';
import cryptoRandomString from 'crypto-random-string';



import {
  Box,
  makeStyles,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Container,
  Grid
} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';


import Page from 'src/components/Page';
import VideoCallSharingTest from './VideoCallSharingTest';
import FilesUpload from "../FilesUpload";
import { X as CloseIcon } from 'react-feather'

const useStyles = makeStyles((theme) => ({

  title:{
    display:'flex',
    alignItems:'center',
    width:'100%',
    justifyContent:'space-between',
    marginBottom:'.9em'
  },

  closeButton: {
    display:'flex',
    flexDirection:'flex-end'
  },
  muiDialogPaper: {


  }
}));

function VideoCallTestView() {
  const classes = useStyles();

  //GRAB HOOKS
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(setJanusScripts());
      dispatch(getConferenciaByUser(user, enqueueSnackbar));
    }
    catch (err) {
      console.error(err);
    }
  }, []);

  //
  const janus = useSelector(state => state.janus);
  const { scripts } = janus;


  /// DETERMINA CALLER Y 



  const reunionDatas = useSelector(state => state.conferencia);

  const { user } = useAuth();
  const { hash } = useParams();
;
  const reunionData = _.find(reunionDatas.conferencias, { "contenido_3": hash });




  const logged = user && user.usuario && user.id ? true : false;


  const callerName = logged ? user.usuario + cryptoRandomString({ length: 10, type: 'alphanumeric' }) : hash;
  const peerName = logged ? hash : reunionData && reunionData.meet.host;
  const dateText = reunionData && reunionData.meet.dateText


  const [openAutoservicio, setOpenAutoServicio] = useState(false);

  useEffect(() => {
    if (openAutoservicio) {
      dispatch(getConferenciaByUser(user, enqueueSnackbar));
    }
  }, [openAutoservicio])


  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


  return (
    <Page className={classes.root} title="Cliente | Meet " >
      {
        scripts.ready && callerName && peerName &&
        <VideoCallSharingTest
          callerName={callerName}
          peerName={peerName}
          autoservicioCb={() => setOpenAutoServicio(true)}
          logged={logged}
          dateText={dateText}
        />
      }

      <Box className={classes.muiDialogPaper}>
        <Dialog fullScreen onClose={() => setOpenAutoServicio(false)} open={openAutoservicio} >


          <Container maxWidth="md" TransitionComponent={Transition} className={classes.title} >

                <Typography variant="h3">
                  {reunionData && reunionData.oportunidad_id
                    ? "Recepción de documentos"
                    : "Su listado de documentos aún no está listo."
                  }
                </Typography>
                <IconButton aria-label="close" onClick={() => setOpenAutoServicio(false)} className={classes.closeButton}>
                  <CloseIcon />
                </IconButton>

          </Container>





          {
            reunionData && reunionData.oportunidad_id && (
              <FilesUpload
                oportunidad_id={reunionData.oportunidad_id}

              />
            )
          }

        </Dialog>


      </Box>

    </Page>
  );
}

export default VideoCallTestView;
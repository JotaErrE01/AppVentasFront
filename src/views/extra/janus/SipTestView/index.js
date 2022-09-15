import React, { useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import {
  makeStyles
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store';
import useAuth from 'src/contextapi/hooks/useAuth';
import { setJanusScripts } from 'src/slices/janus';
import { getConferenciaByUser } from 'src/slices/conferencias';
import SipTest from './SipTest';
import { fgDigitalConfig } from 'src/config';
import Page from 'src/components/Page';

import _ from 'lodash'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#000000',
    minHeight: '100%',
    fontFamily: "Helvetica Neue"
  }
}));



function AudioRoomTestView() {

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { hash, phone } = useParams();

  const _conferencias = useSelector(state => state.conferencia);
  const _janus = useSelector(state => state.janus);
  const { scripts } = _janus;

  //FIXME: GET BY ID METHODD
  const _conferencia = _.find(_conferencias.conferencias, { "contenido_3": hash });



  useEffect(() => {
    try {
      dispatch(setJanusScripts());
      dispatch(getConferenciaByUser(user, enqueueSnackbar));
    }
    catch (err) {
      console.error(err);
    }
  }, []);


  let centralIP = fgDigitalConfig.central_ip;
  let extensionNumber = user.phone;
  let extensionName = user.name;
  let passwordExt = atob(user.password_plano);
  

  const classes = useStyles();

  

  return (
    <Page className={classes.root} title="Echo Test">
      {
        scripts.ready ?
          <SipTest
            phone={phone}
            centralIP={centralIP}
            extensionNumber={extensionNumber}
            extensionName={extensionName}
            passwordExt={passwordExt}
          />
          :
          <></>

      }
    </Page>
  );
}

export default AudioRoomTestView;
import React, { useState, useEffect, createRef } from 'react';
import { Link as RouterLink, useHistory, useParams } from 'react-router-dom';
import Page from 'src/components/Page';
import useAuth from 'src/contextapi/hooks/useAuth';
import { useSnackbar } from 'notistack';

import VideoRoomTest from './VideoRoomTest';
import { useDispatch, useSelector } from 'src/store';
import { getSalaCore } from 'src/slices/coreSala';
import JSONTree from 'react-json-tree';
import _ from 'lodash';
import { Alert } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import { setJanusScripts } from 'src/slices/janus';



//FIND USER
const fnLookName = (users, nameUser) => {
  
  const found = users && users.length && users.find(item => item.nameUserJoin == nameUser);
  if (found && found.user && found.user.id) {
    return found.user.name;
  } else {
    return "XXXXXX"
  }
}


function VideoRoomTestView() {

  const dispatch = useDispatch();

  const { user } = useAuth();
  const { idSala } = useParams();

  //FETCH SALA

  useEffect(() => {
    dispatch(getSalaCore(idSala))
    initJanus();

  }, [dispatch]);



  const initJanus = () => {
    try { dispatch(setJanusScripts()); }
    catch (err) { alert('Error al inicializar teléfono') }
  }

  const { loadingArr, buildingSala, coreSala } = useSelector(state => state.coreSala);
  const { scripts } = useSelector(state => state.janus);


  const coreUsers = 
  (coreSala && coreSala.users && coreSala.users.length) ?
    [
      ...coreSala.users, 
      {
        nameUserJoin: coreSala.host.usuario,
        user: coreSala.host,
      }
    ]
    : false;





  const me = {
    type: 'GUEST',
    nameUserJoin: user ? user.usuario : null,
    nombres: user ? `${user.name}` : `-`
  }

  const template = {
    viewRemoto: false,
    viewRemoteVideo: false,
    // nameUserJoin: false,
    // nombres: "*LIBRE",
  };





  //::: CREATE VIDEO BOXES
  const total = 12;
  const videosAux = Array(total).fill(template);
  const videoRefs = React.useRef([]);



  // ATTACH VIDEO 
  videoRefs.current = videosAux.map((_, i) => videoRefs.current[i] ?? createRef());
  const videos = videosAux.map((item, i) => {
    return {
      ...item,
      ref: videoRefs.current[i]
    }
  });
  const [remote, setRemote] = useState(videos);
  const [participants, setParticipants] = useState([]);




  //::: HABILITAR REMOTO
  function habilitarRemoto({ remoteFeedVR, value, coreUsers, current }) {
    const { rfindex, rfdisplay } = remoteFeedVR;



    const i = rfindex - 1;
    const payload = {
      ...current[i],
      viewRemoto: value,
      viewRemoteVideo: value,
      // nameUserJoin:rfdisplay

    }
    let _current = [...current];
    // _current.splice(i, 1, payload);
    // _current = _.orderBy(_current, ['display'],['asc']); // Use Lodash to sort array by 'name'


    setRemote(_current);
  }


  async function attachMediaStreamRemoto({ remoteFeedVR, stream, coreUsers, current, cb }) {

    const { rfindex, rfdisplay } = remoteFeedVR;
    const i = rfindex - 1;

    console.log(remote)
    const payload = {
      ...current[i],
      nameUserJoin: rfdisplay,
    };

    payload.ref.current.srcObject = stream;


    const _current = [...current];

    _current.splice(i, 1, payload);
    setRemote(_current);




    //---------------------------------------------------------------
    // Lo siguiente es si el usuario camio esto antes de inciar todo
    //---------------------------------------------------------------
    cb && cb();

  }

  function habilitarNoRemotoVideo({ remoteFeedVR, value, cb }) {

    const { rfindex } = remoteFeedVR;

    if (!value) {
      cb && cb();
    }
    const i = rfindex - 1;
    const payload = {
      ...remote[i],
      viewRemoteVideo: !value,

    }
    const _remote = [...remote]
    _remote.splice(i, 1, payload);
    setRemote([..._remote]);

  }


  function participantsCb({ participants, room }) {
    let _participants = participants.filter(item => item.display !== me.nameUserJoin)
    _participants = _participants.map(item => ({ ...item, name: fnLookName(coreUsers, item.display) }));
    setParticipants(_participants);
  }

  const history = useHistory();


  if (!user) {
    return (
      <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => history.push('/')}>INICIO</Button>}>
        Lo sentimos, usted no tiene acceso a este sitio.
      </Alert>
    )
  }


  return (

    <>



      {
        coreUsers && scripts.ready ?
          <VideoRoomTest
            me={me}
            remote={remote}
            setRemote={setRemote}
            total={remote.length}
            //
            habilitarRemoto={habilitarRemoto}
            attachMediaStreamRemoto={attachMediaStreamRemoto}
            habilitarNoRemotoVideo={habilitarNoRemotoVideo}

            coreUsers={coreSala && coreSala.users && coreSala.users}
            participantsCb={participantsCb}
            participants={participants}

          /> : <></>
      }


    </>
  );
}

export default VideoRoomTestView;
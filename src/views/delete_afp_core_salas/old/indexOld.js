import { Alert } from '@material-ui/lab';
import { forEach } from 'lodash-es';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import LoadBounce from 'src/components/common/LoadBounce';
import Nowloading from 'src/components/common/Nowloading';
import useAuth from 'src/contextapi/hooks/useAuth';
import { getSalaCore } from 'src/slices/coreSala';
import { useDispatch, useSelector } from 'src/store';
import VideoRoom from './VideoRoom';





const getAuthorization = (coreSala, nameUserJoin) => {
  if (coreSala.id) {
    if (coreSala.users.find(x => x.nameUserJoin === nameUserJoin)) {
      return true;
    }
    if (coreSala.host.usuario === nameUserJoin) {
      return true;
    }
  }
}


function VideoRoomTestView() {

  const dispatch = useDispatch();
  const { idSala } = useParams();

  useEffect(() => {
    dispatch(getSalaCore(idSala))
  }, [dispatch]);

  const _coreSala = useSelector(state => state.coreSala)
  const { loading, coreSala } = _coreSala;
  const { user } = useAuth();



  const auth = user ? {
    type: 'LOGGED',
    nameUserJoin: user.usuario,
    nombres: user.name,
  } : {
    type: 'GUEST',
    nameUserJoin: Math.random().toString(36).substring(9),
    nombres: "INVITADO"

  }


  const authorization = getAuthorization(coreSala, auth.nameUserJoin);

  if (loading) {
    return <Nowloading />
  }



  if (authorization || auth.type === "GUEST") {
    return <VideoRoom coreSala={coreSala} auth={auth} />
  }



  return <Alert severity="error">No posee permisos para entrar a esta sala. <Link to="/">Inicio</Link></Alert>




}

export default VideoRoomTestView;
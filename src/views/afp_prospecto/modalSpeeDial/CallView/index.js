import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import useAuth from 'src/contextapi/hooks/useAuth';
import { setJanusScripts } from 'src/slices/janus';
import SipTest from './SipTest';
import { fgDigitalConfig } from 'src/config';
import _ from 'lodash'



function AudioRoomTestView({ phoneNumber, setPhoneNumber , setPayload, payload}) {

  const { user } = useAuth();


  const dispatch = useDispatch();
  const { scripts } = useSelector(state => state.janus);

  let centralIp = fgDigitalConfig.central_ip;
  let extensionNumber = user.phone;
  let extensionName = user.name;
  let passwordExt = atob(user.password_plano);



  useEffect(() => {
    try {
      dispatch(setJanusScripts());
    }
    catch (err) {
      console.error(err);
    }
  }, []);


  return (

    scripts.ready ?

      <SipTest
        centralIp={centralIp}
        extensionNumber={extensionNumber}
        extensionName={extensionName}
        passwordExt={passwordExt}
        

        payload={payload}
        setPayload={setPayload}

        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}


      />


      :
      <></>



  );
}

export default AudioRoomTestView;
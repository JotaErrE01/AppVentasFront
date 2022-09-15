import { Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { fgDigitalConfig } from 'src/config';
import useAuth from 'src/contextapi/hooks/useAuth';
import { setJanusScripts } from 'src/slices/janus';
import { useDispatch, useSelector } from 'src/store';
import SipTest from 'src/views/afp_intencion/actividades/CallSipUi/SipTest';
import { differenceInMinutes, differenceInSeconds } from 'date-fns'
import JSONTree from 'react-json-tree';
import Alert from '@material-ui/lab/Alert';


const CallSipUi = ({
    speedDial,
    phoneNumber,
    guardarActividad
}) => {

    // lLEVANTA SCRIPTS
    const dispatch = useDispatch();
    const { user } = useAuth();
    const janusState = useSelector(state => state.janus);
    useEffect(() => {
        !janusState.scripts.ready && dispatch(setJanusScripts());
    }, []);


    const callSettings = {
        central: fgDigitalConfig.central_ip,
        server: fgDigitalConfig.server_rtc,
        name: user.name,
        phone: user.phone,
        pass: atob(user.password_plano)
    }



    //:: HANDLLE CALL
    const [currentCall, setCurrentCall] = useState({
        plugin: null,
        sipId: null,
        phone: null,
        status: null,
    });

    const [callTrace, setCallTrace] = useState([]);

    const _setCurrentCall = (value) => {
        setCurrentCall(prevState => ({
            ...prevState,
            ...value
        }));
    };



    //TRACING LLAMADA ESTADO
    const handleSave = (phone, duracion) => {
        const payload = {
            codigo: "phone",
            celular_cliente: phone,
            duracion: duracion
        };
        guardarActividad(payload)
    }


    // guarda llamada
    useEffect(() => {
        if (currentCall.phone) {
            const payload = {
                ...currentCall,
                timestamp: Date.now()
            }
            const tsize = callTrace.length;
            if (tsize && callTrace[tsize - 1].status == 'ended') {
                setCallTrace([payload]);
            } else {
                setCallTrace([...callTrace, payload]);
            }
        }
    }, [currentCall]);

    useEffect(() => {

        const calling = callTrace.find(item => item.status == 'calling');
        const accepted = callTrace.find(item => item.status == 'accepted');
        const ended = callTrace.find(item => item.status == 'ended');
        const beep = callTrace.find(item => item.status == 'beep');

        const size = callTrace.length - 2;
        const prevStatus = callTrace[size];

        if (accepted && ended) {
            const acceptedDate = accepted.timestamp;
            const endDate = ended.timestamp;
            const duracion = differenceInSeconds(endDate, acceptedDate)
            handleSave(prevStatus.phone, duracion)
        }

    }, [callTrace]);


    return (


        janusState.scripts.ready && (
            <SipTest
                phoneLabel={speedDial ? 'Marcado rápido' : 'Teléfono'}
                callSettings={callSettings}
                setCurrentCall={_setCurrentCall}
                currentCall={currentCall}
                phoneNumber={phoneNumber}
            />
        )



    )






}

export default CallSipUi;
import React, { useEffect, useState } from 'react'
import JSONTree from 'react-json-tree';
import TitleDescription from 'src/components/TitleDescription';
import { fgDigitalConfig } from 'src/config';
import useAuth from 'src/contextapi/hooks/useAuth';
import { setJanusScripts } from 'src/slices/janus';
import { useDispatch, useSelector } from 'src/store';
import SipTest from 'src/views/afp_intencion/actividades/CallSipUi/SipTest';


const CallSipUi = ({
    speedDial,
    phoneNumber,
    guardarActividad
}) => {

    const { user } = useAuth();
    const dispatch = useDispatch();

    //:: JANUS INIT
    useEffect(() => {
        try { dispatch(setJanusScripts()); }
        catch (err) { console.error(err); }
    }, []);

    const { scripts } = useSelector(state => state.janus);
    const callSettings = {
        central: fgDigitalConfig.central_ip,
        server: fgDigitalConfig.server_rtc,
        name: user.name,
        phone: user.phone,
        pass: atob(user.password_plano)
    }

    //:: END JANUS INIT

    var Janus = window.Janus;
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



    // guarda llamada
    useEffect(() => {
        if (currentCall.phone) {
            const tsize = callTrace.length;
            if (tsize && callTrace[tsize - 1].status == 'ended') {
                setCallTrace([currentCall]);
            } else {
                setCallTrace([...callTrace, currentCall]);
            }
        }
    }, [currentCall]);



    //TRACING LLAMADA ESTADOS


    const handleSave = (phone) => {
        
        guardarActividad({
            codigo: "phone",
            celular_cliente: phone
        },
        () => { });
    }
    useEffect(() => {
        const calling = callTrace.find(item => item.status == 'calling');

        const ended = callTrace.find(item => item.status == 'ended');
        const beep = callTrace.find(item => item.status == 'beep');

        const size = callTrace.length - 2;
        const prevStatus = callTrace[size];

    

        if (beep) handleSave(prevStatus.phone)

        if (ended) handleSave(prevStatus.phone)

    }, [callTrace]);




    return (

        scripts.ready ?
            <>
                <SipTest
                    phoneLabel={speedDial ? 'Marcado rápido' : 'Teléfono'}
                    callSettings={callSettings}
                    setCurrentCall={_setCurrentCall}
                    currentCall={currentCall}
                    phoneNumber={phoneNumber}
                    Janus={Janus}
                />
            </>


            : <TitleDescription title="Servidor de llamadas no disponible" />






    )
}

export default CallSipUi

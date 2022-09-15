import React, { useState, useEffect } from 'react';
import useAuth from 'src/contextapi/hooks/useAuth';
import { createActividad } from 'src/slices/actividad';
import CallView from 'src/views/extra/janus/CallView'

import { useDispatch } from 'src/store';
import { useSnackbar } from 'notistack';

const ActividadSpeedDial = () => {

    const { user } = useAuth();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const {tipo_venta_asesor}= user;


    const [phoneNumber, setPhoneNumber] = useState(0);

    const [payload, setPayload] = useState({
        receivingAudio: false,
        callAccepted: false,
        callDeclined: false,
        callEnded: false,
        phoneNumber: 0,
    });



    const hanldePayload = (value) => {
        setPayload(prevState => ({
            ...prevState,
            ...value
        }));
    };

    useEffect(() => {
        const { receivingAudio, callAccepted, callEnded, phoneNumber } = payload;


        if (receivingAudio && callAccepted && callEnded && phoneNumber) {

            

            const meet = {
                host: 'XXXXX',
                datetime: new Date(),
                dateText: null,
                celular_cliente:phoneNumber,
            };
            

                        


            const registro = {
                "cliente_id": null,
                "tipo_asignacion": null,
                "prospecto_id": null,
                "oportunidad_id": null,
                "usuario_id": user.id,
                "actividad_id": tipo_venta_asesor == 1 ? "1011" :  tipo_venta_asesor == 2 && "1013",
                "contenido_2": JSON.stringify(meet),
                "contenido_3": null,
            };

            dispatch(createActividad(
                registro,
                enqueueSnackbar,
                () => {
                    setPayload({
                        receivingAudio: false,
                        callAccepted: false,
                        callDeclined: false,
                        callEnded: false,
                        phoneNumber: 0,
                    });
                }
            ));
        }
    }, [payload])

    return (
        <div>
            <CallView
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                payload={payload}
                setPayload={hanldePayload}
            />
           
        </div>
    )
}

export default ActividadSpeedDial;

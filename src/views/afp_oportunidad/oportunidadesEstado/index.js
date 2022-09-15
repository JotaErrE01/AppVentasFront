import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'src/store';

import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';
import OportunidadTieneEstado from './OportunidadTieneEstado'
import { cleanOportunidadTieneEstados, getOportunidadTieneEstados, postOportunidadTieneEstado, validateOportunidad, senMailBienvenida } from 'src/slices/oportunidad';

const OportunidadesEstado = ({ fondo }) => {

    const params = useParams();

    const { idOportunidad } = params;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    //FETCH
    useEffect(() => {
        idOportunidad ? dispatch(getOportunidadTieneEstados(idOportunidad, enqueueSnackbar)) :
            dispatch(cleanOportunidadTieneEstados());
    }, [dispatch])




    const _oportunidad = useSelector(state => state.oportunidad);
    const _cliente = useSelector((state) => state.cliente);
    const { Oportunidad: mainOportunidad } = useSelector(state => state.cliente);





    const [payload, setPayload] = useState(false);

    const unlocked = useState(_oportunidad.oportunidad_estado_id==5);


    const handleStatus = () => {

        dispatch(postOportunidadTieneEstado(payload, enqueueSnackbar, () => {}));
        
        if(payload.oportunidad_estado_id==5){
            let payload = {
                nombre_cliente: _cliente.ConsultarData.primer_nombre,
                email_cliente: _cliente.ConsultarData.email,
                tipo_fondo: mainOportunidad.fondo_id
            };

            if(fondo) {
                payload = { ...payload, nombre_fondo: fondo.contenido };
            }

            dispatch(senMailBienvenida(payload));
        }

        setPayload(false)

    }

    const sendStatus = (body) => {
        dispatch(postOportunidadTieneEstado(body, enqueueSnackbar, () => { }));
    }

    const onValidateOportunidad = (idOportunidad) => {
        

        let onSuccess = (data) => {
            if (data.estado == 2) {
                enqueueSnackbar('Hay errores en la información del contrato', {
                    variant: 'error'
                });
            } else if (data.estado == 1) {
                enqueueSnackbar('No hay errores en el contrato', {
                    variant: 'success'
                });
            }

            dispatch(getOportunidadTieneEstados(idOportunidad));
        }

        let onError = (data) => {
            enqueueSnackbar('Hay errores en la información del contrato', { variant: 'error' });
            dispatch(getOportunidadTieneEstados(idOportunidad));
        }

        dispatch(validateOportunidad(idOportunidad, onSuccess, onError));
    }

    return (
        <div>
            <OportunidadTieneEstado
                opCatalogoEstados={_oportunidad.opCatalogoEstados || []}
                estados={_oportunidad.estados || []}
                idOportunidad={idOportunidad}

                payload={payload}
                setPayload={setPayload}
                handleStatus={handleStatus}
                sendStatus={sendStatus}
                onValidateOportunidad={onValidateOportunidad}
                loadingValidate={_oportunidad.loadingValidate}

                locked={!unlocked}
            />

        </div>
    )
}

export default OportunidadesEstado

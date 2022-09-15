import React, { useEffect, useState } from 'react';

import { Button, Grid, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { VideocamRounded, CallRounded } from '@material-ui/icons';

import { useDispatch, useSelector } from 'src/store';
import { getShowIntenciones, loadIntencionId, postActividadAlone, postStoreIntencionActividad, postStoreIntencionFase, postStoreIntencionOpotunidad, postStoreMotivoCierre, updateActividadAlone } from 'src/slices/intencion';
import useAuth from 'src/contextapi/hooks/useAuth';
import hash from 'object-hash';


///:: MA MODULES
import Header from './Header';
import IntencionGrid from './IntencionGrid'
import GestionUi from 'src/views/afp_intencion/GestionUi';

import TabsWrap from './actividades/TabsWrap';
import AgendarModule from './actividades/AgendarModule';
import JSONTree from 'react-json-tree';



import Funnel from 'src/views/afp_analytics/Funnel';
import Tabsx from './Tabsx';
import ModalPickOportunidad from './ModalPickOportunidad';
import ModalActividadEnd from './actividades/ModalActividadEnd';
import CallSipUi from './actividades/CallSipUi';
import ModalDescalificar from './ModalDescalificar';
import { useHistory } from 'react-router';
import ModalActividadVincular from './ModalActividadVincular';


const IntencionView = () => {
    const [grabbed, setGrabbed] = useState(false);
    const [dialogOporunidad, setDialogOportunidad] = useState(false);
    const [dialogActividadEnd, setDialogActividadEnd] = useState(false);
    const [modalVincularActividad, setModalVincularActividad] = useState(false);


    const { user } = useAuth()
    const history = useHistory()


    const dispatch = useDispatch();

    const {

        intencionArr,
        intencionLoading,
        actualizandoFase,


        fasesCatalogo,
        oportunidadCatalogo,
        motivosCatalogo,
        actividadesAloneArr

    } = useSelector((state) => state.intencion);


    function getIntenciones() {
        dispatch(getShowIntenciones());
    }


    function guardarFase(payload) {
        dispatch(postStoreIntencionFase(payload));
    }
    function guardarOportunidad(intencionId, opotunidadId) {
        const payload = {
            intencionId, opotunidadId
        }
        dispatch(postStoreIntencionOpotunidad(payload, () => console.log({ intencionId, opotunidadId })));
    }

    function guardarActividad(value) {
        const payload = {
            codigo: 'phone',
            celular_cliente: value.phone,
            duracion: value.duracion,
            intencion_id: grabbed.id,
            // datetime: value.datetime,
            // datetext: value.datetext,
        }
        

        const cb = () => setDialogActividadEnd(grabbed && grabbed.fases_id === 1);
        dispatch(postStoreIntencionActividad(payload, cb));
    }


    function guardarVincularActividad(value) {
        const payload = {
            intencion_id: grabbed.id,
            actividad_id: value
        };
        const callBack = () => { };
        dispatch(updateActividadAlone(payload, callBack))
    }


    //:::  PARA DESCALIFICAR INTENCION
    const [dialogDescalificar, setDialogdescalificar] = useState(false);
    function onDescalificarSave(payload) {
        const _payload = {
            ...payload,
            intencion_id: grabbed.id,
        }
        const callback = () => {
            setDialogdescalificar(false);
        }
        dispatch(postStoreMotivoCierre(_payload, callback));
    }
    //:::  END DESCALIFICAR INTENCION



    //:: MANT SPEEDDIAL 
    const speedDialSubmit = (value) => {
        const payload = {
            codigo: 'phone',
            celular_cliente: value.phone,
        };
        const callBack = () => { console.log('Done!') };
        dispatch(postActividadAlone(payload, callBack));
    }



    useEffect(() => { getIntenciones(); }, []);

    const fullItem = intencionArr.find(item => item.id === grabbed.id);


    return (
        <>
            <Header />

            <ModalPickOportunidad
                //modal handles
                dialogOporunidad={dialogOporunidad}
                setDialogOportunidad={setDialogOportunidad}

                dialogActividadEnd={dialogActividadEnd}
                setDialogActividadEnd={setDialogActividadEnd}


                intencionId={grabbed.id}
                oportunidadCatalogo={oportunidadCatalogo}
                guardarOportunidad={guardarOportunidad}
            />

            <ModalDescalificar
                onDescalificarSave={onDescalificarSave}
                motivosCatalogo={motivosCatalogo}
                //dialog triggerr
                dialogDescalificar={dialogDescalificar}
                setDialogdescalificar={setDialogdescalificar}
            />

            <ModalActividadEnd
                dialogActividadEnd={dialogActividadEnd}
                setDialogActividadEnd={setDialogActividadEnd}
                name={grabbed.prospecto_nombres}
                guardarFase={
                    () => guardarFase({
                        id: grabbed.id,
                        fase_id: 2
                    })}
            />


            {/* 
            <Grid container>
                    <Grid item xs={12}>
                        <CallSipUi
                            speedDial={true}
                            intencionId={null}
                            phoneNumber={''}
                            guardarActividad={speedDialSubmit}
                        />
                    </Grid>
            </Grid> 
            */}


            <Tabsx>
                <IntencionGrid
                    data={intencionArr}
                    loading={intencionLoading}
                    setGrabbed={setGrabbed}
                />

                <Funnel />
            </Tabsx>

            {
                grabbed && grabbed.id &&
                <GestionUi

                    grabbed={grabbed}
                    setGrabbed={setGrabbed}

                    dialogOporunidad={dialogOporunidad}
                    setDialogOportunidad={setDialogOportunidad}

                    dialogActividadEnd={dialogActividadEnd}
                    setDialogActividadEnd={setDialogActividadEnd}

                    dialogDescalificar={dialogDescalificar}
                    setDialogdescalificar={setDialogdescalificar}

                    fasesCatalogo={fasesCatalogo}

                >
                    {
                        grabbed && grabbed.id &&
                        <TabsWrap>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <CallSipUi
                                        intencionId={grabbed.id}
                                        phoneNumber={grabbed.calling || ''}
                                        guardarActividad={guardarActividad}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <AgendarModule guardarActividad={guardarActividad} />
                                </Grid>
                            </Grid>
                            <>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <ModalActividadVincular
                                            open={modalVincularActividad}
                                            setOpen={setModalVincularActividad}
                                            onSubmit={guardarVincularActividad}
                                            actividadesAloneArr={actividadesAloneArr}
                                        />
                                    </Grid>
                                </Grid>


                                {
                                    fullItem &&
                                        fullItem.actividadesArr &&
                                        fullItem.actividadesArr.length ?
                                        fullItem.actividadesArr.map(item => {
                                            const { contenido, codigo } = item.tipo_actividad;
                                            return (
                                                <ListItem>
                                                    <ListItemIcon>
                                                        {
                                                            (codigo === 'phone') ? <CallRounded /> :
                                                                (codigo === 'video') && <VideocamRounded />
                                                        }
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={contenido}>
                                                    </ListItemText>
                                                </ListItem>
                                            );
                                        }) : <></>
                                }
                            </>
                        </TabsWrap>

                    }


                </GestionUi>
            }















        </>
    )

}


export default IntencionView;


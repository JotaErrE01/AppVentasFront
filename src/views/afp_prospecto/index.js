import React, { useEffect, useState } from 'react';

import { Grid, makeStyles, Paper } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';

import { useDispatch, useSelector } from 'src/store';
import { deleteProspecto, postProspecto, putProspecto } from 'src/slices/prospecto';
import { useSnackbar } from 'notistack';
import ModalSpeedDial from './modalSpeeDial';
import ModalEmbudo from './modalEmbudo'
import { postActividadAlone, postCargaProspectos, postStoreIntencionActividad } from 'src/slices/intencion';
import Header from './Header';
import { getProspectos, getProspecto } from 'src/slices/prospecto';


//:: new prospecto
import ProspectoGrid from 'src/views/afp_prospecto/ProspectoGrid'
import useAuth from 'src/contextapi/hooks/useAuth';
import ModalCreate from 'src/views/afp_prospecto/ModalCreate';
import ModalDelete from 'src/views/afp_prospecto/ModalDelete';
import CallSipUi from 'src/views/afp_intencion/actividades/CallSipUi';

import { getCatalogoOrigenHorizonte, getCatalogoOrigenInversion } from 'src/slices/catalogos';



const ProspectoView = () => {


    const classes = useStyles();
    const history = useHistory();
    const params = useParams();


    ///CREAR :: EDITAR


    const [edit, setEdit] = useState(false);

    //:: USING
    const [embudoOpen, setEmbudoOpen] = useState(false);

    const dispatch = useDispatch();



    //MANT LEADS

    const [grabArr, setGrabArr] = useState([]);
    const onGrabArr = (value) => {
        setGrabArr(value);
    }


    function handleEmbudo(grabArr) {
        
        dispatch(postCargaProspectos({ prospecto_ids: grabArr }, ()=>setEmbudoOpen(false) ))
    }


    //:: MANT SPEEDDIAL 
    const speedDialSubmit = (value) => {
        const callBack = () => { console.log('Done!')};
        dispatch(postActividadAlone(value, callBack));
    }


    //:: MANT PROSPECTO
    const { user } = useAuth();
    const [modalCrear, setModalCrear] = useState(params.id||false);
    const [modalDelete, setModalDelete] = useState(false);
    useEffect(() => {
        if (!modalCrear) {
            setModalDelete(false);
            history.push('/afp/prospecto/');
        }
    }, [modalCrear]);

    useEffect(() => {

        params.id
            ? dispatch(getProspecto(params.id, (e) => console.log(`--> LOADED BY ID ${e}`)))
            : dispatch(getProspectos(() => {}));

        if (user.tipo_venta_asesor == 1) {
            dispatch(getCatalogoOrigenHorizonte());
        }
        if (user.tipo_venta_asesor == 2) {
            dispatch(getCatalogoOrigenHorizonte());
        }
        if (user.tipo_venta_asesor == 3) {
            dispatch(getCatalogoOrigenHorizonte());
            dispatch(getCatalogoOrigenInversion());
        }

    }, [dispatch]);

    const _prospecto = useSelector(state => state.prospecto);
    const _catalogo = useSelector(state => state.catalogo);


    const catalogo = [
        ..._catalogo.origenInversion,
        ..._catalogo.origenHorizonte
    ];
    const onGrab = (id) => history.push(`/afp/prospecto/${id}`);


    const onProspectoSubmit = (values) => {

        const callBack = () => {
            history.push(`/afp/prospecto`);
            setModalCrear(false);
        }
        if (values.action == "DELETE") {
            dispatch(deleteProspecto(params.id, callBack));
            return;
        }
        !params.id && dispatch(postProspecto(values, callBack));
        params.id && dispatch(putProspecto(values, callBack));
    }
    //:: END MANT PROSPECTO



    return (

        <>


            <ModalCreate
                id={params.id}
                prospecto={_prospecto.prospecto && _prospecto.prospecto} // ON EDIT REUTILIZA FORM
                modalCrear={modalCrear}
                catalogoOrigen={catalogo}
                onProspectoSubmit={onProspectoSubmit}

                setModalCrear={setModalCrear}
                setModalDelete={setModalDelete}


            />

            <ModalDelete
                open={modalDelete}
                setOpen={setModalDelete}
                onSubmit={() => onProspectoSubmit({ action: 'DELETE' })}

            />

            <ModalEmbudo
                open={embudoOpen}
                setOpen={setEmbudoOpen}
                grabArr={grabArr}
                handleEmbudo={handleEmbudo}
            />

            <Header
                grabArr={grabArr}
                grabbedLength={grabArr.length}
                onEmbudoOpen={() => setEmbudoOpen(true)}
                editing={edit}
                setModalCrear={setModalCrear}
            />





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


            <Paper className={classes.paper}>
                <ProspectoGrid
                    data={_prospecto.prospectos}
                    loading={_prospecto.loading}
                    onGrab={onGrab}
                    onGrabArr={onGrabArr}
                />
            </Paper>




        </>
    )
}

export default ProspectoView;



const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        // marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        background: theme.palette.primary.contrastText
    }
}));


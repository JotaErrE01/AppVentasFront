import React, { useState, useEffect, Suspense } from 'react';
import Page from 'src/components/Page';
import { Backdrop, Container, makeStyles, CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';


//MODULES
import { useHistory, useParams } from 'react-router';
import _ from 'lodash';
import hash from 'object-hash';
import DateFnsUtils from "@date-io/date-fns";
import JSONTree from 'react-json-tree'
import clsx from 'clsx';
import PropTypes from 'prop-types'

//LOCAL
import LoadingScreen from 'src/components/LoadingScreen';
import ScreenWrap from 'src/views/afp_actividad/actividadEdit/ScreenWrap'
import ActividadEditForm from 'src/views/afp_actividad/actividadEdit/ActividadEditForm'
//REDUX FN
import { useDispatch, useSelector } from 'src/store';
import { getProspectos } from 'src/slices/prospecto'
import { getCatalogosByMaestro } from 'src/slices/catalogos'
import { getClientesSearch } from 'src/slices/clientes'

//CUSTOM HOOK
import useAuth from 'src/contextapi/hooks/useAuth';
import { getActividadById } from 'src/slices/actividad';

//THEME



const ActividadEdit = ({ create, id }) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory()
    const { user } = useAuth();
    const { tipo_venta_asesor } = user;

    const _actividad_filter = tipo_venta_asesor == 1 ? '_APH' : tipo_venta_asesor == 2 && '_API';

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(getProspectos(user.id, enqueueSnackbar));
        dispatch(getCatalogosByMaestro(_actividad_filter));
        id && dispatch(getActividadById(user.id, id, enqueueSnackbar));
    }, [dispatch]);


    const clienteSearch = (documento) => {
        dispatch(getClientesSearch(documento, enqueueSnackbar));
    }

    //REDUX GLOBAL
    const _prospecto = useSelector((state) => state.prospecto);
    const _catalogo = useSelector((state) => state.catalogo);
    const _cliente = useSelector((state) => state.cliente);
    const _actividad = useSelector((state) => state.actividad);

    const { catalogos: _catalogo_actividades, loadingList } = _catalogo;
    const _prospectos = _prospecto.prospectos;


    if (loadingList) {
        return (
            <Backdrop className={classes.backdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Container maxWidth="md" className={classes.root}>

            <ActividadEditForm
                actividad={!create && _actividad.actividad}
                prospectos={_prospectos}
                actividades={_catalogo_actividades}
                clienteSearch={clienteSearch}
                cliente={_cliente.ConsultarData && _cliente.ConsultarData}
                clienteWait={_cliente.loadData && _cliente.loadData}
                clienteError={_cliente.Alert && _cliente.Alert}
            />
        </Container>
    )
}

export default ActividadEdit;


const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

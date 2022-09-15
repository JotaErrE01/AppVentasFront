
//UI UX
import React, { useEffect, useState } from 'react'
import Skeleton from '@material-ui/lab/Skeleton';
import { Backdrop, Box, CircularProgress, Container, makeStyles, Paper } from '@material-ui/core';

///custom
import Page from 'src/components/Page';

//REDUX FN
import { useDispatch, useSelector } from 'src/store';
import { getActividadByUser } from 'src/slices/actividad';
import { useSnackbar } from 'notistack';

//CUSTOM HOOK
import useAuth from 'src/contextapi/hooks/useAuth';
import ActividadGrid from './ActividadGrid';
import { getCatalogoActividades, getCatalogoOrigenHorizonte, getCatalogoOrigenInversion } from 'src/slices/catalogos';
import JSONTree from 'react-json-tree';

const Actividades = ({ setEdit }) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();
    const { tipo_venta_asesor } = user;
    

    //FETCH
    useEffect(() => {

        dispatch(getActividadByUser(user, enqueueSnackbar));


        if(tipo_venta_asesor==1){
            dispatch(getCatalogoActividades('_APH'));
            dispatch( getCatalogoOrigenHorizonte());

        }
        if(tipo_venta_asesor==2){
            dispatch(getCatalogoActividades('_API'));
            dispatch(getCatalogoOrigenInversion());

        }
        if(tipo_venta_asesor==3){
            // dispatch(getCatalogoActividades('_APH'));
            // dispatch(getCatalogoOrigenHorizonte());
            // dispatch(getCatalogoActividades('_API'));
            // dispatch(getCatalogoOrigenInversion());

        }



      

    }, [dispatch]);


    //MUST
    const _actividad = useSelector(state => state.actividad);
    const _catalogo = useSelector(state => state.catalogo);
    const _catalogoOrigen = [..._catalogo.origenHorizonte, ..._catalogo.origenInversion];


    const debug = {
        data: _actividad.actividades,
        catalogoActividades:_catalogo.actividades,
        catalogoOrigen:_catalogoOrigen
      
    }


    return (
        <>
            {_actividad.error &&
                <Paper className={classes.root}>
                    <div>ERROR</div>
                </Paper>

            }
            {_actividad.loadingList || _catalogo.loadingList &&

                <Paper className={classes.root}>
                    <CircularProgress color="inherit" />
                </Paper>

            }
            {
             
                _catalogo.actividades.length &&
                _catalogoOrigen.length &&
                <ActividadGrid
                    data={_actividad.actividades}
                    catalogoActividades={_catalogo.actividades}
                    catalogoOrigen={_catalogoOrigen}
                    setEdit={setEdit}
                    loading={_actividad.loadingList }
                />
            }
        
           
        </>

    )





}

export default Actividades;


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.light,
        minHeight: '12em',
        display:"flex",
        flexDirection:"column",
        justifyContent: 'center',
        alignItems:'center'
    },


    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    }
}));


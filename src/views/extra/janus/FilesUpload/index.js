import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store';
import useAuth from 'src/contextapi/hooks/useAuth';
import { getFondoAporteEdit, getObtenerDocumentosOportunidad } from 'src/slices/clientes';
import { useParams } from 'react-router';
import JSONTree from 'react-json-tree';
import FilesUploadView from './FilesUploadView'
import Page from 'src/components/Page';
import { Box, CircularProgress } from '@material-ui/core';



const FilesUploaddContainer = ({oportunidad_id}) => {

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const _clientes = useSelector(state => state.cliente);

    const { adjuntosLoading, 
        adjuntosError,
        archivosAdjuntos, 
        adjuntosCheckList,
        Oportunidad,
    } = _clientes;


    useEffect(() => {
        try {
            dispatch(getObtenerDocumentosOportunidad(oportunidad_id));
            dispatch(getFondoAporteEdit(oportunidad_id));
        }
        catch (err) {
            console.error(err);
        }
    }, []);

    if (adjuntosLoading) {
        return <Box m={3} style={{justifyContent:'center', display:'flex'}}>
            <CircularProgress />
        </Box>


    }

    return (


            <FilesUploadView
                oportunidadId={oportunidad_id}
                oportunidad={Oportunidad}
                adjuntosCheckList={adjuntosCheckList}
                archivosAdjuntos={archivosAdjuntos}
                adjuntosError={adjuntosError}
            />

         


    )
}

export default FilesUploaddContainer

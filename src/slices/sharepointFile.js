import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import URL from 'src/config/baseurl';
import { StaticRouter } from 'react-router';
import { isDebuggerStatement } from 'typescript';

const initialState = {
    sharepointFiles: [],
    loading: false,
    error: false,
    sharepointFile: {},
    tipoFondos: []
}

const slice = createSlice({
    name: 'sharepointFile',
    initialState,
    reducers: {
        //:: READ ALL
        getSharepointFilesFetch(state) {
            state.sharepointFiles = [];
            state.loading = true;
            state.error = false;
        },
        getSharepointFilesSuccess(state, action) {

            const { sharepointFiles, tipoFondos, catDistribucion } = action.payload.data;
            state.catDistribucion = catDistribucion;
            state.sharepointFiles = sharepointFiles;
            state.tipoFondos = tipoFondos;

            state.loading = false;
            state.error = false;
        },
        getSharepointFilesError(state, action) {
            state.sharepointFiles = initialState.sharepointFiles;
            state.loading = false;
            state.error = false;
        },

        //:: POST
        postSharepointFilesFetch(state) {

            state.loading = true;
            state.error = false;
        },
        postSharepointFilesSuccess(state, action) {

            state.sharepointFiles.push(action.payload);
            state.loading = false;
            state.error = false;
        },
        postSharepointFilesError(state, action) {

            state.loading = false;
            state.error = action.payload;
        },

        //:: POST
        deleteSharepointFilesFetch(state) {

            state.loading = true;
            state.error = false;
        },
        deleteSharepointFilesSuccess(state, action) {
            const { id } = action.payload.roleHasSharepoint
            _.remove(state.sharepointFiles, item => item.id === id);

            
            state.loading = false;
            state.error = false;
        },
        deleteSharepointFilesError(state, action) {

            state.loading = false;
            state.error = action.payload;
        },

    }
});


//:: READ ALL
export const getSharepointFile = (enqueueSnackbar) => async (dispatch) => {

    const { getSharepointFilesFetch, getSharepointFilesSuccess, getSharepointFilesError } = slice.actions;
    dispatch(getSharepointFilesFetch());

    try {

        const response = await axs.get(`${URL}/afp/crm/rol_has_sharepoint_file`);

        const { data } = response;

        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(getSharepointFilesSuccess(data));
            return;
        }
        throw data.mensaje;
    }
    catch (error) {
        const payload = error ? error : 'Error en los servicios';

        dispatch(getSharepointFilesError(payload));
        enqueueSnackbar(error, { variant: 'error' });
    }
};

//:: POST
export const postSharepointFile = (body, enqueueSnackbar, cb) => async (dispatch) => {



    const { postSharepointFilesFetch, postSharepointFilesSuccess, postSharepointFilesError } = slice.actions;
    dispatch(postSharepointFilesFetch());
    try {
        const response = await axs.post(`${URL}/afp/crm/rol_has_sharepoint_file`, body);
        const { data } = response;
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(postSharepointFilesSuccess(data.data));
            cb();
            return;
        }
        throw data.mensaje;
    }
    catch (error) {

        dispatch(postSharepointFilesError(error ? error : 'Error al subir el archivo'));
        enqueueSnackbar('Error al subir el archivo', { variant: 'error' });
    }
}

//:: POST
export const deleteSharePointFile = (id, enqueueSnackbar) => async (dispatch) => {
    
    const { deleteSharepointFilesFetch, deleteSharepointFilesSuccess, deleteSharepointFilesError } = slice.actions;
    dispatch(deleteSharepointFilesFetch());
    try {

        const response = await axs.post(`${URL}/afp/crm/rol_has_sharepoint_file/${id}`, { _method: 'delete' });
        


        const { data } = response;
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(deleteSharepointFilesSuccess(data.data));
            return;
        }
        throw data.mensaje;
    }
    catch (error) {

        dispatch(deleteSharepointFilesError(error ? error : 'Error al eliminar archivo'));
        enqueueSnackbar('Error al eliminar el archivo', { variant: 'error' });
    }
}




export const reducer = slice.reducer;

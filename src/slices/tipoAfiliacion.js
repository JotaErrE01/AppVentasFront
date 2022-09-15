import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import URL from 'src/config/baseurl';


const initialState = {
    tipoAfiliaciones: [],
    loading: false,
    error: false,
}


//afp/crm/cliente/tipoAfiliacion

const slice = createSlice({
    name: 'tipoaFiliacion',
    initialState,
    reducers: {
        //:: READ BY CEDULA FONDO ID
        getTipoAfiliacionesFetch(state, action) {
            state.tipoAfiliaciones = []
            state.loading = true;
        },
        getTipoAfiliacionesSuccess(state, action) {
            state.tipoAfiliaciones = action.payload.data;
            state.loading = false;
            state.error = false;
        },
        getTipoAfiliacionesError(state, action) {
            state.tipoAfiliaciones = [];
            state.loading = false;
            state.error = action.payload;
        }
    }
});






export const getTipoAfiliaciones = ( enqueueSnackbar, numero_identificacion) => async (dispatch) => {
    const { getTipoAfiliacionesFetch, getTipoAfiliacionesSuccess, getTipoAfiliacionesError } = slice.actions;
    dispatch(getTipoAfiliacionesFetch());
        try {
            const { data } = await axs.get(`${URL}/afp/crm/cliente/tipoAfiliacion/${numero_identificacion}`);
            
            if (data.success) {
                enqueueSnackbar(data.mensaje, { variant: 'success' });
                dispatch(getTipoAfiliacionesSuccess(data));
                return;
            }
            throw data.mensaje;
        }
        catch (error) {
            dispatch(getTipoAfiliacionesError(error ? error : 'Error en los servicios'));
            enqueueSnackbar("Error en los servicios", { variant: 'error' });
        }
    

};




export const reducer = slice.reducer;

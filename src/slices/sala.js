import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import URL from 'src/config/baseurl';

const initialState = {
    salas: [],
    loading: false,

    sala: {},
    loadingSala: false,


}

const slice = createSlice({
    name: 'sala',
    initialState,
    reducers: {

        // :: LIST
        getSalasFetch(state) {
            state.salas = [];
            state.loading = true;
        },
        getSalasSuccess(state, action) {

            state.salas = action.payload
            state.loading = false;
        },


        // :: LIST ITEM
        getSalaFetch(state) {
            state.sala = false;
            state.loadingSala = true;
        },
        getSalaSuccess(state, action) {
            state.sala = action.payload
            state.loadingSala = false;
        },

        // :: CREATE
        postSalaFetch(state) {
            state.loading = true;
        },
        postSalaSuccess(state, action) {
            const salas = [...state.salas, action.payload]
            state.salas = salas;
        },

        // :: EDITT

        putSalaFetch(state) {
            state.loading = true;
        },
        putSalaSuccess(state, action) {
            const salas = [...state.salas];
            const i = salas.findIndex(x => x.id === action.payload.id);
            salas[i] = action.payload;
            state.salas = [...salas]
            state.loading = false;
        },

        // :: DELETE

        deleteSalaFetch(state) {
            state.loading = true;
        },
        deleteSalaSuccess(state, action) {
            const salas = [...state.salas];
            const i = salas.findIndex(x => x.id === action.payload.id);
            salas.splice(i, 1);
            state.salas = [...salas]
            state.loading = false;
        },






    }
});


export const reducer = slice.reducer;




export const getSalas = (enqueueSnackbar) => async (dispatch) => {


    try {
        const { getSalasFetch, getSalasSuccess } = slice.actions;

        dispatch(getSalasSuccess());
        const response = await axs.get(`${URL}/afp/crm/salas`);
        const { data } = response;
        if (data.success) {
            // enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(getSalasSuccess(data.payload));
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }

    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });

    }
};

export const getSala = (enqueueSnackbar, id) => async (dispatch) => {


    try {
        const { getSalaFetch, getSalaSuccess } = slice.actions;

        dispatch(getSalaFetch());
        const response = await axs.get(`${URL}/afp/crm/salas/${id}`);

        
        const { data } = response;
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(getSalaSuccess(data.payload));
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }

    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });

    }
};

export const postSala = (enqueueSnackbar, body, cb) => async (dispatch) => {

    
    const { postSalaFetch, postSalaSuccess } = slice.actions;

    dispatch(postSalaFetch());

    try {
        const response = await axs.post(`${URL}/afp/crm/salas`, body);
        const { data } = response;
        
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            cb();
            dispatch(postSalaSuccess(data.payload));
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }

    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });

    }
};

export const putSala = (enqueueSnackbar, body, cb) => async (dispatch) => {

    
    const { putSalaFetch, putSalaSuccess } = slice.actions;

    dispatch(putSalaFetch());

    try {
        const response = await axs.post(`${URL}/afp/crm/salas`, { _method: 'put', ...body });
        const { data } = response;
        
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(putSalaSuccess(data.payload));

            cb();
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }

    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });

    }
};

export const deleteSala = (enqueueSnackbar, id, cb) => async (dispatch) => {

    
    const { deleteSalaFetch, deleteSalaSuccess } = slice.actions;
    dispatch(deleteSalaFetch());

    try {
        const response = await axs.post(`${URL}/afp/crm/salas/${id}`, { _method: 'delete' });
        const { data } = response;
        
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(deleteSalaSuccess(data.payload));
            cb();
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }

    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });

    }
};



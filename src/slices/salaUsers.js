import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import URL from 'src/config/baseurl';

const initialState = {
    catalogoUsers: [],
    salaUsers:[],
    loading: false,
}

const slice = createSlice({
    name: 'sala',
    initialState,
    reducers: {

      

        //:::::::::::::::     :::::::::::::::::/
        getCatalogoUsersFetch(state) {
            state.catalogoUsers = [];
            state.loading = true;
        },
        getCataloguUsersSuccess(state, action) {
            state.catalogoUsers = action.payload
            state.loading = false;
        },


           // :: LIST
        getSalaUserFetch(state,action) {
            state.salaUsers=[];
            state.loading = true;
        },
        getSalaUserSuccess(state, action) {
            
            state.salaUsers=action.payload;

           state.loading = false;
        },


        // :: CREATE
        postSalaUserFetch(state) {
            state.loading = true;
        },
        postSalaUserSuccess(state, action) {
           state.loading = false;
        },


        // :: DELETE

        deleteSalaUserFetch(state,action) {
            state.loading = true;
        },
        deleteSalaUserSuccess(state, action) {
           state.loading = false;
        },




    }
});


export const reducer = slice.reducer;


export const getSalaUsers = (enqueueSnackbar, id) => async (dispatch) => {
    const { getSalaUserFetch, getSalaUserSuccess } = slice.actions;
    try {
        dispatch(getSalaUserFetch());
        const response = await axs.get(`${URL}/afp/crm/salasUsers/${id}`);
        const { data } = response;
        if (data.success) {
            
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(getSalaUserSuccess(data.payload));
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }
    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });

    }
};


export const postSalaUser = (enqueueSnackbar, body, cb) => async (dispatch) => {

    const { postSalaUserFetch, postSalaUserSuccess } = slice.actions;
    try {
        dispatch(postSalaUserFetch());
        const response = await axs.post(`${URL}/afp/crm/salasUsers`, body);
        const { data } = response;
        
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            cb();
            dispatch(postSalaUserSuccess(data.payload));
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }

    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });

    }
};



export const deleteSalaUser = (enqueueSnackbar, body, cb) => async (dispatch) => {

    
    const { deleteSalaUserFetch, deleteSalaUserSuccess } = slice.actions;

    try {
        dispatch(deleteSalaUserFetch());

        const response = await axs.post(`${URL}/afp/crm/salasUsers/delete`,body);
        const { data } = response;

        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(deleteSalaUserSuccess(data.payload));
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

//:::::::::::::::::::         ::::::::::::::::::::::::

//:: READ CATALOGO USERS
export const getCatalogoUsers = (enqueueSnackbar) => async (dispatch) => {
    const { getCatalogoUsersFetch, getCataloguUsersSuccess } = slice.actions;
    try {
        dispatch(getCatalogoUsersFetch());
        const response = await axs.get(`${URL}/afp/crm/salasUsers/catalogoUsers`);
        const { data } = response;
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(getCataloguUsersSuccess(data.payload));
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
        }

    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });
    }
};




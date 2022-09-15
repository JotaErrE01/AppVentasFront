import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import URL from 'src/config/baseurl';
import { ToastContainer, toast } from 'react-toastify';


const initialState = {
    coreSalaArr: [],
    loadingArr: false,

    coreSala: {},
    loading: false,


    buildingSala: false,
    buildResult: false,
}


const slice = createSlice({
    name: 'coreSalas',
    initialState,
    reducers: {
        // :: LIST
        getSalasFetch(state) {
            state.coreSalaArr = [];
            state.loadingArr = true;
        },
        getSalasSuccess(state, action) {
            state.coreSalaArr = action.payload
            state.loadingArr = false;
        },

        // :: ITEM
        getSalaFetch(state) {
            state.coreSala = {};
            state.loading = true;
        },
        getSalaSuccess(state, action) {
            state.coreSala = action.payload
            state.loading = false;
        },


        // :: BUILDD
        buildSalaFetch(state) {
            
            state.buildingSala = true;
            state.buildResult = {};
        },
        buildSalaSuccess(state, action) {
            
            state.buildingSala = false;
            state.buildResult = action.payload;
        },
        buildSalaError(state, action) {
            state.buildingSala = false;
        }
    }
});

export const reducer = slice.reducer;



export const getSalasCore = () => async (dispatch) => {


    const { getSalasFetch, getSalasSuccess } = slice.actions;
    try {
        dispatch(getSalasFetch());
        const response = await axs.get(`${URL}/afp/user/showSalas`);
        
        const { data } = response;
        if (data.success) {
            dispatch(getSalasSuccess(data.payload));
        } else {
            toast.error(data.mensaje)
        }

    }
    catch (error) {
        toast.error('Lo sentimos, hubo un error al cagar el módulo de salas')

    }
};

export const getSalaCore = (idSala) => async (dispatch) => {

    const { getSalaSuccess, getSalaFetch } = slice.actions;

    try {


        dispatch(getSalaFetch());
        const response = await axs.get(`${URL}/afp/user/showSala/${idSala}`);


        const { data } = response;
        if (data.success) {
            dispatch(getSalaSuccess(data.payload));



        } else {
            toast.error(data.mensaje)
        }

    }
    catch (error) {
        toast.error('Lo sentimos, hubo un error al cagar el módulo de salas')


    }
};

export const buildSalasCore = (cb) => async (dispatch) => {

    const { buildSalaFetch, buildSalaSuccess, buildSalaError } = slice.actions;

    try {
        dispatch(buildSalaFetch())
        const response = await axs.get(`${URL}/afp/user/buildSala`);
        
        

        const { data } = response;

        if (data.success) {
            dispatch(buildSalaSuccess(data.payload));
            cb();
            toast.success('Salas actualizadas con éxito');

        } else {
            toast.error('Se produjo un error al actualizar las salas de venta')
            dispatch(buildSalaError());
        }
    } catch (error) {
        toast.error('Se produjo un error al actualizar las salas de venta')
        dispatch(buildSalaError());
    }

}


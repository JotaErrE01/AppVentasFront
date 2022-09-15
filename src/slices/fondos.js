import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axs from 'src/utils/axs';
import baseurl from 'src/config/baseurl';

const initialState = {
    fondoCortoAndLargoPlazo: '',
    TabOnCreateFondo: '',
};

const slice = createSlice({
    name: 'fondo',
    initialState,
    reducers: {
        fondoCortoAndLargo(state, action) {
            const fondoCL = action.payload;
            state.fondoCortoAndLargoPlazo = fondoCL;
        },
        actionRenderTabOnCreate(state, action) {
            const optionRender = action.payload;
            state.TabOnCreateFondo = optionRender;
        },
    }
});

export const reducer = slice.reducer;

export const fondoCortoAndLargo = (codigo) => async (dispatch) => {
    dispatch(slice.actions.fondoCortoAndLargo(codigo));
}

export const actionRenderTabOnCreate = (option) => async (dispatch) => {
    dispatch(slice.actions.actionRenderTabOnCreate(option));
}
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
import axs from 'src/utils/axs';
import { setArchivosAdjuntosChecklist, setOportunidad } from './clientes';

const initialState = {
	fondosLargoPlazo: [],
	loadingSubmit: false,
	error: {}
};

const slice = createSlice({
	name: 'fondosLargoPlazo',
	initialState,
	reducers: {
		crearFondo(state, action) {
			state.loadingSubmit = true;
		},
		crearFondoSuccess(state, action) {
			state.loadingSubmit = false;
		},
		crearFondoError(state, action) {
			state.loadingSubmit = false;
		},
		crearFondoMaster(state, action) {
			state.loadingSubmit = true;
		},
		crearFondoMasterSuccess(state, action) {
			state.loadingSubmit = false;
		},
		crearFondoMasterError(state, action) {
			state.loadingSubmit = false;
		},
		updateFondoMaster(state, action) {
			state.loadingSubmit = true;
		},
		updateFondoMasterSuccess(state, action) {
			state.loadingSubmit = false;
		},
		updateFondoMasterError(state, action) {
			state.loadingSubmit = false;
		}
	}
});

// const URL = baseurl;
export const reducer = slice.reducer;

export const crearFondo = (body, onSuccess) => async (dispatch) => {
	
	dispatch(slice.actions.crearFondo());
	console.log('crearFondo');
	try {
		let response = await axs({
			method: 'post',
			url: baseurl + '/afp/crm/oportunidad/crear',
			data: body
		});

		let { success, data, mensaje, error } = response.data;

		if (success) {
			dispatch(setOportunidad(data));
			dispatch(slice.actions.crearFondoSuccess());
			onSuccess && onSuccess(data.id, mensaje);
		} else {
			dispatch(slice.actions.crearFondoError(error));
		}
	} catch (e) {
		console.log(e);
		dispatch(slice.actions.crearFondoError(e));
	}
};

export const crearFondoMaster = (body, onSuccess) => async (dispatch) => {
	dispatch(slice.actions.crearFondoMaster());

	try {
		let response = await axs({
			method: 'post',
			url: baseurl + '/afp/crm/oportunidad/crear/master',
			data: body
		});

		let { success, data, error } = response.data;

		if (success) {
			dispatch(setOportunidad(data));
			dispatch(slice.actions.crearFondoMasterSuccess());
			onSuccess && onSuccess(data.id);
		} else {
			dispatch(slice.actions.crearFondoMasterError(error));
		}
	} catch (e) {
		console.log(e);
		dispatch(slice.actions.crearFondoMasterError(e));
	}
};

export const updateFondo = (body, onSuccess) => async (dispatch) => {
	dispatch(slice.actions.updateFondoMaster());

	try {
		let response = await axs({
			method: 'post',
			url: baseurl + '/afp/crm/oportunidad/actualizar/aportes',
			data: body
		});

		let { success, data, mensaje } = response.data;

		if (success) {
			dispatch(setOportunidad(data));
			dispatch(slice.actions.updateFondoMasterSuccess());
			onSuccess && onSuccess(data.id, mensaje);
		} else {
			dispatch(slice.actions.updateFondoMasterError());
		}
	} catch (e) {
		console.log(e);
		dispatch(slice.actions.updateFondoMasterError());
	}
};

export default slice;

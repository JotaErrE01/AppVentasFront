import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
// import axios from 'src/utils/axios_old';

const initialState = {
	fases: [],
	isEditingForm: false,
	loadingForm: false,
	loadingDelete: false
};

const slice = createSlice({
	name: 'fasesEmbudo',
	initialState,
	reducers: {
		getFases(state, action) {
			const fases = action.payload;
			state.fases = fases.filter((fase) => fase.cat_id == 'FEV');
		},
		setIsEditingForm(state, action) {
			const isEditing = action.payload;
			state.isEditingForm = isEditing;
		},
		setEditingId(state, action) {
			const id = action.payload;
			state.editingId = id;
		},
		setDeletingId(state, action) {
			const id = action.payload;
			state.deletingId = id;
		},
		savingFaseCatalogo(state) {
			state.loadingForm = true;
		},
		createCatalogoSuccess(state, action) {
			const catalogo = action.payload;
			state.loadingForm = false;
			state.isEditingForm = false;
			state.fases.push(catalogo);
		},
		updateCatalogoSuccess(state, action) {
			const fase = action.payload;
			state.loadingForm = false;
			state.editingId = null;
			state.fases = _.map(state.fases, function(item) {
				return item.id === fase.id ? fase : item;
			});
		},
		deletingCatalogo(state) {
			state.loadingDelete = true;
		},
		deleteCatalogoSuccess(state, action) {
			const fase = action.payload;
			state.deletingId = null;
			state.loadingDelete = false;
			state.fases = state.fases.filter((fas) => fas.id != fase.id);
		},
		saveCatalogoError(state, action) {
			const error = action.payload;
			state.loadingForm = false;
			state.error = error;
		},
		deleteCatalogoError(state, action) {
			const error = action.payload;
			state.error = error;
		}
	}
});

const URL = baseurl;
export const reducer = slice.reducer;

export const getFases = () => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogo/ver');

	dispatch(slice.actions.getFases(response.data));
};

export const setIsEditingForm = (isEditing) => async (dispatch) => {
	dispatch(slice.actions.setIsEditingForm(isEditing));
};

export const setEditingId = (editingId) => async (dispatch) => {
	dispatch(slice.actions.setEditingId(editingId));
};

export const setDeletingId = (deletingId) => async (dispatch) => {
	dispatch(slice.actions.setDeletingId(deletingId));
};

export const createFaseCatalogo = (catalogo, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.savingFaseCatalogo());

	try {
		const response = await axs.post(URL + '/afp/crm/catalogo', catalogo);

		let { data } = response;

		if (data.success) {
			enqueueSnackbar(data.mensaje, {
				variant: 'success'
			});

			dispatch(slice.actions.createCatalogoSuccess(data.data));
		} else {
			enqueueSnackbar(data.mensaje, {
				variant: 'error'
			});

			dispatch(slice.actions.saveCatalogoError(data.error));
		}
	} catch (e) {
		enqueueSnackbar('Ocurrió un error con los servicios', {
			variant: 'error'
		});

		dispatch(slice.actions.saveCatalogoError(e));
	}
};

export const updateFaseCatalogo = (catalogo, enqueueSnackbar, setIdeSelectedMenu) => async (dispatch) => {
	dispatch(slice.actions.savingFaseCatalogo());

	try {
		const response = await axs.put(URL + '/afp/crm/catalogo', catalogo);

		let { data } = response;

		if (data.success) {
			enqueueSnackbar(data.mensaje, {
				variant: 'success'
			});

			setIdeSelectedMenu(null);

			dispatch(slice.actions.updateCatalogoSuccess(data.data));
		} else {
			enqueueSnackbar(data.mensaje, {
				variant: 'error'
			});

			dispatch(slice.actions.saveCatalogoError(data.error));
		}
	} catch (e) {
		enqueueSnackbar('Ocurrió un error con los servicios', {
			variant: 'error'
		});

		dispatch(slice.actions.saveCatalogoError(e));
	}
};

export const deleteFaseCatalogo = (id, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.deletingCatalogo());

	try {
		const response = await axs.delete(URL + '/afp/crm/catalogo/' + id);

		let { data } = response;

		if (data.success) {
			enqueueSnackbar(data.mensaje, {
				variant: 'success'
			});

			dispatch(slice.actions.deleteCatalogoSuccess(data.data));
		} else {
			enqueueSnackbar(data.mensaje, {
				variant: 'error'
			});

			dispatch(slice.actions.deleteCatalogoError(data.error));
		}
	} catch (e) {
		enqueueSnackbar('Ocurrió un error con los servicios', {
			variant: 'error'
		});

		dispatch(slice.actions.deleteCatalogoError(e));
	}
};

export default slice;

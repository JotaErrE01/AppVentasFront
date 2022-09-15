import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs'
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
// import axios from 'src/utils/axios_old';

const initialState = {
	catalogos: [],
	isEditingForm: false,
	loadingForm: false,
	loadingDelete: false
};

const slice = createSlice({
	name: 'catalgosMaestros',
	initialState,
	reducers: {
		getCatalogosMaestros(state, action) {
			const catalogos = action.payload;
			state.catalogos = catalogos;
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
		savingCatalogo(state) {
			state.loadingForm = true;
		},
		createCatalogoSuccess(state, action) {
			const catalogo = action.payload;
			state.loadingForm = false;
			state.isEditingForm = false;
			state.catalogos.push(catalogo);
		},
		updateCatalogoSuccess(state, action) {
			const catalogo = action.payload;
			state.loadingForm = false;
			state.editingId = null;
			state.catalogos = _.map(state.catalogos, function (item) {
				return item.id === catalogo.id ? catalogo : item;
			});
		},
		deletingCatalogo(state) {
			state.loadingDelete = true;
		},
		deleteCatalogoSuccess(state, action) {
			const catalogo = action.payload;
			state.deletingId = null;
			state.loadingDelete = false;
			state.catalogos = state.catalogos.filter((cat) => cat.id != catalogo.id);
			// state.catalogos = _.filter(state.catalogos, { id: catalogo.id });
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

export const reducer = slice.reducer;

const URL = baseurl;

export const getCatalogosMaestros = () => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogomaestro/ver');
	
	dispatch(slice.actions.getCatalogosMaestros(response.data));
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

export const createCatalogo = (catalogo, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.savingCatalogo());

	try {
		const response = await axs.post(URL + '/afp/crm/catalogomaestro', catalogo);

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

export const updateCatalogo = (catalogo, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.savingCatalogo());

	try {
		const response = await axs.post(URL + '/afp/crm/catalogomaestro', {_method: 'put',...catalogo},
		
		);

		let { data } = response;

		if (data.success) {
			enqueueSnackbar(data.mensaje, {
				variant: 'success'
			});

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

export const deleteCatalogo = (id, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.deletingCatalogo());

	try {
		const response = await axs.post(URL+'/afp/crm/catalogomaestro/'+id , {_method: 'delete'})

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

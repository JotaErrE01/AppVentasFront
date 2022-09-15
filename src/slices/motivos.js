import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
// import axios from 'src/utils/axios_old';

const initialState = {
	motivos: [],
	isEditingForm: false,
	loadingForm: false,
	loadingDelete: false
};

const slice = createSlice({
	name: 'motivos',
	initialState,
	reducers: {
		getMotivosCatalogo(state, action) {
			const motivos = action.payload;
			state.motivos = motivos.filter((motivo) => motivo.cat_id == 'VM');
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
			const motivo = action.payload;
			state.loadingForm = false;
			state.isEditingForm = false;
			state.motivos.push(motivo);
		},
		updateCatalogoSuccess(state, action) {
			const motivo = action.payload;
			state.loadingForm = false;
			state.editingId = null;
			state.motivos = _.map(state.motivos, function(item) {
				return item.id === motivo.id ? motivo : item;
			});
		},
		deletingCatalogo(state) {
			state.loadingDelete = true;
		},
		deleteCatalogoSuccess(state, action) {
			const motivo = action.payload;
			state.deletingId = null;
			state.loadingDelete = false;
			state.motivos = state.motivos.filter((mt) => mt.id != motivo.id);
			// state.motivos = _.filter(state.motivos, { id: catalogo.id });
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

export const getMotivosCatalogo = () => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogo/ver');

	dispatch(slice.actions.getMotivosCatalogo(response.data));
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

export const createMotivosCatalogo = (catalogo, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.savingCatalogo());

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

export const updateMotivosCatalogo = (catalogo, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.savingCatalogo());

	try {
		//const response = await Axios.put(URL + '/afp/crm/catalogo', catalogo);
		const response = await axs.post(URL + '/afp/crm/catalogo', { _method: 'put', ...catalogo });

		let { data } = response;

		if (data.success) {
			enqueueSnackbar('Actualizado exitosamente', {
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

export const deleteMotivosCatalogo = (id, enqueueSnackbar) => async (dispatch) => {
	dispatch(slice.actions.deletingCatalogo());

	try {
		const response = await axs.post(URL + '/afp/crm/catalogo/' + id, { _method: 'delete' });

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

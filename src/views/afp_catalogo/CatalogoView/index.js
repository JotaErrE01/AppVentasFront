import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
import axs from 'src/utils/axs';

const initialState = {
	catalogos: [],
	isEditingForm: false,
	loadingForm: false,
	loadingDelete: false,
	loadingList: false,
	paises: [],
	tiposDocumento: [],
	nivelesPreparacion: [],
	estadosCiviles: [],
	bancos: [],
	tipoCuentas: [],
	fondoHorizonte: [],
	fondoInversion: [],
	parentescos: [],
	actividades:[]
};

const slice = createSlice({
	name: 'catalgos',
	initialState,
	reducers: {
		getCatalogos(state, action) {
			const catalogos = action.payload;
			state.catalogos = catalogos;
			state.loadingList = false;
		},
		getCatalogoPaisesSuccess(state, action) {
			const paises = action.payload;
			state.paises = paises;
		},
		getCatalogoTiposDocumentoSuccess(state, action) {
			const tiposDocumento = action.payload;
			state.tiposDocumento = tiposDocumento;
		},
		getCatalogoNivelPreparacionSuccess(state, action) {
			const nivelesPreparacion = action.payload;
			state.nivelesPreparacion = nivelesPreparacion;
		},
		getCatalogoEstadosCivilesSuccess(state, action) {
			const estadosCiviles = action.payload;
			state.estadosCiviles = estadosCiviles;
		},
		getCatalogoBancosSuccess(state, action) {
			const bancos = action.payload;
			state.bancos = bancos;
		},
		getCatalogoTipoCuentasSuccess(state, action) {
			const tipoCuentas = action.payload;
			state.tipoCuentas = tipoCuentas;
		},
		getCatalogoFondoHorizonteSuccess(state, action) {
			const fondoHorizonte = action.payload;
			state.fondoHorizonte = fondoHorizonte;
		},
		getCatalogoFondoInversionSuccess(state, action) {
			const fondoInversion = action.payload;
			state.fondoInversion = fondoInversion;
		},
		getCatalogoParentescoSuccess(state, action) {
			const parentescos = action.payload;
			state.parentescos = parentescos;
		},
		getCatalogoActividadesSuccess(state, action) {
			state.loadingList=false;

			state.actividades = action.payload;;
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
		loadingList(state) {
			state.loadingList = true;
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
			state.catalogos = _.map(state.catalogos, function(item) {
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

const URL = baseurl;
export const reducer = slice.reducer;

export const getCatalogos = () => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogo/ver');
	
	dispatch(slice.actions.getCatalogos(response.data));
};

export const getCatalogosByMaestro = (maestro_id) => async (dispatch) => {
	dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + maestro_id);
	dispatch(slice.actions.getCatalogos(response.data));
};

export const getCatalogoPaises = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'PA');

	dispatch(slice.actions.getCatalogoPaisesSuccess(response.data));
};

export const getCatalogoTiposDocumento = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'TD');

	dispatch(slice.actions.getCatalogoTiposDocumentoSuccess(response.data));
};

export const getCatalogoNivelPreparacion = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'NP');

	dispatch(slice.actions.getCatalogoNivelPreparacionSuccess(response.data));
};

export const getCatalogoEstadosCivies = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'CI');
	
	dispatch(slice.actions.getCatalogoEstadosCivilesSuccess(response.data));
};

export const getCatalogoBancos = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'CB');
	
	dispatch(slice.actions.getCatalogoBancosSuccess(response.data));
};

export const getCatalogoTipoCuentas = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'CTC');
	
	dispatch(slice.actions.getCatalogoTipoCuentasSuccess(response.data));
};

export const getCatalogoFondoHorizonte = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'FH');
	
	dispatch(slice.actions.getCatalogoFondoHorizonteSuccess(response.data));
};

export const getCatalogoFondoInversion = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'FI');
	
	dispatch(slice.actions.getCatalogoFondoInversionSuccess(response.data));
};

export const getCatalogoParentesco = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'PN');
	
	dispatch(slice.actions.getCatalogoParentescoSuccess(response.data));
};

export const getCatalogoActividades = (maestro_id) => async (dispatch) => {
	dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + maestro_id);
	dispatch(slice.actions.getCatalogoActividadesSuccess(response.data));
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

export const updateCatalogo = (catalogo, enqueueSnackbar) => async (dispatch) => {
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

export const deleteCatalogo = (id, enqueueSnackbar) => async (dispatch) => {
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

export const getCatalogo = (catalogoId) => async (dispatch) => {
    const response = await axs.get(baseurl + `/afp/crm/catalogo/${catalogoId}`);
    dispatch(slice.actions.getCatalogos(response.data))
};




export default slice;

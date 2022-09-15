import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
import axs from 'src/utils/axs';
import { _getCatalogo, _getCatalogoPaises } from 'src/utils/catalogosUtil';

const initialState = {
	catalogos: [],
	isEditingForm: false,
	loadingForm: false,
	loadingDelete: false,
	loadingList: false,
	paises: [],
	nacionalidades: [],
	tiposDocumento: [],
	nivelesPreparacion: [],
	estadosCiviles: [],
	bancos: [],
	tipoCuentas: [],
	fondoHorizonte: [],
	fondoInversion: [],
	parentescos: [],
	parentescosAEE: [],
	actividades: [],
	origenInversion: [],
	origenHorizonte: [],
	provincias: [],
	provinciasEmpresa: [],
	aeInversion: [],
	aeHorizonte: [],
	sexos: [],
	cantones: [],
	cantonesEmpresa: [],
	parroquias: [],
	parroquiasEmpresa: [],
	titulos: [],
	valorUnidad: {},
	loadError: false,
	frecuenciaAcreditacion: [],
	tipoIdentificacion: [],
	formaPagos: [],
	tipoTitulares: [],
	tipoEmpresas: [],
	bancosAcreditacion: [],
	tipoCuentasAcreditacion: []
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
		getCatalogoNacionalidadesSuccess(state, action) {
			const nacionalidades = action.payload;
			state.nacionalidades = nacionalidades;
		},
		getCatalogoProvinciaSuccess(state, action) {
			const provincias = action.payload;
			state.provincias = provincias;
		},
		getCatalogoProvinciaEmpresaSuccess(state, action) {
			const provincias = action.payload;
			state.provinciasEmpresa = provincias;
		},
		getCatalogoCantonesSuccess(state, action) {
			const cantones = action.payload;
			state.cantones = cantones;
		},
		getCatalogoCantonesEmpresaSuccess(state, action) {
			const cantones = action.payload;
			state.cantonesEmpresa = cantones;
		},
		getCatalogoParroquiasSuccess(state, action) {
			const parroquias = action.payload;
			state.parroquias = parroquias;
		},
		getCatalogoParroquiasEmpresaSuccess(state, action) {
			const parroquias = action.payload;
			state.parroquiasEmpresa = parroquias;
		},
		getCatalogoAeInversionSuccess(state, action) {
			state.aeInversion = action.payload;
		},
		getCatalogoAeHorizonteSuccess(state, action) {
			state.aeHorizonte = action.payload;
		},

		getCatalogoTiposDocumentoSuccess(state, action) {
			const tiposDocumento = action.payload;
			state.tiposDocumento = tiposDocumento;
		},
		getCatalogoNivelPreparacionSuccess(state, action) {
			const nivelesPreparacion = action.payload;
			state.nivelesPreparacion = nivelesPreparacion;
		},
		getCatalogoTitulosSuccess(state, action) {
			const titulos = action.payload;
			state.titulos = titulos;
		},
		getCatalogoEstadosCivilesSuccess(state, action) {
			const estadosCiviles = action.payload;
			state.estadosCiviles = estadosCiviles;
		},
		getCatalogoBancosSuccess(state, action) {
			const bancos = action.payload;
			state.bancos = bancos;
			state.loadingList = false;
		},
		getValorUnidadSuccess(state, action) {
			const valores = action.payload;

			if (valores && valores[0]) {
				state.valorUnidad = valores[0];
			}
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
		getCatalogoParentescoAEESuccess(state, action) {
			const parentescos = action.payload;
			state.parentescosAEE = parentescos;
		},
		getCatalogoActividadesSuccess(state, action) {
			state.loadingList = false;

			state.actividades = action.payload;
		},
		getCatalogoOrigenInversionSuccess(state, action) {
			state.loadingList = false;
			state.origenInversion = action.payload;
		},
		getCatalogoOrigenHorizonteSuccess(state, action) {
			state.loadingList = false;
			state.origenHorizonte = action.payload;
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
		},
		getCatalogoSexosSuccess(state, action) {
			const sexos = action.payload;
			state.sexos = sexos;
		},
		setLoadError(state, action) {
			const value = action.payload;
			state.loadError = value;
		},
		getCatalogoFrecuenciaAcreditacionSuccess(state, action) {
			state.frecuenciaAcreditacion = action.payload;
		},
		getCatalogoTipoIdentificacionSuccess(state, action) {
			state.tipoIdentificacion = action.payload;
		},
		getCatalogoFormaPagoSuccess(state, action) {
			state.formaPagos = action.payload;
		},
		getCatalogoTipoTitularesSuccess(state, action) {
			state.tipoTitulares = action.payload;
		},
		getCatalogoTipoEmpresaSuccess(state, action) {
			state.tipoEmpresas = action.payload;
		},
		getCatalogoTipoCuentaAcreditacionSuccess(state, action) {
			state.tipoCuentasAcreditacion = action.payload;
		},
		getCatalogoBancosAcreditacionSuccess(state, action) {
			state.bancosAcreditacion = action.payload;
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
	
	const locales = ['_APH', '_API', '_OPH', '_OPI'];
	const isLocal = locales.indexOf(maestro_id) > -1 && true;
	dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + `/afp/crm/catalogo/bymaestro/${maestro_id}/${isLocal ? 'local' : ''}`);
	
	dispatch(slice.actions.getCatalogos(response.data));
};

export const getCatalogoPaises = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'CP');

	if (response.status != 200) {
		console.log('getCatalogoPaises => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoPaisesSuccess(response.data));
};

export const getCatalogoNacionalidad = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'NA');

	if (response.status != 200) {
		console.log('Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoNacionalidadesSuccess(response.data));
};

export const getCatalogoProvincias = (mode = 'cliente') => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'PR');

	if (response.status != 200) {
		console.log('getCatalogoProvincias => Status != 200');
		console.log(response);
		return;
	}

	if (mode == 'cliente') {
		dispatch(slice.actions.getCatalogoProvinciaSuccess(response.data));
	} else if (mode == 'empresa') {
		dispatch(slice.actions.getCatalogoProvinciaEmpresaSuccess(response.data));
	}
};

export const getCatalogoCantones = (idProvincia, mode = 'cliente') => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'CA/' + idProvincia);

	if (response.status != 200) {
		console.log('getCatalogoCantones => Status != 200');
		console.log(response);
		return;
	}

	if (mode == 'cliente') {
		dispatch(slice.actions.getCatalogoCantonesSuccess(response.data));
	} else if (mode == 'empresa') {
		dispatch(slice.actions.getCatalogoCantonesEmpresaSuccess(response.data));
	}
};

export const getCatalogoParroquias = (idCanton, mode = 'cliente') => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'PA/' + idCanton);

	if (response.status != 200) {
		console.log('getCatalogoParroquias => Status != 200');
		console.log(response);
		return;
	}

	if (mode == 'cliente') {
		dispatch(slice.actions.getCatalogoParroquiasSuccess(response.data));
	} else if (mode == 'empresa') {
		dispatch(slice.actions.getCatalogoParroquiasEmpresaSuccess(response.data));
	}
};

export const getCatalogoTiposDocumento = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + 'TD/local');

	if (response.status != 200) {
		console.log('getCatalogoTiposDocumento => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoTiposDocumentoSuccess(response.data));
};

export const getCatalogoNivelPreparacion = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'NP');

	if (response.status != 200) {
		console.log('getCatalogoNivelPreparacion => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoNivelPreparacionSuccess(response.data));
};

export const getCatalogoEstadosCivies = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'CI');

	if (response.status != 200) {
		console.log('getCatalogoEstadosCivies => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoEstadosCivilesSuccess(response.data));
};

export const getCatalogoBancos = () => async (dispatch) => {
	dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'CB');

	if (response.status != 200) {
		console.log('getCatalogoBancos => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoBancosSuccess(response.data));
};

export const getCatalogoTipoCuentas = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'CTC');

	if (response.status != 200) {
		console.log('getCatalogoTipoCuentas => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoTipoCuentasSuccess(response.data));
};

export const getCatalogoFondoHorizonte = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'FH');

	if (response.status != 200) {
		console.log('getCatalogoFondoHorizonte => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoFondoHorizonteSuccess(response.data));
};

export const getCatalogoFondoInversion = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'FI');

	if (response.status != 200) {
		console.log('getCatalogoFondoInversion => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoFondoInversionSuccess(response.data));
};

export const getCatalogoParentesco = () => async (dispatch) => {
	// dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'PN');

	if (response.status != 200) {
		console.log('getCatalogoParentesco => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoParentescoSuccess(response.data));
};

export const getCatalogoActividades = (maestro_id) => async (dispatch) => {
	dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + `/afp/crm/catalogo/bymaestro/${maestro_id}/local`);

	if (response.status != 200) {
		console.log('getCatalogoActividades => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoActividadesSuccess(response.data));
};

export const getCatalogoOrigenHorizonte = () => async (dispatch) => {
	dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + '_OPH/local');

	if (response.status != 200) {
		console.log('getCatalogoOrigenHorizonte => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoOrigenHorizonteSuccess(response.data));
};

export const getCatalogoOrigenInversion = () => async (dispatch) => {
	dispatch(slice.actions.loadingList());
	const response = await axs.get(URL + '/afp/crm/catalogo/bymaestro/' + '_OPI/local');

	if (response.status != 200) {
		console.log('getCatalogoOrigenInversion => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoOrigenInversionSuccess(response.data));
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

	if (response.status != 200) {
		console.log('getCatalogo => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogos(response.data));
};

export const getCatalogoAeHorizonte = () => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'EH');

	if (response.status != 200) {
		console.log('getCatalogoAeHorizonte => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoAeHorizonteSuccess(response.data));
};

export const getCatalogoAeInversion = () => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'EI');

	if (response.status != 200) {
		console.log('getCatalogoAeInversion => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoAeInversionSuccess(response.data));
};

export const getCatalogoSexos = () => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogo/' + 'E2');

	if (response.status != 200) {
		console.log('getCatalogoSexos => Status != 200');
		console.log(response);
		return;
	}

	dispatch(slice.actions.getCatalogoSexosSuccess(response.data));
};

export const getCatalogoTipoCuenta = async (banco_id) => {
	return await axs.get(URL + '/afp/crm/catalogo/TiposCuentaBancos/' + banco_id);
};

export const getCatalogoDigitosCuenta = async (banco_id, tipo_cuenta) => {
	return await axs.get(URL + '/afp/crm/catalogo/DigitosPorTipoCtaBco/' + banco_id + '/' + tipo_cuenta);
};

export const getCatalogosCliente = () => async (dispatch) => {
	dispatch(slice.actions.setLoadError(false));

	let hayError = false;

	// PAISES
	let respuesta = await _getCatalogo('CP');
	if (respuesta != false) dispatch(slice.actions.getCatalogoPaisesSuccess(respuesta));
	else hayError = true;

	// SEXO
	respuesta = await _getCatalogo('E2');
	if (respuesta != false) dispatch(slice.actions.getCatalogoSexosSuccess(respuesta));
	else hayError = true;

	// NIVEL PREPARACION
	respuesta = await _getCatalogo('NP');
	if (respuesta != false) dispatch(slice.actions.getCatalogoNivelPreparacionSuccess(respuesta));
	else hayError = true;

	// TITULO PROFESIONAL
	respuesta = await _getCatalogo('PO');
	if (respuesta != false) dispatch(slice.actions.getCatalogoTitulosSuccess(respuesta));
	else hayError = true;

	// NACIONALIDADES
	respuesta = await _getCatalogo('NA');
	if (respuesta != false) dispatch(slice.actions.getCatalogoNacionalidadesSuccess(respuesta));
	else hayError = true;

	// ESTADO CIVIL
	respuesta = await _getCatalogo('CI');
	if (respuesta != false) dispatch(slice.actions.getCatalogoEstadosCivilesSuccess(respuesta));
	else hayError = true;

	// PROVINCIAS
	respuesta = await _getCatalogo('PR');
	if (respuesta != false) dispatch(slice.actions.getCatalogoProvinciaSuccess(respuesta));
	else hayError = true;

	dispatch(slice.actions.setLoadError(hayError));
};

export const getGeoCatalogos = (cliente) => async (dispatch) => {
	let hayError = false;

	let { empresa } = cliente;

	let respuesta;

	if (cliente.provincia_id) {
		// CANTON CLIENTE
		respuesta = await _getCatalogo('CA', cliente.provincia_id);
		if (respuesta != false) dispatch(slice.actions.getCatalogoCantonesSuccess(respuesta));
		else hayError = true;
	}

	if (cliente.canton_id) {
		// PARROQUIA CLIENTE
		respuesta = await _getCatalogo('PA', cliente.canton_id);
		if (respuesta != false) dispatch(slice.actions.getCatalogoParroquiasSuccess(respuesta));
		else hayError = true;
	}

	if (empresa && empresa.provincia_id) {
		// CANTON EMPRESA
		respuesta = await _getCatalogo('CA', empresa.provincia_id);
		if (respuesta != false) dispatch(slice.actions.getCatalogoCantonesEmpresaSuccess(respuesta));
		else hayError = true;
	}

	if (empresa && empresa.canton_id) {
		// PARROQUIA EMPRESA
		respuesta = await _getCatalogo('PA', empresa.canton_id);
		if (respuesta != false) dispatch(slice.actions.getCatalogoParroquiasEmpresaSuccess(respuesta));
		else hayError = true;
	}

	dispatch(slice.actions.setLoadError(hayError));
};

export const getCatalogosFondos = (codigoFondo) => async (dispatch) => {
	let respuesta = await _getCatalogo('PN');
	if (respuesta != false) dispatch(slice.actions.getCatalogoParentescoSuccess(respuesta));

	respuesta = await _getCatalogo('CB');
	if (respuesta != false) dispatch(slice.actions.getCatalogoBancosSuccess(respuesta));

	respuesta = await _getCatalogo('VU', codigoFondo);
	if (respuesta != false) dispatch(slice.actions.getValorUnidadSuccess(respuesta));

	respuesta = await _getCatalogo('NA');
	if (respuesta != false) dispatch(slice.actions.getCatalogoNacionalidadesSuccess(respuesta));

	respuesta = await _getCatalogo('CP');
	if (respuesta != false) dispatch(slice.actions.getCatalogoPaisesSuccess(respuesta));

	respuesta = await _getCatalogo('EI');
	if (respuesta != false) dispatch(slice.actions.getCatalogoAeInversionSuccess(respuesta));

	// PROVINCIAS
	respuesta = await _getCatalogo('PR');
	if (respuesta != false) dispatch(slice.actions.getCatalogoProvinciaSuccess(respuesta));

	respuesta = await _getCatalogo('R4');
	if (respuesta != false) dispatch(slice.actions.getCatalogoTipoTitularesSuccess(respuesta));

	if (codigoFondo == '000001') {
		respuesta = await _getCatalogo('PE');
		if (respuesta != false) dispatch(slice.actions.getCatalogoParentescoAEESuccess(respuesta));

		respuesta = await _getCatalogo('EH');
		if (respuesta != false) dispatch(slice.actions.getCatalogoAeHorizonteSuccess(respuesta));
	} else if (codigoFondo == '000038') {
		respuesta = await _getCatalogo('R2');
		if (respuesta != false) dispatch(slice.actions.getCatalogoFrecuenciaAcreditacionSuccess(respuesta));

		respuesta = await _getCatalogo('R5');
		if (respuesta != false) dispatch(slice.actions.getCatalogoTipoIdentificacionSuccess(respuesta));

		respuesta = await _getCatalogo('R3');
		if (respuesta != false) dispatch(slice.actions.getCatalogoFormaPagoSuccess(respuesta));

		respuesta = await _getCatalogo('R6');
		if (respuesta != false) dispatch(slice.actions.getCatalogoTipoCuentaAcreditacionSuccess(respuesta));
	} else {
		respuesta = await _getCatalogo('R4');
		if (respuesta != false) dispatch(slice.actions.getCatalogoTipoTitularesSuccess(respuesta));
	}
};

export const getCatalogoTipoEmpresa = () => async (dispatch) => {
	let respuesta = await _getCatalogo('E6');
	if (respuesta != false) dispatch(slice.actions.getCatalogoTipoEmpresaSuccess(respuesta));
};

export const getCatalogoBancosAcreditacion = (forma_pago) => async (dispatch) => {
	const response = await axs.get(URL + '/afp/crm/catalogo/BancosRentaplus/' + forma_pago);

	if (response.status != 200) {
		console.log('getCatalogoBancosAcreditacion => Status != 200');
		console.log(response);
		return;
	}

	let catalogo = response.data.map((item) => {
		return {
			codigo: item.codigo_referencia_bancaria,
			contenido: item.descripcion
		};
	});

	dispatch(slice.actions.getCatalogoBancosAcreditacionSuccess(catalogo));
};

export default slice;

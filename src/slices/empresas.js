import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axs from 'src/utils/axs';
import baseurl from 'src/config/baseurl';
import { loadData } from './clientes';

const initialState = {
	empresa: {
		id: null,
		Ruc: '',
		razon_social: '',
		telefono: '',
		email: '',
		extension: '',
		provincia: '',
		canton: '',
		parroquia: '',
		calle_principal: '',
		numeracion: '',
		interseccion: '',
		codigo_postal: '',
		ciudadela: '',
		etapa: '',
		manzana: '',
		solar: '',
		referencia: '',
		edificio: '',
		piso: '',
		departamento: '',
		codigo_postal2: ''
	},
	loadingEmpresa: false,
	empresaOportunidad: {},
	loadingEmpresaOportunidad: false
};

const slice = createSlice({
	name: 'empresas',
	initialState,
	reducers: {
		postSearchEmpresa(state, action) {
			const consult = action.payload;
			console.log('consult', consult);
			state.empresa = consult;
			console.log('empresa', state.empresa);
		},
		getDeleteInformationWithRefuseEmpresa(state) {
			state.empresa.id = '';
			state.empresa.Ruc = '';
			state.empresa.razon_social = '';
			state.empresa.telefono = '';
			state.empresa.email = '';
			state.empresa.extension = '';
			state.empresa.provincia = '';
			state.empresa.canton = '';
			state.empresa.parroquia = '';
			state.empresa.calle_principal = '';
			state.empresa.numeracion = '';
			state.empresa.interseccion = '';
			state.empresa.codigo_postal = '';
			state.empresa.ciudadela = '';
			state.empresa.etapa = '';
			state.empresa.manzana = '';
			state.empresa.solar = '';
			state.empresa.referencia = '';
			state.empresa.edificio = '';
			state.empresa.piso = '';
			state.empresa.departamento = '';
			state.empresa.codigo_postal2 = '';
		},
		_postSearchEmpresa(state) {
			state.loadingEmpresa = true;
		},
		postSearchEmpresaSuccess(state) {
			state.loadingEmpresa = false;
		},
		postSearchEmpresaError(state) {
			state.loadingEmpresa = false;
		},
		setEmpresaOportunidad(state, action) {
			const empresa = action.payload;
			state.loadingEmpresaOportunidad = false;

			state.empresaOportunidad = empresa;
		}
	}
});

export const reducer = slice.reducer;

export const postSearchEmpresa = async (ruc, onSuccess, onError) => {
	try {
		const response = await axs.post(baseurl + '/afp/empresas/search', { ruc });

		onSuccess && onSuccess(response.data);

		// return response.data;
	} catch (e) {
		onError && onError(e);
		// return {};
	}
};

export const getDeleteInformationWithRefuseEmpresa = () => async (dispatch) => {
	dispatch(slice.actions.getDeleteInformationWithRefuseEmpresa());
};

export const setEmpresa = (empresa) => async (dispatch) => {
	dispatch(slice.actions.postSearchEmpresa(empresa));
};

export const setEmpresaOportunidad = (empresa) => async (dispatch) => {
	dispatch(slice.actions.setEmpresaOportunidad(empresa));
};

export default slice;

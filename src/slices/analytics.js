// http://localhost:8080/api/afp/crm/analytics/efectividad
import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import URL from 'src/config/baseurl';
import { toast } from 'react-toastify';

const initialState = {
	efectividadLabels: [],
	efectividadPayload: [],
	efectividadLoading: false,
	prospectosLabels: [],
	prospectosPayload: [],
	prospectosLoading: false,
	firmaTotalesLabels: [],
	firmaTotalesPayload: [],
	firmaTotalesLoading: false,
	firmaIntentosLabels: [],
	firmaIntentosPayload: [],
	firmaExitosLabels: [],
	firmaExitosPayload: [],
	firmaPersonaLoading: false,

	firmaSistemasFetch: false,
	firmaSistemasError: false,
	firmaSistemasPayload: [],

	registroCivilFetch: false,
	registroCivilError: false,
	registroCivilPayload: [],
	registroCivilAgrupadoMes: [],
	registroCivilAgrupadoDia: [],


};

const slice = createSlice({
	name: 'efectividad',
	initialState,
	reducers: {
		//::
		getEfectividadFetch(state) {
			state.efectividadLabels = [];
			state.efectividadPayload = [];
			state.efectividadLoading = true;
		},
		getEfectividadSuccess(state, action) {
			state.efectividadLabels = action.payload.labels;
			state.efectividadPayload = action.payload.payload;
			state.efectividadLoading = false;
		},
		//:: Prospectos
		getProspectos(state) {
			state.prospectosLoading = true;
		},
		getProspectosSuccess(state, action) {
			state.prospectosLabels = action.payload.labels;
			state.prospectosPayload = action.payload.payload;
			state.prospectosLoading = false;
		},
		//:: Firma
		getFirmaTotales(state) {
			state.firmaTotalesLoading = true;
		},
		getFirmaTotalesSuccess(state, action) {
			state.firmaTotalesLabels = action.payload.labels;
			state.firmaTotalesPayload = action.payload.payload;
			state.firmaTotalesLoading = false;
		},
		//:: Firma persona
		getFirmaPersona(state) {
			state.firmaPersonaLoading = true;
		},
		getFirmaIntentosSuccess(state, action) {
			state.firmaIntentosLabels = action.payload.labels;
			state.firmaIntentosPayload = action.payload.payload;
		},
		getFirmaExitosSuccess(state, action) {
			state.firmaExitosLabels = action.payload.labels;
			state.firmaExitosPayload = action.payload.payload;
		},
		getFirmaPersonaSuccess(state) {
			state.firmaPersonaLoading = false;
		},


		getFirmaSistemasFetch(state) {
			state.firmaSistemasFetch = true;
			state.firmaSistemasError = false;
			state.firmaSistemasPayload = [];
		},
		getFirmaSistemasSuccess(state, action) {
			state.firmaSistemasFetch = false;
			state.firmaSistemasError = false;
			state.firmaSistemasPayload = action.payload;
		},
		getFirmaSistemasError(state) {
			state.firmaSistemasFetch = false;
			state.firmaSistemasError = true;
			state.firmaSistemasPayload = [];
		},


		//
		getRegistroCivilFetch(state, action) {
			state.registroCivilFetch = true;
			state.registroCivilError = false;
			state.registroCivilPayload = [];
		},
		getRegistroCivilSuccess(state, action) {

			
			state.registroCivilFetch = false;
			state.registroCivilError = false;
			state.registroCivilPayload = action.payload.consultaTotal;
			state.registroCivilAgrupadoDia = action.payload.agrupadoDia;
			state.registroCivilAgrupadoMes = action.payload.agrupadoMes;
			state.agrupadoLocalidad = action.payload.agrupadoLocalidad;


		},
		getRegistroCivilError(state, action) {
			state.registroCivilFetch = false;
			state.registroCivilError = action.payload;
			state.registroCivilPayload = [];
		},



	}
});

export const reducer = slice.reducer;

export const getEfectividad = (fe_inicio, fe_fin, estado) => async (dispatch) => {
	const body = {
		fe_inicio,
		fe_fin,
		estado
	};

	const { getEfectividadFetch, getEfectividadSuccess } = slice.actions;
	try {
		dispatch(getEfectividadFetch());
		const response = await axs.post(`${URL}/afp/crm/analytics/efectividad`, body);

		const { data } = response;

		if (data.success) {
			dispatch(getEfectividadSuccess(data));
		} else {
			toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
		}
	} catch (error) {
		toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
	}
};

export const getProspectos = (fe_inicio, fe_fin) => async (dispatch) => {
	const body = {
		fe_inicio,
		fe_fin
	};

	const { getProspectos, getProspectosSuccess } = slice.actions;

	try {
		dispatch(getProspectos());
		const response = await axs.post(`${URL}/afp/crm/analytics/prospectos`, body);

		const { data } = response;

		if (data.success) {
			dispatch(getProspectosSuccess(data));
		} else {
			toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
		}
	} catch (error) {
		toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
	}
};

export const getFirmaTotales = (fe_inicio, fe_fin) => async (dispatch) => {
	const body = {
		fe_inicio,
		fe_fin
	};

	const { getFirmaTotales, getFirmaTotalesSuccess } = slice.actions;
	try {
		dispatch(getFirmaTotales());

		let response = await axs.post(`${URL}/afp/crm/analytics/firma/totales`, body);

		let { data } = response;

		if (data.success) {
			let totales = data.payload;

			response = await axs.post(`${URL}/afp/crm/analytics/firma/totales`, { ...body, estado_firma: 2 });
			
			data = response.data;

			if (data.success) {
				totales = [...totales, ...data.payload];
			}

			data = { ...data, payload: totales };

			

			dispatch(getFirmaTotalesSuccess(data));
		} else {
			toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
		}
	} catch (error) {
		toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
	}
};

export const getFirmaPersona = (fe_inicio, fe_fin) => async (dispatch) => {
	const body = {
		fe_inicio,
		fe_fin
	};

	const {
		getFirmaPersona: _getFirmaPersona,
		getFirmaPersonaSuccess,
		getFirmaIntentosSuccess,
		getFirmaExitosSuccess
	} = slice.actions;

	try {
		dispatch(_getFirmaPersona());
		let response = await axs.post(`${URL}/afp/crm/analytics/firma`, body);

		let { data } = response;

		if (data.success) {
			dispatch(getFirmaIntentosSuccess(data));

			response = await axs.post(`${URL}/afp/crm/analytics/firma`, { ...body, estado_firma: 2 });
			data = response.data;
			

			if (data.success) {
				dispatch(getFirmaExitosSuccess(data));
			}

			dispatch(getFirmaPersonaSuccess());
		} else {
			toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
		}
	} catch (error) {
		toast.error('Lo sentimos, la información del reporte no pudo ser cargada');
	}
};


export const getFirmaSistemas = (fe_inicio, fe_fin) => async (dispatch) => {
	const { getFirmaSistemasFetch, getFirmaSistemasSuccess, getFirmaSistemasError } = slice.actions;

	try {
		dispatch(getFirmaSistemasFetch());
		const response = await axs.post(`${URL}/afp/crm/analytics/firma/sistemas`, { fe_inicio, fe_fin });
		response.data && response.data.success
			? dispatch(getFirmaSistemasSuccess(response.data.payload))
			: dispatch(getFirmaSistemasError());
	}
	catch (e) {
		dispatch(getFirmaSistemasError())
	}

}


export const getRegistroCivil = ({fe_ini, fe_fin}) => async (dispatch) => {
	

	try {
		dispatch(slice.actions.getRegistroCivilFetch());

		const response = await axs.post(`${URL}/afp/crm/analytics/registroCivil`, { fe_ini, fe_fin });

		
		
		response.data && response.data.success
			? dispatch(slice.actions.getRegistroCivilSuccess(response.data))
			: dispatch(slice.actions.getRegistroCivilError());
	} catch (e) {
		
		dispatch(slice.actions.getRegistroCivilError(e));
	}


}



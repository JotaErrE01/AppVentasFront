import { createSlice } from '@reduxjs/toolkit';
import baseurl from 'src/config/baseurl';
import axs from 'src/utils/axs';
import { setArchivosAdjuntosChecklist } from './clientes';

const initialState = {
	adjuntos: [],
	loadingSign: false
};

const slice = createSlice({
	name: 'adjuntos',
	initialState,
	reducers: {
		sendToSign(state, action) {
			// const adjuntos = action.payload;
			state.loadingSign = true;
		},
		sendToSignSuccess(state, action) {
			// const adjuntos = action.payload;
			state.loadingSign = false;
		},
		sendToSignError(state, action) {
			// const adjuntos = action.payload;
			state.loadingSign = false;
		}
	}
});

const URL = baseurl;
export const reducer = slice.reducer;

export const sendToSign = (params, onSuccess, onError) => async (dispatch) => {

	
	dispatch(slice.actions.sendToSign());

	try {
		const response = await axs.post(URL + '/afp/crm/oportunidad/signfiles', params);

		

		let { success, adjuntosCheckList, archivosAdjuntos, error } = response.data;
		
		if (success) {
			dispatch(slice.actions.sendToSignSuccess());
			dispatch(setArchivosAdjuntosChecklist({ adjuntosCheckList, archivosAdjuntos }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.sendToSignError(error));
			onError && onError(response.data);
		}
	} catch (e) {
		dispatch(slice.actions.sendToSignError(e));
		onError(e);
	}
};

export default slice;

import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import baseurl from 'src/config/baseurl';

const initialState = {
	userData: {
		id: '',
		avatar: '',
		canHire: '',
		country: '',
		email: '',
		isPublic: '',
		name: '',
		password: '',
		phone: '',
		role: '',
		state: '',
		tier: ''
	},
	Wait: true, //se utiliza para respuesta en base a cambio de componentes
	Alert: false, //mantiene notificacion oculta a la vista
	loadingSubordinados: false,
	subordinados: []
};

const slice = createSlice({
	name: 'usuario',
	initialState,
	reducers: {
		postUserSearch(state, action) {
			const list = action.payload;
			state.userData = list;
			state.userData.id = list.id;
			state.userData.avatar = list.avatar;
			state.userData.canHire = list.canHire;
			state.userData.country = list.country;
			state.userData.email = list.email;
			state.userData.isPublic = list.isPublic;
			state.userData.name = list.name;
			state.userData.password = list.password_plano;
			state.userData.phone = list.phone;
			state.userData.role = list.role_id;
			state.userData.state = list.state;
			state.userData.tier = list.tier;
			state.Wait = false;
			state.Alert = false;
		},
		getAlertSearchEmpty(state) {
			state.Alert = true;
		},
		getSubordinados(state, action) {
			state.loadingSubordinados = true;
		},
		getSubordinadosSuccess(state, action) {
			state.loadingSubordinados = false;
			state.subordinados = action.payload;
		},
		getSubordinadosError(state, action) {
			state.loadingSubordinados = false;
			// state.error = action.payload;
		}
	}
});

export const reducer = slice.reducer;

//
export const postUserSearch = (data) => async (dispatch) => {
	/* const response = await axs.post('https://api.servorio.com.ar/api/afp/login/access', { "email": data.email, "password": data.password }); */
	const response = await axs.post(baseurl + '/afp/login/access', { email: data.email, password: data.password });
	/* console.log(response.data); */
	try {
		if (response.data === 500) {
			dispatch(slice.actions.getAlertSearchEmpty());
		} else {
			dispatch(slice.actions.postUserSearch(response.data));
		}
	} catch (error) {
		console.log(error);
	}
};

export const getSubordinados = (onSucess, onError) => async (dispatch) => {
	dispatch(slice.actions.getSubordinados());
	try {
		const { data } = await axs.get(`${baseurl}/afp/user/subordinados`);

		if (data.success) {
			dispatch(slice.actions.getSubordinadosSuccess(data.subordinados));

			onSucess && onSucess();
		} else {
			dispatch(slice.actions.getSubordinadosError());
			onError && onError();
		}
	} catch (error) {
		dispatch(slice.actions.getSubordinadosError(error));
		onError && onError();
	}
};

export default slice;

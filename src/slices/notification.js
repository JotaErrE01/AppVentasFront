import { createSlice } from '@reduxjs/toolkit';
import URL from 'src/config/baseurl';
import axios from 'src/utils/axs';
import _ from 'lodash';

const initialState = {
	loading: false,
	notifications: []
};

const slice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		getNotifications(state, action) {
			state.loading = true;
		},
		getNotificationsSuccess(state, action) {
			const notifications = action.payload;

			state.notifications = [ ...notifications ];

			state.loading = false;
		},
		getNotificationsError(state, action) {
			state.loading = false;
		},
		setNotiReadSuccess(state, action) {
			const notificacion = action.payload;

			state.notifications = _.map(state.notifications, (noti) => {
				return noti.id == notificacion.id ? notificacion : noti;
			});
		}
	}
});

export const reducer = slice.reducer;

export const getNotifications = () => async (dispatch) => {
	dispatch(slice.actions.getNotifications());

	try {
		const response = await axios.get(URL + '/afp/user/notifications');
		

		dispatch(slice.actions.getNotificationsSuccess(response.data));
	} catch (e) {
		dispatch(slice.actions.getNotificationsError());
	}
};

export const setNotiRead = (noti) => async (dispatch) => {
	try {
		const response = await axios.put(URL + '/afp/user/notifications/markread', { notificacion_id: noti.id });

		const { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.setNotiReadSuccess(data));
		}
	} catch (e) {
		console.log(e);
	}
};

export const setAllNotiRead = () => async (dispatch) => {
	try {
		const response = await axios.put(URL + '/afp/user/notifications/markread/all');
		
		const { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.getNotificationsSuccess(data));
		}
	} catch (e) {
		console.log(e);
	}
};

export default slice;

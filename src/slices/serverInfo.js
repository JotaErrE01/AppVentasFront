import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import baseurl from 'src/config/baseurl';

const initialState = {
    serverinfo:null,
};
const slice = createSlice({
    name: 'serverInfo',
    initialState,
    reducers: {
        getServerinfoFetch(state, action) {
            state.database = null;
            state.api = null;
            state.core_api = null;
            state.loading = true;
        },
        getServerinfoOk(state, action) {
            state.serverinfo = {
                ...action.payload,
                central_ip_server:process.env.REACT_APP_CENTRAL_IP,
                janus_gateway_server:process.env.REACT_APP_SERVER_RTC,

            }
            state.loading = false;
        }
    }
});

export const reducer = slice.reducer;


export const getServerinfo = (enqueueSnackbar) => async (dispatch) => {
    const { getServerinfoFetch, getServerinfoOk } = slice.actions;
    try {
        dispatch(getServerinfoFetch());
        const response = await axs.get(`${baseurl}/afp/crm/serverinfo`);
        const { data } = response;
        if (data.success) {
            dispatch(getServerinfoOk(data));
            return;
        } else {
            enqueueSnackbar(data.mensaje, { variant: 'error' });
            return
        }
    }
    catch (error) {
        enqueueSnackbar('Lo sentimos, intente más tarde', { variant: 'error' });
    }
};
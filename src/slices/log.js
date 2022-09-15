import baseurl from "src/config/baseurl";
import { formatErrorMessages } from "src/utils/formatErrorMessages";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  errorLogs: [],
  isLoading: true,
  error: null,
}

const slice = createSlice({
  name: "log",
  initialState,
  reducers: {
    getErrorLogs(state, action) {
      state.errorLogs = action.payload;
      state.isLoading = false;
    },
    getErrorLogsFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const startGetErrorLogs = (query = false) => async (dispatch) => {
  const { getErrorLogs, getErrorLogsFailed } = slice.actions;
  try {
    let name = 'q';
    let value = '';
    if(query) {
      name = Object.keys(query)[0];
      value = Object.values(query)[0];

      if(name === 'all'){
        query = false;
      }
    }
    const url = query ? `${baseurl}/errorlogs?${name}=${value}` : `${baseurl}/errorlogs`;
    console.log(url);
    const response = await fetch(url);
    const { data } = await response.json();
    console.log(data);
    const dataFormated = formatErrorMessages(data.data);
    data.data = dataFormated;

    console.log(data);
    dispatch(getErrorLogs(data));
  } catch (error) {
    console.log(error);
    dispatch(getErrorLogsFailed(error));
  }
}

export const startChangePage = (url) => async dispatch => {
  const { getErrorLogs, getErrorLogsFailed } = slice.actions;
  try {
    console.log(url);
    const response = await fetch(url);
    // dispatch(slice.actions.changePage());
    const { data } = await response.json();
    // console.log({response});
    const dataFormated = formatErrorMessages(data.data);
    data.data = dataFormated;
    dispatch(getErrorLogs(data));
  } catch (error) {
    console.log(error);
    dispatch(getErrorLogsFailed(error));
  }
}

export const logReducer = slice.reducer;

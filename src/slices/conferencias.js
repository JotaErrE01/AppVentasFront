import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import baseurl from 'src/config/baseurl';




const init = {
  conferencias: [],
  loadingForm: false,
  error:false,

  loadingList:false,
  errorList:false,
}

const slice = createSlice({
  name: 'conferencias',
  initialState: init,
  reducers: {
    createConferenciaSucesss(state, action) {
      state.conferencias = [...state.conferencias, action.payload];
      state.loadingForm=false;
    },
    createConferenciaError(state, action) {
      const error = action.payload;
			state.error = error;
    },
    setLoadingForm(state, action) {
      state.loadingForm = !state.loadingForm;
    },
    

    //
    getConferenciasSuccess(state, action) {
      state.conferencias =  action.payload;
      state.loadingForm=false;
    },
    getConferenciasError(state, action) {
			state.errorList =  action.payload;;
    },
    setLoadingList(state, action) {
      state.loadingList = !state.loadingList;
    },



  }
});

export const reducer = slice.reducer;






const parseConferencia = (conferencias) => {
  const payload = conferencias.map(item => {
    const meet = JSON.parse(item.contenido_2);
    return({
      
      ...item, 
      meet: meet 
      
    })
  })
  return payload;
}

export const createConferencia = (conferencia, enqueueSnackbar, redirectCb) => async (dispatch) => {
  
  dispatch(slice.actions.setLoadingForm());
  try {
    const response = await axs.post(baseurl + '/afp/crm/activitie', conferencia);
    const { data } = response;
    if (data.success) {
        enqueueSnackbar(data.mensaje, { variant: 'success' });
        dispatch(slice.actions.createConferenciaSucesss(data));
        redirectCb();
    } 
    else {
        enqueueSnackbar(data.mensaje, { variant: 'error' });
        dispatch(slice.actions.createConferenciaError(data));
    }
  } 
  catch (e) {

    alert(JSON.stringify(e))
    enqueueSnackbar('Ocurrió un error con los servicios', {	variant: 'error'});
    dispatch(slice.actions.createConferenciaError(e));
  }

  dispatch(slice.actions.setLoadingList());

};


export const getConferenciaByUser = (user, enqueueSnackbar) => async (dispatch) => {
  
  dispatch(slice.actions.setLoadingList());
    try {

      const response = await axs.get(`${baseurl}/afp/crm/activitie/ver`);

      const { data } = response;
      const conferencia = parseConferencia(data)

      if (data) {
          dispatch(slice.actions.getConferenciasSuccess(conferencia));
      } 
      else {
        
          enqueueSnackbar(data.mensaje, { variant: 'error' });
          dispatch(slice.actions.getConferenciasError(data));
      }
    } 
    catch (e) {

      enqueueSnackbar('Ocurrió un error con los servicios', {	variant: 'error'});
      dispatch(slice.actions.getConferenciasError(e));
    }
  dispatch(slice.actions.setLoadingList());

};





export default slice;

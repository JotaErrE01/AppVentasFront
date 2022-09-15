import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axs from 'src/utils/axs';
import baseurl, { siteurl } from 'src/config/baseurl';
import { MailAgendarVideoCall } from 'src/mailer';
import { encode, decode } from 'js-base64';




const init = {
  actividades: [],
  actividad: false,
  loadingForm: false,
  error: false,

  loadingList: false,
  errorList: false,
}

const slice = createSlice({
  name: 'actividades',
  initialState: init,
  reducers: {

    //::: CREATE :::
    createactividadesucesss(state, action) {
      state.actividades = [...state.actividades, action.payload];
      state.loadingForm = false;
    },
    createActividadError(state, action) {
      const error = action.payload;
      state.error = error;
    },
    setLoadingForm(state, action) {
      state.loadingForm = !state.loadingForm;
    },

    //:: READ :::
    getActividadByIdFech(state, action) {
      state.loading = true;
    },
    getActividadByIdSuccess(state, action) {
      state.actividad = action.payload;
      state.loading = false;
    },
    getActividadByIdError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    //:: UPDATE
    updateActividadFech(state, action) {
      state.loading = true
    },
    updateActividadSuccess(state, action) {
      const actividad = action.payload;
      const index = state.actividades.findIndex((item) => item.id == actividad.id);
      if (index != -1) {
        state.actividades[index] = actividad;
        state.actividades = [...state.actividades];
      } else {
        state.actividades = [...state.actividades, actividad];
      }
      state.actividad = actividad;
      state.loading = false;
    },
    updateActividadError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },




    //:: READ ALL 
    getactividadesSuccess(state, action) {
      state.actividades = action.payload;
      state.loadingList = false;
    },
    getactividadesError(state, action) {
      state.errorList = action.payload;;
    },
    setLoadingList(state, action) {
      state.loadingList = !state.loadingList;
    },

    updateActividadeSucesss(state, action) {
      const catalogo = action.payload;

      state.catalogos = _.map(state.catalogos, function (item) {
        return item.id === catalogo.id ? catalogo : item;
      });

      state.loadingForm = false;
    },
    updateActividadeError(state, action) {
      const error = action.payload;
      state.error = error;
    }

  }
});

export const reducer = slice.reducer;


const parseActividad = (actividad) => {
  const meet = JSON.parse(actividad.contenido_2);
  return ({
    ...actividad,
    meet: meet
  })
}

const parseActividades = (actividades) => {
  const payload = actividades.map(item => {
    const meet = JSON.parse(item.contenido_2);
    return ({ ...item, meet: meet })
  })
  return payload;
}



export const sendMailAfp = async (payload) => {
  

  

  const { prospecto } = payload;
  const meet = JSON.parse(payload.contenido_2);

  

  const mailProps = {
    "email_cliente": prospecto.correo_cliente,
    "nombre_cliente": `${prospecto.nombre_cliente} ${prospecto.apellido_cliente}`,
    "asunto": "GENESIS ADMINISTRADORA DE FONDOS || NUEVA REUNION",
    "datetime": meet.dateText,
    "url": `https://app.fondosgenesisdigital.com/meet/${payload.contenido_3}`,
    "mail_soporte": "serviciosalcliente@fondosgenesis.com",
    "facebook": "https://www.facebook.com/FondosGenesis",
    "instagram": "https://www.instagram.com/fondosgenesis/",
    "website": "https://genesis.administradoradefondos.com",
     
  };



  const texto = MailAgendarVideoCall(mailProps);
  const body = {
    rucCedula: 0,
    emailDestinatario: mailProps.email_cliente,
    nombreDestinatario: mailProps.nombre_cliente,
    asunto: mailProps.asunto,
    texto: encode(texto)
  }

  const response = await axs.post(baseurl + '/afp/crm/sendMailAfp', body);
  
}




export const asignarActividadOportunidad = (actividad, onSuccess, enqueueSnackbar) => async (dispatch) => {

  dispatch(slice.actions.setLoadingForm());
  try {
    const response = await axs.put(baseurl + '/afp/crm/activitie', actividad);
    const { data } = response;

    if (data.success) {
      enqueueSnackbar(data.mensaje || 'Actividad asignada', { variant: 'success' });
      dispatch(slice.actions.updateActividadeSucesss(parseActividad(data.data)));
      onSuccess && onSuccess();
    }
    else {
      enqueueSnackbar(data.mensaje, { variant: 'error' });
      dispatch(slice.actions.updateActividadeError(data));
    }
  }
  catch (e) {
    enqueueSnackbar('Ocurrió un error con los servicios', { variant: 'error' });
    dispatch(slice.actions.updateActividadeError(e));
  }


};


//
export const getActividadByUser = (user, enqueueSnackbar) => async (dispatch) => {
  dispatch(slice.actions.setLoadingList());
  try {
    const response = await axs.get(`${baseurl}/afp/crm/activitie/ver/${user.id}`);
    
    const { data } = response;

    if (data) {
      const _actividad = parseActividades(data)
      dispatch(slice.actions.getactividadesSuccess(_actividad));
    }
    else {
      enqueueSnackbar(data.mensaje, { variant: 'error' });
      dispatch(slice.actions.getactividadesError(data));
    }

  }
  catch (e) {
    enqueueSnackbar('Ocurrió un error con los servicios', { variant: 'error' });
    dispatch(slice.actions.getactividadesError(e));
  }

};

export const getActividadById = (userId, id, enqueueSnackbar) => async (dispatch) => {
  dispatch(slice.actions.getActividadByIdFech());

  try {
    const response = await axs.get(`${baseurl}/afp/crm/activitie/ver/${userId}/${id}`);
    const { data } = response;
    if (data.success) {
      enqueueSnackbar(data.mensaje, { variant: 'success' });
      dispatch(slice.actions.getActividadByIdSuccess(parseActividad(data.data)))
    } else {
      enqueueSnackbar(data.mensaje, { variant: 'error' });
      dispatch(slice.actions.getActividadByIdError(data));
    }
  } catch {
    enqueueSnackbar('Hubo un error con los servicios', { variant: 'error' });
    dispatch(slice.actions.getActividadByIdError('Hubo un error con los servicios'));
  }


}


export const createActividad = (actividad, enqueueSnackbar, cb) => async (dispatch) => {
  dispatch(slice.actions.setLoadingForm());
  try {
    const response = await axs.post(baseurl + '/afp/crm/activitie', actividad);
    const { data } = response;

    if (data.success) {

      if( data.data.actividad_id === 1010 || data.data.actividad_id === 1012 ){
        
        sendMailAfp(data.data);
      }
    
      enqueueSnackbar(data.mensaje, { variant: 'success' });
      dispatch(slice.actions.createactividadesucesss(parseActividad(data.data)));
      cb();
    }
    else {
      enqueueSnackbar(data.mensaje, { variant: 'error' });
      dispatch(slice.actions.createActividadError(data));
    }
  }
  catch (e) {
    enqueueSnackbar('Ocurrió un error con los servicios', { variant: 'error' });
    dispatch(slice.actions.createActividadError(e));
  }


};



export const updateActividad = (actividad, enqueueSnackbar, cb) => async (dispatch) => {
  debugger
  dispatch(slice.actions.updateActividadFech());
  try {
    const response = await axs.post(baseurl + '/afp/crm/activitie', { _method: 'put', ...actividad });
    const { data: { success, data, mensaje } } = response;
    
    if(success){
      dispatch(slice.actions.updateActividadSuccess(parseActividad(data)))
      enqueueSnackbar(mensaje, { variant: 'success' });
      cb();
      return;
    }
    throw data.mensaje;
    cb();
    
      
  }
  catch (e) {
      dispatch(slice.actions.updateActividadError(e));
      enqueueSnackbar(e, { variant: 'error' });
      cb();
    
  }


};





export default slice;

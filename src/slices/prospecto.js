import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
import { toast } from 'react-toastify';




const initialState = {
  prospectos: [],
  loading: false,
  prospecto: {},
  isEditingForm: false,
  uploadingCarga: false,



  loadingCarga: false,
  cargaArr: [],
  loadingAssign: false,



  asignandoAleatorio: false,
  asignarAleatorioResult: {},


  updatingProspectoField: false,
  updatingProspectoFieldResult: {},



};

const slice = createSlice({
  name: 'prospecto',
  initialState,
  reducers: {

    loadProspectoSuccess(state, action) {
      debugger
      state.prospecto = action.payload;
    },
    //:: READ ALL
    getProspectosFetch(state) {
      state.loading = true;
      state.error = false;
    },
    getProspectosSucess(state, action) {
      state.prospectos = action.payload;
      state.loading = false;
    },
    getProspectosError(state, action) {
      state.prospectos = [];
      state.loading = false;
      state.error = true;
    },
    getProspectoClean(state, action) {
      state.loading = false;
    },

    //:: READ BY ID
    getProspectoFetch(state) {
      state.prospecto = {}
      state.loading = true;
      state.error = false;
    },
    getProspectoSucess(state, action) {

      state.prospecto = action.payload;
      state.loading = false;
    },

    //:: UPDATE
    putProspectoFetch(state) {
      state.loading = true;
      state.error = false;
    },
    putProspectoSucess(state, action) {
      const replace = [...state.prospectos];
      _.replace(replace, { id: action.payload.id }, action.payload);
      state.prospecto = replace;

      state.loading = false;
    },
    putProspectoError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    // :: CREATE

    postProspectoFetch(state) {
      state.loading = true;
      state.error = false;
    },
    postProspectoSuccess(state, action) {

      state.loading = false;
      state.prospectos.unshift(action.payload);
    },
    postProspectoError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    //DELETE
    deleteProspectoFetch(state) {
      state.loading = true;
      state.error = false;
    },

    deleteProspectoSuccess(state, action) {
      state.prospectos = state.prospectos.filter((item) => item.id !== action.payload);
      state.error = false;
      state.loading = false;
    },
    deleteProspectoError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    uploadProspectosFile(state, action) {
      state.uploadingCarga = true;
      // state.error = action.payload;
    },
    uploadProspectosFileSuccess(state, action) {
      state.uploadingCarga = false;
      // state.error = action.payload;
    },
    uploadProspectosFileError(state, action) {
      state.uploadingCarga = false;
      // state.error = action.payload;
    },



    getProspectosCarga(state, action) {
      state.loadingCarga = true;
      state.cargaArr = [];
    },
    getProspectosCargaSuccess(state, action) {
      state.loadingCarga = false;
      state.cargaArr = action.payload
    },
    getProspectosCargaError(state, action) {
      state.loadingCarga = false;
      // state.error = action.payload;
    },



    assignProspectos(state, action) {
      state.loadingAssign = true;
    },
    assignProspectosSuccess(state, action) {
      state.loadingAssign = false;
    },
    assignProspectosError(state, action) {
      state.loadingAssign = false;
      // state.error = action.payload;
    },




    asignarAleatorioFetch(state, action) {
      state.asignandoAleatorio = true;
    },
    asignarAleatorioSuccess(state, action) {
      state.asignandoAleatorio = false;
    },
    asignarAleatorioClean(state, action) {
      state.asignandoAleatorio = false;
    },




    updateProspectoFieldFetch(state, action) {
      state.updatingProspectoField = action.payload;
    },
    updateProspectoFieldSuccess(state, action) {


      let _cargaArr = [...state.cargaArr];
      const cargaIndex = _cargaArr.findIndex(item => item.id == action.payload.carga_id);
      if (cargaIndex > -1) {
        const cargaItem = _cargaArr[cargaIndex];
        const prospectos = cargaItem.prospectos;
        const prospectoIndex = prospectos.findIndex(item => item.id == action.payload.id);
        if (prospectoIndex > -1) {
          _cargaArr[cargaIndex].prospectos[prospectoIndex] = action.payload;
        }
      }


      state.updatingProspectoField = false;
      state.cargaArr = [..._cargaArr];
    },
    updateProspectoFieldClean(state, action) {
      state.updatingProspectoField = false;
    },





  }
});

const URL = baseurl;

export const getProspectos = (cb) => async (dispatch) => {

  const { getProspectosFetch, getProspectosSucess, getProspectosError } = slice.actions;
  try {
    dispatch(getProspectosFetch());
    const response = await axs.get(`${URL}/afp/crm/prospecto`);
    

    const { data } = response;
    cb()
    dispatch(getProspectosSucess(data.payload));
  } catch (e) {
    toast.error('Ocurrió un error con los servicios');
    dispatch(getProspectosError(e));
  }
};




//v2.0
export const loadProspecto = (prospecto, cb) => async (dispatch) => {

try{
  const { loadProspectoSuccess } = slice.actions;
  dispatch(loadProspectoSuccess(prospecto));
  cb();
}catch(e){
  console.log(e);
  
}
  
}
export const postProspecto = (prospecto, cb) => async (dispatch) => {
  const { postProspectoFetch, postProspectoSuccess, postProspectoError } = slice.actions;
  dispatch(postProspectoFetch());
  try {
    const response = await axs.post(baseurl + '/afp/crm/prospecto', prospecto);

    const { data } = response;
    if (data.success) {
      toast.success(data.mensaje);
      dispatch(postProspectoSuccess(data.data));
      cb();
    } else {
      toast.error(data.mensaje);
    }
  } catch (error) {
    dispatch(postProspectoError(error));
    toast.error('Lo sentimos, hubo un error de conexión');
  }
}
export const getProspecto = (id, cb) => async (dispatch) => {
  const { getProspectoFetch, getProspectoSucess, getProspectoClean } = slice.actions;
  dispatch(getProspectoFetch());
  try {
    const response = await axs.get(`${URL}/afp/crm/prospecto/showById/${id}`);

    const { data } = response;


    if (data.success) {
      toast.success(data.mensaje);
      dispatch(getProspectoSucess(data.payload));
      cb(data.payload);
      return;
    } else {
      toast.warning(data.mensaje);
      dispatch(getProspectoClean());

    }
  } catch (error) {
    toast.error('Error en los servicios');
    dispatch(getProspectoClean(error));
  }
};
export const putProspecto = (prospecto, cb) => async (dispatch) => {
  const { putProspectoFetch, putProspectoSucess, putProspectoError } = slice.actions;
  dispatch(putProspectoFetch());
  try {
    const response = await axs.post(baseurl + '/afp/crm/prospecto', { _method: 'put', ...prospecto });
    const { data } = response;
    if (data.success) {

      toast.success(data.mensaje);
      dispatch(putProspectoSucess(data.payload));
      cb();
      return;
    }
  } catch (error) {


    console.log(error);
    toast.error('Lo sentimos, hubo un error con los servicios');
    dispatch(putProspectoError(error));
  }
};
export const deleteProspecto = (id, cb) => async (dispatch) => {
  const { deleteProspectoError, deleteProspectoFetch, deleteProspectoSuccess } = slice.actions;

  dispatch(deleteProspectoFetch());
  try {
    ///TODO: NO ME PERMITA ELIMINAR SI EXISTE UNA RELACION...
    const response = await axs.post(`${baseurl}/afp/crm/prospecto/${id}`, { _method: 'delete' });

    const { data } = response;


    if (data.success) {
      toast.success(data.mensaje);
      dispatch(deleteProspectoSuccess(data.id));
      cb();
      return;
    } else {
      toast.warning(data.mensaje);
      cb();
    }
  } catch (error) {
    toast.error("Lo sentimos, hubo un error al intentar eliminar un registro");
    dispatch(deleteProspectoError(error));
  }
};

export const getProspectosCarga = (onSucess, onError) => async (dispatch) => {
  dispatch(slice.actions.getProspectosCarga());
  try {

    const { data } = await axs.get(`${baseurl}/afp/crm/prospecto/carga`);

    if (data.success) {
      dispatch(slice.actions.getProspectosCargaSuccess(data.cargas));

      onSucess && onSucess();
    } else {
      dispatch(slice.actions.getProspectosCargaError());
      onError && onError();
    }
  } catch (error) {
    dispatch(slice.actions.getProspectosCargaError(error));
    onError && onError();
  }
};

export const uploadProspectosFile = (body, onSucess, onError) => async (dispatch) => {

  dispatch(slice.actions.uploadProspectosFile());
  try {
    const { data } = await axs.post(`${baseurl}/afp/crm/prospecto/carga`, body);



    if (data.success) {
      dispatch(slice.actions.uploadProspectosFileSuccess());

      onSucess && onSucess(data);
    } else {
      dispatch(slice.actions.uploadProspectosFileError());
      onError && onError();
    }
  } catch (error) {
    console.log(error);

    dispatch(slice.actions.uploadProspectosFileError(error));
    onError && onError();
  }
};

// export const assignProspectos = (body, onSucess, onError) => async (dispatch) => {
// 	dispatch(slice.actions.assignProspectos());
// 	try {
// 		const { data } = await axs.post(`${baseurl}/afp/crm/prospecto/carga/asignacion`, body);

// 		if (data.success) {
// 			dispatch(slice.actions.assignProspectosSuccess());

// 			onSucess && onSucess(data);
// 		} else {
// 			dispatch(slice.actions.assignProspectosError());
// 			onError && onError();
// 		}
// 	} catch (error) {
// 		console.log(error);

// 		dispatch(slice.actions.assignProspectosError(error));
// 		onError && onError();
// 	}
// };

export const storeAsignacionSuffle = (payload, cb) => async (dispatch) => {
  const { asignarAleatorioFetch, asignarAleatorioSuccess, asignarAleatorioClean } = slice.actions
  try {
    dispatch(asignarAleatorioFetch());
    const { data } = await axs.post(`${baseurl}/afp/crm/prospecto/carga/asignacion`, payload);
    if (data.success) {
      toast.success(data.mensaje);
      dispatch(asignarAleatorioSuccess());
      cb();
    } else {
      
      toast.error('Se produjo un error al ingresar los prospectos en el embudo')
      dispatch(asignarAleatorioClean());

    }
  } catch (e) {
    

    toast.error('Se produjo un error al ingresar los prospectos en el embudo')
    dispatch(asignarAleatorioClean());
  }
}


export const updateProspectoField = (payload) => async (dispatch) => {
  const { updateProspectoFieldFetch, updateProspectoFieldSuccess, updateProspectoFieldClean } = slice.actions

  try {
    dispatch(updateProspectoFieldFetch(payload.idProspecto));
    const { data } = await axs.post(`${baseurl}/afp/crm/prospecto/field`, { _method: 'put', ...payload });

    if (data.success) {
      toast.success(data.mensaje);
      dispatch(updateProspectoFieldSuccess(data.payload));
    } else {
      toast.error('Se produjo un error al actualizar')
      dispatch(updateProspectoFieldClean());

    }
  } catch (e) {
    toast.error('Se produjo un error al actualizar')
    dispatch(updateProspectoFieldClean());
  }
}








export const reducer = slice.reducer;

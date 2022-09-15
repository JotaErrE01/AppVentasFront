import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import baseurl from 'src/config/baseurl';


const initialState = {

    ///:CATALOGOS
    fasesCatalogo: [],
    oportunidadCatalogo: [],





    cargaEmbudoArr: [],
    cargaEmbudoLoading: false,
    cargaEmbudoSuccess: false,

    intencionLoadId: false,
    intencionArr: [],
    intencionLoading: false,






    actualizandoFase: false,

    //
    guardandoActividad: false,
    guardandoActividadAlone: false,

    guardandoOportunidad: false,
    guardandoMotivoCierre: false,

    


    //

    embudoLoading: false,
    embudo_1: [],
    embudo_2: [],
    actividadesAloneArr:[]


    //

}


const slice = createSlice({
    name: 'intencion',
    initialState,
    reducers: {
        cargaProspectosFetch(state, action) {
            state.cargaEmbudoArr = [];
            state.cargaEmbudoLoading = true;
            state.cargaEmbudoSuccess = false
        },
        cargaProspectosSuccess(state, action) {
            state.cargaEmbudoArr = [...state.cargaEmbudoArr, ...action.payload];
            state.cargaEmbudoLoading = false;
            state.cargaEmbudoSuccess = true
        },

        showIntencionesFetch(state, action) {
            state.intencionArr = [];
            state.intencionLoading = true;
        },
        showIntencionesSuccess(state, action) {
            const { payload, fasesCatalogo, oportunidadCatalogo, motivosCatalogo, actividadesAlone } = action.payload;
            

            state.intencionArr = [...state.intencionArr, ...payload];
            state.intencionLoading = false;
            state.fasesCatalogo = fasesCatalogo;
            state.oportunidadCatalogo = oportunidadCatalogo;
            state.motivosCatalogo = motivosCatalogo;
            state.actividadesAloneArr = actividadesAlone;

        },
        showIntencionesClean(state, action) {
            state.intencionLoading = false;
        },


        storeIntencionFaseFetch(state, action) {
            state.actualizandoFase = true;
        },
        storeIntencionFaseSuccess(state, action) {
            state.intencionArr = action.payload
            state.actualizandoFase = true;
        },
        storeIntencionFaseClean(state, action) {
            state.actualizandoFase = false;
        },


        storeIntencionActividadFetch(state, action) {
            state.guardandoActividad = true;
        },
        storeIntencionActividadSuccess(state, action) {
            state.intencionArr = action.payload
            state.guardandoActividad = false;
        },
        storeIntencionActividadClean(state, action) {
            state.guardandoActividad = false;
        },


        storeActividadAloneFetch(state, action) {
            state.guardandoActividadAlone = true;
        },
        storeActividadAloneSuccess(state, action) {
            state.guardandoActividadAlone = false;
        },
        storeActividadAloneClean(state, action) {
            state.guardandoActividadAlone = false;
        },

        updateActividadAloneFetch(state, action) {
            state.guardandoActividadAlone = true;
        },
        updateActividadAloneSuccess(state, action) {

            const {actividadesAloneArr} = state;
            
            const found = state.actividadesAloneArr.findIndex(item=>item.id === action.payload.id);
            actividadesAloneArr.splice(found,1);
            state.actividadesAloneArr = actividadesAloneArr;
            state.actividadesAloneArr = false;
        },
        updateActividadAloneClean(state, action) {
            state.guardandoActividadAlone = false;
        },


        




        storeOportunidadFetch(state, action) {
            state.guardandoOportunidad = true;
        },
        storeopotunidadSuccess(state, action) {
            state.intencionArr = action.payload
            state.guardandoOportunidad = true;
        },
        storeOportunidadClean(state, action) {
            state.guardandoOportunidad = false;
        },



        storeMotivoCierreFetch(state, action) {
            state.guardandoMotivoCierre = true;
        },
        storeMotivoCierreSuccess(state, action) {
            state.intencionArr = action.payload
            state.guardandoMotivoCierre = true;
        },
        storeMotivoCierreClean(state, action) {
            state.guardandoMotivoCierre = false;
        },











        getEmbudoFetch(state, action) {
            state.embudoLoading = true;
            state.embudo = []
        },
        getEmbudoSuccess(state, action) {
            
            state.embudoLoading = false;
            state.embudo_1 = action.payload.embudo_1;
            state.embudo_2 = action.payload.embudo_2

        },
        getEmbudoClean(state, action) {
            state.embudoLoading = false;
            state.embudo = []
        },

        loadIntencionId(state, action) {
            state.intencionLoadId = action.payload;
        }



    }
});

//OBTIENE EMBUDO DE VENTAS
export const getEmbudo = () => async (dispatch) => {
    const { getEmbudoFetch, getEmbudoSuccess, getEmbudoClean } = slice.actions;
    try {
        dispatch(getEmbudoFetch());
        const response = await axs.get(`${baseurl}/afp/intencion/analytics/embudo`);

        const { data } = response;
        if (data.success) {

            dispatch(getEmbudoSuccess(data));
            toast.success('Proceso exitoso');
        } else {
            toast.error('Se produjo un error al cargar el embudo de ventas')
            dispatch(getEmbudoClean())
        }

    } catch (e) {
        toast.error('Se produjo un error al cargar el embudo de ventas')
        dispatch(getEmbudoClean())
    }
}

// RREPORTE DE EMBUDO
export const getAnalyticsEmbudo = (payload) => async (dispatch) => {
    
    const { getEmbudoFetch, getEmbudoSuccess, getEmbudoClean } = slice.actions;
    try {
        dispatch(getEmbudoFetch());

      
        const response = await axs.post(`${baseurl}/afp/intencion/analytics/intenciones`, payload);
        

        const { data } = response;
        
        if (data.success) {

            dispatch(getEmbudoSuccess(data));


            toast.success('Proceso exitoso');
        } else {
            toast.error('Se produjo un error al cargar el embudo de ventas')
            dispatch(getEmbudoClean())
        }

    } catch (e) {
        toast.error('Se produjo un error al cargar el embudo de ventas')
        dispatch(getEmbudoClean())
    }
}


// convierte prospectos en lead
export const postCargaProspectos = (payload, cb) => async (dispatch) => {
    const { cargaProspectosFetch, cargaProspectosSuccess } = slice.actions
    try {
        dispatch(cargaProspectosFetch());
        const response = await axs.post(`${baseurl}/afp/intencion/cargaProspectos`, payload);
        

        const { data } = response;
        if (data.success) {
            
            dispatch(cargaProspectosSuccess(data.payload));
            toast.success('Proceso exitoso');
            cb();
        } else {
            

            toast.error('Se produjo un error al ingresar los prospectos en el embudo')
        }
    } catch (e) {
        
        console.error(e);
        toast.error('Se produjo un error al ingresar los prospectos en el embudo')
    }
}

export const getShowIntenciones = () => async (dispatch) => {
    const { showIntencionesFetch, showIntencionesSuccess, showIntencionesClean } = slice.actions;
    try {
        dispatch(showIntencionesFetch());
        const response = await axs.get(`${baseurl}/afp/intencion/showIntenciones`);
            

        const { data } = response;
        if (data.success) {
            dispatch(showIntencionesSuccess(data));
            toast.success('Proceso exitoso');
        } else {
            toast.error('Se produjo un error al cargar los registros.')
            dispatch(showIntencionesClean())
        }

    } catch (e) {
        toast.error('Se produjo un error al cargar los registros.')
        dispatch(showIntencionesClean())
    }


}




export const postStoreIntencionFase = (payload) => async (dispatch) => {
        const { storeIntencionFaseFetch, storeIntencionFaseClean, storeIntencionFaseSuccess } = slice.actions
    try {
        dispatch(storeIntencionFaseFetch());
        const response = await axs.post(`${baseurl}/afp/intencion/storeIntencionFase`, payload);

        const { data } = response;
        if (data.success) {

            toast.success('Proceso exitoso');
            dispatch(storeIntencionFaseSuccess(data.payload));

        } else {
            toast.error('se produjo un error al actualizar fase')
            dispatch(storeIntencionFaseClean());

        }
    } catch (e) {
        toast.error('Se produjo un error al actualizar fase')
        dispatch(storeIntencionFaseClean());
    }
}

export const postStoreIntencionActividad = (payload, cb) => async (dispatch) => {

    
    
    const { storeIntencionActividadFetch,
        storeIntencionActividadSuccess,
        storeIntencionActividadClean }
        = slice.actions
    try {
        dispatch(storeIntencionActividadFetch());
        const response = await axs.post(`${baseurl}/afp/intencion/storeIntencionActividad`, payload);
        
        


        const { data } = response;

        
        if (data.success) {
            toast.success(data.mensaje);
            dispatch(storeIntencionActividadSuccess(data.payload));
            cb();
        } else {
            toast.error('Se produjo un error, actividad no registrada');
            dispatch(storeIntencionActividadClean());
        
        }
    } catch (e) {
        toast.error('Se produjo un error con los servicios, actividad no registrada')
        dispatch(storeIntencionActividadClean());
    }
};


export const postActividadAlone = (payload, cb)=> async (dispatch)=>{

    const { storeActividadAloneClean, storeActividadAloneSuccess, storeActividadAloneFetch} = slice.actions
    try {
        dispatch(storeActividadAloneFetch());
        const response = await axs.post(`${baseurl}/afp/intencion/storeActividadAlone`, payload);        
        
        const { data } = response;
        if (data.success) {
            toast.success(data.mensaje);
            dispatch(storeActividadAloneSuccess(data.payload));
            cb();
        } else {
            toast.error('Se produjo un error, actividad no registrada');
            dispatch(storeActividadAloneClean());
        
        }
    } catch (e) {
        const errorr =e;
        toast.error('Se produjo un error con los servicios, actividad no registrada')
        dispatch(storeActividadAloneClean());
    }
}

export const updateActividadAlone = (payload, cb)=> async (dispatch)=>{

    const { updateActividadAloneClean, updateActividadAloneSuccess, updateActividadAloneFetch} = slice.actions
    try {
        dispatch(updateActividadAloneFetch());
        const response = await axs.post(`${baseurl}/afp/intencion/updateActividadAlone`, payload);        
       ;
        const { data } = response;
        if (data.success) {
            toast.success(data.mensaje);
            dispatch(updateActividadAloneSuccess(data.payload));
            cb();
        } else {
            toast.error('Se produjo un error, actividad no registrada');
            dispatch(updateActividadAloneClean());
        
        }
    } catch (e) {
        const errorr =e;
        toast.error('Se produjo un error con los servicios, actividad no registrada')
        dispatch(updateActividadAloneClean());
    }
}




export const postStoreIntencionOpotunidad = (payload, cb) => async (dispatch) => {
    

    const { storeopotunidadSuccess, storeOportunidadClean, storeOportunidadFetch } = slice.actions;

    try {
        dispatch(storeOportunidadFetch());


        const response = await axs.post(`${baseurl}/afp/intencion/storeIntencionOportunidad`, payload);
        
        const { data } = response;

        if (data.success) {
            toast.success(data.mensaje);
            dispatch(storeopotunidadSuccess(data.payload));
            cb();
        } else {
            toast.error(data.mensaje)
            dispatch(storeOportunidadClean());
            // cb()
        }
    } catch (e) {
        toast.error('Se podujo un error al guardar contrato')
        dispatch(storeOportunidadClean());
        // cb();
    }
}


export const postStoreMotivoCierre = (payload, cb) => async (dispatch) => {
    const { storeMotivoCierreFetch, storeMotivoCierreClean, storeMotivoCierreSuccess } = slice.actions
    try {
        dispatch(storeMotivoCierreFetch());
        const response = await axs.post(`${baseurl}/afp/intencion/storeIntencionMotivoCierre`, payload);
                

        const { data } = response;
        if (data.success) {

            toast.success(data.mensaje);
            dispatch(storeMotivoCierreSuccess(data.payload));
            cb();

        } else {
            toast.error(data.mensaje)
            dispatch(storeMotivoCierreClean());

        }
    } catch (e) {
        toast.error('Se produjo un error, inténtelo más tarde')
        dispatch(storeMotivoCierreClean());

    }
}



export const loadIntencionId = (intencionId, cb) => (dispatch) => {

    const _loadIntencionId = slice.actions.loadIntencionId;
    dispatch(_loadIntencionId(intencionId));
    cb();
}










export const reducer = slice.reducer;

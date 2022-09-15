import { createSlice } from '@reduxjs/toolkit';
import axs from 'src/utils/axs';
import _ from 'lodash';
import baseurl from 'src/config/baseurl';
import { encode } from 'js-base64';
import { mailKit } from 'src/mailer';

const URL = baseurl;
const clientURL = process.env.REACT_APP_AFP_WEB_CLIENT;


const initialState = {
    oportunidades: [],
    oportunidad: {},
    rows: 0,
    loading: false,
    error: false,
    oportunidadEstados: [],
    oportunidadTieneEstados: [],
    locked: false,
    loadingValidate: false,
    loadingOportunidadEstados: false,
    oportunidadEstados: []
};




const slice = createSlice({
    name: 'oportunidades',
    initialState,
    reducers: {

        //:: READ ALL 
        getOportunidadesFech(state, action) {
            state.oportunidades = []
            state.loading = true;
        },
        getOportunidadesSuccess(state, action) {


            state.oportunidades = action.payload.data;
            state.rows = action.payload.rows
            state.loading = false;
            state.error = false;
        },
        getOportunidadesError(state, action) {

            state.oportunidades = [];
            state.loading = false;
            state.error = action.payload;
        },

        //:: CLEAN OPORTUNIDAD TIENE ESTADOS

        cleanOportunidadTieneEstadoFetch(state, action) {
            state.oportunidadTieneEstados = [];
            state.oportunidadEstados = [];
            state.current_status = {};
            state.estados = []



            state.locked = false;
            state.loading = false;
            state.error = false;
        },


        //:: READ OPORTUNIDAD TIENE ESTADOS 
        getOportunidadTieneEstadoFech(state, action) {
            state.oportunidadTieneEstados = [];
            state.loading = true;
        },
        getOportunidadTieneEstadoSuccess(state, action) {

            const {
                oportunidadTieneEstados,
                oportunidadEstados,
                current_status,
                locked,
                estados,
            } = action.payload.data;


            state.oportunidadTieneEstados = oportunidadTieneEstados;
            state.oportunidadEstados = oportunidadEstados;
            state.current_status = current_status;
            state.estados = _.reverse(_.uniqBy(estados, 'contenido'));





            state.locked = locked;
            state.loading = false;
            state.error = false;

        },
        getOportunidadTieneEstadoError(state, action) {

            state.oportunidadTieneEstados = [];
            state.loading = false;
            state.error = action.payload;
        },


        //:: POST OPORTUNIDAD TIENE ESTADOS
        postOportunidadTieneEstadoFech(state, action) {
            state.loading = true;
        },
        postOportunidadTieneEstadoSuccess(state, action) {



            const oportunidad_estado = action.payload;
            // const { oportunidadTieneEstado } = oportunidad_estado;

            const current = _.findIndex(state.estados, function (item) { return item.contenido == oportunidad_estado.contenido });

            // 
            // if (
            //     state.current_status &&
            //     (state.current_status.oportunidad_estado_id == 2 ||
            //         state.current_status.oportunidad_estado_id == 6)
            // ) {
            //     state.current_status = oportunidadTieneEstado;
            //     state.locked = true;
            // } else if (
            //     state.current_status &&
            //     (state.current_status.oportunidad_estado_id == 4 ||
            //         state.current_status.oportunidad_estado_id == 13 ||
            //         state.current_status.oportunidad_estado_id == 8 ||
            //         state.current_status.oportunidad_estado_id == 3)
            // ) {
            //     state.current_status = oportunidadTieneEstado;
            //     state.locked = false;
            // }

            if (current >= 0) {
                state.estados[current] = oportunidad_estado;
            } else {
                state.estados.push(oportunidad_estado);
            }




            state.loading = false;
            state.error = false;
        },
        postOportunidadTieneEstadoError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        validateOportunidad(state, action) {
            state.loadingValidate = true;
        },
        validateOportunidadSuccess(state, action) {

            state.loadingValidate = false;
            // state.error = action.payload;
        },
        validateOportunidadError(state, action) {
            state.loadingValidate = false;
            // state.loading = false;
            // state.error = action.payload;
        },
        getOportunidadEstados(state, action) {
            state.loadingOportunidadEstados = true;
        },
        getOportunidadEstadosSuccess(state, action) {
            state.loadingOportunidadEstados = false;
            state.oportunidadEstados = action.payload;
        },
        getOportunidadEstadosError(state, action) {
            state.loadingOportunidadEstados = false;
        },
    }
});



export const getOportunidades = (enqueueSnackbar, { skip, take }, { field, sort }) => async (dispatch) => {
    const { getOportunidadesFech, getOportunidadesSuccess, getOportunidadesError } = slice.actions;
    dispatch(getOportunidadesFech());
    try {
        const { data } = await axs.get(`${URL}/afp/crm/oportunidad_/${skip}/${take}/${field}/${sort}`);
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(getOportunidadesSuccess(data));
            return;
        }
        throw data.mensaje;
    }
    catch (error) {
        
        dispatch(getOportunidadesError(error ? error : 'Error en los servicios'));
        enqueueSnackbar("Error en los servicios", { variant: 'error' });
    }
};


//:: OPORTUNIDAD TIENE ESTADOS


export const cleanOportunidadTieneEstados = (idOportunidad, enqueueSnackbar) => async (dispatch) => {
    console.log('CLEANING OP')
    const { cleanOportunidadTieneEstadoFetch } = slice.actions;
    dispatch(cleanOportunidadTieneEstadoFetch());
};


//:: OPORTUNIDAD TIENE ESTADOS
export const getOportunidadTieneEstados = (idOportunidad, enqueueSnackbar, callback) => async (dispatch) => {
    const { getOportunidadTieneEstadoFech, getOportunidadTieneEstadoSuccess, getOportunidadTieneEstadoError } = slice.actions;
    dispatch(getOportunidadTieneEstadoFech());
    try {
        const { data } = await axs.get(`${URL}/afp/crm/oportunidadtieneestados/${idOportunidad}`);

        console.log('GET OPORTUNIDAD TIENE ESTADOS', data);

        if (data.success) {
            enqueueSnackbar && enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(getOportunidadTieneEstadoSuccess(data));
            if(callback) callback();
            return;
        }
        throw data.mensaje;
    }
    catch (error) {
        dispatch(getOportunidadTieneEstadoError(error ? error : 'Error en los servicios'));
        enqueueSnackbar && enqueueSnackbar("Error en los servicios", { variant: 'error' });
    }
};


export const postOportunidadTieneEstado = (body, enqueueSnackbar, onSuccess) => async (dispatch) => {
    const { postOportunidadTieneEstadoError, postOportunidadTieneEstadoFech, postOportunidadTieneEstadoSuccess } = slice.actions;
    dispatch(postOportunidadTieneEstadoFech());
    try {
        const { data } = await axs.post(`${URL}/afp/crm/oportunidadtieneestados`, body);
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            dispatch(postOportunidadTieneEstadoSuccess(data.data));
            dispatch(getOportunidadTieneEstados(body.oportunidad_id, enqueueSnackbar));
            onSuccess();
            return;
        }
        throw data.mensaje;
    }
    catch (error) {
        dispatch(postOportunidadTieneEstadoError(error));
        enqueueSnackbar("Error en los servicios", { variant: 'error' });
    }

}




export const postOportunidadTieneEstadoSignedFiles = (body, enqueueSnackbar, onSuccess) => async (dispatch) => {
    const { postOportunidadTieneEstadoError, postOportunidadTieneEstadoFech, postOportunidadTieneEstadoSuccess } = slice.actions;
    dispatch(postOportunidadTieneEstadoFech());
    try {
        const response = await axs.post(`${URL}/afp/crm/oportunidad/signedfiles`, body);

        const { data } = response;
        if (data.success) {
            enqueueSnackbar(data.mensaje, { variant: 'success' });
            onSuccess(data.allSigned ? 2 : 3)
            return;
        }
        throw data.mensaje;
    }
    catch (error) {

        dispatch(postOportunidadTieneEstadoError(error));
        enqueueSnackbar("Error en los servicios", { variant: 'error' });
    }
};

export const validateOportunidad = (idOportunidad, onSuccess, onError) => async (dispatch) => {
    const { validateOportunidad: _validateOportunidad, validateOportunidadError, validateOportunidadSuccess } = slice.actions;
    dispatch(_validateOportunidad());
    try {

        const response = await axs.get(`${URL}/afp/crm/oportunidad/validate/${idOportunidad}`);

        const { data } = response;
        if (data.success) {
            dispatch(validateOportunidadSuccess(data.data));
            onSuccess && onSuccess(data.data);
        } else {
            dispatch(validateOportunidadError(data.data));
            onError && onError(data.data);
        }
    } catch (e) {
        dispatch(validateOportunidadError(e));
        onError && onError(e);
    }
};

export const senMailBienvenida = (payload) => async (dispatch) => {
    

    const mailProps = {
        "nombre_cliente": payload.nombre_cliente,
        "facebook": "https://www.facebook.com/FondosGenesis",
        "instagram": "https://www.instagram.com/fondosgenesis/",
        "website": "https://genesis.administradoradefondos.com",
        "url_kit": clientURL + "/cliente/inicio",
        "email_cliente": payload.email_cliente,
        "tipo_fondo": payload.tipo_fondo,
        "nombre_fondo": payload.nombre_fondo,
                // "email_cliente": 'danielarelam@gmail.com',

        "asunto": "GENESIS ADMINISTRADORA DE FONDOS || KIT BIENVENIDA",
    };

    const body = {
        rucCedula: 0,
        emailDestinatario: mailProps.email_cliente,
        nombreDestinatario: mailProps.nombre_cliente,
        asunto: mailProps.asunto,
        texto: encode(mailKit(mailProps))
    }

    const response = await axs.post(baseurl + '/afp/crm/sendMailAfp', body);
    


}

export const getOportunidadEstados = (onSuccess, onError) => async (dispatch) => {
    const { getOportunidadEstados: _getOportunidadEstados, getOportunidadEstadosSuccess, getOportunidadEstadosError } = slice.actions;
    dispatch(_getOportunidadEstados());
    try {

        const response = await axs.get(`${URL}/afp/crm/oportunidadestados`);

        const { data } = response;
        console.log('jfksjfksjfksjk');
        console.log({data});
        dispatch(getOportunidadEstadosSuccess(data));
        onSuccess && onSuccess(data.data);
        
    } catch (e) {
        console.log(e);
        dispatch(getOportunidadEstadosError(e));
        onError && onError(e);
    }
};

export const reprocesarAlta = ({ id, idOportunidad }, callback, enqueueSnackbar) => async dispatch => {
    try {
        await axs.get(`${URL}/afp/crm/oportunidadtieneestados/inactivar/${id}`);
        dispatch(getOportunidadTieneEstados(idOportunidad, enqueueSnackbar, callback));
    } catch (error) {
        console.log(error);
        callback(false);
    }
}


export const reducer = slice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { siteurl } from 'src/config/baseurl';

const slice = createSlice({
    name: 'janus',
    initialState: {
        scripts: {
            adapter: null,
            janus: null,
            ready: null,
        },
        initialized: false
    },
    reducers: {
        /// SETEAR SCRIPT TAGS DE LIBRERIA JANUS
        setScriptsAdapter(state, action) {
            state.scripts.adapter = action.payload;
        },
        setScriptsJanus(state, action) {
            state.scripts.janus = action.payload;
        },
        checkReady(state) {
            if (state.scripts.janus && state.scripts.adapter) {
                state.scripts.ready = true;
            }
        },
        setInitialized(state, action) {
            
            state.initialized = action.payload;
        },
    }
});

export const reducer = slice.reducer;



/// SETEAR SCRIPT TAGS DE LIBRERIA JANUS
export const setJanusScripts = () => async (dispatch) => {

    const JANUS_ADAPTER = `${siteurl}/janux/adapter.min.js`;
    const JANUS_API = `${siteurl}/janux/janus2.js`;

    async function renderScriptTag(src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;

        let element = document.getElementById("foot");
        element.appendChild(script);
        script.addEventListener('load', () => {
            console.log(src);
            if (src == JANUS_ADAPTER) {
                dispatch(slice.actions.setScriptsAdapter(true));
                dispatch(slice.actions.checkReady());
            }
            if (src == JANUS_API) {
                dispatch(slice.actions.setScriptsJanus(true));
                dispatch(slice.actions.checkReady());
            }
        });
    }
    await renderScriptTag(JANUS_ADAPTER);
    await renderScriptTag(JANUS_API);
}


export const setInitialized = (value) => async (dispatch) => {
    dispatch(slice.actions.setInitialized(value));
}


export default slice;
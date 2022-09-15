import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as chatReducer } from 'src/slices/chat';
import { reducer as formReducer } from 'redux-form';
import { reducer as mailReducer } from 'src/slices/mail';
import { reducer as notificationReducer } from 'src/slices/notification';
import { reducer as catalogosReducer } from 'src/slices/catalogos';
import { reducer as clientesReducer } from 'src/slices/clientes';
import { reducer as empresasReducer } from 'src/slices/empresas';
import { reducer as kanbanReducer } from 'src/slices/kanban';
import { reducer as usuarioReducer } from 'src/slices/usuario';
import { reducer as fondoReducer } from 'src/slices/fondos';
import { reducer as janusReducer } from 'src/slices/janus';
import { reducer as prospectoReducer } from 'src/slices/prospecto';
import { reducer as actividadReducer } from 'src/slices/actividad';
import { reducer as motivosReducer } from 'src/slices/motivos';
import { reducer as actividadesReducer } from 'src/slices/actividades';
import { reducer as faseEmbudoReducer } from 'src/slices/faseEmbudo';
import { reducer as catalogosMaestrosReducer } from 'src/slices/catalogosMaestros';
import { reducer as conferenciaReducer } from 'src/slices/conferencias';
import { reducer as adjuntoReducer } from 'src/slices/adjuntos';
import { reducer as fondoLargoPlazoReducer } from 'src/slices/fondoLargoPlazo';
import {reducer as OportunidadReducer} from 'src/slices/oportunidad';
import {reducer as SharepointFileReducer} from 'src/slices/sharepointFile';
import {reducer as tipoAfiliacionReducer} from 'src/slices/tipoAfiliacion';
import {reducer as salaReducer} from 'src/slices/sala';
import {reducer as salaUserReducer} from 'src/slices/salaUsers';
import {reducer as coreSalaReducer} from 'src/slices/coreSala';
import {reducer as analyticsReducer} from 'src/slices/analytics'
import {reducer as intencionReducer} from 'src/slices/intencion'
import {reducer as serverinfoReducer} from 'src/slices/serverInfo'
import { logReducer } from 'src/slices/log';

const rootReducer = combineReducers({
	cliente: clientesReducer,
	empresa: empresasReducer,
	kanban: kanbanReducer,
	calendar: calendarReducer,
	chat: chatReducer,
	form: formReducer,
	mail: mailReducer,
	notifications: notificationReducer,
	usuario: usuarioReducer,
	fondo: fondoReducer,
	janus: janusReducer,
	prospecto: prospectoReducer,
	actividad: actividadReducer,
	fasesEmbudo: faseEmbudoReducer,
	motivos: motivosReducer,
	catalogo: catalogosReducer,
	catalogoMaestro: catalogosMaestrosReducer,
	actividades: actividadesReducer,
	conferencia: conferenciaReducer,
	adjunto: adjuntoReducer,
	fondoLargoPlazo: fondoLargoPlazoReducer,
	oportunidad: OportunidadReducer,
	sharepointFile: SharepointFileReducer,
	tipoAfiliacion: tipoAfiliacionReducer,
	sala:salaReducer,
	salaUser:salaUserReducer,
	coreSala:coreSalaReducer,
	analytics:analyticsReducer,
	intencion:intencionReducer,
	serverinfo:serverinfoReducer,
	log: logReducer
});
export default rootReducer;

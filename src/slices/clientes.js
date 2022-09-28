import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import axs from 'src/utils/axs';
import baseurl from 'src/config/baseurl';
import { parse } from 'date-fns';
import { setEmpresa } from './empresas';
// import { _adjuntosCheckList, _archivosAdjuntos } from './_mock_adjuntos';

const _ConsultarData = {
	step: '',
	id_cliente: '',
	tipo_documento: '',
	numero_identificacion: '',
	codigo_cliente: '',
	fecha_expiracion_documento: '',
	nombre_cliente: '',
	apellido_cliente: '',
	pais_ubicacion_cliente: '',
	sexo_cliente: '',
	grado_instruccion_cliente: '',
	titulo_obtenido_cliente: '',
	fecha_nacimiento_cliente: '',
	nacionalidad_cliente: '',
	nacionalidad_cliente2: '',
	nacionalidad_cliente3: '',
	estado_civil_cliente: '',
	numero_identificacion_conyugue: '',
	nombre_apellido_conyugue: '',
	numero_identificacion_representante_legal: '',
	nombre_apellido_representante_legal: '',
	politicamente_expuesto: '',
	es_jubilado: '',
	fecha_jubilado: '',
	telefono_cliente: '',
	celular_cliente: '',
	correo_cliente: '',
	provincia_cliente: '',
	canton_cliente: '',
	parroquia_cliente: '',
	recinto_cliente: '',
	calle_principal_domicilio: '',
	numeracion_domicilio: '',
	interseccion_domicilio: '',
	codigo_postal_domicilio: '',
	ciudadela_cooperativa_sector_domicilio: '',
	etapa_domicilio: '',
	manzana_domicilio: '',
	solar_domicilio: '',
	referencia_domicilio: '',
	edificio_domicilio: '',
	piso_edificio_domicilio: '',
	numero_departamento_edificio_domicilio: '',
	actividad_economica: '',
	ruc_actividad_economica_cliente: '',
	razon_social_actividad_economica_cliente: '',
	cargo_actividad_economica_cliente: '',
	dpto_laboral_actividad_economica_cliente: '',
	telefono_actividad_economica_cliente: '',
	ext_telefono_actividad_economica_cliente: '',
	correo_actividad_economica_cliente: '',
	provincia_actividad_economica_cliente: '',
	canton_actividad_economica_cliente: '',
	parroquia_actividad_economica_cliente: '',
	calle_principal_domicilio_actividad: '',
	numeracion_domicilio_actividad: '',
	interseccion_domicilio_actividad: '',
	codigo_postal_domicilio_actividad: '',
	ciudadela_cooperativa_sector_domicilio_actividad: '',
	etapa_domicilio_actividad: '',
	manzana_domicilio_actividad: '',
	solar_domicilio_actividad: '',
	referencia_domicilio_actividad: '',
	edificio_domicilio_actividad: '',
	piso_edificio_domicilio_actividad: '',
	numero_departamento_edificio_domicilio_actividad: '',
	codigo_postal_edificio_domicilio_actividad: ''
};

const _castConsultarData = (consult) => {
	let consultarData = consult;

	consultarData.step = consult.step;
	consultarData.id_cliente = consult.id;
	consultarData.tipo_documento = consult.tipo_identificacion;
	consultarData.numero_identificacion = consult.numero_identificacion;
	consultarData.codigo_cliente = consult.codigo_cliente;
	consultarData.fecha_expiracion_documento = consult.fecha_expira_ci_pas;
	consultarData.nombre_cliente = consult.primer_nombre;
	consultarData.apellido_cliente = consult.primer_apellido;
	consultarData.pais_ubicacion_cliente = consult.pais_residencia_local;
	consultarData.sexo_cliente = consult.sexo;
	consultarData.grado_instruccion_cliente = consult.nivel_preparacion;
	consultarData.titulo_obtenido_cliente = consult.profesion;
	consultarData.fecha_nacimiento_cliente = consult.fecha_nacimiento;
	consultarData.nacionalidad_cliente = consult.nacionalidad;
	consultarData.nacionalidad_cliente2 = consult.nacionalidad2;
	consultarData.nacionalidad_cliente3 = consult.nacionalidad3;
	consultarData.estado_civil_cliente = consult.estado_civil_catalogo_id;
	consultarData.numero_identificacion_conyugue = consult.conyuge_cedula_pas;
	consultarData.nombre_apellido_conyugue = consult.conyuge_nombres;
	consultarData.numero_identificacion_representante_legal = consult.representante_legal_cedula_pas;
	consultarData.nombre_apellido_representante_legal = consult.representante_legal_apoderado;
	consultarData.politicamente_expuesto = consult.politicamente_expuesto;
	consultarData.fecha_jubilacion = consult.fecha_jubilacion;
	consultarData.es_jubilado = consult.es_jubilado;
	consultarData.fecha_jubilado = consult.fecha_jubilacion;
	consultarData.telefono_cliente = consult.telefono_principal;
	consultarData.celular_cliente = consult.telefono_secundario;
	consultarData.correo_cliente = consult.email;
	consultarData.provincia_cliente = consult.provincia;
	consultarData.canton_cliente = consult.canton;
	consultarData.parroquia_cliente = consult.parroquia;
	consultarData.recinto_cliente = consult.recinto;
	consultarData.calle_principal_domicilio = consult.calle_principal;
	consultarData.numeracion_domicilio = consult.numero_principal;
	consultarData.interseccion_domicilio = consult.calle_interseccion_1;
	consultarData.codigo_postal_domicilio = consult.codigo_regional;
	consultarData.ciudadela_cooperativa_sector_domicilio = consult.ciudadela;
	consultarData.etapa_domicilio = consult.etapa;
	consultarData.manzana_domicilio = consult.manzana;
	consultarData.solar_domicilio = consult.solar_villa;
	consultarData.referencia_domicilio = consult.referencia_adicional;
	consultarData.edificio_domicilio = consult.nombre_edificio;
	consultarData.piso_edificio_domicilio = consult.piso;
	consultarData.numero_departamento_edificio_domicilio = consult.numero_departamento;
	consultarData.actividad_economica = consult.actividad_economica;

	consultarData.cargo_actividad_economica_cliente = consult.cargo;
	consultarData.dpto_laboral_actividad_economica_cliente = consult.departamento_laboral;

	consultarData.empresa_id = consult.empresa ? consult.empresa.id : null;
	consultarData.ruc_actividad_economica_cliente = consult.empresa ? consult.empresa.Ruc : '';
	consultarData.razon_social_actividad_economica_cliente = consult.empresa ? consult.empresa.razon_social : '';
	consultarData.correo_actividad_economica_cliente = consult.empresa ? consult.empresa.email : '';
	consultarData.provincia_actividad_economica_cliente = consult.empresa ? consult.empresa.provincia : '';
	consultarData.canton_actividad_economica_cliente = consult.empresa ? consult.empresa.canton : '';
	consultarData.parroquia_actividad_economica_cliente = consult.empresa ? consult.empresa.parroquia : '';
	consultarData.calle_principal_domicilio_actividad = consult.empresa ? consult.empresa.calle_principal : '';
	consultarData.numeracion_domicilio_actividad = consult.empresa ? consult.empresa.numeracion : '';
	consultarData.interseccion_domicilio_actividad = consult.empresa ? consult.empresa.interseccion : '';
	consultarData.codigo_postal_domicilio_actividad = consult.empresa ? consult.empresa.codigo_postal : '';
	consultarData.ciudadela_cooperativa_sector_domicilio_actividad = consult.empresa ? consult.empresa.ciudadela : '';
	consultarData.etapa_domicilio_actividad = consult.empresa ? consult.empresa.etapa : '';
	consultarData.manzana_domicilio_actividad = consult.empresa ? consult.empresa.manzana : '';
	consultarData.solar_domicilio_actividad = consult.empresa ? consult.empresa.solar : '';
	consultarData.referencia_domicilio_actividad = consult.empresa ? consult.empresa.referencia : '';
	consultarData.edificio_domicilio_actividad = consult.empresa ? consult.empresa.edificio : '';
	consultarData.piso_edificio_domicilio_actividad = consult.empresa ? consult.empresa.piso : '';
	consultarData.numero_departamento_edificio_domicilio_actividad = consult.empresa
		? consult.empresa.departamento
		: '';
	consultarData.codigo_postal_edificio_domicilio_actividad = consult.empresa ? consult.empresa.codigo_postal2 : '';
	consultarData.telefono_actividad_economica_cliente = consult.empresa ? consult.empresa.telefono : '';
	consultarData.ext_telefono_actividad_economica_cliente = consult.empresa ? consult.empresa.extension : '';

	return consultarData;
};

const initialState = {
	OportunidadesListado: {
		data: [],
		loading: false,
		error: false
	},

	ConsultarData: _ConsultarData,

	AlertClienteCreate: false, // utilizado unicamente a la hora de crear un cliente step a step
	AlertClienteEdit: false, // utilizado unicamente a la hora de crear un cliente step a step

	StepCharge: {
		///consulta de cliente basica en bd
		id_cliente: '',
		numero_identificacion: '',
		primer_nombre: '',
		primer_apellido: '',
		codigo_cliente: '',
		step: ''
	},
	FondoMaster: {
		///consulta de fondo master
		cheque: 0,
		deposito_directo: 0,
		traspaso: 0,
		transferencia: 0,
		beneficiarios: [],
		nombres: '',
		apellidos: '',
		documento: '',
		expira: '',
		nacionalidad: '',
		nacionalidades: []
	},
	create_edit_corto_plazo: true, // se utiliza para saber si ya creo o edito un fondo a corto plazo
	Wait: true, //se utiliza para respuesta en base a cambio de componentes
	Alert: false, //mantiene notificacion oculta a la vista
	Error: 0, //para mensajes de error
	DeleteAporte: 0, //para mensajes cuando borra
	UpdateAporte: 0,
	StoreAporte: 0,
	FondoAportes: [], //lista de fondo de aportes de largo plazo (horizonte) del cliente
	tipoFondo: '',
	loadData: false,
	comunicacionAfp: true, // Se utiliza para verificar la conexiÃ³n con el afp core
	FondoAporteEditar: {
		cliente: [],
		bsv: [],
		bae: []
	},
	DataAllClient: [],
	CedStep: '',
	cedClienteInicial: '',
	LastFondoCliente: {
		datos_aporte: [],
		beneficiario_sv: []
	},
	loadingCliente: false,
	documentosAdjuntos: [],
	adjuntosCheckList: [],
	archivosAdjuntos: [],
	adjuntosLoading: false,
	adjuntosUploading: false,
	Oportunidad: {
		aporte: {}
	},
	loadingPrima: false,
	errorPrima: '',
	fondoSeleccionado: {},
	mensajesBeneficiosAdicionales: {},
	errorBeneficiosAdicionales: '',
	loadingDocumentosAdjuntos: false,
	loadingGenerate: [],
	datosClienteSelected: null,
	errorDatosClienteSelected: ''
};

const slice = createSlice({
	name: 'clientes',
	initialState,
	reducers: {
		postEnviarDocumentos(state, action) {
			state.adjuntosUploading = true;
		},
		postEnviarDocumentosLoading(state, action) {
			state.adjuntosLoading = true;
		},
		postEnviarDocumentosSuccess(state, action) {
			// state.adjuntosLoading = false;

			// const adjunto = action.payload.data;

			// const foundArchivoAdjunto = _.find(state.archivosAdjuntos,
			// 	{tipo_documento_id:adjunto.tipo_documento_id }
			// );
			// let payload = [];
			// if(foundArchivoAdjunto){ //cuando existe en la lista
			// 	 payload  = _.map(state.archivosAdjuntos, function (item) {
			// 		return item.tipo_documento_id === adjunto.tipo_documento_id ? adjunto : item;
			// 	});

			// 	state.archivosAdjuntos =payload;

			// }else{

			// 	 payload = [...state.archivosAdjuntos,adjunto]
			// 	state.archivosAdjuntos =payload;
			// }

			const adjunto = action.payload;

			let indexUpdate = state.archivosAdjuntos.findIndex((item) => item.idAdjunto == adjunto.id);

			if (indexUpdate != -1) {
				state.archivosAdjuntos[indexUpdate] = adjunto;
				state.archivosAdjuntos = [...state.archivosAdjuntos];
			} else {
				state.archivosAdjuntos = [...state.archivosAdjuntos, adjunto];
			}

			let indexUpdateCheckList = state.adjuntosCheckList.findIndex(
				(item) => item.tipo_documento_id == adjunto.tipo_documento_id
			);

			if (indexUpdateCheckList != -1) {
				state.adjuntosCheckList[indexUpdateCheckList] = {
					...state.adjuntosCheckList[indexUpdateCheckList],
					estado: 'Pendiente'
				};
				state.adjuntosCheckList = [...state.adjuntosCheckList];
			}

			state.adjuntosUploading = false;
		},

		_postEnviarDocumentosFetch(state, action) {
			state.adjuntosLoading = true;
		},
		_postEnviarDocumentosSuccess(state, action) {
			state.adjuntosLoading = false;
			const adjunto = action.payload;
			let index = state.archivosAdjuntos.findIndex((item) => item.idAdjunto == adjunto.id);

			if (index != -1) {
				const _archivos = [...state.archivosAdjuntos];
				_archivos[index] = adjunto;
				state.archivosAdjuntos = [..._archivos];
			} else {
				state.archivosAdjuntos = [...state.archivosAdjuntos, adjunto];
			}
		},
		_postEnviarDocumentosError(state, action) {
			state.adjuntosError = action.payload;
			state.adjuntosLoading = false;
		},

		postEnviarDocumentosError(state, action) {
			state.adjuntosError = action.payload;
			state.postEnviarDocumentosError = false;
		},
		getEnviarDocumentos(state, action) {
			state.Documentos = action.payload;
			state.loadingDocumentosAdjuntos = false;
		},
		getClientesSearch(state, action) {
			const consult = action.payload;

			let clienteCasted = _castConsultarData(consult);

			state.ConsultarData = { ...clienteCasted };

			state.Wait = consult.id ? false : true;
			state.Alert = consult.id ? false : true;
			state.DeleteAporte = 0;
			state.StoreAporte = 0;
			state.errorMessage = '';
		},
		getDeleteInformationWithRefuse(state) {
			state.Wait = true;
			state.Alert = false;
			state.DeleteAporte = 0;
			state.StoreAporte = 0;
			state.Error = 0;
			state.FondoAportes = [];
			state.FondoAporteEditar.cliente = [];
			state.FondoAporteEditar.bsv = [];
			state.FondoAporteEditar.bae = [];
			state.DataAllClient = [];
			state.CedStep = '';
			state.StepCharge.id_cliente = '';
			state.StepCharge.numero_identificacion = '';
			state.StepCharge.primer_nombre = '';
			state.StepCharge.primer_apellido = '';
			state.StepCharge.tipo_documento = '';
			state.StepCharge.codigo_cliente = '';
			// state.ConsultarData.numero_identificacion = '';
			// state.ConsultarData.primer_nombre = '';
			// state.ConsultarData.primer_apellido = '';
			// state.ConsultarData.tipo_documento = '';
			// state.ConsultarData.codigo_cliente = '';

			state.ConsultarData = {};
		},
		getAlertSearchEmpty(state) {
			state.StepCharge.Alert = true;
		},
		getMessageError(state, action) {
			const data = action.payload;
			state.errorSave = true;
			state.errorMessage = data.message;
		},
		getAlertStoreAporteSuccess(state, action) {
			state.StoreAporte = action.payload;
			state.DeleteAporte = 0;
			state.UpdateAporte = 0;
			state.Error = 0;
		},
		getOportunidades(state, action) {
			const { data, loading, error } = action.payload;
			state.OportunidadesListado = action.payload;
		},
		getAlertIfNotStore(state) {
			state.Error = 0;
		},
		getFondoAporteList(state, action) {
			const list = action.payload;
			state.tipoFondo = list[1];
			state.FondoAportes = list[0];
			state.StoreAporte = 0;
			state.DeleteAporte = 0;
			state.UpdateAporte = 0;
			state.Error = 0;
		},
		getFondoAporteDelete(state, action) {
			state.DeleteAporte = action.payload;
			state.StoreAporte = 0;
			state.UpdateAporte = 0;
			state.Error = 0;
		},
		getFondoAporteEdit(state, action) {
			const list = action.payload;
			state.FondoAporteEditar.cliente = list.cliente;
			state.FondoAporteEditar.bsv = list.bsv;
			state.FondoAporteEditar.bae = list.bae;
		},
		getQueryDataAll(state, action) {
			const list = action.payload;
			state.DataAllClient = list;
		},
		getSearchClientCreate(state, action) {
			const bool = Boolean(!action.payload.message);
			state.DocumentoDuplicado = bool;
		},
		getDocuementosFondo(state, action) {
			state.DocumentosFondo = action.payload;
		},
		envioCedParaSteps(state, action) {
			const list = action.payload;
			state.ConsultarData.numero_identificacion = list;
		},
		envioAllParaSteps(state, action) {
			const list = action.payload;
			state.ConsultarData = list;
		},
		createOportunity(state, action) {
			state.CrearOportunidad = action.payload;
		},
		setCreateEditarCortoPlazo(state, action) {
			const create_editar_corto_plazo = action.payload;
			state.create_edit_corto_plazo = create_editar_corto_plazo;
		},
		ComunicacionAfpCore(state, action) {
			const comunicacionAfp = action.payload;
			state.comunicacionAfp = comunicacionAfp;
		},
		loadData(state, action) {
			state.loadData = action.payload;
			state.loadingCliente = action.payload;
		},
		getDocumentosOportunidad(state, action) {
			let { adjuntosCheckList, archivosAdjuntos } = action.payload;

			state.adjuntosCheckList = adjuntosCheckList;
			state.archivosAdjuntos = archivosAdjuntos;
			state.adjuntosLoading = false;
		},
		getDocumentosOportunidadLoading(state) {
			state.documentosAdjuntos = [];
			state.adjuntosLoading = true;
		},
		getOportunidad(state, action) {
			state.Oportunidad = action.payload;

			state.mensajesBeneficiosAdicionales = '';
			state.errorBeneficiosAdicionales = '';

			state.loadingOportunidad = false;
		},
		setOportunidad(state, action) {
			state.Oportunidad = action.payload;
		},
		setRegularizarEmpresaOportunidad(state, action) {
			state.Oportunidad = {
				...state.Oportunidad,
				regularizarEmpresa: action.payload
			};
		},
		setLoadingOportunidad(state, action) {
			state.loadingOportunidad = action.payload;
		},
		setTipoFondo(state, action) {
			state.tipoFondo = { ...action.payload };
		},
		setLoadingGenerate(state, action) {
			const { indexGenerating, loadingValue } = action.payload;
			if (!state.loadingGenerate) {
				state.loadingGenerate = [];
			}
			state.loadingGenerate[indexGenerating] = loadingValue;
			state.loadingGenerate = [...state.loadingGenerate];
		},
		generateContratoHorizonteSuccess(state, action) {
			const adjunto = action.payload;

			let indexUpdate = state.archivosAdjuntos.findIndex((item) => item.idAdjunto == adjunto.id);

			if (indexUpdate != -1) {
				state.archivosAdjuntos[indexUpdate] = adjunto;
				state.archivosAdjuntos = [...state.archivosAdjuntos];
			} else {
				state.archivosAdjuntos = [...state.archivosAdjuntos, adjunto];
			}
		},
		generateAutorizacionBancariaSuccess(state, action) {
			const adjunto = action.payload;

			let indexUpdate = state.archivosAdjuntos.findIndex((item) => item.idAdjunto == adjunto.id);

			if (indexUpdate != -1) {
				state.archivosAdjuntos[indexUpdate] = adjunto;
				state.archivosAdjuntos = [...state.archivosAdjuntos];
			} else {
				state.archivosAdjuntos = [...state.archivosAdjuntos, adjunto];
			}
		},
		generateAutorizacionRolSuccess(state, action) {
			const adjunto = action.payload;

			let indexUpdate = state.archivosAdjuntos.findIndex((item) => item.idAdjunto == adjunto.id);

			if (indexUpdate != -1) {
				state.archivosAdjuntos[indexUpdate] = adjunto;
				state.archivosAdjuntos = [...state.archivosAdjuntos];
			} else {
				state.archivosAdjuntos = [...state.archivosAdjuntos, adjunto];
			}
		},
		getOportunidadPrima(state, action) {
			state.loadingPrima = true;
			state.errorPrima = '';
		},
		getOportunidadPrimaSuccess(state, action) {
			const prima = action.payload;
			state.Oportunidad = { ...state.Oportunidad, aporte: { ...state.Oportunidad.aporte, monto_prima: prima } };
			state.loadingPrima = false;
		},
		getOportunidadPrimaError(state, action) {
			const mensaje = action.payload;
			state.errorPrima = mensaje;
			state.loadingPrima = false;
		},
		getBeneficiosAdicionales(state, action) {
			state.loadingBeneficiosAdicionales = true;
			state.errorBeneficiosAdicionales = '';
		},
		getBeneficiosAdicionalesSuccess(state, action) {
			const beneficiosAdicionales = action.payload;

			const {
				estado_aplicacion_soluciona,
				monto_soluciona,
				mensaje_soluciona,
				estado_aplicacion_itp,
				monto_itp,
				mensaje_itp,
				estado_aplicacion_aee,
				monto_aee,
				mensaje_aee,
				mensaje
			} = beneficiosAdicionales;

			// "estad/o_aplicacion_soluciona": 1,
			// "monto_soluciona": 2.99,
			// "mensaje_soluciona": "null",
			// "estado_aplicacion_itp": 3,
			// "monto_itp": 0,
			// "mensaje_itp": "Edad no permitida para el Beneficio ITP \r",
			// "estado_aplicacion_aee": 3,
			// "monto_aee": 0,
			// "mensaje_aee": "Edad no permitida para el Beneficio Asistencia Exequial Extendida \r",
			// "mensaje": "Cliente fuera del rango de edad permitida 18 hasta 64 años.\r"

			// let asistenciaExequialExtendida = monto_itp;
			// let soluciona = monto_soluciona;
			// let seguroItp = monto_aee;

			//

			let mensajes = {};

			if (estado_aplicacion_soluciona == 3 || estado_aplicacion_soluciona == 0) {
				mensajes = { ...mensajes, mensajeSoluciona: mensaje_soluciona };
			} else {
				mensajes = { ...mensajes, mensajeSoluciona: null };
			}

			if (estado_aplicacion_itp == 3 || estado_aplicacion_itp == 0) {
				mensajes = { ...mensajes, mensajeItp: mensaje_itp };
			} else {
				mensajes = { ...mensajes, mensajeItp: null };
			}

			if (estado_aplicacion_aee == 3 || estado_aplicacion_aee == 0) {
				mensajes = { ...mensajes, mensajeAee: mensaje_aee };
			} else {
				mensajes = { ...mensajes, mensajeAee: null };
			}

			let checkedSoluciona = (() => {
				if (estado_aplicacion_soluciona == 1 || estado_aplicacion_soluciona == 2) return true;
				else return false;
			})();

			let checkedItp = (() => {
				if (estado_aplicacion_itp == 1 || estado_aplicacion_itp == 2) return true;
				else return false;
			})();

			let checkedAee = (() => {
				if (estado_aplicacion_aee == 1 || estado_aplicacion_aee == 2) return true;
				else return false;
			})();

			state.Oportunidad = {
				...state.Oportunidad,
				aporte: {
					...state.Oportunidad.aporte,
					monto_soluciona,
					monto_itp,
					monto_aee,
					estado_aplicacion_soluciona,
					checkedSoluciona,
					estado_aplicacion_itp,
					checkedItp,
					estado_aplicacion_aee,
					checkedAee
				}
			};
			state.mensajesBeneficiosAdicionales = mensajes;
			state.errorBeneficiosAdicionales = mensaje;
			state.loadingBeneficiosAdicionales = false;
		},
		getBeneficiosAdicionalesError(state, action) {
			const mensaje = action.payload;
			state.errorBeneficiosAdicionales = mensaje;
			state.loadingBeneficiosAdicionales = false;
		},
		validateDuplicate(state, action) {
			const data = action.payload;
			state.DocumentoDuplicado = data.success;
		},
		setFondoSelected(state, action) {
			const idFondo = action.payload;
			state.fondoSeleccionado = idFondo;
		},
		resetCosultarData(state, action) {
			state.ConsultarData = { ..._ConsultarData };
		},
		getClienteById(state, action) {
			state.loadingCliente = true;
		},
		getClienteByIdSuccess(state, action) {
			const cliente = action.payload;

			let clienteCasted = _castConsultarData(cliente);

			state.ConsultarData = { ...clienteCasted };

			state.Wait = cliente.id ? false : true;
			state.Alert = cliente.id ? false : true;
			state.DeleteAporte = 0;
			state.StoreAporte = 0;
			state.errorMessage = '';
			state.loadingCliente = false;
		},
		getClienteByIdError(state, action) {
			state.loadingCliente = false;
		},
		postAportesClientesStore(state, action) {
			state.loadingOportunidadForm = true;
		},
		postAportesClientesStoreSuccess(state, action) {
			state.loadingOportunidadForm = false;
		},
		postAportesClientesStoreError(state, action) {
			state.loadingOportunidadForm = false;
		},
		getFondoAporteUpdate(state, action) {
			state.UpdateAporte = action.payload;
			state.loadingOportunidadForm = true;
			state.DeleteAporte = 0;
			state.StoreAporte = 0;
			state.Error = 0;
		},
		getFondoAporteUpdateSuccess(state, action) {
			state.loadingOportunidadForm = false;
		},
		getFondoAporteUpdateError(state, action) {
			state.loadingOportunidadForm = false;
		},
		postClientesCrear(state, action) {
			state.loadingClienteStepForm = true;
		},
		postClientesCrearSuccess(state, action) {
			state.loadingClienteStepForm = false;
		},
		postClientesCrearError(state, action) {
			state.loadingClienteStepForm = false;
		},
		postClientesEditar(state, action) {
			state.loadingClienteStepForm = true;
		},
		postClientesEditarSuccess(state, action) {
			state.loadingClienteStepForm = false;
		},
		postClientesEditarError(state, action) {
			state.loadingClienteStepForm = false;
		},
		cleanAdjuntosInfo(state, action) {
			state.documentosAdjuntos = [];
			state.adjuntosCheckList = [];
			state.archivosAdjuntos = [];
		},
		setDatosClient(state, action) {
			state.datosClienteSelected = action.payload;
		},
		setErrorDatosClient(state, action) {
			state.errorDatosClienteSelected = action.payload;
		}
	}
});

export const reducer = slice.reducer;

export const loadData = (load) => async (dispatch) => {
	dispatch(slice.actions.loadData(load));
};

export const postClientesConsultar = (cedula) => async (dispatch) => {
	try {
		const response = await axs.post(baseurl + '/afp/cliente/consultar', { numero_identificacion: cedula });
		dispatch(slice.actions.getClientesSearch(response.data));
	} catch (error) {
		console.log(error);
	}
};

export const getListarOportunidades = () => async (dispatch) => {
	dispatch(slice.actions.getOportunidades({ data: [], loading: true, error: false }));
	try {
		const response = await axs.get(baseurl + `/afp/crm/oportunidades`);
		dispatch(slice.actions.getOportunidades({ data: response.data.data, loading: false, error: false }));
		dispatch(slice.actions.createOportunity(false));
	} catch (error) {
		dispatch(slice.actions.getOportunidades({ data: [], loading: false, error: error }));

		console.log(error);
	}
};

export const postClientesEditar = (data, step, cedulaCli, onSuccess, onError) => async (dispatch) => {
	// dispatch(slice.actions.postClientesEditar());
	const response = await axs.post(baseurl + '/afp/cliente/editar', { data, step, cedulaCli });
	if (response) {
		if (response.data && response.data.id) {
			onSuccess && onSuccess(response.data.id);
			dispatch(slice.actions.getClientesSearch(response.data));
			dispatch(slice.actions.postClientesEditarSuccess());
		} else {
			onError && onError(response);
			// dispatch(slice.actions.getMessageError(response.data));
			// dispatch(slice.actions.postClientesEditarError());
		}
	} else {
		onError && onError(response);
		// dispatch(slice.actions.getMessageError({ message: 'Error con el servidor' }));
		// dispatch(slice.actions.postClientesEditarError());
	}
};

export const postClientesCrear = (data, step, cedulaCli, onSuccess, onError) => async (dispatch) => {
	// dispatch(slice.actions.postClientesCrear());

	const response = await axs.post(baseurl + '/afp/cliente/crear', { data, step, cedulaCli });

	if (response) {
		if (response.data && response.data.id) {
			onSuccess && onSuccess(response.data.id);
			dispatch(slice.actions.getClientesSearch(response.data));
			dispatch(slice.actions.getClienteByIdSuccess(response.data));
			// dispatch(slice.actions.createOportunity(true));
			dispatch(slice.actions.postClientesCrearSuccess());

			if (response.data.empresa) {
				dispatch(setEmpresa(response.data.empresa));
			}
		} else {
			onError && onError(response);
			// dispatch(slice.actions.getMessageError(response.data));
			// dispatch(slice.actions.postClientesCrearError());
		}
	} else {
		onError && onError();
		// dispatch(slice.actions.getMessageError({ message: 'Error con el servidor' }));
		// dispatch(slice.actions.postClientesCrearError());
	}
};

export const getClientesSearch = (cedula) => async (dispatch) => {
	dispatch(loadData(true));
	try {
		const response = await axs.post(baseurl + '/afp/crm/oportunidad/ver', { numero_identificacion: cedula });
		if (response.data || response.data !== 500) {
			dispatch(slice.actions.getClientesSearch(response.data));
			dispatch(slice.actions.ComunicacionAfpCore(response.data.success));
			dispatch(loadData(false));
		} else {
			dispatch(slice.actions.getAlertSearchEmpty());
			dispatch(slice.actions.ComunicacionAfpCore(response.data.success));
			dispatch(loadData(false));
		}
	} catch (error) {
		console.log(error);
		dispatch(loadData(false));
	}
};

export const getDeleteInformationWithRefuse = () => async (dispatch) => {
	dispatch(slice.actions.getDeleteInformationWithRefuse());
};

export const getAlertSearchEmpty = () => async (dispatch) => {
	dispatch(slice.actions.getAlertSearchEmpty(false));
};

export const postAportesClientesStore = (body, onSuccess) => async (dispatch) => {

	console.log('postAportesClientesStore')
	dispatch(slice.actions.postAportesClientesStore());
	axs({
		method: 'post',
		url: baseurl + '/afp/crm/oportunidad/crear',
		data: body
	})
		.then(function (response) {


			let { success, data } = response.data;

			if (success) {
				dispatch(slice.actions.postAportesClientesStoreSuccess());
				dispatch(slice.actions.getAlertStoreAporteSuccess(data));
				dispatch(slice.actions.getOportunidad(data));
				dispatch(slice.actions.createOportunity(false));
				onSuccess && onSuccess(data.id);
			} else {
				dispatch(slice.actions.postAportesClientesStoreError());
			}
		})
		.catch(function (error) {

			console.log(error);
			dispatch(slice.actions.getAlertIfNotStore(error));
			dispatch(slice.actions.postAportesClientesStoreError());
		});
};

export const getFondoAporteList = (cedula, fondoSeleccionado) => async (dispatch) => {
	try {
		dispatch(slice.actions.setTipoFondo(fondoSeleccionado));

		const response = await axs.post(baseurl + '/afp/crm/oportunidad/ver/aportes', {
			numero_identificacion: cedula,
			tipo_fondo: fondoSeleccionado.codigo
		});

		dispatch(slice.actions.getFondoAporteList([response.data, fondoSeleccionado]));
		dispatch(slice.actions.loadData(false));
		dispatch(slice.actions.createOportunity(true));
	} catch (error) {
		console.log(error);
	}
};

export const postEnviarDocumentos = (body, onSuccess) => async (dispatch) => {
	try {
		dispatch(slice.actions.postEnviarDocumentos());

		const response = await axs.post(baseurl + '/afp/crm/adjunto', { body });

		let { success, data } = response.data;

		if (success) {
			// dispatch(slice.actions.getEnviarDocumentos(response.data));
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			onSuccess && onSuccess();
		}
	} catch (error) {
		dispatch(slice.actions.postEnviarDocumentosError(error));
		console.log(error);
	}
};

export const postEnviarDocumentos2 = (body, onSuccess) => async (dispatch) => {
	const { _postEnviarDocumentosFetch, _postEnviarDocumentosSuccess, _postEnviarDocumentosError } = slice.actions;
	try {
		dispatch(_postEnviarDocumentosFetch());
		const response = await axs.post(baseurl + '/afp/crm/adjunto', { body });

		const { data } = response;

		if (data.success) {
			dispatch(_postEnviarDocumentosSuccess(data.data));
			return;
		}
		throw data.mensaje;
	} catch (error) {
		const payload = error;

		dispatch(_postEnviarDocumentosError(error));
	}
};

export const getFondoAporteDelete = (id_cliente, identificacion) => async (dispatch) => {
	try {
		const response = await axs.post(baseurl + '/afp/crm/oportunidad/borrar/aportes', { id_cliente: id_cliente });
		if (response.data == 1) {
			dispatch(slice.actions.getFondoAporteDelete(response.data));
			dispatch(getFondoAporteList(identificacion));
		} else {
			return 500;
		}
	} catch (error) { }
};

export const getFondoAporteEdit = (id_fondo) => async (dispatch) => {
	try {
		// dispatch(slice.actions.setOportunidad({}));
		dispatch(slice.actions.setLoadingOportunidad(true));

		const response = await axs.get(baseurl + `/afp/crm/oportunidades/${id_fondo}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(getClientesSearch(data.cod_ced_cliente));
			dispatch(slice.actions.getOportunidad(data));
			dispatch(slice.actions.createOportunity(false));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingOportunidad(false));
		console.log(error);
	}
};

export const getFondoAporteUpdate = (body, onSuccess) => async (dispatch) => {
	let change = { check: false };

	dispatch(slice.actions.getFondoAporteUpdate());

	axs({
		method: 'post',
		url: baseurl + '/afp/crm/oportunidad/actualizar/aportes',
		data: body
	})
		.then(function (response) {
			// dispatch(slice.actions.getFondoAporteUpdate(response.data));
			// dispatch(slice.actions.getOportunidad(response.data.data));
			// redirectCb();




			let { success, data } = response.data;

			if (success) {
				dispatch(slice.actions.getFondoAporteUpdate(data.aporte));
				dispatch(slice.actions.getOportunidad(data));
				onSuccess && onSuccess(data.id);
				dispatch(slice.actions.getFondoAporteUpdateSuccess());
			} else {
				dispatch(slice.actions.getFondoAporteUpdateError());
			}

			// dispatch(getFondoAporteList(body.numero_identificacion));
		})
		.catch(function (error) {


			console.log(error);
			dispatch(slice.actions.getAlertIfNotStore(change));
			dispatch(slice.actions.getFondoAporteUpdateError());
		});
};

export const getQueryDataAll = (cedula) => async (dispatch) => {
	try {
		const response = await axs.post(baseurl + '/afp/crm/oportunidad/ver', { numero_identificacion: cedula });

		dispatch(slice.actions.getQueryDataAll(response.data));
	} catch (error) {
		console.log(error);
	}
};

export const envioCedParaSteps = (cedula) => async (dispatch) => {
	dispatch(slice.actions.envioCedParaSteps(cedula));
};

export const envioAllParaSteps = (data) => async (dispatch) => {
	dispatch(slice.actions.envioAllParaSteps(data));
};

export const lastFondoAporteOfClient = (cedula) => async (dispatch) => {
	try {
		//ruta desarrollo
		//const response = await axs.post('http://afp_web_laravel.test/api/afp/crm/oportunidad/ver/aportereciente',{"numero_identificacion" : cedula});
		//ruta servidor
		const response = await axs.post(baseurl + '/afp/crm/oportunidad/aporte/ver/aportereciente', {
			numero_identificacion: cedula
		});
		if (response.data === 500) {
			//por ahora no hacer nada
		} else {
			dispatch(slice.actions.lastFondoAporteOfClient(response.data));
		}
	} catch (error) {
		console.log(error);
	}
};

export const setCreateEditarCortoPlazo = (data) => async (dispatch) => {
	dispatch(slice.actions.setCreateEditarCortoPlazo(data));
};

export const getSearchClient = (cedula) => async (dispatch) => {
	try {
		const response = await axs.get(baseurl + `/afp/cliente/cedula/${cedula}`);
		dispatch(slice.actions.getSearchClientCreate(response.data));
	} catch (error) {
		console.log(error);
	}
};

export const getSearchClientLocal = (cedula) => async (dispatch) => {
	try {
		const response = await axs.get(baseurl + `/afp/cliente/cedula/local/${cedula}`);

		dispatch(slice.actions.validateDuplicate(response.data));
	} catch (error) {
		console.log(error);
	}
};

export const getObtenerDocumentosFondo = (fondo) => async (dispatch) => {
	try {
		const response = await axs.get(baseurl + `/afp/documentos/fondo/${fondo}`);
		dispatch(slice.actions.getDocuementosFondo(response.data));
	} catch (error) {
		console.log(error);
	}
};

export const getObtenerDocumentosOportunidad = (idOportunidad) => async (dispatch) => {
	dispatch(slice.actions.getDocumentosOportunidadLoading());
	try {
		const response = await axs.get(baseurl + `/afp/crm/oportunidades-adjuntos/${idOportunidad}`);
		dispatch(slice.actions.getDocumentosOportunidad(response.data));
	} catch (error) {
		console.log(error);
	}
};

export const setCreateOportunity = (value) => async (dispatch) => {
	dispatch(slice.actions.createOportunity(value));
};

export const setOportunidad = (oportunidad) => async (dispatch) => {
	dispatch(slice.actions.setOportunidad(oportunidad));
};

export const setRegularizarEmpresaOportunidad = (estado) => async (dispatch) => {
	dispatch(slice.actions.setRegularizarEmpresaOportunidad(estado));
};

export const generateContratoHorizonte = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/horizonte/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};

export const generateContratoMaster = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/master/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};

export const generateContratoRentaPlus = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/rentaplus/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};

export const generateContratoEstrategico = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/estrategico/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};

export const generateContratoSuperior = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/superior/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};

export const generateAutorizacionBancaria = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/autorizacion-debito/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};

export const generateConsentimientoProteccionDatos = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/consentimiento-proteccion-datos/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.postEnviarDocumentosSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};


export const generateAutorizacionRol = (idOportunidad, onSuccess, indexGenerating) => async (dispatch) => {
	try {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: true }));

		const response = await axs.get(baseurl + `/afp/pdf/autorizacion-rol/${idOportunidad}`);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.generateAutorizacionRolSuccess(data));
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		}
	} catch (error) {
		dispatch(slice.actions.setLoadingGenerate({ indexGenerating, loadingValue: false }));
		console.log(error);
	}
};

export const getOportunidadPrima = async (params, onSuccess, onError) => {
	let mensajeError;

	try {
		// dispatch(slice.actions.getOportunidadPrima());

		const response = await axs.post(baseurl + '/AfpGenesis/Prima', params);

		let { success, prima, mensaje } = response.data;

		mensajeError = mensaje;

		if (success) {
			// dispatch(slice.actions.getOportunidadPrimaSuccess(prima));
			// onSuccess && onSuccess(prima);
			return prima;
		} else {
			// dispatch(slice.actions.getOportunidadPrimaError(mensajeError));
			// onError();
			return false;
		}
	} catch (error) {
		// dispatch(slice.actions.getOportunidadPrimaError('Ocurrió un error consultando el valor'));
		// onError();
		console.log(error);
		return false;
	}
};

export const getOportunidadBeneficiosAdicionales = (params, onSuccess) => async (dispatch) => {
	let mensajeError;

	try {
		dispatch(slice.actions.getBeneficiosAdicionales());

		const response = await axs.post(baseurl + '/AfpGenesis/BeneficiosAdicionales', params);

		let { success, beneficiosAdicionales, mensaje } = response.data;

		mensajeError = mensaje;

		if (success) {
			dispatch(slice.actions.getBeneficiosAdicionalesSuccess(beneficiosAdicionales));
			onSuccess && onSuccess();
		} else {
			dispatch(slice.actions.getBeneficiosAdicionalesError(mensajeError));
		}
	} catch (error) {
		dispatch(slice.actions.getBeneficiosAdicionalesError('Ocurrió un error consultando los valores'));
		console.log(error);
	}
};

export const setFondoSelected = (idFondo) => (dispatch) => {
	dispatch(slice.actions.setFondoSelected(idFondo));
};

export const resetCosultarData = () => (dispatch) => {
	dispatch(slice.actions.resetCosultarData());
};

export const getClienteById = (id, onSuccess) => async (dispatch) => {
	try {
		dispatch(slice.actions.getClienteById());

		const response = await axs.get(baseurl + '/afp/cliente/id/' + id);

		let { success, cliente, mensaje } = response.data;

		if (success) {
			dispatch(slice.actions.getClienteByIdSuccess(cliente));
			onSuccess && onSuccess(cliente);
		} else {
			dispatch(slice.actions.getClienteByIdError());
		}
	} catch (error) {
		console.log(error);
		dispatch(slice.actions.getClienteByIdError());
	}
};

export const cleanAdjuntosInfo = () => async (dispatch) => {
	dispatch(slice.actions.cleanAdjuntosInfo());
};

export const setArchivosAdjuntosChecklist = (data) => async (dispatch) => {
	dispatch(slice.actions.getDocumentosOportunidad(data));
};

export const updateEmpresaOportunidad = (empresaOportuindad, onSuccess, onError) => async (dispatch) => {
	// dispatch(slice.actions.updateEmpresaOportunidad());

	try {
		const response = await axs.post(baseurl + '/afp/crm/oportunidad/empresa', empresaOportuindad);

		let { success, data } = response.data;

		if (success) {
			dispatch(slice.actions.getFondoAporteUpdate(data.aporte));
			dispatch(slice.actions.getOportunidad(data));
			onSuccess && onSuccess(data.id);
			dispatch(slice.actions.getFondoAporteUpdateSuccess());
		} else {
			onError && onError();
			dispatch(slice.actions.getFondoAporteUpdateError());
		}
	} catch (e) {
		console.log(e);
		onError && onError();
		// dispatch(slice.actions.getAlertIfNotStore(change));
		// dispatch(slice.actions.getFondoAporteUpdateError());
	}
};


export const getDatosCliente = (cedula) => async (dispatch) => {
	try {

		const response = await axs.get(baseurl + `/afp/cliente/datos/${cedula}`);

		let { success, cliente } = response.data;
		console.log(response.data)
		if (success) {
			dispatch(slice.actions.setDatosClient(cliente));
		} else {
			dispatch(slice.actions.setErrorDatosClient(response.data.message));
		}
	} catch (error) {
		console.log(error);
		dispatch(slice.actions.getDatosClienteError());
	}
}


export const validateDataPerson = (genesisData, ownData, state) => async (dispatch) => {
	console.log('genesis: ', genesisData)
	console.log('own: ', ownData)


	if ((new Date(genesisData.fecha_nacimiento)).toLocaleDateString() != (new Date(ownData.fecha_nacimiento_cliente)).toLocaleDateString()) {
		state(false)
	}
}


export const updateDataClient = (genesisData, state) => async (dispatch) => {
	console.log('genesis: ', genesisData)

	try {

		const response = await axs.put(baseurl + `/afp/cliente/update`, genesisData);

		let { success, cliente } = response.data;

		console.log(response.data)
		if (success) {
			dispatch(getClientesSearch(cliente.codigo_cliente, state))
			state(true)
		} else {
			alert('Ha ocurrido un error, intente nuevamente.')
			state(false)
		}

	} catch (error) {
		console.log(error);
		alert('Ocurrió un error actualizando los datos del cliente')
	}
}

export default slice;

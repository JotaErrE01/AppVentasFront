import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Formik, validateYupSchema, FieldArray, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'src/store';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import _ from 'lodash';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Typography,
	Divider,
	makeStyles,
	Grid,
	TextField,
	LinearProgress,
	FormControl,
	ListItem,
	ListItemIcon,
	FormControlLabel,
	Checkbox,
	ListItemText,
	Radio,
	RadioGroup,
	FormHelperText
} from '@material-ui/core';

import usesStyles from '../../../afp_cliente/ClienteCreateAndEditarView/usesStyles';

import {
	getFondoAporteUpdate,
	getOportunidadBeneficiosAdicionales,
	getOportunidadPrima,
	postAportesClientesStore,
	setOportunidad
} from 'src/slices/clientes';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import renderTextField from 'src/components/FormElements/InputText';
import renderSelectField from 'src/components/FormElements/InputSelect';

import * as dayjs from 'dayjs';
import { Fragment } from 'react';
import ValoresOportunity from './ValoresOportunity';
import CuentaInfoOportunity from './CuentaInfoOportunity';
import { postOportunidadTieneEstado } from 'src/slices/oportunidad';
import DisabledHoc from 'src/components/common/DisabledHoc';
import JSONTree from 'react-json-tree';
import InputRadio from 'src/components/FormElements/InputRadio';

const defaultState = {
	nombresSeguroVida: '',
	apellidosSeguroVida: '',
	emailSeguroVida: '',
	parentescoSeguroVida: ''
};

let origenes = [
	{
		codigo: 'C',
		contenido: 'Capital de Trabajo'
	},

	{
		codigo: 'A',
		contenido: 'Ahorros'
	},

	{
		codigo: 'R',
		contenido: 'Remuneración (Con relación de Dependencia)'
	},

	{
		codigo: 'E',
		contenido: 'Enviado por familiares'
	},
	{
		codigo: 'M',
		contenido: 'Actividad Mercantil'
	}
];

let mesesOptions = [
	{ codigo: 1, contenido: 'ENERO' },
	{ codigo: 2, contenido: 'FEBRERO' },
	{ codigo: 3, contenido: 'MARZO' },
	{ codigo: 4, contenido: 'ABRIL' },
	{ codigo: 5, contenido: 'MAYO' },
	{ codigo: 6, contenido: 'JUNIO' },
	{ codigo: 7, contenido: 'JULIO' },
	{ codigo: 8, contenido: 'AGOSTO' },
	{ codigo: 9, contenido: 'SEPTIEMBRE' },
	{ codigo: 10, contenido: 'OCTUBRE' },
	{ codigo: 11, contenido: 'NOVIEMBRE' },
	{ codigo: 12, contenido: 'DICIEMBRE' }
];

let aniosOptions = [];
let date = dayjs();
let anioActual = +date.format('YYYY');
aniosOptions.push({ codigo: anioActual, contenido: anioActual });
aniosOptions.push({ codigo: anioActual + 1, contenido: anioActual + 1 });

const FormRegisterOportunity = ({ setPage, formDisabled }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();

	const classes = usesStyles();

	const [ cantNs, setCantNs ] = useState(0);
	const [ esCuentaTerceros, setEsCuentaTerceros ] = useState(false);
	const [ codSistemaAporte, setCodigoSistemaAporte ] = useState();
	const [ loadingPrima, setLoadingPrima ] = useState();
	const { enqueueSnackbar } = useSnackbar();
	// const { cliente } = useSelector((state) => state.cliente.FondoAporteEditar);
	const {
		Oportunidad: oportunidad,
		// loadingPrima,
		mensajesBeneficiosAdicionales,
		loadingBeneficiosAdicionales,
		ConsultarData: cliente,
		loadingOportunidad
	} = useSelector((state) => state.cliente);


	const {
		prospecto
	} = useSelector((state) => state.prospecto);

	let { idCliente, idSistema, idOportunidad } = useParams();

	useEffect(
		() => {
			if (history.location.pathname.includes('editar') && oportunidad && oportunidad.beneficiarios_seguro_vida) {
				setCantNs(oportunidad.beneficiarios_seguro_vida.length);
			}

			if (nameRoute.includes('crear') && cliente && cliente.numero_identificacion) {
				getBeneficiosAdicionales();
			}

			// SI ES ES CUENTA DE TERECEROS
			if (idSistema) {
				if (idSistema.indexOf('T') != -1) {
					setEsCuentaTerceros(true);
					setCodigoSistemaAporte(idSistema.replace('T', ''));
				} else {
					setCodigoSistemaAporte(idSistema);
				}
			} else if (oportunidad) {
				setCodigoSistemaAporte(oportunidad.aporte.codigo_sistema_aporte_id);
				setEsCuentaTerceros(oportunidad.tipo_cuenta);
			}
		},
		[
			dispatch,
			cliente,
			cliente.numero_identificacion
			// oportunidad
		]
	);

	const _catAeHorizonte = useSelector((state) => state.catalogo.aeHorizonte);
	const intencionLoadId = useSelector((state) => state.intencion.intencionLoadId);


	const identification = useSelector((state) => state.cliente.ConsultarData.numero_identificacion);

	let { parentescos = [], parentescosAEE, bancos, valorUnidad, tipoTitulares } = useSelector(
		(state) => state.catalogo
	);

	const nameRoute = history.location.pathname;

	const getBeneficiosAdicionales = () => {
		let identificacion = cliente.numero_identificacion;
		let fechaNacimiento = cliente.fecha_nacimiento_cliente;
		
		let find = '-';
		let regex = new RegExp(find, 'g');
		
		fechaNacimiento = fechaNacimiento.substring(0, 10).replace(regex, '/');
		
		let params = {
			codigoFondo: '000001',
			identificacion,
			fechaNacimiento
		};

		dispatch(getOportunidadBeneficiosAdicionales(params));
	};

	const handleOnAdd = (push) => {
		if (cantNs < 4) {
			push(defaultState);
			setCantNs(cantNs + 1);
		} else {
			enqueueSnackbar('No puede agregar más de 4 beneficiarios', {
				variant: 'error'
			});
		}
	};

	const handleOnRemove = (remove, index) => {
		if (cantNs >= 1) {
			remove(index);
			setCantNs(cantNs - 1);
		} else {
			enqueueSnackbar('Debe de existir al menos un beneficiario', {
				variant: 'error'
			});
		}
	};

	const handleStatus = (idOportunidad) => {
		const registro = {
			contenido: '-',
			excepcion: '-',
			oportunidad_estado_id: 8,
			oportunidad_id: idOportunidad
		};
		dispatch(
			postOportunidadTieneEstado(registro, enqueueSnackbar, () =>
				history.push('/afp/crm/oportunidad/mantenimientoOportunidad/' + idOportunidad)
			)
		);
	};

	const sendValues = (values, onSuccess) => {
		let seguroVidaValues = [];
		if (values.monto_prima > 0) {
			seguroVidaValues = values.seguroVidaValues;
		}

		// let inicio_debito;

		// if (codSistemaAporte == 1 || codSistemaAporte == 4) {
		// 	let mes = values.mes_inicio.length == 1 ? '0' + values.mes_inicio : values.mes_inicio;
		// 	inicio_debito = values.anio_inicio + '-' + mes + '-01';
		// }
		//TODO: AQUI SE AGREGA INFO DE PROSPECTO, PAYLOAD CLAVE PARA CREAR OPORTUNIDAD
		var body = {
			...values,
			id_cliente: idCliente,
			idAporteCliente: oportunidad && oportunidad.aporte && oportunidad.aporte.id,
			numero_identificacion: identification,
			monto_aporte: values.monto_aporte,
			monto_prima: values.monto_prima,
			monto_aee: values.monto_aee,
			monto_soluciona: values.monto_soluciona,
			monto_itp: values.monto_itp,
			otrosBeneficios: values.otrosBeneficios,
			seguroVidaValues,
			nombresExequial: values.nombresExequial,
			apellidosExequial: values.apellidosExequial,
			parentescoExequial: values.parentescoExequial,
			emailExequial: values.emailExequial,
			cod_fondo_largo_plazo: '000001',
			fondo_id: '000001',
			cod_sistema_aportes_catalogos: codSistemaAporte,
			es_cuenta_tercero: esCuentaTerceros ? 1 : 0,
			// inicio_debito: inicio_debito
			//intencion_id:intencionLoadId || null
			prospecto_id: prospecto.id
		};

		

		dispatch(
			nameRoute.includes('crear')
				? postAportesClientesStore(body, onSuccess)
				: getFondoAporteUpdate(body, onSuccess)
		);
		


	};

	let nombreCliente = (() => {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = cliente;
		let nombre = primer_nombre;

		if (segundo_nombre) {
			nombre += ' ' + segundo_nombre;
		}

		if (primer_apellido) {
			nombre += ' ' + primer_apellido;
		}

		if (segundo_apellido) {
			nombre += ' ' + segundo_apellido;
		}

		return nombre;
	})();

	let indentificacion = (() => {
		if (esCuentaTerceros) return '';
		else return cliente && cliente.numero_identificacion;
	})();

	let opcionesFechasDescuento = (() => {
		let opciones = [];
		if (oportunidad.inicio_debito) {
			let date = dayjs(oportunidad.inicio_debito.substring(0, 10));
			opciones.push({
				contenido: 'Fecha registrada ' + date.format('DD/MM/YYYY'),
				codigo: date.format('YYYY-MM-DD')
			});
		}

		opciones.push({
			contenido: 'Fecha actual ' + dayjs().format('DD/MM/YYYY'),
			codigo: dayjs().format('YYYY-MM-DD')
		});

		let proximo = dayjs().add(1, 'month').startOf('month');

		opciones.push({
			contenido: 'Próximo mes ' + proximo.format('DD/MM/YYYY'),
			codigo: proximo.format('YYYY-MM-DD')
		});

		return opciones;
	})();

	let inicio_debito = (() => {
		if (oportunidad.inicio_debito) {
			let date = dayjs(oportunidad.inicio_debito.substring(0, 10));
			return date.format('YYYY-MM-DD');
		}

		return opcionesFechasDescuento[0].codigo;
	})();

	let tipo_titular = (() => {
		if (typeof oportunidad.es_participe == 'undefined') {
			return '01';
		}

		return oportunidad.es_participe ? '01' : '02';
	})();

	const initialValuesCreate = {
		monto_aporte:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_aporte !== undefined
				? oportunidad.aporte.monto_aporte
				: '',
		monto_prima:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_prima !== undefined
				? oportunidad.aporte.monto_prima
				: '',
		monto_aee:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_aee !== undefined
				? oportunidad.aporte.monto_aee
				: '',
		monto_soluciona:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_soluciona !== undefined
				? oportunidad.aporte.monto_soluciona
				: '',
		monto_itp:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_itp !== undefined
				? oportunidad.aporte.monto_itp
				: '',
		otrosBeneficios: '',
		nombresExequial: '',
		apellidosExequial: '',
		parentescoExequial: '',
		emailExequial: '',
		seguroVidaValues: [ defaultState ],
		nombre_cuenta: nombreCliente,
		identificacion_cuenta: indentificacion,
		numero_cuenta: '',
		entidad_bancaria: '',
		actividad_economica: null,
		// es_participe: 1,
		acepta_arbitraje_comercial: 1,
		tipo_titular: tipo_titular,
		aplica_seguro_global: 1,
		submit: null,

		origen_fondos: '',
		valor_unidad: valorUnidad && valorUnidad.contenido,
		otros_origenes: '',
		inicio_debito: inicio_debito,
		mes_inicio: '',
		anio_inicio: '',
		checkedSoluciona: oportunidad && oportunidad.aporte && oportunidad.aporte.checkedSoluciona,
		checkedItp: oportunidad && oportunidad.aporte && oportunidad.aporte.checkedItp,
		checkedAee: oportunidad && oportunidad.aporte && oportunidad.aporte.checkedAee,

		estado_aplicacion_soluciona:
			oportunidad && oportunidad.aporte && oportunidad.aporte.estado_aplicacion_soluciona,
		estado_aplicacion_itp: oportunidad && oportunidad.aporte && oportunidad.aporte.estado_aplicacion_itp,
		estado_aplicacion_aee: oportunidad && oportunidad.aporte && oportunidad.aporte.estado_aplicacion_aee
	};

	const beneficiarios = [];

	if (oportunidad && oportunidad.beneficiarios_seguro_vida) {
		oportunidad.beneficiarios_seguro_vida.forEach((item) => {
			var beneficiarioSeguroVida = {
				nombresSeguroVida: item.nombre,
				apellidosSeguroVida: item.apellido,
				emailSeguroVida: item.email,
				parentescoSeguroVida: item.parentesco_id,
				id: item.id,
				telefonoSeguroVida: item.telefono
			};
			beneficiarios.push(beneficiarioSeguroVida);
		});
	}

	const initialValuesEdit = {
		monto_aporte: oportunidad && oportunidad.aporte !== undefined ? oportunidad.aporte.monto_aporte : '0',
		monto_prima:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_prima !== undefined
				? oportunidad.aporte.monto_prima
				: '',
		monto_aee:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_aee !== undefined
				? oportunidad.aporte.monto_aee
				: '',
		monto_soluciona:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_soluciona !== undefined
				? oportunidad.aporte.monto_soluciona
				: '',
		monto_itp:
			oportunidad && oportunidad.aporte && oportunidad.aporte.monto_itp ? oportunidad.aporte.monto_itp : '',

		nombresExequial:
			oportunidad && oportunidad.beneficiario_adicional ? oportunidad.beneficiario_adicional.nombre : '',
		apellidosExequial:
			oportunidad && oportunidad.beneficiario_adicional ? oportunidad.beneficiario_adicional.apellido : '',
		parentescoExequial:
			oportunidad && oportunidad.beneficiario_adicional && oportunidad.beneficiario_adicional.parentesco_id,
		emailExequial:
			oportunidad && oportunidad.beneficiario_adicional ? oportunidad.beneficiario_adicional.email : '',
		seguroVidaValues: oportunidad ? beneficiarios : [],
		nombre_cuenta: oportunidad && oportunidad.nombre_cuenta,
		numero_cuenta: oportunidad && oportunidad.numero_cuenta,
		identificacion_cuenta: oportunidad && oportunidad.identificacion_cuenta,
		actividad_economica: oportunidad.actividad_economica,
		entidad_bancaria: oportunidad && oportunidad.entidad_bancaria,
		tipo_cuenta: oportunidad && oportunidad.tipo_cuenta,
		// es_participe: oportunidad && oportunidad.es_participe,
		tipo_titular: tipo_titular,
		acepta_arbitraje_comercial: oportunidad && oportunidad.acepta_arbitraje_comercial,
		aplica_seguro_global: oportunidad && oportunidad.aplica_seguro_global,

		origen_fondos: oportunidad && oportunidad.origen_fondos,
		valor_unidad: oportunidad && oportunidad.valor_unidad,
		// inicio_debito: oportunidad && oportunidad.inicio_debito,
		otros_origenes: oportunidad && oportunidad.origen_fondos == 'Otros' ? oportunidad.otros_origenes : '',
		inicio_debito: inicio_debito,
		checkedSoluciona: oportunidad && oportunidad.aporte && oportunidad.aporte.checkedSoluciona,
		checkedItp: oportunidad && oportunidad.aporte && oportunidad.aporte.checkedItp,
		checkedAee: oportunidad && oportunidad.aporte && oportunidad.aporte.checkedAee,

		estado_aplicacion_soluciona:
			oportunidad && oportunidad.aporte && oportunidad.aporte.estado_aplicacion_soluciona,
		estado_aplicacion_itp: oportunidad && oportunidad.aporte && oportunidad.aporte.estado_aplicacion_itp,
		estado_aplicacion_aee: oportunidad && oportunidad.aporte && oportunidad.aporte.estado_aplicacion_aee
	};

	const validateEmailTel = (value, name, beneficiario) => {
		let error;

		if (oportunidad && oportunidad.aporte && oportunidad.aporte.monto_itp == 0) {
			return error;
		}

		if (name == 'emailSeguroVida') {
			if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
				if (!/^[0-9]+$/gm.test(beneficiario['telefonoSeguroVida'])) {
					error = 'Ingresa un correo electrónico válido';
				}
			}
		} else if (name == 'telefonoSeguroVida') {
			if (!/^[0-9]+$/gm.test(value)) {
				if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(beneficiario['emailSeguroVida'])) {
					error = 'Ingresa un teléfono válido';
				}
			}
		}

		return error;
	};

	const inputsBeneficiariosExequial = [
		{
			nombre: 'nombresExequial',
			component: renderTextField,
			label: 'Nombres'
		},
		{
			nombre: 'apellidosExequial',
			component: renderTextField,
			label: 'Apellidos'
		},
		{
			nombre: 'parentescoExequial',
			component: renderSelectField,
			label: 'Parentesco'
		},
		{
			nombre: 'emailExequial',
			component: renderTextField,
			label: 'Email'
		}
	];

	const _getOportunidadPrima = async (montoAporte) => {
		setLoadingPrima(true);

		let feNacimientoCliente = cliente.fecha_nacimiento_cliente;
		
		let find = '-';
		let regex = new RegExp(find, 'g');
		
		feNacimientoCliente = feNacimientoCliente.substring(0, 10).replace(regex, '/');

		let params = {
			codigoFondo: '000001',
			fechaSuscripcion: dayjs().format('YYYY/MM/DD'),
			fechaNacimiento: feNacimientoCliente,
			montoAporte
		};

		let response = await getOportunidadPrima(params);

		setLoadingPrima(false);

		if (response != false) return response;
		else return 0;
	};

	const onBlurAporte = async (value, setFieldValue) => {
		if (value.length > 1) {
			let valorPrima = await _getOportunidadPrima(value);

			setFieldValue('monto_prima', valorPrima);
		}
	};

	// const onChangeAporte = (value, setFieldValue) => {
	// 	dispatch(
	// 		setOportunidad({
	// 			...oportunidad,
	// 			aporte: {
	// 				...oportunidad.aporte,
	// 				monto_aporte: value
	// 			}
	// 		})
	// 	);
	// };

	let nombreValidate = Yup.string()
		.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
		.min(2, 'Debe de tener al menos 2 caracteres');

	let validacionCuentaBancaria = {};
	if (codSistemaAporte == 1 || codSistemaAporte == 4) {
		validacionCuentaBancaria = {
			entidad_bancaria: Yup.string().required('Se requiere llenar este campo'),
			digitos_cuenta: Yup.number(),
			numero_cuenta: Yup.string()
				.required('Se requiere llenar este campo')
				.when('digitos_cuenta', (digitos_cuenta, schema) => {
					return schema
						.min(digitos_cuenta, 'El dato ingresado es muy corto')
						.max(digitos_cuenta, 'El dato ingresado es muy largo');
				}),
			nombre_cuenta: nombreValidate.required('Se requiere llenar este campo'),
			identificacion_cuenta: Yup.string()
				.min(10, 'El dato ingresado es muy corto')
				.max(10, 'El dato ingresado es muy largo')
				.matches(/^[0-9]+$/gm, 'Solo se admiten números')
				.required('Se requiere llenar este campo')
		};
	}

	let validacionSeguro = {
		seguroVidaValues: Yup.array().of(
			Yup.object().shape({
				nombresSeguroVida: nombreValidate.when('monto_prima', (monto_prima, schema) => {
					if (monto_prima > 0) return schema.required('Se requiere llenar este campo');
					return schema;
				}),
				apellidosSeguroVida: nombreValidate.when('monto_prima', (monto_prima, schema) => {
					if (monto_prima > 0) return schema.required('Se requiere llenar este campo');
					return schema;
				}),
				parentescoSeguroVida: Yup.string().when('monto_prima', (monto_prima, schema) => {
					if (monto_prima > 0) return schema.required('Se debe elegir una opción');
					return schema;
				}),
				emailSeguroVida: Yup.string().email().nullable()
			})
		)
	};

	let validacionExequial = {
		nombresExequial: nombreValidate,
		apellidosExequial: nombreValidate.when(
			[ 'checkedAee', 'nombresExequial' ],
			(checkedAee, nombresExequial, schema) => {
				if (checkedAee && nombresExequial && nombresExequial.length > 0)
					return schema.required('Se requiere llenar este campo');
				return schema;
			}
		),
		parentescoExequial: Yup.string().when(
			[ 'checkedAee', 'nombresExequial' ],
			(checkedAee, nombresExequial, schema) => {
				if (checkedAee && nombresExequial && nombresExequial.length > 0)
					return schema.required('Se debe elegir una opción');
				return schema.nullable();
			}
		),
		emailExequial: Yup.string().email().nullable()
	};

	const calculateTotal = (values) => {
		let _total = 0;
		_total = (+values.monto_aporte || 0) + (+values.monto_prima || 0);

		if (values.checkedAee) {
			_total += +values.monto_aee || 0;
		}

		if (values.checkedSoluciona) {
			_total += +values.monto_soluciona || 0;
		}

		if (values.checkedItp) {
			_total += +values.monto_itp || 0;
		}

		return _total.toFixed(2);
	};

	return (
		<Formik
			initialValues={nameRoute.includes('crear') ? initialValuesCreate : initialValuesEdit}
			enableReinitialize
			validationSchema={Yup.object().shape({
				monto_aporte: Yup.string()
					.matches(/\d+(.\d+)?/, 'Solo se admiten cantidades con 2 decimales')
					.required('Se requiere llenar este campo')
					.test('validar aporte minimo', 'El aporte minimo debe ser es de $10', function(value) {
						if (+value < 10) {
							return false;
						}

						return true;
					}),
				actividad_economica: Yup.string().required('Se debe elegir una opción'),
				origen_fondos: Yup.string().required('Se requiere rellenar esta información'),
				inicio_debito: Yup.string().when('origen_fondos', (origen_fondos, schema) => {
					if (codSistemaAporte == 1 || codSistemaAporte == 4) {
						return schema.required('Se requiere llenar este campo');
					}
					return schema.nullable();
				}),
				valor_unidad: Yup.string()
					.matches(/\d+(.\d+)?/, 'Solo se admiten cantidades con 2 decimales')
					.required('Se requiere llenar este campo'),
				otros_origenes: Yup.string().when('origen_fondos', (origen_fondos, schema) => {
					if (origen_fondos == 'Otros') {
						return schema.required('Se requiere llenar este campo');
					}

					return schema.nullable();
				}),
				tipo_titular: Yup.string().required('Se debe elegir una opción'),
				//INFORMACION DE CUENTA
				...validacionCuentaBancaria,
				...validacionSeguro,
				...validacionExequial
			})}
			onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				try {
					// NOTE: Make API request
					//await wait(1000);
					setSubmitting(true);
					const onSuccess = (idOportunidad) => {
						resetForm();
						setStatus({ success: true });
						setSubmitting(false);

						// if (cliente.es_jubilado == 1) {
						// 	history.push(
						// 		'/afp/crm/oportunidad/mantenimientoOportunidad/' + (idOportunidad || oportunidad.id)
						// 	);
						// 	return;
						// }

						if (location.pathname.includes('crear')) {
							setPage(2);
							history.push('/afp/crm/oportunidad/editar/registroOportunidad/' + idOportunidad + '/2');
						} else {
							setPage(2);
							history.push('/afp/crm/oportunidad/editar/registroOportunidad/' + oportunidad.id + '/2');
						}

						// handleStatus(idOportunidad);
					};

					sendValues(values, onSuccess);
				} catch (err) {
					console.error(err);
					setStatus({ success: false });
					setErrors({ submit: err.message });
					setSubmitting(false);
				}
			}}
		>
			{({
				errors,
				handleBlur,
				handleChange,
				handleSubmit,
				isSubmitting,
				touched,
				values,
				setFieldValue,
				submitCount
			}) => {
				return (
					<form onSubmit={handleSubmit}>
						<HeaderFondo
							amountHeader={calculateTotal(values)}
							loading={loadingPrima || loadingBeneficiosAdicionales || loadingOportunidad}
						/>
						<Box m={3}>
							<ValoresOportunity
								{...{
									errors,
									handleBlur,
									handleChange,
									touched,
									values,
									onBlurAporte,
									// onChangeAporte,
									mensajesBeneficiosAdicionales,
									setFieldValue,
									aporte: oportunidad.aporte
									// calculateTotal,
									// setTotal
								}}
							/>
						</Box>

						{/* ACTIVIDAD ECONOMICA */}
						<Box m={3}>
							<Card>
								<CardHeader title="Actividad Económica" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<FormControl
											variant="outlined"
											fullWidth
											error={Boolean(errors.actividad_economica)}
										>
											<Autocomplete
												disabled={formDisabled}
												id="actividad_economica"
												name="actividad_economica"
												value={(() => {
													let filtered = _.filter(_catAeHorizonte, {
														codigo: values.actividad_economica
													});
													return filtered.length > 0 ? filtered[0] : {};
												})()}
												options={_catAeHorizonte.map((fondo) => {
													return {
														...fondo,
														contenido: fondo.codigo + ' - ' + fondo.contenido
													};
												})}
												getOptionLabel={(option) => option.contenido || ''}
												onBlur={handleBlur}
												onChange={(event, newValue) => {
													setFieldValue(
														'actividad_economica',
														newValue ? newValue.codigo : null
													);
												}}
												renderInput={(params) => (
													<Field
														component={TextField}
														{...params}
														onBlur={handleBlur}
														label="Actividad Económica"
														variant="outlined"
														error={Boolean(
															touched.actividad_economica && errors.actividad_economica
														)}
														helperText={
															touched.actividad_economica && errors.actividad_economica
														}
													/>
												)}
											/>
										</FormControl>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						{/* DECLARACIÓN DE ORIGEN DE FONDOS */}
						<Box m={3}>
							<Card>
								<CardHeader
									title="Declaración de Origen de Fondos"
									action={
										touched.origen_fondos &&
										errors.origen_fondos && (
											<FormHelperText
												error={Boolean(touched.origen_fondos && errors.origen_fondos)}
											>
												{touched.origen_fondos && errors.origen_fondos}
											</FormHelperText>
										)
									}
								/>
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item md={12} xs={12}>
											<FormControl component="fieldset">
												<RadioGroup
													row
													aria-label="origen_fondos"
													name="origen_fondos"
													value={values.origen_fondos}
													onChange={(e) => {
														if (e.target.value != 'Otros') {
															setFieldValue('otros_origenes', '');
														}
														handleChange(e);
													}}
												>
													{/* className={classes.LabelGender} */}
													{/* <FormLabel>Origen de fondos</FormLabel> */}
													{origenes.map((origen) => (
														<FormControlLabel
															value={origen.codigo}
															control={<Radio color="primary" />}
															inputProps={{ 'aria-label': origen.codigo }}
															label={origen.contenido}
														/>
													))}
													<FormControlLabel
														value={'O'}
														control={<Radio color="primary" />}
														inputProps={{ 'aria-label': 'otros' }}
														label={
															<Field
																error={Boolean(
																	touched.otros_origenes && errors.otros_origenes
																)}
																helperText={
																	touched.otros_origenes && errors.otros_origenes
																}
																onBlur={handleBlur}
																//onChange={ev => updateEmpresa(ev, setFieldValue)}
																onChange={(e) => {
																	handleChange(e);
																	if (e.target.value.trim() != '') {
																		setFieldValue('origen_fondos', 'O');
																	}
																}}
																value={values.otros_origenes}
																label="Otros"
																name="otros_origenes"
																id="otros_origenes"
																component={renderTextField}
															/>
														}
													/>
												</RadioGroup>
											</FormControl>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						<Box m={3}>
							<Card>
								<CardHeader title="Integración y rescates" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<Typography
												className={classes.SeparateText}
												variant="body1"
												color="textPrimary"
											>
												El pago de los rescates se realizará a:
											</Typography>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.tipo_titular && errors.tipo_titular)}
												fullWidth
												helperText={touched.tipo_titular && errors.tipo_titular}
												name="tipo_titular"
												id="tipo_titular"
												onBlur={handleBlur}
												onChange={(e) => {
													setFieldValue('tipo_titular', e.target.value);
													handleChange(e);
												}}
												value={values.tipo_titular || ''}
												variant="outlined"
												data={tipoTitulares}
												component={InputRadio}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						<Box m={3}>
							<Card className={classes.SeparateButtons}>
								<CardContent>
									<Fragment>
										<Grid container spacing={4}>
											<Grid item md={6} xs={12}>
												<Typography
													className={classes.SeparateText}
													variant="body1"
													color="textPrimary"
												>
													Valor de la unidad a la fecha de suscripción del presente contrato
												</Typography>
											</Grid>
											<Grid item md={6} xs={12}>
												<Field
													error={Boolean(touched.valor_unidad && errors.valor_unidad)}
													helperText={touched.valor_unidad && errors.valor_unidad}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.valor_unidad}
													label="Valor"
													name="valor_unidad"
													id="valor_unidad"
													component={renderTextField}
													// disabled
												/>
											</Grid>
										</Grid>
									</Fragment>
								</CardContent>
							</Card>
						</Box>

						{(codSistemaAporte == 1 || codSistemaAporte == 4) && (
							<Fragment>
								<Box m={3}>
									<CuentaInfoOportunity
										formDisabled={formDisabled}
										title={'Información de cuenta bancaria'}
										{...{
											values,
											touched,
											errors,
											handleBlur,
											handleChange,
											catalogoBancos: bancos,
											esCuentaTerceros,
											setFieldValue,
											codSistemaAporte
										}}
									/>
								</Box>

								<Box m={3}>
									<Card className={classes.SeparateButtons}>
										<CardContent>
											<Fragment>
												<Grid container spacing={4}>
													<Grid item md={4} xs={12}>
														<Typography
															className={classes.SeparateText}
															variant="body1"
															color="textPrimary"
														>
															Fecha de inicio de débito
														</Typography>
													</Grid>
													<Grid item md={8} xs={12}>
														<Field
															error={Boolean(submitCount > 0 && errors.inicio_debito)}
															fullWidth
															helperText={submitCount > 0 && errors.inicio_debito}
															name="inicio_debito"
															id="inicio_debito"
															onBlur={handleBlur}
															onChange={(e) => {
																setFieldValue('inicio_debito', e.target.value);
																handleChange(e);
															}}
															value={values.inicio_debito || ''}
															variant="outlined"
															data={opcionesFechasDescuento}
															component={InputRadio}
														/>
														{/* <FormControl
															component="fieldset"
															error={Boolean(
																touched.inicio_debito && errors.inicio_debito
															)}
															helperText={touched.inicio_debito && errors.inicio_debito}
														>
															<RadioGroup
																row
																aria-label="inicio_debito"
																name="inicio_debito"
																value={values.inicio_debito || ''}
																onChange={(e) => {
																	setFieldValue('inicio_debito', e.target.value);
																	handleChange(e);
																}}
															>
																{opcionesFechasDescuento.map((opcion) => (
																	<FormControlLabel
																		value={opcion.codigo}
																		control={<Radio color="primary" />}
																		inputProps={{
																			'aria-label': opcion.contenido
																		}}
																		label={opcion.contenido}
																	/>
																))}
															</RadioGroup>
														</FormControl> */}
													</Grid>
												</Grid>
											</Fragment>
										</CardContent>
									</Card>
								</Box>
							</Fragment>
						)}
						{values.monto_prima > 0 && (
							<Box m={3}>
								<Card>
									<CardHeader title="Beneficiario del seguro de vida" />
									<Divider />
									<CardContent>
										<FieldArray
											validateOnChange={false}
											name="seguroVidaValues"
											render={(arrayHelpers) => (
												<div className="App">
													{Object.values(
														values.seguroVidaValues
													).map((beneficiario, index) => {
														const inputsBeneficiarios = [
															{
																nombre: 'nombresSeguroVida',
																component: renderTextField,
																label: 'Nombres'
															},
															{
																nombre: 'apellidosSeguroVida',
																component: renderTextField,
																label: 'Apellidos'
															},
															{
																nombre: 'parentescoSeguroVida',
																component: renderSelectField,
																label: 'Parentesco'
															},
															{
																nombre: 'emailSeguroVida',
																component: renderTextField,
																label: 'Email'
															},
															{
																nombre: 'telefonoSeguroVida',
																component: renderTextField,
																label: 'Teléfono'
															}
														];

														return (
															<Box key={index}>
																<Grid container spacing={2}>
																	{inputsBeneficiarios.map((item) => {
																		if (
																			item.nombre != 'telefonoSeguroVida' &&
																			item.nombre != 'emailSeguroVida'
																		) {
																			return (
																				<Grid
																					item
																					md={6}
																					xs={12}
																					key={item.nombre}
																				>
																					<Field
																						error={Boolean(
																							touched &&
																								touched.seguroVidaValues &&
																								touched
																									.seguroVidaValues[
																									index
																								] &&
																								touched
																									.seguroVidaValues[
																									index
																								][item.nombre] &&
																								errors &&
																								errors.seguroVidaValues &&
																								errors.seguroVidaValues[
																									index
																								] &&
																								errors.seguroVidaValues[
																									index
																								][item.nombre]
																						)}
																						helperText={
																							touched &&
																							touched.seguroVidaValues &&
																							touched.seguroVidaValues[
																								index
																							] &&
																							touched.seguroVidaValues[
																								index
																							][item.nombre] &&
																							errors &&
																							errors.seguroVidaValues &&
																							errors.seguroVidaValues[
																								index
																							] &&
																							errors.seguroVidaValues[
																								index
																							][item.nombre]
																						}
																						onBlur={handleBlur}
																						onChange={handleChange}
																						value={
																							beneficiario[item.nombre]
																						}
																						label={item.label}
																						name={`seguroVidaValues.${index}.${item.nombre}`}
																						id={`seguroVidaValues.${index}.${item.nombre}`}
																						data={
																							item.nombre ===
																								'parentescoSeguroVida' &&
																							parentescos
																						}
																						component={item.component}
																					/>
																				</Grid>
																			);
																		} else {
																			return (
																				<Grid
																					item
																					md={6}
																					xs={12}
																					key={item.nombre}
																				>
																					<Field
																						error={Boolean(
																							touched &&
																								touched.seguroVidaValues &&
																								touched
																									.seguroVidaValues[
																									index
																								] &&
																								touched
																									.seguroVidaValues[
																									index
																								][item.nombre] &&
																								errors &&
																								errors.seguroVidaValues &&
																								errors.seguroVidaValues[
																									index
																								] &&
																								errors.seguroVidaValues[
																									index
																								][item.nombre]
																						)}
																						helperText={
																							touched &&
																							touched.seguroVidaValues &&
																							touched.seguroVidaValues[
																								index
																							] &&
																							touched.seguroVidaValues[
																								index
																							][item.nombre] &&
																							errors &&
																							errors.seguroVidaValues &&
																							errors.seguroVidaValues[
																								index
																							] &&
																							errors.seguroVidaValues[
																								index
																							][item.nombre]
																						}
																						onBlur={handleBlur}
																						onChange={handleChange}
																						value={
																							beneficiario[item.nombre]
																						}
																						label={item.label}
																						name={`seguroVidaValues.${index}.${item.nombre}`}
																						id={`seguroVidaValues.${index}.${item.nombre}`}
																						data={
																							item.nombre ===
																								'parentescoSeguroVida' &&
																							parentescos
																						}
																						component={item.component}
																						validate={(value) =>
																							validateEmailTel(
																								value,
																								item.nombre,
																								beneficiario
																							)}
																					/>
																				</Grid>
																			);
																		}
																	})}
																	<Grid item md={6} xs={12} />
																	{nameRoute.includes('editar') && (
																		<input type="hidden" value={beneficiario.id} />
																	)}
																	<Box m={2}>
																		<Button
																			style={{
																				background: 'black',
																				color: 'white'
																			}}
																			size="small"
																			type="button"
																			onClick={() =>
																				handleOnRemove(
																					arrayHelpers.remove,
																					index
																				)}
																			variant="contained"
																			disabled={
																				values.seguroVidaValues.length === 1 ? (
																					true
																				) : (
																					false
																				)
																			}
																		>
																			Eliminar
																		</Button>
																	</Box>
																</Grid>
															</Box>
														);
													})}
													<Box mt={2}>
														<Button
															style={{ background: 'black', color: 'white' }}
															size="large"
															type="button"
															onClick={() => {
																handleOnAdd(arrayHelpers.push);
															}}
															variant="contained"
														>
															Nuevo beneficiario
														</Button>
													</Box>
												</div>
											)}
										/>
									</CardContent>
								</Card>
							</Box>
						)}

						{values.checkedAee && (
							<Box m={3}>
								<Card>
									<CardHeader title="Beneficiario sólo Asistencia Exequial" />
									<Divider />
									<CardContent>
										<Grid container spacing={2}>
											{inputsBeneficiariosExequial.map((item) => (
												<Grid key={item.nombre} item md={6} xs={12}>
													<Field
														error={Boolean(touched[item.nombre] && errors[item.nombre])}
														helperText={touched[item.nombre] && errors[item.nombre]}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values[item.nombre]}
														label={item.label}
														name={`${item.nombre}`}
														id={`${item.nombre}`}
														data={item.nombre === 'parentescoExequial' && parentescosAEE}
														component={item.component}
													/>
												</Grid>
											))}
										</Grid>
									</CardContent>
								</Card>
							</Box>
						)}

						{/* ARBITRAJE */}
						<Box m={3}>
							<Card>
								<CardHeader title="Pagos y arbitraje" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<ListItem>
											<ListItemIcon />

											<ListItemText primary="Ratifico mi voluntad de someterme a arbitraje" />

											<FormControlLabel
												labelPlacement="start"
												control={
													<Checkbox
														checked={values.acepta_arbitraje_comercial}
														onChange={() => setFieldValue('acepta_arbitraje_comercial', 1)}
														name="acepta_arbitraje_comercial"
													/>
												}
												label="Si"
											/>

											<FormControlLabel
												labelPlacement="start"
												control={
													<Checkbox
														checked={!values.acepta_arbitraje_comercial}
														onChange={() => setFieldValue('acepta_arbitraje_comercial', 0)}
														name="no_acepta_arbitraje_comercial"
													/>
												}
												label="No"
											/>
										</ListItem>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						<Box m={3}>
							<Grid container spacing={2}>
								<Grid item md={6} xs={12} />

								{!formDisabled && (
									<Grid item md={6} xs={12}>
										{isSubmitting ? (
											<LinearProgress />
										) : (
											<Button
												disabled={isSubmitting}
												className={classes.ButtonBlack}
												fullWidth
												size="large"
												type="submit"
												variant="contained"
											>
												Continuar<ArrowForwardIcon />
											</Button>
										)}
									</Grid>
								)}

								{formDisabled && (
									<Grid item md={6} xs={12}>
										<Button
											disabled={isSubmitting}
											className={classes.ButtonBlack}
											fullWidth
											size="large"
											type="submit"
											variant="contained"
										>
											Siguiente página<ArrowForwardIcon />
										</Button>
									</Grid>
								)}
							</Grid>
						</Box>
					</form>
				);
			}}
		</Formik>
	);
};

export default FormRegisterOportunity;

const HeaderFondo = ({ amountHeader, loading }) => {
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<img
				className={classes.figure}
				src="/static/menus/fondos/fondos_inversion.svg"
				alt="Live from space album cover"
				title="Live from space album cover"
			/>
			<div className={classes.details}>
				<CardContent className={classes.content}>
					<Typography variant="subtitle1" color="textSecondary">
						FONDO DE INVERSIONES A LARGO PLAZO - {amountHeader}$
					</Typography>
					{loading && <LinearProgress />}
				</CardContent>
			</div>
		</Card>
	);
};

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'flex',
		margin: '1.5em 1.5em',
		borderRadius: '2pt',
		alignItems: 'center'
	},
	details: {
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	figure: {
		width: 120,
		height: 120,
		objectFit: 'cover',
		borderRadius: '2pt'
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	playIcon: {
		height: 38,
		width: 38
	}
}));

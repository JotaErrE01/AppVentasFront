import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
	Box,
	Grid,
	Button,
	CircularProgress,
	Card,
	CardContent,
	CardHeader,
	Divider,
	TextField,
	LinearProgress,
	InputAdornment,
	IconButton,
	Chip,
	FormHelperText,
	Typography,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormControl
} from '@material-ui/core';
import usesStyles from '../usesStyles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSnackbar } from 'notistack';

import { postClientesEditar, postClientesCrear } from 'src/slices/clientes';
import { getDeleteInformationWithRefuseEmpresa, postSearchEmpresa, setEmpresa } from 'src/slices/empresas';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import SearchIcon from '@material-ui/icons/Search';

import { Fragment } from 'react';

import { useDispatch, useSelector } from 'src/store';

import _ from 'lodash';
import { getCatalogoCantones, getCatalogoParroquias, getGeoCatalogos } from 'src/slices/catalogos';
import renderDateTimePicker from 'src/components/FormElements/InputDate';
import dayjs from 'dayjs';
import InputRadio from 'src/components/FormElements/InputRadio';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const ClienteCreateAndEditarViewStepThree = ({ dataCliente, setPage, cedulaCli, empresa }) => {
	const UsesStyles = { usesStyles };
	const classes = UsesStyles.usesStyles();

	const [ loadingEmpresa, setLoadingEmpresa ] = useState(false);

	const { Oportunidad: oportunidad } = useSelector((state) => state.cliente);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { provincias, cantonesEmpresa, parroquiasEmpresa } = useSelector((state) => state.catalogo);

	const { idCliente } = useParams();

	let query = useQuery();

	const location = useLocation();
	const history = useHistory();

	const submitPreviusPage = () => {
		if (location.pathname.includes('crear')) {
			setPage(2);
		} else {
			history.push('/afp/clientes/editar/' + idCliente + '/2/?codigoFondo=' + query.get('codigoFondo'));
		}
	};

	const searchEmpresa = async (ruc, setFieldValue) => {
		setLoadingEmpresa(true);

		const onSuccess = (empresa) => {
			dispatch(getGeoCatalogos({ empresa }));

			setLoadingEmpresa(false);

			if (empresa && empresa.id) {
				setFieldValue('id', dataCliente.id, true);
				setFieldValue('empresa_id', empresa.id, true);
				setFieldValue('razon_social_actividad_economica_cliente', empresa.razon_social, true);
				setFieldValue('telefono_actividad_economica_cliente', empresa.telefono, true);
				setFieldValue('ext_telefono_actividad_economica_cliente', empresa.extension, true);
				setFieldValue('correo_actividad_economica_cliente', empresa.email, true);
				setFieldValue('provincia', empresa.provincia, true);
				setFieldValue('provincia_id', empresa.provincia_id, true);
				setFieldValue('canton', empresa.canton, true);
				setFieldValue('canton_id', empresa.canton_id, true);
				setFieldValue('parroquia', empresa.parroquia, true);
				setFieldValue('parroquia_id', empresa.parroquia_id, true);
				setFieldValue('calle_principal_domicilio_actividad', empresa.calle_principal, true);
				setFieldValue('numeracion_domicilio_actividad', empresa.numeracion, true);
				setFieldValue('interseccion_domicilio_actividad', empresa.interseccion, true);
				setFieldValue('codigo_postal_domicilio_actividad', empresa.codigo_postal, true);
				setFieldValue('ciudadela_cooperativa_sector_domicilio_actividad', empresa.ciudadela, true);
				setFieldValue('etapa_domicilio_actividad', empresa.etapa, true);
				setFieldValue('manzana_domicilio_actividad', empresa.manzana, true);
				setFieldValue('solar_domicilio_actividad', empresa.solar, true);
				setFieldValue('referencia_domicilio_actividad', empresa.referencia, true);
				setFieldValue('edificio_domicilio_actividad', empresa.edificio, true);
				setFieldValue('piso_edificio_domicilio_actividad', empresa.piso, true);
				setFieldValue('numero_departamento_edificio_domicilio_actividad', empresa.departamento, true);
				setFieldValue('codigo_postal_edificio_domicilio_actividad', empresa.codigo_postal2, true);

				setFieldValue('editable', empresa.editable, true);
			} else {
				setFieldValue('id', dataCliente.id, true);
				setFieldValue('razon_social_actividad_economica_cliente', '', true);
				setFieldValue('telefono_actividad_economica_cliente', '', true);
				setFieldValue('ext_telefono_actividad_economica_cliente', '', true);
				setFieldValue('correo_actividad_economica_cliente', '', true);
				setFieldValue('provincia', '', true);
				setFieldValue('provincia_id', '', true);
				setFieldValue('canton', '', true);
				setFieldValue('canton_id', '', true);
				setFieldValue('parroquia', '', true);
				setFieldValue('parroquia_id', '', true);
				setFieldValue('calle_principal_domicilio_actividad', '', true);
				setFieldValue('numeracion_domicilio_actividad', '', true);
				setFieldValue('interseccion_domicilio_actividad', '', true);
				setFieldValue('codigo_postal_domicilio_actividad', '', true);
				setFieldValue('ciudadela_cooperativa_sector_domicilio_actividad', '', true);
				setFieldValue('etapa_domicilio_actividad', '', true);
				setFieldValue('manzana_domicilio_actividad', '', true);
				setFieldValue('solar_domicilio_actividad', '', true);
				setFieldValue('referencia_domicilio_actividad', '', true);
				setFieldValue('edificio_domicilio_actividad', '', true);
				setFieldValue('piso_edificio_domicilio_actividad', '', true);
				setFieldValue('numero_departamento_edificio_domicilio_actividad', '', true);
				setFieldValue('codigo_postal_edificio_domicilio_actividad', '', true);

				setFieldValue('editable', true, true);
			}
		};

		const onError = () => {
			enqueueSnackbar('Hubo un error consultando la empresa');
			setLoadingEmpresa(false);
		};

		await postSearchEmpresa(ruc, onSuccess, onError);
	};

	const handleClearEmpresa = (setFieldValue) => {
		setFieldValue('empresa_id', '', true);
		setFieldValue('ruc_actividad_economica_cliente', '', true);
		setFieldValue('razon_social_actividad_economica_cliente', '', true);
		setFieldValue('telefono_actividad_economica_cliente', '', true);
		setFieldValue('ext_telefono_actividad_economica_cliente', '', true);
		setFieldValue('correo_actividad_economica_cliente', '', true);
		setFieldValue('provincia_id', '', true);
		setFieldValue('canton_id', '', true);
		setFieldValue('parroquia_id', '', true);
		setFieldValue('calle_principal_domicilio_actividad', '', true);
		setFieldValue('numeracion_domicilio_actividad', '', true);
		setFieldValue('interseccion_domicilio_actividad', '', true);
		setFieldValue('codigo_postal_domicilio_actividad', '', true);
		setFieldValue('ciudadela_cooperativa_sector_domicilio_actividad', '', true);
		setFieldValue('etapa_domicilio_actividad', '', true);
		setFieldValue('manzana_domicilio_actividad', '', true);
		setFieldValue('solar_domicilio_actividad', '', true);
		setFieldValue('referencia_domicilio_actividad', '', true);
		setFieldValue('edificio_domicilio_actividad', '', true);
		setFieldValue('piso_edificio_domicilio_actividad', '', true);
		setFieldValue('numero_departamento_edificio_domicilio_actividad', '', true);
		setFieldValue('codigo_postal_edificio_domicilio_actividad', '', true);

		setFieldValue('editable', true, true);
	};

	const fecha_jubilacion = (() => {
		if (dataCliente.fecha_jubilacion && dataCliente.fecha_jubilacion.length > 10) {
			let fecha = dayjs(dataCliente.fecha_jubilacion.substring(0, 10));
			return fecha.toDate();
		}

		return null;
	})();

	const valueIni = {
		id: dataCliente.id,
		empresa_id: empresa.id,
		actividad_economica: dataCliente.actividad_economica,
		ruc_actividad_economica_cliente: empresa ? empresa.Ruc : '',
		razon_social_actividad_economica_cliente: empresa ? empresa.razon_social : '',

		cargo_actividad_economica_cliente: dataCliente.cargo_actividad_economica_cliente,
		dpto_laboral_actividad_economica_cliente: dataCliente.dpto_laboral_actividad_economica_cliente,

		telefono_actividad_economica_cliente: empresa
			? empresa.telefono
			: dataCliente.telefono_actividad_economica_cliente,
		ext_telefono_actividad_economica_cliente: empresa
			? empresa.extension
			: dataCliente.ext_telefono_actividad_economica_cliente,
		correo_actividad_economica_cliente: empresa ? empresa.email : dataCliente.correo_actividad_economica_cliente,
		provincia_id: empresa && empresa.provincia_id,
		provincia: empresa && empresa.provincia,
		canton_id: empresa && empresa.canton_id,
		canton: empresa && empresa.canton,
		parroquia_id: empresa && empresa.parroquia_id,
		parroquia: empresa && empresa.parroquia,
		monto_ingreso: dataCliente.monto_ingreso,
		calle_principal_domicilio_actividad: empresa
			? empresa.calle_principal
			: dataCliente.calle_principal_domicilio_actividad,
		numeracion_domicilio_actividad: empresa ? empresa.numeracion : dataCliente.numeracion_domicilio_actividad,
		interseccion_domicilio_actividad: empresa ? empresa.interseccion : dataCliente.interseccion_domicilio_actividad,
		codigo_postal_domicilio_actividad: empresa
			? empresa.codigo_postal
			: dataCliente.codigo_postal_domicilio_actividad,
		ciudadela_cooperativa_sector_domicilio_actividad: empresa
			? empresa.ciudadela
			: dataCliente.ciudadela_cooperativa_sector_domicilio_actividad,
		etapa_domicilio_actividad: empresa ? empresa.etapa : dataCliente.etapa_domicilio_actividad,
		manzana_domicilio_actividad: empresa ? empresa.manzana : dataCliente.manzana_domicilio_actividad,
		solar_domicilio_actividad: empresa ? empresa.solar : dataCliente.solar_domicilio_actividad,
		referencia_domicilio_actividad: empresa ? empresa.referencia : dataCliente.referencia_domicilio_actividad,
		edificio_domicilio_actividad: empresa ? empresa.edificio : dataCliente.edificio_domicilio_actividad,
		piso_edificio_domicilio_actividad: empresa ? empresa.piso : dataCliente.piso_edificio_domicilio_actividad,
		numero_departamento_edificio_domicilio_actividad: empresa
			? empresa.departamento
			: dataCliente.numero_departamento_edificio_domicilio_actividad,
		codigo_postal_edificio_domicilio_actividad: empresa
			? empresa.codigo_postal2
			: dataCliente.codigo_postal_edificio_domicilio_actividad,
		editable: empresa.editable,
		fecha_jubilacion: fecha_jubilacion
	};

	const buttonsAEC = [
		{
			contenido: 'PUBLICO',
			codigo: 'S04'
		},
		{
			contenido: 'PRIVADO',
			codigo: 'S05'
		},
		{
			contenido: 'INDEPENDIENTE',
			codigo: 'M74'
		},
		{
			contenido: 'JUBILADO',
			codigo: 'S01'
		}
	];

	let valdacionesEmpresa = {
		ruc_actividad_economica_cliente: Yup.string()
			.min(13, 'El RUC ingresado es muy corto')
			.max(13, 'Máximo 13 caracteres')	
			.matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales')
			.nullable(),
		dpto_laboral_actividad_economica_cliente: Yup.string()
			.max(20, 'Máximo 20 caracteres')		
			.nullable(),
		razon_social_actividad_economica_cliente: Yup.string()
			.when('actividad_economica', (actividad_economica, schema) => {
				if (actividad_economica != 'S01') {
					return schema
						// .matches(
						// 	/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
						// 	'Solo se admiten letras, números y # ° . - como caracteres especiales'
						// )
						.required('Se requiere llenar este campo')
						.nullable();
				}
				return schema.nullable();
			})
			.when('ruc_actividad_economica_cliente', (ruc_actividad_economica_cliente, schema) => {
				if (typeof ruc_actividad_economica_cliente === 'string')
					return schema
						// .matches(
						// 	/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
						// 	'Solo se admiten letras, números y # ° . - como caracteres especiales'
						// )
						.required('Se requiere llenar este campo')
						.nullable();

				return schema.nullable();
			})
		// telefono_actividad_economica_cliente: Yup.string()
		// 	.when('actividad_economica', (actividad_economica, schema) => {
		// 		if (actividad_economica != 'S01') {
		// 			return schema
		// 				.matches(/^[0-9+\-]+$/gm, 'Solo se admiten números y + - como caracteres especiales')
		// 				.required('Se requiere llenar este campo')
		// 				.nullable();
		// 		}
		// 		return schema.nullable();
		// 	})
		// 	.when('ruc_actividad_economica_cliente', (ruc_actividad_economica_cliente, schema) => {
		// 		if (typeof ruc_actividad_economica_cliente === 'string')
		// 			return schema
		// 				.matches(/^[0-9+\-]+$/gm, 'Solo se admiten números y + - como caracteres especiales')
		// 				.required('Se requiere llenar este campo')
		// 				.nullable();

		// 		return schema.nullable();
		// 	}),
		// ext_telefono_actividad_economica_cliente: Yup.string()
		// 	.matches(/^[0-9+\-]+$/gm, 'Solo se admiten números y + - como caracteres especiales')
		// 	.nullable(),
		// correo_actividad_economica_cliente: Yup.string().when('editable', (editable, schema) => {
		// 	if (editable) return schema.required('Se requiere llenar este campo');

		// 	return schema.nullable();
		// }),
		// provincia_id: Yup.string()
		// 	.when('ruc_actividad_economica_cliente', (ruc_actividad_economica_cliente, schema) => {
		// 		if (typeof ruc_actividad_economica_cliente === 'string')
		// 			return schema.required('Se debe elegir una opción').nullable();

		// 		return schema.nullable();
		// 	})
		// 	.when('editable', (editable, schema) => {
		// 		if (editable) return schema.required('Debe elegir una opción');

		// 		return schema.nullable();
		// 	}),
		// canton_id: Yup.string()
		// 	.when('ruc_actividad_economica_cliente', (ruc_actividad_economica_cliente, schema) => {
		// 		if (typeof ruc_actividad_economica_cliente === 'string')
		// 			return schema.required('Se debe elegir una opción').nullable();

		// 		return schema.nullable();
		// 	})
		// 	.when('editable', (editable, schema) => {
		// 		if (editable) return schema.required('Debe elegir una opción');

		// 		return schema.nullable();
		// 	}),
		// parroquia_id: Yup.string()
		// 	.when('ruc_actividad_economica_cliente', (ruc_actividad_economica_cliente, schema) => {
		// 		if (typeof ruc_actividad_economica_cliente === 'string')
		// 			return schema.required('Se debe elegir una opción').nullable();

		// 		return schema.nullable();
		// 	})
		// 	.when('editable', (editable, schema) => {
		// 		if (editable) return schema.required('Debe elegir una opción');

		// 		return schema.nullable();
		// 	}),

		// cargo_actividad_economica_cliente: Yup.string().required('Se requiere llenar este campo'),
		// dpto_laboral_actividad_economica_cliente: Yup.string().required('Se requiere llenar este campo'),

		// calle_principal_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	)
		// 	.when([ 'numeracion_domicilio_actividad', 'interseccion_domicilio_actividad' ], {
		// 		is: (numeracion_domicilio_actividad, interseccion_domicilio_actividad) =>
		// 			numeracion_domicilio_actividad || interseccion_domicilio_actividad,
		// 		then: Yup.string().required('Se requiere llenar este campo').nullable()
		// 	}),
		// numeracion_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9Nn#Â°.,\- ]+$/gm,
		// 		'Solo se admiten las letras (N n), números y # Â° . , - como caracteres especiales'
		// 	)
		// 	.when([ 'calle_principal_domicilio_actividad', 'interseccion_domicilio_actividad' ], {
		// 		is: (calle_principal_domicilio_actividad, interseccion_domicilio_actividad) =>
		// 			calle_principal_domicilio_actividad || interseccion_domicilio_actividad,
		// 		then: Yup.string().required('Se requiere llenar este campo').nullable()
		// 	}),
		// interseccion_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	)
		// 	.when([ 'calle_principal_domicilio_actividad', 'numeracion_domicilio_actividad' ], {
		// 		is: (calle_principal_domicilio_actividad, numeracion_domicilio_actividad) =>
		// 			calle_principal_domicilio_actividad || numeracion_domicilio_actividad,
		// 		then: Yup.string().required('Se requiere llenar este campo').nullable()
		// 	}),
		// codigo_postal_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales'),
		// /* .required('Se requiere llenar este campo'), */
		// ciudadela_cooperativa_sector_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	),
		// /* .required('Se requiere llenar este campo'), */
		// etapa_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	),
		// /* .required('Se requiere llenar este campo'), */
		// manzana_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	),
		// /* .required('Se requiere llenar este campo'), */
		// solar_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	),
		// /* .required('Se requiere llenar este campo'), */
		// referencia_domicilio_actividad: Yup.string().nullable(),
		// edificio_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	)
		// 	.when([ 'piso_edificio_domicilio_actividad', 'numero_departamento_edificio_domicilio_actividad' ], {
		// 		is: (piso_edificio_domicilio_actividad, numero_departamento_edificio_domicilio_actividad) =>
		// 			piso_edificio_domicilio_actividad || numero_departamento_edificio_domicilio_actividad,
		// 		then: Yup.string().required('Se requiere llenar este campo').nullable()
		// 	}),
		// piso_edificio_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9Nn#Â°.\- ]+$/gm,
		// 		'Solo se admiten las letras (N n), números y # Â° . - como caracteres especiales'
		// 	)
		// 	.when([ 'edificio_domicilio_actividad', 'numero_departamento_edificio_domicilio_actividad' ], {
		// 		is: (edificio_domicilio_actividad, numero_departamento_edificio_domicilio_actividad) =>
		// 			edificio_domicilio_actividad || numero_departamento_edificio_domicilio_actividad,
		// 		then: Yup.string().required('Se requiere llenar este campo').nullable()
		// 	}),
		// numero_departamento_edificio_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(
		// 		/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
		// 		'Solo se admiten letras, números y # ° . - como caracteres especiales'
		// 	)
		// 	.when([ 'edificio_domicilio_actividad', 'piso_edificio_domicilio_actividad' ], {
		// 		is: (edificio_domicilio_actividad, piso_edificio_domicilio_actividad) =>
		// 			edificio_domicilio_actividad || piso_edificio_domicilio_actividad,
		// 		then: Yup.string().required('Se requiere llenar este campo').nullable()
		// 	}),
		// codigo_postal_edificio_domicilio_actividad: Yup.string()
		// 	.nullable()
		// 	.matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales')
	};

	// if (empresa.id && !empresa.editable) {
	// 	valdacionesEmpresa = {};
	// }

	return (
		<Formik
			initialValues={valueIni}
			validationSchema={Yup.object().shape(
				{
					actividad_economica: Yup.string().required('Se debe elegir una opción'),
					monto_ingreso: Yup.string()
						.matches(/\d+(.\d+)?/, 'Solo se admiten cantidades con 2 decimales')
						.required('Se requiere llenar este campo'),
					fecha_jubilacion: Yup.date().nullable(),
					// fecha_jubilacion: Yup.string().when([ 'actividad_economica' ], (actividad_economica, schema) => {
					// 	if (actividad_economica == 'S01') {
					// 		return (actividad_economica, schema)
					// 			.required('Se requiere llenar este campo')
					// 			.test('validar fecha de jubilacion', 'Ingrese una fecha de jubilacion Valida', function(
					// 				value
					// 			) {
					// 				let fechaJubilacion = dayjs(value);

					// 				return fechaJubilacion.isBefore(dayjs(), 'day');
					// 			});
					// 	}

					// 	return schema.nullable();
					// }),
					...valdacionesEmpresa
				},
				[
					[ 'calle_principal_domicilio_actividad', 'numeracion_domicilio_actividad' ],
					[ 'calle_principal_domicilio_actividad', 'interseccion_domicilio_actividad' ],
					[ 'numeracion_domicilio_actividad', 'interseccion_domicilio_actividad' ],
					[ 'piso_edificio_domicilio_actividad', 'numero_departamento_edificio_domicilio_actividad' ],
					[ 'edificio_domicilio_actividad', 'numero_departamento_edificio_domicilio_actividad' ],
					[ 'edificio_domicilio_actividad', 'piso_edificio_domicilio_actividad' ]
				]
			)}
			onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				const step = 3;

				let onSuccess = (idCliente) => {
					resetForm();

					if (oportunidad && oportunidad.id) {
						history.push(`/afp/crm/oportunidad/mantenimientoOportunidad/${oportunidad.id}`);
					} else {
						history.push(
							`/afp/crm/oportunidad/mantenimientoOportunidad/${idCliente}/crear/${query.get(
								'codigoFondo'
							)}`
						);
					}

					// dispatch(getDeleteInformationWithRefuseEmpresa());
					// enqueueSnackbar
				};

				let onError = (response) => {
					setSubmitting(false);
					enqueueSnackbar('Hubo un error guardando el cliente', {
						variant: 'error'
					});

					console.log(response);
				};

				if (dataCliente.step) {
					dispatch(postClientesCrear(values, step, cedulaCli, onSuccess, onError));
				} else {
					dispatch(postClientesEditar(values, step, cedulaCli, onSuccess, onError));
				}
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, setFieldValue, values }) => {
				return (
					<form onSubmit={handleSubmit}>
						{/* Elemento 1 */}
						<Box mt={3}>
							<Card>
								<CardHeader title="Actividad Económica" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item xs={2}>
											<Typography
												className={classes.SeparateText}
												variant="body1"
												color="textPrimary"
											>
												Situación laboral
											</Typography>
										</Grid>
										<Grid item xs={8}>
											<Field
												error={Boolean(
													touched.actividad_economica && errors.actividad_economica
												)}
												fullWidth
												helperText={touched.actividad_economica && errors.actividad_economica}
												name="actividad_economica"
												id="actividad_economica"
												onBlur={handleBlur}
												onChange={(e) => {
													setFieldValue('actividad_economica', e.target.value);
													handleChange(e);
												}}
												value={values.actividad_economica}
												variant="outlined"
												data={buttonsAEC}
												component={InputRadio}
											/>
										</Grid>
									</Grid>
									<Box mt={3}>
										<Grid container spacing={2}>
											<Grid item md={6} xs={12}>
												<Grid container spacing={2}>
													<Grid item md={12} xs={12}>
														<Grid container spacing={2}>
															<Grid item md={8} xs={12}>
																<Field
																	error={Boolean(
																		touched.ruc_actividad_economica_cliente &&
																			errors.ruc_actividad_economica_cliente
																	)}
																	helperText={
																		touched.ruc_actividad_economica_cliente &&
																		errors.ruc_actividad_economica_cliente
																	}
																	onBlur={handleBlur}
																	//onChange={ev => updateEmpresa(ev, setFieldValue)}
																	onChange={handleChange}
																	value={values.ruc_actividad_economica_cliente}
																	label="RUC"
																	name="ruc_actividad_economica_cliente"
																	id="ruc_actividad_economica_cliente"
																	endAdornment={
																		values.empresa_id && (
																			<InputAdornment position="start">
																				<Chip
																					label={'ID ' + values.empresa_id}
																					onDelete={() => {
																						handleClearEmpresa(
																							setFieldValue
																						);
																					}}
																					variant="outlined"
																				/>
																			</InputAdornment>
																		)
																	}
																	component={renderTextField}
																/>
																{values.empresa_id &&
																values.editable && (
																	<FormHelperText>
																		Empresa no se encuentra registrada en los
																		sistemas de Génesis
																	</FormHelperText>
																)}
															</Grid>

															<Grid item md={4} xs={12}>
																{loadingEmpresa ? (
																	<CircularProgress size={20} />
																) : (
																	<Button
																		type="button"
																		variant="contained"
																		style={{
																			background:
																				isSubmitting ||
																				Boolean(
																					errors.ruc_actividad_economica_cliente
																				) ||
																				!values.ruc_actividad_economica_cliente ||
																				(values.ruc_actividad_economica_cliente &&
																					values.ruc_actividad_economica_cliente.trim() ==
																						'')
																					? '#7a7a7a'
																					: 'black',
																			color: 'white'
																		}}
																		className={classes.button}
																		disabled={
																			isSubmitting ||
																			Boolean(
																				errors.ruc_actividad_economica_cliente
																			) ||
																			!values.ruc_actividad_economica_cliente ||
																			(values.ruc_actividad_economica_cliente &&
																				values.ruc_actividad_economica_cliente.trim() ==
																					'')
																		}
																		onClick={() =>
																			searchEmpresa(
																				values.ruc_actividad_economica_cliente,
																				setFieldValue
																			)}
																		startIcon={<SearchIcon />}
																	>
																		BUSCAR
																	</Button>
																)}
															</Grid>
														</Grid>
													</Grid>
												</Grid>
											</Grid>

											<Grid item md={6} xs={12}>
												<Field
													error={Boolean(
														touched.razon_social_actividad_economica_cliente &&
															errors.razon_social_actividad_economica_cliente
													)}
													helperText={
														touched.razon_social_actividad_economica_cliente &&
														errors.razon_social_actividad_economica_cliente
													}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.razon_social_actividad_economica_cliente}
													label="Razón Social"
													name="razon_social_actividad_economica_cliente"
													id="razon_social_actividad_economica_cliente"
													variant="outlined"
													fullWidth
													disabled={values.editable == false}
													component={renderTextField}
												/>
											</Grid>
											{/* values.actividad_economica != 'S01' */}
											{false && (
												<Fragment>
													{/* BUSCAR EMPRESA */}

													<Grid item md={6} xs={12}>
														<Grid container spacing={2}>
															<Grid item md={12} xs={12}>
																<Grid container spacing={2}>
																	<Grid item md={8} xs={12}>
																		<Field
																			error={Boolean(
																				touched.ruc_actividad_economica_cliente &&
																					errors.ruc_actividad_economica_cliente
																			)}
																			helperText={
																				touched.ruc_actividad_economica_cliente &&
																				errors.ruc_actividad_economica_cliente
																			}
																			onBlur={handleBlur}
																			//onChange={ev => updateEmpresa(ev, setFieldValue)}
																			onChange={handleChange}
																			value={
																				values.ruc_actividad_economica_cliente
																			}
																			label="RUC"
																			name="ruc_actividad_economica_cliente"
																			id="ruc_actividad_economica_cliente"
																			endAdornment={
																				values.empresa_id && (
																					<InputAdornment position="start">
																						<Chip
																							label={
																								'ID ' +
																								values.empresa_id
																							}
																							onDelete={() => {
																								handleClearEmpresa(
																									setFieldValue
																								);
																							}}
																							variant="outlined"
																						/>
																					</InputAdornment>
																				)
																			}
																			component={renderTextField}
																		/>
																		{values.empresa_id &&
																		values.editable && (
																			<FormHelperText>
																				Empresa no se encuentra registrada en
																				los sistemas de Génesis
																			</FormHelperText>
																		)}
																	</Grid>

																	<Grid item md={4} xs={12}>
																		{loadingEmpresa ? (
																			<CircularProgress size={20} />
																		) : (
																			<Button
																				type="button"
																				variant="contained"
																				style={{
																					background:
																						isSubmitting ||
																						Boolean(
																							errors.ruc_actividad_economica_cliente
																						) ||
																						!values.ruc_actividad_economica_cliente ||
																						(values.ruc_actividad_economica_cliente &&
																							values.ruc_actividad_economica_cliente.trim() ==
																								'')
																							? '#7a7a7a'
																							: 'black',
																					color: 'white'
																				}}
																				className={classes.button}
																				disabled={
																					isSubmitting ||
																					Boolean(
																						errors.ruc_actividad_economica_cliente
																					) ||
																					!values.ruc_actividad_economica_cliente ||
																					(values.ruc_actividad_economica_cliente &&
																						values.ruc_actividad_economica_cliente.trim() ==
																							'')
																				}
																				onClick={() =>
																					searchEmpresa(
																						values.ruc_actividad_economica_cliente,
																						setFieldValue
																					)}
																				startIcon={<SearchIcon />}
																			>
																				BUSCAR
																			</Button>
																		)}
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
													</Grid>

													<Grid item md={6} xs={12}>
														<Field
															error={Boolean(
																touched.razon_social_actividad_economica_cliente &&
																	errors.razon_social_actividad_economica_cliente
															)}
															helperText={
																touched.razon_social_actividad_economica_cliente &&
																errors.razon_social_actividad_economica_cliente
															}
															onBlur={handleBlur}
															onChange={handleChange}
															value={values.razon_social_actividad_economica_cliente}
															label="Razón Social"
															name="razon_social_actividad_economica_cliente"
															id="razon_social_actividad_economica_cliente"
															variant="outlined"
															fullWidth
															disabled={!values.editable}
															component={renderTextField}
														/>
													</Grid>

													<Grid item md={6} xs={12}>
														<Grid container spacing={2}>
															<Grid item md={12} xs={12}>
																<Grid container spacing={2}>
																	<Grid item md={8} xs={12}>
																		<Field
																			error={Boolean(
																				touched.telefono_actividad_economica_cliente &&
																					errors.telefono_actividad_economica_cliente
																			)}
																			helperText={
																				touched.telefono_actividad_economica_cliente &&
																				errors.telefono_actividad_economica_cliente
																			}
																			onBlur={handleBlur}
																			onChange={handleChange}
																			value={
																				values.telefono_actividad_economica_cliente
																			}
																			label="Teléfono"
																			name="telefono_actividad_economica_cliente"
																			id="telefono_actividad_economica_cliente"
																			variant="outlined"
																			fullWidth
																			disabled={!values.editable}
																			component={renderTextField}
																		/>
																	</Grid>
																	<Grid item md={4} xs={12}>
																		<Field
																			error={Boolean(
																				touched.ext_telefono_actividad_economica_cliente &&
																					errors.ext_telefono_actividad_economica_cliente
																			)}
																			helperText={
																				touched.ext_telefono_actividad_economica_cliente &&
																				errors.ext_telefono_actividad_economica_cliente
																			}
																			onBlur={handleBlur}
																			onChange={handleChange}
																			value={
																				values.ext_telefono_actividad_economica_cliente
																			}
																			label="Ext."
																			name="ext_telefono_actividad_economica_cliente"
																			id="ext_telefono_actividad_economica_cliente"
																			variant="outlined"
																			fullWidth
																			disabled={!values.editable}
																			component={renderTextField}
																		/>
																	</Grid>
																</Grid>
															</Grid>
														</Grid>
													</Grid>
													<Grid item md={6} xs={12}>
														<Field
															error={Boolean(
																touched.correo_actividad_economica_cliente &&
																	errors.correo_actividad_economica_cliente
															)}
															helperText={
																touched.correo_actividad_economica_cliente &&
																errors.correo_actividad_economica_cliente
															}
															onBlur={handleBlur}
															onChange={handleChange}
															value={values.correo_actividad_economica_cliente}
															label="Correo"
															name="correo_actividad_economica_cliente"
															id="correo_actividad_economica_cliente"
															variant="outlined"
															fullWidth
															disabled={!values.editable}
															component={renderTextField}
														/>
													</Grid>
													<Grid item md={4} xs={12}>
														<Field
															error={Boolean(touched.provincia_id && errors.provincia_id)}
															helperText={touched.provincia_id && errors.provincia_id}
															onBlur={handleBlur}
															onChange={(event) => {
																let nombreProvincia =
																	event.target.options[event.target.selectedIndex]
																		.text;

																handleChange(event);
																dispatch(
																	getCatalogoCantones(event.target.value, 'empresa')
																);
																setFieldValue('provincia', nombreProvincia);
															}}
															label="Provincia"
															value={values.provincia_id}
															name="provincia_id"
															id="provincia_id"
															data={provincias}
															disabled={!values.editable}
															component={renderSelectField}
														/>
													</Grid>
													<Grid item md={4} xs={12}>
														<Field
															error={Boolean(touched.canton_id && errors.canton_id)}
															helperText={touched.canton_id && errors.canton_id}
															onBlur={handleBlur}
															onChange={(event) => {
																let nombreCanton =
																	event.target.options[event.target.selectedIndex]
																		.text;

																handleChange(event);
																dispatch(
																	getCatalogoParroquias(event.target.value, 'empresa')
																);
																setFieldValue('canton', nombreCanton);
															}}
															label="Cantón"
															name="canton_id"
															id="canton_id"
															value={values.canton_id || ''}
															data={cantonesEmpresa}
															component={renderSelectField}
															disabled={!values.editable}
														/>
													</Grid>
													<Grid item md={4} xs={12}>
														<Field
															error={Boolean(touched.parroquia_id && errors.parroquia_id)}
															helperText={touched.parroquia_id && errors.parroquia_id}
															onBlur={handleBlur}
															onChange={(event) => {
																let nombreParroquia =
																	event.target.options[event.target.selectedIndex]
																		.text;

																handleChange(event);
																setFieldValue('parroquia', nombreParroquia);
															}}
															label="Parroquia"
															name="parroquia_id"
															id="parroquia_id"
															value={values.parroquia_id}
															data={parroquiasEmpresa}
															component={renderSelectField}
															disabled={!values.editable}
														/>
													</Grid>

													{/* <Grid item md={6} xs={12} /> */}
												</Fragment>
											)}
											{/* INGRESOS */}
											<Grid item md={4} xs={12}>
												<Field
													error={Boolean(touched.monto_ingreso && errors.monto_ingreso)}
													helperText={touched.monto_ingreso && errors.monto_ingreso}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.monto_ingreso}
													label="Ingresos"
													name="monto_ingreso"
													id="monto_ingreso"
													variant="outlined"
													fullWidth
													component={renderTextField}
												/>
											</Grid>

											{/* CARGO */}
											<Grid item md={4} xs={12}>
												<Field
													error={Boolean(
														touched.cargo_actividad_economica_cliente &&
															errors.cargo_actividad_economica_cliente
													)}
													helperText={
														touched.cargo_actividad_economica_cliente &&
														errors.cargo_actividad_economica_cliente
													}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.cargo_actividad_economica_cliente}
													label="Cargo Actividad"
													name="cargo_actividad_economica_cliente"
													id="cargo_actividad_economica_cliente"
													component={renderTextField}
												/>
											</Grid>

											{/* DPTO LABORAL */}

											<Grid item md={4} xs={12}>
												<Field
													error={Boolean(
														touched.dpto_laboral_actividad_economica_cliente &&
															errors.dpto_laboral_actividad_economica_cliente
													)}
													helperText={
														touched.dpto_laboral_actividad_economica_cliente &&
														errors.dpto_laboral_actividad_economica_cliente
													}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.dpto_laboral_actividad_economica_cliente}
													label="Dpto. Laboral"
													name="dpto_laboral_actividad_economica_cliente"
													id="dpto_laboral_actividad_economica_cliente"
													variant="outlined"
													fullWidth
													component={renderTextField}
												/>
											</Grid>
										</Grid>
									</Box>
								</CardContent>
							</Card>
						</Box>

						{values.actividad_economica == 'S01' && (
							<Box mt={3}>
								<Card>
									<CardHeader title="Jubilación" />
									<Divider />
									<CardContent>
										<Fragment>
											{' '}
											<Grid container spacing={2}>
												<Grid item md={6} xs={12}>
													<Typography
														className={classes.SeparateText}
														variant="body1"
														color="textPrimary"
													>
														Fecha de Jubilación
													</Typography>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.fecha_jubilacion && errors.fecha_jubilacion
														)}
														helperText={touched.fecha_jubilacion && errors.fecha_jubilacion}
														onBlur={handleBlur}
														value={values.fecha_jubilacion}
														onChange={(date) => setFieldValue('fecha_jubilacion', date)}
														label="Fecha de Jubilación"
														name="fecha_jubilacion"
														id="fecha_jubilacion"
														fullWidth
														component={renderDateTimePicker}
													/>
												</Grid>
											</Grid>
										</Fragment>
									</CardContent>
								</Card>
							</Box>
						)}

						{/* values.actividad_economica != 'S01' */}
						{false && (
							<Fragment>
								<Box mt={3}>
									<Card>
										<CardHeader title="Ubicación de Actividad" />
										<Divider />
										<CardContent>
											<Grid container spacing={2}>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.calle_principal_domicilio_actividad &&
																errors.calle_principal_domicilio_actividad
														)}
														helperText={
															touched.calle_principal_domicilio_actividad &&
															errors.calle_principal_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.calle_principal_domicilio_actividad}
														label="Calle Principal"
														name="calle_principal_domicilio_actividad"
														id="calle_principal_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.numeracion_domicilio_actividad &&
																errors.numeracion_domicilio_actividad
														)}
														helperText={
															touched.numeracion_domicilio_actividad &&
															errors.numeracion_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.numeracion_domicilio_actividad}
														label="Numeración"
														name="numeracion_domicilio_actividad"
														id="numeracion_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.interseccion_domicilio_actividad &&
																errors.interseccion_domicilio_actividad
														)}
														helperText={
															touched.interseccion_domicilio_actividad &&
															errors.interseccion_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.interseccion_domicilio_actividad}
														label="Intersección"
														name="interseccion_domicilio_actividad"
														id="interseccion_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.codigo_postal_domicilio_actividad &&
																errors.codigo_postal_domicilio_actividad
														)}
														helperText={
															touched.codigo_postal_domicilio_actividad &&
															errors.codigo_postal_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.codigo_postal_domicilio_actividad}
														label="Codigo Postal"
														name="codigo_postal_domicilio_actividad"
														id="codigo_postal_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.ciudadela_cooperativa_sector_domicilio_actividad &&
																errors.ciudadela_cooperativa_sector_domicilio_actividad
														)}
														helperText={
															touched.ciudadela_cooperativa_sector_domicilio_actividad &&
															errors.ciudadela_cooperativa_sector_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.ciudadela_cooperativa_sector_domicilio_actividad}
														label="Ciudadela/Cooperativa/Sector"
														name="ciudadela_cooperativa_sector_domicilio_actividad"
														id="ciudadela_cooperativa_sector_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.etapa_domicilio_actividad &&
																errors.etapa_domicilio_actividad
														)}
														helperText={
															touched.etapa_domicilio_actividad &&
															errors.etapa_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.etapa_domicilio_actividad}
														label="Etapa"
														name="etapa_domicilio_actividad"
														id="etapa_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.manzana_domicilio_actividad &&
																errors.manzana_domicilio_actividad
														)}
														helperText={
															touched.manzana_domicilio_actividad &&
															errors.manzana_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.manzana_domicilio_actividad}
														label="Manzana"
														name="manzana_domicilio_actividad"
														id="manzana_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.solar_domicilio_actividad &&
																errors.solar_domicilio_actividad
														)}
														helperText={
															touched.solar_domicilio_actividad &&
															errors.solar_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.solar_domicilio_actividad}
														label="Solar"
														name="solar_domicilio_actividad"
														id="solar_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={12} xs={12}>
													<Field
														error={Boolean(
															touched.referencia_domicilio_actividad &&
																errors.referencia_domicilio_actividad
														)}
														helperText={
															touched.referencia_domicilio_actividad &&
															errors.referencia_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.referencia_domicilio_actividad}
														label="Referencia"
														name="referencia_domicilio_actividad"
														id="referencia_domicilio_actividad"
														multiline
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Box>

								<Box mt={3}>
									<Card>
										<CardHeader title="Edificio de Actividad" />
										<Divider />
										<CardContent>
											<Grid container spacing={2}>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.edificio_domicilio_actividad &&
																errors.edificio_domicilio_actividad
														)}
														helperText={
															touched.edificio_domicilio_actividad &&
															errors.edificio_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.edificio_domicilio_actividad}
														label="Edificio"
														name="edificio_domicilio_actividad"
														id="edificio_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.piso_edificio_domicilio_actividad &&
																errors.piso_edificio_domicilio_actividad
														)}
														helperText={
															touched.piso_edificio_domicilio_actividad &&
															errors.piso_edificio_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.piso_edificio_domicilio_actividad}
														label="Piso"
														name="piso_edificio_domicilio_actividad"
														id="piso_edificio_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.numero_departamento_edificio_domicilio_actividad &&
																errors.numero_departamento_edificio_domicilio_actividad
														)}
														helperText={
															touched.numero_departamento_edificio_domicilio_actividad &&
															errors.numero_departamento_edificio_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.numero_departamento_edificio_domicilio_actividad}
														label="No. Departamento"
														name="numero_departamento_edificio_domicilio_actividad"
														id="numero_departamento_edificio_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.codigo_postal_edificio_domicilio_actividad &&
																errors.codigo_postal_edificio_domicilio_actividad
														)}
														helperText={
															touched.codigo_postal_edificio_domicilio_actividad &&
															errors.codigo_postal_edificio_domicilio_actividad
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.codigo_postal_edificio_domicilio_actividad}
														label="Codigo Postal"
														name="codigo_postal_edificio_domicilio_actividad"
														id="codigo_postal_edificio_domicilio_actividad"
														variant="outlined"
														fullWidth
														disabled={!values.editable}
														component={renderTextField}
													/>
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Box>
							</Fragment>
						)}
						{/* botones */}
						<Box mt={3}>
							<Grid container spacing={2}>
								<Grid item md={6} xs={12}>
									<Button
										className={classes.ButtonBlack}
										onClick={submitPreviusPage}
										fullWidth
										size="large"
										type="button"
										variant="contained"
										disabled={isSubmitting}
									>
										<ArrowBackIcon /> Atrás
									</Button>
								</Grid>
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
											Continuar <ArrowForwardIcon />
										</Button>
									)}
								</Grid>
							</Grid>
						</Box>
					</form>
				);
			}}
		</Formik>
	);
};

export default ClienteCreateAndEditarViewStepThree;

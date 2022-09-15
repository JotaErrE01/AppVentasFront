import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import {
	Box,
	Grid,
	Button,
	CircularProgress,
	Card,
	CardContent,
	CardHeader,
	Divider,
	RadioGroup,
	Radio,
	FormControl,
	FormControlLabel,
	FormLabel,
	Typography,
	LinearProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import usesStyles from '../usesStyles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';

import * as dayjs from 'dayjs';

import { postClientesEditar, postClientesCrear, getSearchClientLocal } from 'src/slices/clientes';

import _ from 'lodash';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import renderDateTimePicker from '../../../../components/FormElements/InputDate';

import { Fragment } from 'react';
import useAuth from 'src/contextapi/hooks/useAuth';
import { useHistory, useLocation, useParams } from 'react-router';
import JSONTree from 'react-json-tree';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

let siNoValues = [ { text: 'SI', value: 1 }, { text: 'NO', value: 0 } ];

const ClienteCreateAndEditarViewStepOne = ({ dataCliente, actionType, cedulaCli, setPage, reloadCatalogos }) => {
	const UsesStyles = { usesStyles };
	const classes = UsesStyles.usesStyles();
	const { user } = useAuth();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const [ showNacionalidad2, setShowNacionalidad2 ] = useState(dataCliente.nacionalidad2 ? true : false);
	const [ showNacionalidad3, setShowNacionalidad3 ] = useState(dataCliente.nacionalidad3 ? true : false);

	const [ waringGenerico, setWaringGenerico ] = useState();

	const { duplicateDocument, errorMessage, ConsultarData: cliente, loadingClienteStepForm } = useSelector(
		(state) => state.cliente
	);

	let {
		tiposDocumento,
		nacionalidades,
		paises,
		nivelesPreparacion = [],
		estadosCiviles = [],
		sexos,
		titulos,
		loadError
	} = useSelector((state) => state.catalogo);

	let query = useQuery();

	const location = useLocation();
	const history = useHistory();

	const fecha_nacimiento = (() => {
		if (dataCliente.fecha_nacimiento && dataCliente.fecha_nacimiento.length > 10) {
			let fecha = dayjs(dataCliente.fecha_nacimiento.substring(0, 10));
			return fecha.toDate();
			// return dayjs('2004-03-16');
		}

		return null;
	})();

	const fecha_expira_ci_pas = (() => {
		if (dataCliente.fecha_expira_ci_pas && dataCliente.fecha_expira_ci_pas.length > 10) {
			let fecha = dayjs(dataCliente.fecha_expira_ci_pas.substring(0, 10));
			return fecha.toDate();
		}

		return null;
	})();

	//
	const valueIni = {
		/* inicializados fuera */
		id: dataCliente.id,
		sexo_cliente:
			dataCliente.sexo_cliente && dataCliente.sexo_cliente != '' ? dataCliente.sexo_cliente.toUpperCase() : 'M',
		// estado_civil_cliente: estado_civil_clienteEst || EstadoCivilCI[0].codigo,
		estado_civil_cliente: dataCliente.estado_civil_catalogo_id,
		tipo_documento: dataCliente.tipo_identificacion,
		pais_nacimiento: dataCliente.pais_nacimiento || 'EC',
		pais_ubicacion_cliente: dataCliente.pais_ubicacion_cliente || 'EC',
		// grado_instruccion_cliente: grado_instruccion_clienteEst || NivelPreparacionNP[0].codigo,
		grado_instruccion_cliente: dataCliente.nivel_preparacion,
		// es_jubilado: dataCliente.es_jubilado,
		fecha_nacimiento_cliente: fecha_nacimiento,
		fecha_expiracion_documento: fecha_expira_ci_pas,
		politicamente_expuesto: dataCliente.politicamente_expuesto,
		/* inicializados dentro */
		numero_identificacion: cedulaCli,
		primer_nombre: dataCliente.primer_nombre,
		segundo_nombre: dataCliente.segundo_nombre,
		primer_apellido: dataCliente.primer_apellido,
		segundo_apellido: dataCliente.segundo_apellido,

		titulo_obtenido_cliente: dataCliente.titulo_obtenido_cliente,
		conyuge_cedula_pas: dataCliente.conyuge_cedula_pas,
		conyuge_nombres: dataCliente.conyuge_nombres || '',
		conyuge_apellidos: dataCliente.conyuge_apellidos || '',
		apoderado_cedula_id: dataCliente.apoderado_cedula_id || '',
		apoderado_nombres: dataCliente.apoderado_nombres || '',
		apoderado_apellidos: dataCliente.apoderado_apellidos || '',
		nacionalidad_cliente: dataCliente.nacionalidad_cliente || 'EC',
		nacionalidad_cliente2: dataCliente.nacionalidad_cliente2,
		nacionalidad_cliente3: dataCliente.nacionalidad_cliente3,
		codigo_dactilar: dataCliente.codigo_dactilar ? dataCliente.codigo_dactilar : '',

		es_persona_estadounidense: dataCliente.es_persona_estadounidense || 0,
		numero_contribuyente_us: dataCliente.numero_contribuyente_us || '',
		es_residente_otro_pais: dataCliente.es_residente_otro_pais || 0
	};

	const submitingNextPage = (idCliente) => {
		if (location.pathname.includes('crear')) {
			setPage(2);
		} else {
			history.push('/afp/clientes/editar/' + idCliente + '/2/?codigoFondo=' + query.get('codigoFondo'));
		}
	};

	const deleteNacionalidad2 = (setFieldValue) => {
		setShowNacionalidad2(false);
		setFieldValue('nacionalidad_cliente2', '', false);
	};
	const deleteNacionalidad3 = (setFieldValue) => {
		setShowNacionalidad3(false);
		setFieldValue('nacionalidad_cliente3', '', false);
	};
	const agregarNacionalidad = () => {
		if (showNacionalidad2 == false) {
			setShowNacionalidad2(true);
		} else {
			setShowNacionalidad3(true);
		}
	};

	return (
		<Formik
			initialValues={valueIni}
			// enableReinitialize
			validationSchema={Yup.object().shape({
				tipo_documento: Yup.string().required('Se debe elegir una opción'),
				numero_identificacion: Yup.string()
					.required('Se requiere llenar este campo')
					.when('tipo_documento', (tipo_documento, schema) => {
						if (tipo_documento === 'C')
							return schema
								.min(10, 'El dato ingresado es muy corto')
								.max(10, 'El dato ingresado es muy largo')
								.matches(/^[0-9]+$/gm, 'Solo se admiten números')
								.required('Se requiere llenar este campo');

						if (tipo_documento === 'P')
							return schema
								.min(5, 'El dato ingresado es muy corto')
								.max(13, 'El dato ingresado es muy largo')
								.matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas')
								.required('Se requiere llenar este campo');

						return schema;
					})
					.test('validar identificación con tipo de identificacion', 'Cédula no válida', function(value) {
						var tipo_documento = this.parent.tipo_documento;
						if (typeof value === 'string' && value.length === 10 && tipo_documento === 'C') {
							var digits = value.split('').map(Number);
							var provincialCode = digits[0] * 10 + digits[1];
							if (provincialCode >= 1 && (provincialCode <= 24 || provincialCode === 30)) {
								var checkerDigit = digits.pop();
								var calculatedDigit =
									digits.reduce((previousValue, currentValue, index) => {
										var isNine = currentValue === 9 ? 1 : 0;
										return previousValue - (currentValue * (2 - index % 2)) % 9 - isNine * 9;
									}, 1000) % 10;
								if (calculatedDigit !== checkerDigit) {
									return false;
								}
							} else {
								return false;
							}
						}
						return true;
					}),
				codigo_dactilar: Yup.string().required('Se requiere llenar este campo'),
				primer_nombre: Yup.string()
					.max(25, 'Máximo 25 caracteres')
					.required('Se requiere llenar este campo')
					.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras'),
				segundo_nombre: Yup.string()
					.max(25, 'Máximo 25 caracteres')
					// .required('Se requiere llenar este campo')
					.nullable()
					.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras'),
				primer_apellido: Yup.string()
					.max(25, 'Máximo 25 caracteres')
					.required('Se requiere llenar este campo')
					.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras'),
				segundo_apellido: Yup.string()
					.max(25, 'Máximo 25 caracteres')
					// .required('Se requiere llenar este campo')
					.nullable()
					.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras'),
				sexo_cliente: Yup.string().required('Se debe elegir una opción'),
				// fecha_expiracion_documento: Yup.date().nullable(),
				fecha_expiracion_documento: Yup.date()
					.nullable()
					.test('validar fecha de expiracion', 'La fecha no puede ser menor a la fecha actual', function(
						value
					) {
						let feExpiracion = dayjs(value);

						return feExpiracion.isAfter(dayjs(), 'day');
					}),
				pais_nacimiento: Yup.string().required('Se debe elegir una opción'),
				pais_ubicacion_cliente: Yup.string().required('Se debe elegir una opción'),
				grado_instruccion_cliente: Yup.string().required('Se debe elegir una opción'),
				titulo_obtenido_cliente: Yup.string().when(
					'grado_instruccion_cliente',
					(grado_instruccion_cliente, schema) => {
						if (grado_instruccion_cliente !== 'N' && grado_instruccion_cliente !== 'P')
							return schema.required('Se debe elegir una opción');
						return schema.nullable();
					}
				),
				nacionalidad_cliente: Yup.string().required('Se debe elegir una opción'),
				estado_civil_cliente: Yup.string().required('Se debe elegir una opción'),
				conyuge_cedula_pas: Yup.string().when('estado_civil_cliente', (estado_civil_cliente, schema) => {
					if (query.get('codigoFondo') != '000001' && estado_civil_cliente === 'C')
						return schema
							.min(5, 'El dato ingresado es muy corto')
							.max(13, 'El dato ingresado es muy largo')
							.matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas')
							.required('Se requiere llenar este campo');

					return schema.nullable();
				}),
				conyuge_nombres: Yup.string().when('estado_civil_cliente', (estado_civil_cliente, schema) => {
					if (query.get('codigoFondo') != '000001' && estado_civil_cliente === 'C')
						return schema.required('Se requiere llenar este campo');

					return schema.nullable();
				}),
				conyuge_apellidos: Yup.string().when('estado_civil_cliente', (estado_civil_cliente, schema) => {
					if (query.get('codigoFondo') != '000001' && estado_civil_cliente === 'C')
						return schema.required('Se requiere llenar este campo');

					return schema.nullable();
				}),
				es_persona_estadounidense: Yup.string().nullable(),
				numero_contribuyente_us: Yup.string()
					.max(10, 'Solo se admite hasta 10 caracteres')
					// .matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas')
					// .matches(/^[a-zA-Z0-9]*$/, 'Solo se admiten números y letras')
					.when('es_persona_estadounidense', (es_persona_estadounidense, schema) => {
						if (es_persona_estadounidense == '1') return schema.required('Se requiere rellenar este campo');
						return schema;
					}),
				// numero_contribuyente_us: Yup.string().nullable(),
				/* .test('validar fecha de jubilacion', 'Ingrese una fecha de jubilacion Valida', function (values) {
                    var hoy = new Date()
                    var fechajubilado = new Date(this.parent.fecha_jubilacion);
                    var años = hoy.getFullYear() - fechajubilado.getFullYear();
                    var diferenciaMeses = hoy.getMonth() - fechajubilado.getMonth();
                    var diferenciaDias = hoy.getDay() - fechajubilado.getDay();

                    if (años <= 0 && diferenciaMeses <= 0 && diferenciaDias <= 0) {
                        return true;
                    } else {
                        return false;
                    }
                 }) */
				fecha_nacimiento_cliente: Yup.date(),
				apoderado_nombres: Yup.string().when('fecha_nacimiento_cliente', (fecha_nacimiento_cliente, schema) => {
					var hoy = new Date();
					var fechaNacimiento = new Date(fecha_nacimiento_cliente);
					var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
					var diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
					if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
						edad--;
					}
					if (edad <= '17') {
						return schema.required('Se requiere llenar este campo');
					}
					return schema;
				}),
				apoderado_apellidos: Yup.string().when(
					'fecha_nacimiento_cliente',
					(fecha_nacimiento_cliente, schema) => {
						var hoy = new Date();
						var fechaNacimiento = new Date(fecha_nacimiento_cliente);
						var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
						var diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
						if (
							diferenciaMeses < 0 ||
							(diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
						) {
							edad--;
						}
						if (edad <= '17') {
							return schema.required('Se requiere llenar este campo');
						}
						return schema;
					}
				),
				apoderado_cedula_id: Yup.string().when(
					'fecha_nacimiento_cliente',
					(fecha_nacimiento_cliente, schema) => {
						var hoy = new Date();
						var fechaNacimiento = new Date(fecha_nacimiento_cliente);
						var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
						var diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
						if (
							diferenciaMeses < 0 ||
							(diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
						) {
							edad--;
						}
						if (edad <= '17') {
							return schema
								.min(5, 'El dato ingresado es muy corto')
								.max(13, 'El dato ingresado es muy largo')
								.matches(/^[0-9A-Z-ÑÁÉÍÓÚ]+$/gm, 'Solo se admiten números y letras mayúsculas')
								.required('Se requiere llenar este campo');
						}
						return schema;
					}
				)
			})}
			onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				if (dataCliente.origen_datos == 2) {
					setWaringGenerico();
					let nombre = `${values.primer_apellido.trim()} ${values.segundo_apellido
						? values.segundo_apellido.trim()
						: ''} ${values.primer_nombre.trim()} ${values.segundo_nombre
						? values.segundo_nombre.trim()
						: ''}`;

					if (nombre.trim().toUpperCase() != dataCliente.nombre_registro_civil.trim().toUpperCase()) {
						setWaringGenerico(
							'Los nombres y apellidos que quieres guardar no coinciden con los enviados desde el Registro Civil: ' +
								dataCliente.nombre_registro_civil
						);

						setErrors({
							primer_nombre: true,
							segundo_nombre: true,
							primer_apellido: true,
							segundo_apellido: true
						});

						setSubmitting(false);

						return;
					}
				}

				let onSuccess = (id) => {
					setSubmitting(false);
					enqueueSnackbar('Cliente creado correctamente', {
						variant: 'success'
					});
					submitingNextPage(id);
				};

				let onError = (response) => {
					
					setSubmitting(false);
					enqueueSnackbar('Hubo un error guardando el cliente', {
						variant: 'error'
					});

					console.log(response);
				};

				const step = 1;
				if (cliente.step) {
					dispatch(postClientesCrear(values, step, cedulaCli, onSuccess, onError));
				} else {
					dispatch(postClientesEditar(values, step, cedulaCli, onSuccess, onError));
				}
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, setFieldValue, values }) => {
				return (
					<form onSubmit={handleSubmit}>
						{loadError && (
							<Box mt={3}>
								<Alert icon={false} severity="warning">
									Hubo un error cargando ciertos catálogos,{' '}
									<RouterLink onClick={reloadCatalogos}>recargar</RouterLink>.
								</Alert>
							</Box>
						)}

						{/* Elemento 1 */}
						<Box mt={3}>
							<Card>
								<CardHeader title="Documento de Identidad" />
								<Divider />
								<CardContent>
									{/* Elemento 1 */}
									<Grid container alignItems="center" spacing={2}>
										<Grid item xs={12}>
											{waringGenerico && <Alert severity="warning">{waringGenerico}</Alert>}
										</Grid>
										<Grid item md={3} xs={12}>
											<Field
												error={Boolean(touched.tipo_documento && errors.tipo_documento)}
												helperText={touched.tipo_documento && errors.tipo_documento}
												label="Tipo de Documento"
												name="tipo_documento"
												id="tipo_documento"
												onBlur={handleBlur}
												onChange={handleChange}
												data={tiposDocumento}
												value={values.tipo_documento}
												component={renderSelectField}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<Field
												error={Boolean(
													(touched.numero_identificacion && errors.numero_identificacion) ||
														duplicateDocument
												)}
												helperText={
													(touched.numero_identificacion && errors.numero_identificacion) ||
													(duplicateDocument &&
														'El número de documento ya se encuentra registrado')
												}
												onBlur={(e) => {
													handleBlur(e);
													if (actionType === 1) {
														dispatch(getSearchClientLocal(values.numero_identificacion));
													}
												}}
												onChange={handleChange}
												value={values.numero_identificacion}
												label="Numero de Identificación"
												name="numero_identificacion"
												id="numero_identificacion"
												component={renderTextField}
												disabled
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<Field
												error={Boolean(touched.codigo_dactilar && errors.codigo_dactilar)}
												helperText={touched.codigo_dactilar && errors.codigo_dactilar}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.codigo_dactilar}
												label="Código dactilar"
												name="codigo_dactilar"
												id="codigo_dactilar"
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={3} xs={12}>
											<Field
												error={Boolean(
													touched.fecha_expiracion_documento &&
														errors.fecha_expiracion_documento
												)}
												helperText={
													touched.fecha_expiracion_documento &&
													errors.fecha_expiracion_documento
												}
												label="Fecha de Expiración"
												name="fecha_expiracion_documento"
												id="fecha_expiracion_documento"
												value={values.fecha_expiracion_documento}
												onChange={(date) => setFieldValue('fecha_expiracion_documento', date)}
												onBlur={handleBlur}
												component={renderDateTimePicker}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						{/* Elemento 2 */}
						<Box mt={3}>
							<Card>
								<CardHeader title="Bio" />
								<Divider />
								<CardContent>
									<Fragment>
										<Grid container spacing={2} alignItems="center">
											<Grid item lg={3} md={6} xs={12}>
												<Field
													error={Boolean(touched.primer_nombre && errors.primer_nombre)}
													helperText={touched.primer_nombre && errors.primer_nombre}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.primer_nombre}
													label="Primer nombre"
													name="primer_nombre"
													id="primer_nombre"
													component={renderTextField}
												/>
											</Grid>
											<Grid item lg={3} md={6} xs={12}>
												<Field
													error={Boolean(touched.segundo_nombre && errors.segundo_nombre)}
													helperText={touched.segundo_nombre && errors.segundo_nombre}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.segundo_nombre}
													label="Segundo nombre"
													name="segundo_nombre"
													id="segundo_nombre"
													component={renderTextField}
												/>
											</Grid>
											<Grid item lg={3} md={6} xs={12}>
												<Field
													error={Boolean(touched.primer_apellido && errors.primer_apellido)}
													helperText={touched.primer_apellido && errors.primer_apellido}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.primer_apellido}
													label="Primer apellido"
													name="primer_apellido"
													id="primer_apellido"
													component={renderTextField}
												/>
											</Grid>
											<Grid item lg={3} md={6} xs={12}>
												<Field
													error={Boolean(touched.segundo_apellido && errors.segundo_apellido)}
													helperText={touched.segundo_apellido && errors.segundo_apellido}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.segundo_apellido}
													label="Segundo apellido"
													name="segundo_apellido"
													id="segundo_apellido"
													component={renderTextField}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<Field
													error={Boolean(touched.pais_nacimiento && errors.pais_nacimiento)}
													helperText={touched.pais_nacimiento && errors.pais_nacimiento}
													label="Pais de nacimiento"
													name="pais_nacimiento"
													id="pais_nacimiento"
													onBlur={handleBlur}
													onChange={handleChange}
													data={paises}
													value={values.pais_nacimiento}
													component={renderSelectField}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<Field
													error={Boolean(
														touched.fecha_nacimiento_cliente &&
															errors.fecha_nacimiento_cliente
													)}
													helperText={
														touched.fecha_nacimiento_cliente &&
														errors.fecha_nacimiento_cliente
													}
													value={values.fecha_nacimiento_cliente}
													onChange={(date) => setFieldValue('fecha_nacimiento_cliente', date)}
													onBlur={handleBlur}
													label="Fecha de Nacimineto"
													name="fecha_nacimiento_cliente"
													id="fecha_nacimiento_cliente"
													component={renderDateTimePicker}
													disabled
												/>
											</Grid>
											<Grid item md={12} xs={12}>
												<FormControl component="fieldset">
													<RadioGroup
														row
														aria-label="sexo_cliente"
														name="sexo_cliente"
														value={values.sexo_cliente}
														onChange={handleChange}
													>
														<FormLabel className={classes.LabelGender}>Sexo</FormLabel>
														<Alert
															icon={false}
															severity="success"
															className={classes.SpaceRadio}
														>
															{sexos.map((sexo) => (
																<FormControlLabel
																	value={sexo.codigo}
																	control={<Radio color="primary" />}
																	inputProps={{ 'aria-label': sexo.contenido }}
																	label={sexo.contenido}
																/>
															))}
														</Alert>
													</RadioGroup>
												</FormControl>
											</Grid>
											<Grid item md={6} xs={12}>
												<Field
													error={Boolean(
														touched.grado_instruccion_cliente &&
															errors.grado_instruccion_cliente
													)}
													helperText={
														touched.grado_instruccion_cliente &&
														errors.grado_instruccion_cliente
													}
													onBlur={handleBlur}
													onChange={handleChange}
													label="Instrucción"
													name="grado_instruccion_cliente"
													value={values.grado_instruccion_cliente}
													id="grado_instruccion_cliente"
													data={nivelesPreparacion}
													component={renderSelectField}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<Field
													error={Boolean(
														touched.titulo_obtenido_cliente &&
															errors.titulo_obtenido_cliente
													)}
													helperText={
														touched.titulo_obtenido_cliente &&
														errors.titulo_obtenido_cliente
													}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.titulo_obtenido_cliente}
													label="Título Obtenido"
													name="titulo_obtenido_cliente"
													id="titulo_obtenido_cliente"
													data={titulos}
													component={renderSelectField}
												/>
												{/* <Field
													error={Boolean(
														touched.titulo_obtenido_cliente &&
															errors.titulo_obtenido_cliente
													)}
													helperText={
														touched.titulo_obtenido_cliente &&
														errors.titulo_obtenido_cliente
													}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.titulo_obtenido_cliente}
													label="Título Obtenido"
													name="titulo_obtenido_cliente"
													id="titulo_obtenido_cliente"
													component={renderTextField}
												/> */}
											</Grid>
										</Grid>
									</Fragment>
								</CardContent>
							</Card>
						</Box>

						{/* Nacionalidad 3 */}
						<Box mt={3}>
							<Card>
								<CardHeader title="Nacionalidad" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(
													touched.nacionalidad_cliente && errors.nacionalidad_cliente
												)}
												helperText={touched.nacionalidad_cliente && errors.nacionalidad_cliente}
												label="Nacionalidad"
												onBlur={handleBlur}
												name="nacionalidad_cliente"
												id="nacionalidad_cliente"
												value={values.nacionalidad_cliente}
												onChange={handleChange}
												data={nacionalidades}
												component={renderSelectField}
											/>
										</Grid>
										<Grid item md={6} xs={12} className={classes.separateNacionalidad}>
											<Grid container spacing={2}>
												<Grid item md={6} xs={12} />
												<Grid item md={6} xs={12}>
													<Button
														className={classes.ButtonBlack}
														onClick={agregarNacionalidad}
														fullWidth
														variant="contained"
													>
														Agregar Nacionalidad
													</Button>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
									{showNacionalidad2 && (
										<Grid container spacing={2}>
											<Grid item md={6} xs={12}>
												<Field
													label="Nacionalidad"
													name="nacionalidad_cliente2"
													id="nacionalidad_cliente2"
													value={values.nacionalidad_cliente2}
													onChange={handleChange}
													data={nacionalidades}
													component={renderSelectField}
												/>
											</Grid>
											<Grid item md={6} xs={12} className={classes.separateNacionalidad}>
												<Grid container spacing={2}>
													<Grid item md={6} xs={12} />
													<Grid item md={6} xs={12}>
														<Button
															className={classes.ButtonBlack}
															onClick={() => deleteNacionalidad2(setFieldValue)}
															fullWidth
															variant="contained"
														>
															Eliminar Nacionalidad
														</Button>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									)}
									{showNacionalidad3 && (
										<Grid container spacing={2}>
											<Grid item md={6} xs={12}>
												<Field
													label="Nacionalidad"
													name="nacionalidad_cliente3"
													id="nacionalidad_cliente3"
													value={values.nacionalidad_cliente3}
													onChange={handleChange}
													data={nacionalidades}
													component={renderSelectField}
												/>
											</Grid>
											<Grid item md={6} xs={12} className={classes.separateNacionalidad}>
												<Grid container spacing={2}>
													<Grid item md={6} xs={12} />
													<Grid item md={6} xs={12}>
														<Button
															className={classes.ButtonBlack}
															onClick={() => deleteNacionalidad3(setFieldValue)}
															fullWidth
															variant="contained"
														>
															Eliminar Nacionalidad
														</Button>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									)}
								</CardContent>
							</Card>
						</Box>

						{/* Parte 4 */}

						<Box mt={3}>
							<Card>
								<CardHeader title="Información Conyugue" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(
													touched.estado_civil_cliente && errors.estado_civil_cliente
												)}
												helperText={touched.estado_civil_cliente && errors.estado_civil_cliente}
												onBlur={handleBlur}
												label="Estado Civil"
												name="estado_civil_cliente"
												id="estado_civil_cliente"
												value={values.estado_civil_cliente}
												data={estadosCiviles}
												onChange={handleChange}
												component={renderSelectField}
											/>
										</Grid>

										{values.estado_civil_cliente === 'C' && (
											<Fragment>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.conyuge_cedula_pas && errors.conyuge_cedula_pas
														)}
														helperText={
															touched.conyuge_cedula_pas && errors.conyuge_cedula_pas
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.conyuge_cedula_pas}
														label="Numero de identificación o pasaporte"
														name="conyuge_cedula_pas"
														id="conyuge_cedula_pas"
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.conyuge_nombres && errors.conyuge_nombres
														)}
														helperText={touched.conyuge_nombres && errors.conyuge_nombres}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.conyuge_nombres}
														label="Nombres"
														name="conyuge_nombres"
														id="conyuge_nombres"
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.conyuge_apellidos && errors.conyuge_apellidos
														)}
														helperText={
															touched.conyuge_apellidos && errors.conyuge_apellidos
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.conyuge_apellidos}
														label="Apellidos"
														name="conyuge_apellidos"
														id="conyuge_apellidos"
														component={renderTextField}
													/>
												</Grid>
											</Fragment>
										)}
									</Grid>
								</CardContent>
							</Card>
						</Box>

						{/* parte 5 */}
						{dayjs().diff(dayjs(fecha_nacimiento), 'years') < 18 && (
							<Box mt={3}>
								<Card>
									<CardHeader
										title="Representante Legal"
										subheader="Aplica cuando titular es menor de edad *"
									/>
									<Divider />
									<CardContent>
										<Grid container spacing={2}>
											<Grid item md={4} xs={12}>
												<Field
													error={Boolean(
														touched.apoderado_nombres && errors.apoderado_nombres
													)}
													helperText={touched.apoderado_nombres && errors.apoderado_nombres}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.apoderado_nombres}
													label="Nombres"
													name="apoderado_nombres"
													id="apoderado_nombres"
													component={renderTextField}
												/>
											</Grid>
											<Grid item md={4} xs={12}>
												<Field
													error={Boolean(
														touched.apoderado_apellidos && errors.apoderado_apellidos
													)}
													helperText={
														touched.apoderado_apellidos && errors.apoderado_apellidos
													}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.apoderado_apellidos}
													label="Apellidos"
													name="apoderado_apellidos"
													id="apoderado_apellidos"
													component={renderTextField}
												/>
											</Grid>
											<Grid item md={4} xs={12}>
												<Field
													error={Boolean(
														touched.apoderado_cedula_id && errors.apoderado_cedula_id
													)}
													helperText={
														touched.apoderado_cedula_id && errors.apoderado_cedula_id
													}
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.apoderado_cedula_id}
													label="Numero de identificación o pasaporte"
													name="apoderado_cedula_id"
													id="apoderado_cedula_id"
													component={renderTextField}
												/>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Box>
						)}

						{query.get('codigoFondo') != '000001' && (
							<Box mt={3}>
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
														{' '}
														¿Es una persona políticamente expuesta?{' '}
													</Typography>
												</Grid>
												<Grid item md={6} xs={12}>
													<Grid container spacing={2}>
														{[ 'SI', 'NO' ].map((opcion) => (
															<Grid item md={6} xs={12}>
																<Button
																	className={
																		values.politicamente_expuesto === opcion ? (
																			classes.ColorButtonOnSelect
																		) : (
																			classes.ColorButtonOffSelect
																		)
																	}
																	onClick={() =>
																		setFieldValue('politicamente_expuesto', opcion)}
																	fullWidth
																	size="large"
																	variant="contained"
																>
																	{opcion}
																</Button>
															</Grid>
														))}
													</Grid>
												</Grid>
											</Grid>
										</Fragment>
									</CardContent>
								</Card>
							</Box>
						)}

						<Box mt={3}>
							<Card>
								<CardHeader title="Residencia Fiscal" />
								<Divider />
								<CardContent>
									<Grid container spacing={4}>
										<Grid item md={6} xs={12}>
											<Typography
												className={classes.SeparateText}
												variant="body1"
												color="textPrimary"
											>
												País de Residencia
											</Typography>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(
													touched.pais_ubicacion_cliente && errors.pais_ubicacion_cliente
												)}
												helperText={
													touched.pais_ubicacion_cliente && errors.pais_ubicacion_cliente
												}
												label="País de Residencia"
												name="pais_ubicacion_cliente"
												id="pais_ubicacion_cliente"
												onBlur={handleBlur}
												onChange={(e) => {
													if (e.target.value != 'EC' && e.target.value != 'US') {
														setFieldValue('es_residente_otro_pais', 1);
													}

													handleChange(e);
												}}
												data={paises}
												value={values.pais_ubicacion_cliente}
												component={renderSelectField}
											/>
										</Grid>
									</Grid>
									<Grid container spacing={4}>
										<Grid item md={6} xs={12}>
											<Typography
												className={classes.SeparateText}
												variant="body1"
												color="textPrimary"
											>
												{' '}
												¿Es una persona estadounidense para fines fiscales?{' '}
											</Typography>
										</Grid>
										<Grid item md={6} xs={12}>
											<Grid container spacing={2}>
												{siNoValues.map((opcion) => (
													<Grid item md={6} xs={12}>
														<Button
															className={
																values.es_persona_estadounidense == opcion.value ? (
																	classes.ColorButtonOnSelect
																) : (
																	classes.ColorButtonOffSelect
																)
															}
															onClick={() =>
																setFieldValue(
																	'es_persona_estadounidense',
																	opcion.value
																)}
															fullWidth
															size="large"
															variant="contained"
														>
															{opcion.text}
														</Button>
													</Grid>
												))}
											</Grid>
										</Grid>
										{values.es_persona_estadounidense == 1 && (
											<Fragment>
												<Grid item md={6} xs={12}>
													<Typography
														className={classes.SeparateText}
														variant="body1"
														color="textPrimary"
													>
														No. Contribuyente Estados Unidos
													</Typography>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														error={Boolean(
															touched.numero_contribuyente_us &&
																errors.numero_contribuyente_us
														)}
														helperText={
															touched.numero_contribuyente_us &&
															errors.numero_contribuyente_us
														}
														onBlur={handleBlur}
														onChange={handleChange}
														value={values.numero_contribuyente_us}
														label="No. Contribuyente"
														name="numero_contribuyente_us"
														id="numero_contribuyente_us"
														component={renderTextField}
													/>
												</Grid>
											</Fragment>
										)}
									</Grid>
									<Divider style={{ marginTop: '.7rem', marginBottom: '.7rem' }} />
									<Grid container spacing={4}>
										<Grid item md={6} xs={12}>
											<Typography
												className={classes.SeparateText}
												variant="body1"
												color="textPrimary"
											>
												{' '}
												¿Es residente de cualquier otro país distinto de Estados Unidos y
												Ecuador para fines fiscales?{' '}
											</Typography>
										</Grid>
										<Grid item md={6} xs={12}>
											<Grid container spacing={2}>
												{siNoValues.map((opcion) => (
													<Grid item md={6} xs={12}>
														<Button
															className={
																values.es_residente_otro_pais == opcion.value ? (
																	classes.ColorButtonOnSelect
																) : (
																	classes.ColorButtonOffSelect
																)
															}
															onClick={() =>
																setFieldValue('es_residente_otro_pais', opcion.value)}
															fullWidth
															size="large"
															variant="contained"
														>
															{opcion.text}
														</Button>
													</Grid>
												))}
											</Grid>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						{/* botones */}
						<Box mt={3}>
							<Grid container spacing={2}>
								<Grid item md={6} xs={12} />
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
											Continuar
										<ArrowForwardIcon />
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

export default ClienteCreateAndEditarViewStepOne;

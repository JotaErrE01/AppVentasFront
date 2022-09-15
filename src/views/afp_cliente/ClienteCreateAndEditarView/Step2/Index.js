import React, { useState, Fragment, useEffect } from 'react';
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
	LinearProgress,
	FormHelperText
} from '@material-ui/core';
import usesStyles from '../usesStyles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useDispatch, useSelector } from 'src/store';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSnackbar } from 'notistack';

import { postClientesEditar, postClientesCrear } from 'src/slices/clientes';

import _ from 'lodash';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import { getCatalogoCantones, getCatalogoParroquias, getCatalogoProvincias } from 'src/slices/catalogos';
import { useHistory, useLocation, useParams } from 'react-router';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const ClienteCreateAndEditarViewStepTwo = ({ dataCliente, actionType, cedulaCli, mensajeAlert, setPage }) => {
	const UsesStyles = { usesStyles };
	const classes = UsesStyles.usesStyles();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { errorMessage, loadingClienteStepForm, loadingCliente } = useSelector((state) => state.cliente);

	const { provincias, cantones, parroquias } = useSelector((state) => state.catalogo);

	// useEffect(
	// 	() => {
	// 		if (provincias.length == 0) dispatch(getCatalogoProvincias());
	// 	},
	// 	[ dispatch ]
	// );

	// useEffect(
	// 	() => {
	//
	// 		if (dataCliente && dataCliente.provincia_id && !loadingCliente) {
	// 			dispatch(getCatalogoCantones(dataCliente.provincia_id));
	// 		}

	// 		if (dataCliente && dataCliente.canton_id && !loadingCliente) {
	// 			dispatch(getCatalogoParroquias(dataCliente.canton_id));
	// 		}
	// 	},
	// 	[ dataCliente ]
	// );

	const { idCliente, paso } = useParams();
	const location = useLocation();
	const history = useHistory();

	let query = useQuery();

	// const _provincias = (() => {
	// 	return provincias && provincias.length
	// 		? provincias.map((provincia) => ({
	// 				codigo: provincia.contenido,
	// 				contenido: provincia.contenido
	// 			}))
	// 		: [];
	// })();

	// const _cantones = (() => {
	// 	return cantones && cantones.length
	// 		? cantones.map((canton) => ({
	// 				codigo: canton.contenido,
	// 				contenido: canton.contenido
	// 			}))
	// 		: [];
	// })();

	// const getPrefijo = (value) => {
	//     const prefijo = _.find(_provincias, {contenido:value });
	//
	//     return prefijo.contenido_3;

	// }

	const submitingNextPage = (idCliente) => {
		if (location.pathname.includes('crear')) {
			setPage(3);
		} else {
			history.push('/afp/clientes/editar/' + idCliente + '/3/?codigoFondo=' + query.get('codigoFondo'));
		}
	};

	const submitPreviusPage = () => {
		if (location.pathname.includes('crear')) {
			setPage(1);
		} else {
			history.push('/afp/clientes/editar/' + idCliente + '/1/?codigoFondo=' + query.get('codigoFondo'));
		}
	};

	const valueIni = {
		...dataCliente
	};

	return (
		<Formik
			initialValues={valueIni}
			validationSchema={Yup.object().shape(
				{
					telefono_cliente: Yup.string()
						.min(9, 'El número ingresado es muy corto')
						.max(10, 'Máximo 10 caracteres')
						.required('Se requiere llenar este campo')
						.matches(/^[0-9]+$/gm, 'Solo se admiten números'),
					celular_cliente: Yup.string()
						.min(10, 'El número ingresado es muy corto')
						.max(10, 'Máximo 12 caracteres')
						/* .required('Se requiere llenar este campo') */
						.required('Se requiere llenar este campo')
						.matches(/^[0-9]+$/gm, 'Solo se admiten números'),
					correo_cliente: Yup.string()
						.max(60, 'Máximo 60 caracteres')
						.email('Se requiere un correo válido')
						.required('Se requiere llenar este campo'),
					provincia_id: Yup.string().required('Se debe elegir una opción'),
					canton_id: Yup.string().required('Se debe elegir una opción'),
					parroquia_id: Yup.string()
						.required('Se requiere llenar este campo')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						),
					recinto: Yup.string()
						.max(30, 'Máximo 30 caracteres')
						/* .required('Se requiere llenar este campo'), */
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable(),
					calle_principal_domicilio: Yup.string()
						.max(25, 'Máximo 25 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable()
						.when([ 'numeracion_domicilio', 'interseccion_domicilio' ], {
							is: (numeracion_domicilio, interseccion_domicilio) =>
								numeracion_domicilio || interseccion_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					numeracion_domicilio: Yup.string()
						.max(10, 'Máximo 10 caracteres')
						// .matches(
						// 	/^[0-9Nn#°.,\- ]+$/gm,
						// 	'Solo se admiten las letras (N n), números y # ° . , - como caracteres especiales'
						// )
						.nullable()
						.when([ 'calle_principal_domicilio', 'interseccion_domicilio' ], {
							is: (calle_principal_domicilio, interseccion_domicilio) =>
								calle_principal_domicilio || interseccion_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					interseccion_domicilio: Yup.string()
						.max(25, 'Máximo 25 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable()
						.when([ 'calle_principal_domicilio', 'numeracion_domicilio' ], {
							is: (calle_principal_domicilio, numeracion_domicilio) =>
								calle_principal_domicilio || numeracion_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					codigo_postal_domicilio: Yup.string()
						.max(10, 'Máximo 10 caracteres')
						/* .required('Se requiere llenar este campo') */
						.matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales')
						.nullable(),
					ciudadela_cooperativa_sector_domicilio: Yup.string()
						.max(40, 'Máximo 40 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable()
						.when([ 'etapa_domicilio', 'manzana_domicilio', 'solar_domicilio' ], {
							is: (etapa_domicilio, manzana_domicilio, solar_domicilio) =>
								etapa_domicilio || manzana_domicilio || solar_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					etapa_domicilio: Yup.string()
						.max(6, 'Máximo 6 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable(),
					// .when(['ciudadela_cooperativa_sector_domicilio', 'manzana_domicilio', 'solar_domicilio'], {
					//     is: (ciudadela_cooperativa_sector_domicilio, manzana_domicilio, solar_domicilio) => ciudadela_cooperativa_sector_domicilio || manzana_domicilio || solar_domicilio,
					//     then: Yup.string().required('Se requiere llenar este campo').nullable()
					// }),
					manzana_domicilio: Yup.string()
						.max(4, 'Máximo 4 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable()
						.when([ 'ciudadela_cooperativa_sector_domicilio', 'etapa_domicilio', 'solar_domicilio' ], {
							is: (ciudadela_cooperativa_sector_domicilio, etapa_domicilio, solar_domicilio) =>
								ciudadela_cooperativa_sector_domicilio || etapa_domicilio || solar_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					solar_domicilio: Yup.string()
						.max(6, 'Máximo 6 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable()
						.when([ 'ciudadela_cooperativa_sector_domicilio', 'etapa_domicilio', 'manzana_domicilio' ], {
							is: (ciudadela_cooperativa_sector_domicilio, etapa_domicilio, manzana_domicilio) =>
								ciudadela_cooperativa_sector_domicilio || etapa_domicilio || manzana_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					referencia_domicilio: Yup.string()
						.max(60, 'Máximo 60 caracteres')
						// .required('Se requiere llenar este campo')
						.nullable()
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , + - como caracteres especiales'
						),
					edificio_domicilio: Yup.string()
						.max(40, 'Máximo 40 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
							'Solo se admiten letras, números y # ° . , - como caracteres especiales'
						)
						.nullable()
						.when([ 'piso_edificio_domicilio', 'numero_departamento_edificio_domicilio' ], {
							is: (piso_edificio_domicilio, numero_departamento_edificio_domicilio) =>
								piso_edificio_domicilio || numero_departamento_edificio_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					piso_edificio_domicilio: Yup.string()
						.max(3, 'Máximo 3 caracteres')
						.matches(
							/^[0-9Nn#°.\- ]+$/gm,
							'Solo se admiten las letras (N n), números y # ° . - como caracteres especiales'
						)
						.nullable()
						.when([ 'edificio_domicilio', 'numero_departamento_edificio_domicilio' ], {
							is: (edificio_domicilio, numero_departamento_edificio_domicilio) =>
								edificio_domicilio || numero_departamento_edificio_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					numero_departamento_edificio_domicilio: Yup.string()
						.max(6, 'Máximo 6 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.nullable()
						.when([ 'edificio_domicilio', 'piso_edificio_domicilio' ], {
							is: (edificio_domicilio, piso_edificio_domicilio) =>
								edificio_domicilio || piso_edificio_domicilio,
							then: Yup.string().required('Se requiere llenar este campo')
						})
				},
				[
					[ 'calle_principal_domicilio', 'numeracion_domicilio' ],
					[ 'calle_principal_domicilio', 'interseccion_domicilio' ],
					[ 'numeracion_domicilio', 'interseccion_domicilio' ],
					[ 'piso_edificio_domicilio', 'numero_departamento_edificio_domicilio' ],
					[ 'edificio_domicilio', 'numero_departamento_edificio_domicilio' ],
					[ 'edificio_domicilio', 'piso_edificio_domicilio' ],
					[ 'ciudadela_cooperativa_sector_domicilio', 'etapa_domicilio' ],
					[ 'ciudadela_cooperativa_sector_domicilio', 'solar_domicilio' ],
					[ 'ciudadela_cooperativa_sector_domicilio', 'manzana_domicilio' ],
					[ 'etapa_domicilio', 'manzana_domicilio' ],
					[ 'etapa_domicilio', 'solar_domicilio' ],
					[ 'solar_domicilio', 'manzana_domicilio' ]
				]
			)}
			onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				let onSuccess = (id) => {
					setSubmitting(false);
					enqueueSnackbar('Cliente guardado correctamente', {
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

				const step = 2;

				if (dataCliente.step) {
					dispatch(postClientesCrear(values, step, cedulaCli, onSuccess, onError));
				} else {
					dispatch(postClientesEditar(values, step, cedulaCli, onSuccess, onError));
				}
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
				<form onSubmit={handleSubmit}>
					<Box mt={3}>
						<Card>
							<CardHeader title="Información de Contacto" />
							<Divider />
							<CardContent>
								<Grid container spacing={2} style={{ marginTop: 8, marginBottom: 8 }}>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.provincia_id && errors.provincia_id)}
											helperText={touched.provincia_id && errors.provincia_id}
											onBlur={handleBlur}
											//onChange={handleChange}
											label="Provincia"
											name="provincia_id"
											id="provincia_id"
											value={values.provincia_id}
											data={provincias}
											component={renderSelectField}
											onChange={(event) => {
												let nombreProvincia =
													event.target.options[event.target.selectedIndex].text;

												handleChange(event);
												dispatch(getCatalogoCantones(event.target.value));
												setFieldValue('provincia', nombreProvincia);
											}}
										/>
										{values.provincia_registro_civil && (
											<FormHelperText>
												Info. Reg. Civil: {values.provincia_registro_civil}
											</FormHelperText>
										)}
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.canton_id && errors.canton_id)}
											helperText={touched.canton_id && errors.canton_id}
											onBlur={handleBlur}
											onChange={(event) => {
												let nombreCanton =
													event.target.options[event.target.selectedIndex].text;

												handleChange(event);
												dispatch(getCatalogoParroquias(event.target.value));
												setFieldValue('canton', nombreCanton);
											}}
											label="Cantón"
											name="canton_id"
											id="canton_id"
											value={values.canton_id}
											data={cantones}
											component={renderSelectField}
										/>
										{values.canton_registro_civil && (
											<FormHelperText>
												Info. Reg. Civil: {values.canton_registro_civil}
											</FormHelperText>
										)}
									</Grid>
								</Grid>

								<Grid container spacing={2}>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.parroquia_id && errors.parroquia_id)}
											helperText={touched.parroquia_id && errors.parroquia_id}
											onBlur={handleBlur}
											onChange={(event) => {
												let nombreParroquia =
													event.target.options[event.target.selectedIndex].text;

												handleChange(event);
												setFieldValue('parroquia', nombreParroquia);
											}}
											label="Parroquia"
											name="parroquia_id"
											id="parroquia_id"
											value={values.parroquia_id}
											data={parroquias}
											component={renderSelectField}
										/>
										{values.parroquia_registro_civil && (
											<FormHelperText>
												Info. Reg. Civil: {values.parroquia_registro_civil}
											</FormHelperText>
										)}
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.recinto && errors.recinto)}
											helperText={touched.recinto && errors.recinto}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.recinto}
											label="Recinto"
											name="recinto"
											id="recinto"
											component={renderTextField}
										/>
									</Grid>
								</Grid>

								<Grid container spacing={2}>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.telefono_cliente && errors.telefono_cliente)}
											helperText={touched.telefono_cliente && errors.telefono_cliente}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.telefono_cliente}
											label="Teléfono"
											name="telefono_cliente"
											id="telefono_cliente"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.celular_cliente && errors.celular_cliente)}
											helperText={touched.celular_cliente && errors.celular_cliente}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.celular_cliente}
											label="Celular"
											name="celular_cliente"
											id="celular_cliente"
											component={renderTextField}
										/>
									</Grid>
								</Grid>

								<Grid container spacing={2} style={{ marginTop: 8, marginBottom: 8 }}>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.correo_cliente && errors.correo_cliente)}
											helperText={touched.correo_cliente && errors.correo_cliente}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.correo_cliente}
											label="Correo"
											name="correo_cliente"
											id="correo_cliente"
											component={renderTextField}
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>

					<Box mt={3}>
						<Card>
							<CardHeader title="Domicilio" />
							<Divider />
							<CardContent>
								<Grid container spacing={2}>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(
												touched.calle_principal_domicilio && errors.calle_principal_domicilio
											)}
											helperText={
												touched.calle_principal_domicilio && errors.calle_principal_domicilio
											}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.calle_principal_domicilio}
											label="Calle Principal"
											name="calle_principal_domicilio"
											id="calle_principal_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.numeracion_domicilio && errors.numeracion_domicilio)}
											helperText={touched.numeracion_domicilio && errors.numeracion_domicilio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.numeracion_domicilio}
											label="Numeración"
											name="numeracion_domicilio"
											id="numeracion_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(
												touched.interseccion_domicilio && errors.interseccion_domicilio
											)}
											helperText={touched.interseccion_domicilio && errors.interseccion_domicilio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.interseccion_domicilio}
											label="Intersección"
											name="interseccion_domicilio"
											id="interseccion_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(
												touched.codigo_postal_domicilio && errors.codigo_postal_domicilio
											)}
											helperText={
												touched.codigo_postal_domicilio && errors.codigo_postal_domicilio
											}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.codigo_postal_domicilio}
											label="Codigo Postal"
											name="codigo_postal_domicilio"
											id="codigo_postal_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(
												touched.ciudadela_cooperativa_sector_domicilio &&
													errors.ciudadela_cooperativa_sector_domicilio
											)}
											helperText={
												touched.ciudadela_cooperativa_sector_domicilio &&
												errors.ciudadela_cooperativa_sector_domicilio
											}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.ciudadela_cooperativa_sector_domicilio}
											label="Ciudadela/Cooperativa/Sector"
											name="ciudadela_cooperativa_sector_domicilio"
											id="ciudadela_cooperativa_sector_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.etapa_domicilio && errors.etapa_domicilio)}
											helperText={touched.etapa_domicilio && errors.etapa_domicilio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.etapa_domicilio}
											label="Etapa"
											name="etapa_domicilio"
											id="etapa_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.manzana_domicilio && errors.manzana_domicilio)}
											helperText={touched.manzana_domicilio && errors.manzana_domicilio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.manzana_domicilio}
											label="Manzana"
											name="manzana_domicilio"
											id="manzana_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<Field
											error={Boolean(touched.solar_domicilio && errors.solar_domicilio)}
											helperText={touched.solar_domicilio && errors.solar_domicilio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.solar_domicilio}
											label="Solar"
											name="solar_domicilio"
											id="solar_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={12} xs={12}>
										<Field
											error={Boolean(touched.referencia_domicilio && errors.referencia_domicilio)}
											helperText={touched.referencia_domicilio && errors.referencia_domicilio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.referencia_domicilio}
											label="Referencia"
											name="referencia_domicilio"
											id="referencia_domicilio"
											multiline
											component={renderTextField}
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>

					<Box mt={3}>
						<Card>
							<CardHeader title="Edificio" />
							<Divider />
							<CardContent>
								<Grid container spacing={2}>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(touched.edificio_domicilio && errors.edificio_domicilio)}
											helperText={touched.edificio_domicilio && errors.edificio_domicilio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.edificio_domicilio}
											label="Edificio"
											name="edificio_domicilio"
											id="edificio_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(
												touched.piso_edificio_domicilio && errors.piso_edificio_domicilio
											)}
											helperText={
												touched.piso_edificio_domicilio && errors.piso_edificio_domicilio
											}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.piso_edificio_domicilio}
											label="Piso"
											name="piso_edificio_domicilio"
											id="piso_edificio_domicilio"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(
												touched.numero_departamento_edificio_domicilio &&
													errors.numero_departamento_edificio_domicilio
											)}
											helperText={
												touched.numero_departamento_edificio_domicilio &&
												errors.numero_departamento_edificio_domicilio
											}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.numero_departamento_edificio_domicilio}
											label="No. Departamento"
											name="numero_departamento_edificio_domicilio"
											id="numero_departamento_edificio_domicilio"
											component={renderTextField}
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>

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
			)}
		</Formik>
	);
};

export default ClienteCreateAndEditarViewStepTwo;

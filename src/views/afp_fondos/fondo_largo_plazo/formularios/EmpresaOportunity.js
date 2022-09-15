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
	Chip
} from '@material-ui/core';
import usesStyles from '../../../afp_cliente/ClienteCreateAndEditarView/usesStyles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSnackbar } from 'notistack';

import {
	updateEmpresaOportunidad,
	setOportunidad,
	getFondoAporteEdit
} from 'src/slices/clientes';
import { setEmpresaOportunidad } from 'src/slices/empresas';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'src/store';

import _ from 'lodash';
import {
	getCatalogoCantones,
	getCatalogoParroquias,
	getCatalogoProvincias,
	getCatalogoTipoEmpresa,
	getGeoCatalogos
} from 'src/slices/catalogos';
import { postOportunidadTieneEstado } from 'src/slices/oportunidad';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const EmpresaOportunity = ({ setPage, cedulaCli, mensajeAlert }) => {
	const UsesStyles = { usesStyles };
	const classes = UsesStyles.usesStyles();
	const { Oportunidad: oportunidad, loadingClienteStepForm, ConsultarData: cliente } = useSelector(
		(state) => state.cliente
	);
	const { loadingEmpresa } = useSelector((state) => state.empresa);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { provincias, cantonesEmpresa, parroquiasEmpresa, tipoEmpresas } = useSelector((state) => state.catalogo);

	let { idOportunidad, codigoFondo } = useParams();

	const history = useHistory();

	useEffect(
		() => {
			dispatch(getCatalogoProvincias());
			dispatch(getCatalogoTipoEmpresa());

			if (idOportunidad && oportunidad && idOportunidad != oportunidad.id) {
				dispatch(setOportunidad({}));
				dispatch(getFondoAporteEdit(idOportunidad));
			}

			if (cliente && cliente.id && oportunidad && oportunidad.id) {
				let { empresa } = oportunidad;

				dispatch(getGeoCatalogos({ ...cliente, empresa }));
			}
		},
		[ cliente ]
	);

	const submitPreviusPage = () => {
		if (oportunidad.fondo_id == '000001') {
			setPage(1);
			history.push('/afp/crm/oportunidad/editar/registroOportunidad/' + idOportunidad + '/1');
		} else {
			setPage(2);
			history.push(
				'/afp/crm/oportunidad/editar/registroOportunidad/' + idOportunidad + '/cortoPlazo/' + codigoFondo + '/2'
			);
		}
	};

	// const handleClearEmpresa = (setFieldValue) => {
	// 	dispatch(setEmpresaOportunidad({}));

	// 	setFieldValue('Ruc', '', true);
	// 	setFieldValue('razon_social', '', true);
	// 	setFieldValue('telefono', '', true);
	// 	setFieldValue('extension', '', true);
	// 	setFieldValue('correo', '', true);
	// 	setFieldValue('provincia_id', '', true);
	// 	setFieldValue('canton_id', '', true);
	// 	setFieldValue('parroquia_id', '', true);
	// 	setFieldValue('calle_principal', '', true);
	// 	setFieldValue('numeracion', '', true);
	// 	setFieldValue('interseccion', '', true);
	// 	setFieldValue('codigo_postal', '', true);
	// 	setFieldValue('ciudadela', '', true);
	// 	setFieldValue('etapa', '', true);
	// 	setFieldValue('manzana', '', true);
	// 	setFieldValue('solar', '', true);
	// 	setFieldValue('referencia', '', true);
	// 	setFieldValue('edificio', '', true);
	// 	setFieldValue('piso', '', true);
	// 	setFieldValue('departamento', '', true);
	// 	setFieldValue('codigo_postal2', '', true);

	// 	setFieldValue('monto_ingreso', '', true);
	// };

	// const handleStatus = (idOportunidad) => {
	// 	const registro = {
	// 		contenido: '-',
	// 		excepcion: '-',
	// 		oportunidad_estado_id: 8,
	// 		oportunidad_id: idOportunidad
	// 	};
	// 	dispatch(
	// 		postOportunidadTieneEstado(registro, enqueueSnackbar, () =>
	// 			history.push('/afp/crm/oportunidad/mantenimientoOportunidad/' + idOportunidad)
	// 		)
	// 	);
	// };

	let empresa = (() => {
		if (oportunidad && oportunidad.empresa) return oportunidad.empresa;
		else return {};
	})();

	const valueIni = {
		id: empresa.id,
		oportunidad_id: idOportunidad,
		monto_ingreso: cliente.monto_ingreso || '',
		departamento_laboral: cliente.departamento_laboral || '',
		cargo: cliente.cargo?.trim() || '',

		tipo_empresa: empresa.tipo_empresa?.trim() || '',
		Ruc: empresa.Ruc?.trim() || '',
		razon_social: empresa.razon_social?.trim() || '',

		provincia_id: empresa.provincia_id || '',
		provincia: empresa.provincia?.trim() || '',
		canton_id: empresa.canton_id || '',
		canton: empresa.canton?.trim() || '',
		parroquia_id: empresa.parroquia_id || '',
		parroquia: empresa.parroquia?.trim() || '',

		calle_principal: empresa.calle_principal?.trim(),
		numeracion: empresa.numeracion?.trim() || '',
		interseccion: empresa.interseccion?.trim(),
		codigo_postal: empresa.codigo_postal?.trim() || '',
		ciudadela: empresa.ciudadela?.trim() || '',
		etapa: empresa.etapa?.trim() || '',
		manzana: empresa.manzana?.trim() || '',
		solar: empresa.solar?.trim() || '',
		referencia: empresa.referencia?.trim() || '',
		edificio: empresa.edificio?.trim(),
		piso: empresa.piso?.trim() || '',
		departamento: empresa.departamento?.trim() || '',
		codigo_postal2: empresa.codigo_postal2?.trim() || '',
		email: empresa.email?.trim() || '',
		telefono: empresa.telefono?.trim() || '',
		extension: empresa.extension?.trim() || ''
	};

	let valdacionesEmpresa = {
		telefono: Yup.string()			
			.max(10, 'Máximo 10 caracteres')
			.matches(/^[0-9+\-]+$/gm, 'Solo se admiten números y + - como caracteres especiales')
			.required('Se requiere llenar este campo'),
		extension: Yup.string()
			.matches(/^[0-9+\-]+$/gm, 'Solo se admiten números y + - como caracteres especiales')
			.max(5, 'Máximo 5 caracteres')
			.nullable(),
		/* .required('Se requiere llenar este campo'), */
		email: Yup.string()
			.max(60, 'Máximo 60 caracteres')
			.email('Se requiere un correo válido').nullable(),
		/* .required('Se requiere llenar este campo'), */
		provincia_id: Yup.string().required('Se debe elegir una opción'),
		canton_id: Yup.string().required('Se debe elegir una opción'),
		parroquia_id: Yup.string().required('Se debe elegir una opción')
	};

	return (
		<Formik
			// validate={empresa ? false : true}
			enableReinitialize
			initialValues={valueIni}
			validationSchema={Yup.object().shape(
				{
					tipo_empresa: Yup.string().when([ 'id' ], {
						is: (id) => oportunidad && oportunidad.fondo_id != '000001',
						then: Yup.string().required('Se debe elegir una opción')
					}),
					Ruc: Yup.string()
						.min(13, 'El RUC ingresado es muy corto')
						.max(13, 'Máximo 13 caracteres')
						.matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales')
						.nullable(),
					razon_social: Yup.string()
						.max(50, 'Máximo 50 caracteres')
						// .matches(
						// 	/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
						// 	'Solo se admiten letras, números y # ° . - como caracteres especiales'
						// )
						.required('Se requiere llenar este campo'),
					...valdacionesEmpresa,
					calle_principal: Yup.string()
						.max(25, 'Máximo 25 caracteres')
						.nullable()
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'numeracion', 'interseccion', 'ciudadela', 'edificio' ], {
							is: (numeracion, interseccion, ciudadela, edificio) =>
								numeracion || interseccion || (!ciudadela && !edificio),
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					numeracion: Yup.string()
						.max(10, 'Máximo 10 caracteres')
						.nullable()
						// .matches(
						// 	/^[0-9Nn#Â°.,\- ]+$/gm,
						// 	'Solo se admiten las letras (N n), números y # Â° . , - como caracteres especiales'
						// )
						.when([ 'calle_principal' ], {
							is: (calle_principal) => calle_principal,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					interseccion: Yup.string()
						.max(25, 'Máximo 25 caracteres')
						.nullable()
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'calle_principal' ], {
							is: (calle_principal) => calle_principal,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					codigo_postal: Yup.string()
						.max(10, 'Máximo 10 caracteres')
						.nullable()
						.matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales'),
					ciudadela: Yup.string()
						.max(40, 'Máximo 40 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'etapa', 'manzana', 'solar', 'calle_principal', 'edificio' ], {
							is: (etapa, manzana, solar, calle_principal, edificio) =>
								etapa || manzana || solar || (!calle_principal && !edificio),
							then: Yup.string().required('Se requiere llenar este campo'),
							otherwise: Yup.string().nullable()
						}),
					etapa: Yup.string()
						.max(6, 'Máximo 6 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'ciudadela' ], {
							is: (ciudadela) => ciudadela,
							then: Yup.string().required('Se requiere llenar este campo'),
							otherwise: Yup.string().nullable()
						}),
					manzana: Yup.string()
						.max(4, 'Máximo 4 caracteres')
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'ciudadela' ], {
							is: (ciudadela) => ciudadela,
							then: Yup.string().required('Se requiere llenar este campo'),
							otherwise: Yup.string().nullable()
						}),
					solar: Yup.string()
						.max(6, 'Máximo 6 caracteres')
						.nullable()
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'ciudadela' ], {
							is: (ciudadela) => ciudadela,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					referencia: Yup.string()
						.max(60, 'Máximo 60 caracteres')
						.nullable(),
					edificio: Yup.string()
						.max(40, 'Máximo 40 caracteres')
						.nullable()
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'piso', 'departamento', 'calle_principal', 'ciudadela' ], {
							is: (piso, departamento, calle_principal, ciudadela) =>
								piso || departamento || (!calle_principal && !ciudadela),
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					piso: Yup.string()
						.max(3, 'Máximo 3 caracteres')
						.nullable()
						.matches(
							/^[0-9Nn#Â°.\- ]+$/gm,
							'Solo se admiten las letras (N n), números y # Â° . - como caracteres especiales'
						)
						.when([ 'edificio' ], {
							is: (edificio) => edificio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					departamento: Yup.string()
						.max(6, 'Máximo 6 caracteres')
						.nullable()
						.matches(
							/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.\- ]+$/gm,
							'Solo se admiten letras, números y # ° . - como caracteres especiales'
						)
						.when([ 'edificio' ], {
							is: (edificio) => edificio,
							then: Yup.string().required('Se requiere llenar este campo')
						}),
					codigo_postal2: Yup.string()
						.max(10, 'Máximo 10 caracteres')
						.nullable()
						.matches(/^[0-9\-]+$/gm, 'Solo se admiten números y - como caracteres especiales')
					/* .required('Se requiere llenar este campo'), */
				},
				[
					[ 'calle_principal', 'interseccion' ],
					[ 'calle_principal', 'numeracion' ],
					[ 'calle_principal', 'ciudadela' ],
					[ 'calle_principal', 'edificio' ],

					[ 'ciudadela', 'etapa' ],
					[ 'ciudadela', 'manzana' ],
					[ 'ciudadela', 'solar' ],
					[ 'ciudadela', 'calle_principal' ],
					[ 'ciudadela', 'edificio' ],

					[ 'edificio', 'piso' ],
					[ 'edificio', 'departamento' ],
					[ 'edificio', 'calle_principal' ],
					[ 'edificio', 'ciudadela' ]
				]
			)}
			onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				//

				values.empresa_id = empresa.id;

				let onSuccess = (idOportunidad) => {
					setSubmitting(false);
					// handleStatus(idOportunidad);
					history.push('/afp/crm/oportunidad/mantenimientoOportunidad/' + idOportunidad);
				};

				let onError = () => {
					setSubmitting(false);
					enqueueSnackbar('Hubo un error actualizando la información');
				};

				dispatch(updateEmpresaOportunidad(values, onSuccess, onError));
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
										{/* BUSCAR EMPRESA */}

										<Grid item md={4} xs={12}>
											<Field
												error={Boolean(touched.Ruc && errors.Ruc)}
												helperText={touched.Ruc && errors.Ruc}
												onBlur={handleBlur}
												//onChange={ev => updateEmpresa(ev, setFieldValue)}
												onChange={handleChange}
												value={values.Ruc}
												label="RUC"
												name="Ruc"
												id="Ruc"
												// endAdornment={
												// 	empresa.id && (
												// 		<InputAdornment position="start">
												// 			<Chip
												// 				label={'ID ' + empresa.id}
												// 				onDelete={() => {
												// 					handleClearEmpresa(setFieldValue);
												// 				}}
												// 				variant="outlined"
												// 			/>
												// 		</InputAdornment>
												// 	)
												// }
												component={renderTextField}
												// disabled
											/>
										</Grid>

										<Grid item md={oportunidad && oportunidad.fondo_id == '000001' ? 8 : 4} xs={12}>
											<Field
												error={Boolean(touched.razon_social && errors.razon_social)}
												helperText={touched.razon_social && errors.razon_social}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.razon_social}
												label="Razón Social"
												name="razon_social"
												id="razon_social"
												variant="outlined"
												fullWidth
												component={renderTextField}
												// disabled
											/>
										</Grid>

										{oportunidad &&
										oportunidad.fondo_id != '000001' && (
											<Grid item md={4} xs={12}>
												<Field
													error={Boolean(touched.tipo_empresa && errors.tipo_empresa)}
													helperText={touched.tipo_empresa && errors.tipo_empresa}
													onBlur={handleBlur}
													onChange={handleChange}
													label="Tipo de empresa"
													value={values.tipo_empresa}
													name="tipo_empresa"
													id="tipo_empresa"
													data={tipoEmpresas}
													component={renderSelectField}
												/>
											</Grid>
										)}

										<Grid item md={6} xs={12}>
											<Grid container spacing={2}>
												<Grid item md={12} xs={12}>
													<Grid container spacing={2}>
														<Grid item md={8} xs={12}>
															<Field
																error={Boolean(touched.telefono && errors.telefono)}
																helperText={touched.telefono && errors.telefono}
																onBlur={handleBlur}
																onChange={handleChange}
																value={values.telefono}
																label="Teléfono"
																name="telefono"
																id="telefono"
																variant="outlined"
																fullWidth
																component={renderTextField}
															/>
														</Grid>
														<Grid item md={4} xs={12}>
															<Field
																error={Boolean(touched.extension && errors.extension)}
																helperText={touched.extension && errors.extension}
																onBlur={handleBlur}
																onChange={handleChange}
																value={values.extension}
																label="Ext."
																name="extension"
																id="extension"
																variant="outlined"
																fullWidth
																component={renderTextField}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.email && errors.email)}
												helperText={touched.email && errors.email}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.email}
												label="Correo"
												name="email"
												id="email"
												variant="outlined"
												fullWidth
												component={renderTextField}
												disabled={empresa && empresa.editable == false}
											/>
										</Grid>
										<Grid item md={4} xs={12}>
											<Field
												error={Boolean(touched.provincia_id && errors.provincia_id)}
												helperText={touched.provincia_id && errors.provincia_id}
												onBlur={handleBlur}
												onChange={(event) => {
													let nombreProvincia =
														event.target.options[event.target.selectedIndex].text;

													handleChange(event);
													dispatch(getCatalogoCantones(event.target.value, 'empresa'));
													setFieldValue('provincia', nombreProvincia);
												}}
												label="Provincia"
												value={values.provincia_id}
												name="provincia_id"
												id="provincia_id"
												data={provincias}
												disabled={empresa && empresa.editable == false}
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
														event.target.options[event.target.selectedIndex].text;

													handleChange(event);
													dispatch(getCatalogoParroquias(event.target.value, 'empresa'));
													setFieldValue('canton', nombreCanton);
												}}
												label="Cantón"
												name="canton_id"
												id="canton_id"
												value={values.canton_id || ''}
												data={cantonesEmpresa}
												component={renderSelectField}
												disabled={empresa && empresa.editable == false}
											/>
										</Grid>
										<Grid item md={4} xs={12}>
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
												data={parroquiasEmpresa}
												component={renderSelectField}
												disabled={empresa && empresa.editable == false}
											/>
										</Grid>

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
												error={Boolean(touched.cargo && errors.cargo)}
												helperText={touched.cargo && errors.cargo}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.cargo}
												label="Cargo Actividad"
												name="cargo"
												id="cargo"
												component={renderTextField}
											/>
										</Grid>

										{/* DPTO LABORAL */}

										<Grid item md={4} xs={12}>
											<Field
												error={Boolean(
													touched.departamento_laboral && errors.departamento_laboral
												)}
												helperText={touched.departamento_laboral && errors.departamento_laboral}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.departamento_laboral}
												label="Dpto. Laboral"
												name="departamento_laboral"
												id="departamento_laboral"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						<Box mt={3}>
							<Card>
								<CardHeader title="Ubicación de Actividad" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.calle_principal && errors.calle_principal)}
												helperText={touched.calle_principal && errors.calle_principal}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.calle_principal}
												label="Calle Principal"
												name="calle_principal"
												id="calle_principal"
												variant="outlined"
												fullWidth
												disabled={empresa && empresa.editable == false}
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<TextField
												error={Boolean(touched.numeracion && errors.numeracion)}
												helperText={touched.numeracion && errors.numeracion}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.numeracion}
												label="Numeración"
												name="numeracion"
												id="numeracion"
												variant="outlined"
												fullWidth
												disabled={empresa && empresa.editable == false}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.interseccion && errors.interseccion)}
												helperText={touched.interseccion && errors.interseccion}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.interseccion}
												label="Intersección"
												name="interseccion"
												id="interseccion"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.codigo_postal && errors.codigo_postal)}
												helperText={touched.codigo_postal && errors.codigo_postal}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.codigo_postal}
												label="Codigo Postal"
												name="codigo_postal"
												id="codigo_postal"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.ciudadela && errors.ciudadela)}
												helperText={touched.ciudadela && errors.ciudadela}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.ciudadela}
												label="Ciudadela/Cooperativa/Sector"
												name="ciudadela"
												id="ciudadela"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.etapa && errors.etapa)}
												helperText={touched.etapa && errors.etapa}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.etapa}
												label="Etapa"
												name="etapa"
												id="etapa"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.manzana && errors.manzana)}
												helperText={touched.manzana && errors.manzana}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.manzana}
												label="Manzana"
												name="manzana"
												id="manzana"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.solar && errors.solar)}
												helperText={touched.solar && errors.solar}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.solar}
												label="Solar"
												name="solar"
												id="solar"
												variant="outlined"
												fullWidth
												disabled={empresa && empresa.editable == false}
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={12} xs={12}>
											<Field
												error={Boolean(touched.referencia && errors.referencia)}
												helperText={touched.referencia && errors.referencia}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.referencia}
												label="Referencia"
												name="referencia"
												id="referencia"
												multiline
												variant="outlined"
												fullWidth
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
												error={Boolean(touched.edificio && errors.edificio)}
												helperText={touched.edificio && errors.edificio}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.edificio}
												label="Edificio"
												name="edificio"
												id="edificio"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.piso && errors.piso)}
												helperText={touched.piso && errors.piso}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.piso}
												label="Piso"
												name="piso"
												id="piso"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(touched.departamento && errors.departamento)}
												helperText={touched.departamento && errors.departamento}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.departamento}
												label="No. Departamento"
												name="departamento"
												id="departamento"
												variant="outlined"
												fullWidth
												component={renderTextField}
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<Field
												error={Boolean(
													touched.codigo_postal_edificio && errors.codigo_postal_edificio
												)}
												helperText={
													touched.codigo_postal_edificio && errors.codigo_postal_edificio
												}
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.codigo_postal_edificio}
												label="Codigo Postal"
												name="codigo_postal_edificio"
												id="codigo_postal_edificio"
												variant="outlined"
												fullWidth
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
				);
			}}
		</Formik>
	);
};

export default EmpresaOportunity;

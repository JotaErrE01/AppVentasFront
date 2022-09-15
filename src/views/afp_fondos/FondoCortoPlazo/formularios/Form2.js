import React, { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Field, FieldArray } from 'formik';
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
	makeStyles,
	Breadcrumbs,
	Container,
	Typography,
	LinearProgress
} from '@material-ui/core';
import usesStyles from 'src/views/afp_cliente/ClienteCreateAndEditarView/usesStyles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

// import TipoCuentaBancariaCB from '../../../JSON_CATALOGOS/TIPO_CUENTA_BANCARIA_CB';

import renderTextField from '../../../../components/FormElements/InputText';
import renderSelectField from '../../../../components/FormElements/InputSelect';
import { getCatalogoBancos, getCatalogoTipoCuentas } from 'src/slices/catalogos';
import { useDispatch, useSelector } from 'src/store';

import Page from 'src/components/Page';
import { Link, Link as RouterLink, useHistory, useParams, useLocation } from 'react-router-dom';

import { getFondoAporteEdit, setOportunidad } from 'src/slices/clientes';
import { updateFondo } from 'src/slices/fondoLargoPlazo';
import { useSnackbar } from 'notistack';
import { debug } from 'request';
import { postOportunidadTieneEstado } from 'src/slices/oportunidad';
import Referencias from './Referencias';

const defaultState = {
	entidad_bancaria: '',
	tipo_cuenta: '',
	antiguedad_anios: '',
	antiguedad_meses: '',
	numero_cuenta: '',
	saldos_creditos: ''
};

const Form2 = ({ setPage }) => {
	const UsesStyles = { usesStyles };
	const classes = UsesStyles.usesStyles();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();

	const { Oportunidad: oportunidad, ConsultarData: cliente } = useSelector((state) => state.cliente);

	const { loadingSubmit } = useSelector((state) => state.fondoLargoPlazo);

	let { bancos, tipoCuentas } = useSelector((state) => state.catalogo);

	let { idOportunidad, codigoFondo } = useParams();

	useEffect(
		() => {
			try {
				dispatch(getCatalogoBancos());
				// dispatch(getCatalogoTipoCuentas());

				if (idOportunidad && oportunidad && idOportunidad != oportunidad.id) {
					dispatch(setOportunidad({}));
					dispatch(getFondoAporteEdit(idOportunidad));
				}
			} catch (err) {
				console.error(err);
			}
		},
		[ dispatch ]
	);

	const submitPreviusPage = () => {
		history.replace(
			`/afp/crm/oportunidad/editar/registroOportunidad/${oportunidad.id}/cortoPlazo/${oportunidad.fondo_id}`
		);
		return;
	};

	const sendValues = (values) => {
		const onSuccess = (idOportunidad, mensaje) => {
			enqueueSnackbar(mensaje, { variant: 'success' });

			setPage(3);
			history.push(
				'/afp/crm/oportunidad/editar/registroOportunidad/' + idOportunidad + '/cortoPlazo/' + codigoFondo + '/3'
			);

			// handleStatus();
		};

		// let idOportunidad = oportunidad && oportunidad.aporte && oportunidad.aporte.id;

		var body = {
			...oportunidad,
			...values,
			codigo_fondo: oportunidad.fondo_id,
			idAporteCliente: oportunidad && oportunidad.aporte && oportunidad.aporte.id,
			numero_identificacion: cliente.numero_identificacion,
			plazo: 'corto'
		};

		dispatch(updateFondo(body, onSuccess));
	};

	let referenciasValue = (() => {
		if (oportunidad && oportunidad.referencias && oportunidad.referencias.length > 0) {
			return oportunidad.referencias.map((referencia) => {
				return {
					...referencia,
					entidad_bancaria: referencia.entidad,
					antiguedad_anios: referencia.antiguedad_anios,
					antiguedad_meses: referencia.antiguedad_meses,
					saldos_creditos: referencia.saldos
				};
			});
		}

		return [ defaultState ];
	})();

	const handleStatus = () => {
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

	const initValues = {
		ingreso_mensual: oportunidad && oportunidad.ingreso_mensual ? oportunidad.ingreso_mensual : '',
		egreso_mensual: oportunidad && oportunidad.egreso_mensual ? oportunidad.egreso_mensual : '',
		otros_ingresos: oportunidad && oportunidad.otros_ingresos ? oportunidad.otros_ingresos : '',
		activos: oportunidad && oportunidad.activos ? oportunidad.activos : '',
		pasivos: oportunidad && oportunidad.pasivos ? oportunidad.pasivos : '',
		patrimonio: oportunidad && oportunidad.patrimonio ? oportunidad.patrimonio : '',
		concepto_otros_ingresos:
			oportunidad && oportunidad.concepto_otros_ingresos ? oportunidad.concepto_otros_ingresos : '',
		trans_internacionales: oportunidad && oportunidad.trans_internacionales ? 1 : 0,
		referenciasValue
	};

	let validacionReferencias = {
		referenciasValue: Yup.array().of(
			Yup.object().shape(
				{
					saldos_creditos: Yup.string()
						.matches(/\d+(.\d+)?/, 'Solo se admiten cantidades con 2 decimales')
						.nullable(),
					entidad_bancaria: Yup.string().required('Se requiere llenar este campo'),
					tipo_cuenta: Yup.string().required('Se requiere llenar este campo'),
					numero_cuenta: Yup.string()
						.matches(/^[0-9]+$/gm, 'Solo se admiten números')
						.required('Se requiere llenar este campo'),
					antiguedad_anios: Yup.string()
						.matches(/^[0-9]+$/gm, 'Solo se admiten números')
						.when('antiguedad_meses', {
							is: (val) => !val,
							then: Yup.string().required('Se requiere llenar este campo'),
							otherwise: Yup.string()
						}),
					antiguedad_meses: Yup.string()
						.matches(/^[0-9]+$/gm, 'Solo se admiten números')
						.when('antiguedad_anios', {
							is: (val) => !val,
							then: Yup.string().required('Se requiere llenar este campo'),
							otherwise: Yup.string()
						})
				},
				[ [ 'antiguedad_anios', 'antiguedad_meses' ] ]
			)
		)
	};

	let validacionSituacionEconomica = Yup.string()
		.matches(/\d+(.\d+)?/, 'Solo se admiten cantidades con 2 decimales')
		.required('Se requiere llenar este campo');

	return (
		<Formik
			initialValues={initValues}
			enableReinitialize={true}
			validationSchema={Yup.object().shape({
				ingreso_mensual: validacionSituacionEconomica,
				egreso_mensual: validacionSituacionEconomica,
				otros_ingresos: Yup.string().matches(/\d+(.\d+)?/, 'Solo se admiten cantidades con 2 decimales'),
				activos: validacionSituacionEconomica,
				pasivos: validacionSituacionEconomica,
				patrimonio: validacionSituacionEconomica,
				concepto_otros_ingresos: Yup.string()
					.matches(
						/^[0-9a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü#°.,\- ]+$/gm,
						'Solo se admiten letras, números y # ° . , - como caracteres especiales'
					)
					.when('otros_ingresos', (otros_ingresos, schema) => {
						if (otros_ingresos && typeof otros_ingresos === 'string' && otros_ingresos != 0)
							return schema.required('Se requiere llenar este campo');

						return schema;
					}),
				trans_internacionales: Yup.string(),
				...validacionReferencias
			})}
			onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				try {
					sendValues(values);
					setStatus({ success: true });
					setSubmitting(false);
				} catch (err) {
					console.error(err);
					setStatus({ success: false });
					setErrors({ submit: err.message });
					setSubmitting(false);
				}
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
				<form onSubmit={handleSubmit}>
					{/* Card 1 */}
					<Box mt={3}>
						<Card>
							<CardHeader title="Situación Económica" />
							<Divider />
							<CardContent>
								{/* Elemento 1 */}
								<Grid container spacing={2}>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(touched.ingreso_mensual && errors.ingreso_mensual)}
											helperText={touched.ingreso_mensual && errors.ingreso_mensual}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.ingreso_mensual}
											label="Ingresos Mensual USD$"
											name="ingreso_mensual"
											id="ingreso_mensual"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(touched.egreso_mensual && errors.egreso_mensual)}
											helperText={touched.egreso_mensual && errors.egreso_mensual}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.egreso_mensual}
											label="Egresos Mensuales USD$"
											name="egreso_mensual"
											id="egreso_mensual"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(touched.otros_ingresos && errors.otros_ingresos)}
											helperText={touched.otros_ingresos && errors.otros_ingresos}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.otros_ingresos}
											label="Otros Ingresos USD$"
											name="otros_ingresos"
											id="otros_ingresos"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(touched.activos && errors.activos)}
											helperText={touched.activos && errors.activos}
											onBlur={handleBlur}
											onChange={(e) => {
												handleChange(e);
												setFieldValue('patrimonio', e.target.value - values.pasivos);
											}}
											value={values.activos}
											label="Activos"
											name="activos"
											id="activos"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(touched.pasivos && errors.pasivos)}
											helperText={touched.pasivos && errors.pasivos}
											onBlur={handleBlur}
											onChange={(e) => {
												handleChange(e);
												setFieldValue('patrimonio', values.activos - e.target.value);
											}}
											onKeyUp={() => setFieldValue('patrimonio', values.activos - values.pasivos)}
											value={values.pasivos}
											label="Pasivos"
											name="pasivos"
											id="pasivos"
											component={renderTextField}
										/>
									</Grid>
									<Grid item md={4} xs={12}>
										<Field
											error={Boolean(touched.patrimonio && errors.patrimonio)}
											helperText={touched.patrimonio && errors.patrimonio}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.patrimonio}
											label="Patrimonio"
											name="patrimonio"
											id="patrimonio"
											component={renderTextField}
											disabled
										/>
									</Grid>
									<Grid item md={12} xs={12}>
										<TextField
											error={Boolean(
												touched.concepto_otros_ingresos && errors.concepto_otros_ingresos
											)}
											helperText={
												touched.concepto_otros_ingresos && errors.concepto_otros_ingresos
											}
											onBlur={handleBlur}
											onChange={handleChange}
											value={values.concepto_otros_ingresos}
											label="Concepto Otros Ingresos"
											name="concepto_otros_ingresos"
											id="concepto_otros_ingresos"
											multiline
											variant="outlined"
											fullWidth
										/>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>
					<Box mt={3}>
						<Referencias
							{...{
								errors,
								handleBlur,
								handleChange,
								touched,
								values,
								setFieldValue,
								tipoCuentas,
								bancos
							}}
							max={2}
						/>
					</Box>
					<Box mt={3}>
						<Card className={classes.SeparateButtons}>
							<CardContent>
								<Fragment>
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<Typography
												className={classes.SeparateText}
												variant="body1"
												color="textPrimary"
											>
												{' '}
												¿Realiza transacciones internacionales?{' '}
											</Typography>
										</Grid>
										<Grid item md={6} xs={12}>
											<Grid container spacing={2}>
												{[
													{ codigo: 1, contenido: 'SI' },
													{ codigo: 0, contenido: 'NO' }
												].map((opcion) => (
													<Grid item md={6} xs={12}>
														<Button
															className={
																values.trans_internacionales == opcion.codigo ? (
																	classes.ColorButtonOnSelect
																) : (
																	classes.ColorButtonOffSelect
																)
															}
															onClick={() =>
																setFieldValue('trans_internacionales', opcion.codigo)}
															fullWidth
															size="large"
															variant="contained"
														>
															{opcion.contenido}
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

					{/* botones */}
					<Box mt={3}>
						<Grid container>
							<Grid item md={12} xs={12}>
								<Grid container spacing={2}>
									<Grid item md={6} xs={12}>
										<Button
											className={classes.ButtonBlack}
											onClick={() => {
												setPage(1);
												// history.re
												history.replace(
													'/afp/crm/oportunidad/editar/registroOportunidad/' +
														idOportunidad +
														'/cortoPlazo/' +
														codigoFondo +
														'/1'
												);
											}}
											fullWidth
											size="large"
											type="button"
											variant="contained"
											disabled={loadingSubmit}
										>
											<ArrowBackIcon /> Atrás
										</Button>
									</Grid>

									<Grid item md={6} xs={12}>
										{loadingSubmit ? (
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
							</Grid>
						</Grid>
					</Box>
				</form>
			)}
		</Formik>
	);
};

export default Form2;

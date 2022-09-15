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
	FormHelperText,
	Grid,
	// Link,
	TextField,
	CircularProgress,
	LinearProgress,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	ListItem,
	ListItemIcon,
	ListItemText,
	Checkbox
} from '@material-ui/core';

import {
	getClienteById,
	getFondoAporteEdit,
	getOportunidadBeneficiosAdicionales,
	setOportunidad
} from 'src/slices/clientes';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import renderTextField from 'src/components/FormElements/InputText';

import { getCatalogoFondoHorizonte, getCatalogoFondoInversion, getCatalogosFondos } from 'src/slices/catalogos';

import { Fragment } from 'react';

import MontosInversion from './MontosInversion';
import { crearFondo, updateFondo } from 'src/slices/fondoLargoPlazo';

import Beneficiarios from './Beneficiarios';
import usesStyles from '../../../afp_cliente/ClienteCreateAndEditarView/usesStyles';
import InputRadio from 'src/components/FormElements/InputRadio';
import * as dayjs from 'dayjs';

let origenes = [
	{
		codigo: 'C',
		contenido: 'Capital de Trabajo'
	},
	{
		codigo: 'M',
		contenido: 'Actividad Mercantil'
	},
	{
		codigo: 'E',
		contenido: 'Enviado por familiares'
	},
	{
		codigo: 'R',
		contenido: 'Remuneración (Rel. Dep)'
	},
	{
		codigo: 'A',
		contenido: 'Ahorros'
	}
];

const FormMaster = ({ setPage }) => {
	const dispatch = useDispatch();
	const history = useHistory();

	const classes = usesStyles();

	const { enqueueSnackbar } = useSnackbar();
	const [ waringGenerico, setWaringGenerico ] = useState();
	// const { cliente } = useSelector((state) => state.cliente.FondoAporteEditar);
	const _catAeInversion = useSelector((state) => state.catalogo.aeInversion);

	const {
		Oportunidad: oportunidad,
		loadingBeneficiosAdicionales,
		ConsultarData: cliente,
		loadingOportunidad
	} = useSelector((state) => state.cliente);

	const { loadingSubmit } = useSelector((state) => state.fondoLargoPlazo);

	let { fondoHorizonte = [], fondoInversion = [], valorUnidad, tipoTitulares } = useSelector(
		(state) => state.catalogo
	);

	let { idCliente, codigoFondo, idOportunidad } = useParams();

	useEffect(
		() => {
			if (fondoHorizonte && fondoHorizonte.length == 0) {
				dispatch(getCatalogoFondoHorizonte());
			}

			if (fondoHorizonte && fondoInversion.length == 0) {
				dispatch(getCatalogoFondoInversion());
			}

			// dispatch(getCatalogoNacionalidad());
			// dispatch(getCatalogoProvincias());

			if (idCliente && idCliente != cliente.id) {
				dispatch(getClienteById(idCliente));
			} else if (idOportunidad && oportunidad && idOportunidad != oportunidad.id) {
				dispatch(setOportunidad({}));
				dispatch(getFondoAporteEdit(idOportunidad));
			}

			dispatch(getCatalogosFondos(codigoFondo));
		},
		[ cliente ]
	);

	const identification = useSelector((state) => state.cliente.ConsultarData.numero_identificacion);

	let { paises, nacionalidades, parentescos } = useSelector((state) => state.catalogo);

	// const nameRoute = history.location.pathname;
	const location = useLocation();

	const SendValues = (values, onSuccess) => {
		let beneficiariosValues = values.beneficiariosValues.filter(
			(beneficiario) => beneficiario.nombre && beneficiario.apellido && beneficiario.numero_identificacion
		);

		var body = {
			...values,
			beneficiariosValues,
			codigo_fondo: codigoFondo,
			id_cliente: idCliente,
			idAporteCliente: oportunidad && oportunidad.aporte && oportunidad.aporte.id,
			numero_identificacion: identification,
			plazo: 'corto'
		};

		let idOportunidad = oportunidad && oportunidad.aporte && oportunidad.aporte.id;

		!idOportunidad ? dispatch(crearFondo(body, onSuccess)) : dispatch(updateFondo(body, onSuccess));
	};

	let tipo_titular = (() => {
		if (typeof oportunidad.es_participe == 'undefined') {
			return '01';
		}

		return oportunidad.es_participe ? '01' : '02';
	})();

	const initialValuesCreate = {
		cheque:
			oportunidad && oportunidad.cheque && oportunidad.aporte.cheque !== undefined
				? oportunidad.aporte.cheque
				: '',
		deposito_bancario:
			oportunidad && oportunidad.deposito_bancario && oportunidad.aporte.deposito_bancario !== undefined
				? oportunidad.aporte.deposito_bancario
				: '',
		traspaso:
			oportunidad && oportunidad.traspaso && oportunidad.aporte.traspaso !== undefined
				? oportunidad.aporte.traspaso
				: '',
		transferencia:
			oportunidad && oportunidad.transferencia && oportunidad.aporte.transferencia !== undefined
				? oportunidad.aporte.transferencia
				: '',
		beneficiariosValues: [],
		actividad_economica: null,

		origen_fondos: '',
		valor_unidad: valorUnidad && valorUnidad.contenido,
		// valor_unidad: 0.123,
		otros_origenes: '',

		// es_participe: 1,
		acepta_arbitraje_comercial: 1,
		tipo_titular: tipo_titular,

		submit: null
	};

	const beneficiarios = [];

	if (oportunidad && oportunidad.beneficiarios_seguro_vida) {
		oportunidad.beneficiarios_seguro_vida.forEach((item) => {
			let fecha_expiracion = null;

			if (item.fecha_expiracion) {
				fecha_expiracion = dayjs(item.fecha_expiracion.substring(0, 10));
				fecha_expiracion = fecha_expiracion.toDate();
			}

			var beneficiarioSeguroVida = {
				id: item.id,
				nombre: item.nombre,
				apellido: item.apellido,
				numero_identificacion: item.numero_identificacion,
				fecha_expiracion,
				parentesco: item.parentesco_id,
				pais_nacimiento: item.pais_nacimiento,
				nacionalidad: item.nacionalidad,
				nacionalidad2: item.nacionalidad2,
				nacionalidad3: item.nacionalidad3
			};
			beneficiarios.push(beneficiarioSeguroVida);
		});
	}

	const initialValuesEdit = {
		cheque:
			oportunidad && oportunidad.aporte && oportunidad.aporte.cheque !== undefined
				? oportunidad.aporte.cheque
				: '',
		deposito_bancario:
			oportunidad && oportunidad.aporte && oportunidad.aporte.deposito_bancario !== undefined
				? oportunidad.aporte.deposito_bancario
				: '',
		traspaso:
			oportunidad && oportunidad.aporte && oportunidad.aporte.traspaso !== undefined
				? oportunidad.aporte.traspaso
				: '',
		transferencia:
			oportunidad && oportunidad.aporte && oportunidad.aporte.transferencia !== undefined
				? oportunidad.aporte.transferencia
				: '',
		beneficiariosValues: oportunidad ? beneficiarios : [],
		actividad_economica: oportunidad.actividad_economica || '',

		origen_fondos: oportunidad && oportunidad.origen_fondos,
		valor_unidad: oportunidad && oportunidad.valor_unidad,
		otros_origenes: oportunidad && oportunidad.origen_fondos == 'Otros' ? oportunidad.otros_origenes : '',

		// es_participe: oportunidad && oportunidad.es_participe,
		acepta_arbitraje_comercial: oportunidad && oportunidad.acepta_arbitraje_comercial,
		tipo_titular: tipo_titular
	};

	let nombreValidate = Yup.string()
		.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
		.min(2, 'Debe de tener al menos 2 caracteres')
		.required('Se requiere llenar este campo');

	let numberValidate = Yup.string().matches(/\d+(.\d+)?/, 'Solo se admiten cantidades con 2 decimales').nullable();
	// .required('Se requiere llenar este campo');

	// TODO: verificar validacion de cedula
	let validacionBeneficiarios = {
		beneficiariosValues: Yup.array().of(
			Yup.object().shape(
				{
					nombre: Yup.string().nullable().when([ 'apellido', 'numero_identificacion' ], {
						is: (apellido, numero_identificacion) => apellido || numero_identificacion,
						then: Yup.string()
							.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
							.min(2, 'Debe de tener al menos 2 caracteres')
							.required('Se requiere llenar este campo')
					}),
					apellido: Yup.string().nullable().when([ 'nombre', 'numero_identificacion' ], {
						is: (apellido, numero_identificacion) => apellido || numero_identificacion,
						then: Yup.string()
							.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
							.min(2, 'Debe de tener al menos 2 caracteres')
							.required('Se requiere llenar este campo')
					}),
					numero_identificacion: Yup.string().nullable().when([ 'nombre', 'apellido' ], {
						is: (apellido, numero_identificacion) => apellido || numero_identificacion,
						then: Yup.string()
							.required('Se requiere llenar este campo')
							.min(10, 'El dato ingresado es muy corto')
							.max(10, 'El dato ingresado es muy largo')
							.matches(/^[0-9]+$/gm, 'Solo se admiten números!')
							.test('validar identificación con tipo de identificacion', 'Cédula no válida', function(
								value
							) {
								var tipo_documento = this.parent.tipo_documento;
								if (typeof value === 'string' && value.length === 10 && tipo_documento === 'C') {
									var digits = value.split('').map(Number);
									var provincialCode = digits[0] * 10 + digits[1];
									if (provincialCode >= 1 && (provincialCode <= 24 || provincialCode === 30)) {
										var checkerDigit = digits.pop();
										var calculatedDigit =
											digits.reduce((previousValue, currentValue, index) => {
												var isNine = currentValue === 9 ? 1 : 0;
												return (
													previousValue - (currentValue * (2 - index % 2)) % 9 - isNine * 9
												);
											}, 1000) % 10;
										if (calculatedDigit !== checkerDigit) {
											return false;
										}
									} else {
										return false;
									}
								}
								return true;
							})
					}),
					fecha_expiracion: Yup.date().nullable(),
					parentesco: Yup.string().nullable(),
					pais_nacimiento: Yup.string().nullable(),
					nacionalidad: Yup.string().nullable(),
					nacionalidad2: Yup.string().nullable(),
					nacionalidad3: Yup.string().nullable()
				},
				[
					[ 'nombre', 'apellido' ],
					[ 'nombre', 'numero_identificacion' ],
					[ 'apellido', 'numero_identificacion' ]
				]
			)
		)
	};

	const fondo = (() => {
		if (oportunidad && oportunidad.fondo_id) {
			let fondo = fondoHorizonte.find((item) => item.codigo == oportunidad.fondo_id);

			if (fondo) return fondo;

			fondo = fondoInversion.find((item) => item.codigo == oportunidad.fondo_id);

			if (fondo) return fondo;
		} else if (codigoFondo) {
			let fondo = fondoHorizonte.find((item) => item.codigo == codigoFondo);

			if (fondo) return fondo;

			fondo = fondoInversion.find((item) => item.codigo == codigoFondo);

			if (fondo) return fondo;
		}

		return {};
	})();

	let total = (() => {
		let _total = 0;

		if (oportunidad && oportunidad.aporte) {
			_total =
				(+oportunidad.aporte.cheque || 0) +
				(+oportunidad.aporte.deposito_bancario || 0) +
				(+oportunidad.aporte.traspaso || 0) +
				(+oportunidad.aporte.transferencia || 0) +
				(+oportunidad.aporte.monto_prima || 0);
		}

		return _total.toFixed(2);
	})();

	return (
		<Fragment>
			<HeaderFondo
				amountHeader={total}
				loading={loadingBeneficiosAdicionales || loadingOportunidad}
				fondo={fondo}
			/>
			<Formik
				initialValues={location.pathname.includes('crear') ? initialValuesCreate : initialValuesEdit}
				enableReinitialize
				validationSchema={Yup.object().shape({
					cheque: numberValidate,
					deposito_bancario: numberValidate,
					traspaso: numberValidate,
					transferencia: numberValidate,
					actividad_economica: Yup.string().required('Se debe elegir una opción'),
					origen_fondos: Yup.string().required('Se requiere rellenar esta información'),
					// inicio_debito: Yup.string().required('Se requiere rellenar esta información'),
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
					...validacionBeneficiarios
				})}
				validate={(values) => {
					setWaringGenerico();

					if (total == 0) {
						setWaringGenerico('Debes ingresar al menos un valor');

						return { cheque: true, deposito_bancario: true, transferencia: true, traspaso: true };
					}
				}}
				onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
					try {
						setSubmitting(true);

						const onSuccess = (idOportunidad, mensaje) => {
							resetForm();
							setStatus({ success: true });
							setSubmitting(false);
							enqueueSnackbar(mensaje, {
								variant: 'success'
							});
							setPage(2);
							history.push(
								'/afp/crm/oportunidad/editar/registroOportunidad/' +
									idOportunidad +
									'/cortoPlazo/' +
									codigoFondo +
									'/2'
							);
						};

						SendValues(values, onSuccess);
					} catch (err) {
						console.error(err);
						setStatus({ success: false });
						setErrors({ submit: err.message });
						setSubmitting(false);
					}
				}}
			>
				{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, setFieldValue, values }) => {
					return (
						<form onSubmit={handleSubmit}>
							<Box mt={3}>
								<MontosInversion
									{...{
										errors,
										handleBlur,
										touched,
										values,
										waringGenerico
									}}
									handleChange={(e) => {
										let _aporte = { ...oportunidad.aporte };
										_aporte[e.target.name] = e.target.value;
										dispatch(setOportunidad({ ...oportunidad, aporte: _aporte }));
										handleChange(e);
									}}
								/>
							</Box>

							{/* ACTIVIDAD ECONOMICA */}

							<Box mt={3}>
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
													id="actividad_economica"
													name="actividad_economica"
													// value={_.filter(_catAeInversion, {codigo: values.actividad_economica})[0]}
													value={(() => {
														let filtered = _.filter(_catAeInversion, {
															codigo: values.actividad_economica
														});
														return filtered.length > 0 ? filtered[0] : {};
													})()}
													options={_catAeInversion.map((op) => {
														return { ...op, contenido: op.codigo + ' - ' + op.contenido };
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
														<TextField
															{...params}
															onBlur={handleBlur}
															label="Actividad Económica"
															variant="outlined"
															error={Boolean(
																touched.actividad_economica &&
																	errors.actividad_economica
															)}
															helperText={
																touched.actividad_economica &&
																errors.actividad_economica
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
							<Box mt={3}>
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
															if (e.target.value != 'O') {
																setFieldValue('otros_origenes', '');
															}
															handleChange(e);
														}}
													>
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
															inputProps={{ 'aria-label': 'O' }}
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

							<Box mt={3}>
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

							<Box mt={3}>
								<Card className={classes.SeparateButtons}>
									<CardContent>
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
													// disabled
													component={renderTextField}
												/>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Box>

							<Box mt={3}>
								<Beneficiarios
									{...{
										errors,
										handleBlur,
										handleChange,
										touched,
										values,
										setFieldValue,
										paises,
										nacionalidades,
										parentescos
									}}
									max={codigoFondo == '000040' ? 1 : 4}
								/>
							</Box>

							{/* ARBITRAJE */}
							<Box mt={3}>
								<Card>
									<CardHeader title="Arbitraje" />
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
															onChange={() =>
																setFieldValue('acepta_arbitraje_comercial', 1)}
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
															onChange={() =>
																setFieldValue('acepta_arbitraje_comercial', 0)}
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

							<Box mt={3}>
								<Grid container spacing={2}>
									<Grid item md={6} xs={12} />
									<Grid item md={6} xs={12}>
										{loadingSubmit ? (
											<LinearProgress />
										) : (
											<Button
												style={{ background: 'black', color: 'white' }}
												disabled={isSubmitting}
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
		</Fragment>
	);
};

export default FormMaster;

const HeaderFondo = ({ amountHeader, loading, fondo }) => {
	const classes = useStyles();

	return (
		<Box mt={3}>
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
							FONDO DE INVERSIONES A CORTO PLAZO - ${amountHeader}
						</Typography>
						<Typography variant="subtitle2" color="textSecondary">
							{fondo.contenido}
						</Typography>
						{loading && <LinearProgress />}
					</CardContent>
				</div>
			</Card>
		</Box>
	);
};

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'flex',
		// margin: '1.5em 1.5em',
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

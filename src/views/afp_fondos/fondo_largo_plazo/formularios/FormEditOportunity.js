import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Field, FieldArray } from 'formik';
import { useDispatch, useSelector } from 'src/store';
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
	TextField
} from '@material-ui/core';
import { Select, CheckboxWithLabel } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import parentesco from 'src/views/JSON_CATALOGOS/PARENTESCO';
import { getFondoAporteUpdate } from 'src/slices/clientes';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const getTipoParentesco = (id) => {
	if (id !== undefined && parentesco[id - 1]) {
		return parentesco[id - 1].codigo;
	} else {
		return '01';
	}
};
function Row({ index, handleChange, onRemove, nombre, apellido, email, parentesco_id, errors, touched }) {
	return (
		<div>
			<Grid container spacing={2}>
				<Grid item md={6} xs={12}>
					<TextField
						error={Boolean(
							touched &&
								touched.seguroVidaValues &&
								touched.seguroVidaValues[index] &&
								touched.seguroVidaValues[index].nombre &&
								errors &&
								errors.seguroVidaValues &&
								errors.seguroVidaValues[index] &&
								errors.seguroVidaValues[index].nombre
						)}
						helperText={
							touched &&
							touched.seguroVidaValues &&
							touched.seguroVidaValues[index] &&
							touched.seguroVidaValues[index].nombre &&
							errors &&
							errors.seguroVidaValues &&
							errors.seguroVidaValues[index] &&
							errors.seguroVidaValues[index].nombre
						}
						fullWidth
						label="Nombres"
						name={`seguroVidaValues.${index}.nombre`}
						onChange={handleChange}
						defaultValue={nombre}
						variant="outlined"
					/>
				</Grid>
				<Grid item md={6} xs={12}>
					<TextField
						error={Boolean(
							touched &&
								touched.seguroVidaValues &&
								touched.seguroVidaValues[index] &&
								touched.seguroVidaValues[index].apellido &&
								errors &&
								errors.seguroVidaValues &&
								errors.seguroVidaValues[index] &&
								errors.seguroVidaValues[index].apellido
						)}
						helperText={
							touched &&
							touched.seguroVidaValues &&
							touched.seguroVidaValues[index] &&
							touched.seguroVidaValues[index].apellido &&
							errors &&
							errors.seguroVidaValues &&
							errors.seguroVidaValues[index] &&
							errors.seguroVidaValues[index].apellido
						}
						fullWidth
						label="Apellidos "
						name={`seguroVidaValues.${index}.apellido`}
						//onBlur={handleBlur}
						onChange={handleChange}
						defaultValue={apellido}
						variant="outlined"
					/>
				</Grid>
			</Grid>
			<Box mt={2}>
				<Grid container spacing={2}>
					<Grid item md={6} xs={12}>
						<TextField
							name={`seguroVidaValues.${index}.parentesco_id`}
							error={Boolean(
								touched &&
									touched.seguroVidaValues &&
									touched.seguroVidaValues[index] &&
									touched.seguroVidaValues[index].parentesco_id &&
									errors &&
									errors.seguroVidaValues &&
									errors.seguroVidaValues[index] &&
									errors.seguroVidaValues[index].parentesco_id
							)}
							helperText={
								touched &&
								touched.seguroVidaValues &&
								touched.seguroVidaValues[index] &&
								touched.seguroVidaValues[index].parentesco_id &&
								errors &&
								errors.seguroVidaValues &&
								errors.seguroVidaValues[index] &&
								errors.seguroVidaValues[index].parentesco_id
							}
							fullWidth
							select
							label="Parentesco"
							defaultValue={getTipoParentesco(parentesco_id)}
							onChange={handleChange}
							variant="outlined"
						>
							{parentesco.map((option) => (
								<MenuItem key={option.codigo} value={option.codigo}>
									{option.tipo_parentesco} {option.codigo}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item md={6} xs={12}>
						<TextField
							fullWidth
							error={Boolean(
								touched &&
									touched.seguroVidaValues &&
									touched.seguroVidaValues[index] &&
									touched.seguroVidaValues[index].email &&
									errors &&
									errors.seguroVidaValues &&
									errors.seguroVidaValues[index] &&
									errors.seguroVidaValues[index].email
							)}
							helperText={
								touched &&
								touched.seguroVidaValues &&
								touched.seguroVidaValues[index] &&
								touched.seguroVidaValues[index].email &&
								errors &&
								errors.seguroVidaValues &&
								errors.seguroVidaValues[index] &&
								errors.seguroVidaValues[index].email
							}
							label="Email"
							name={`seguroVidaValues.${index}.email`}
							// onBlur={handleBlur}
							onChange={handleChange}
							defaultValue={email}
							variant="outlined"
						/>
					</Grid>
				</Grid>
			</Box>
			<Box m={2}>
				<Button
					style={{ background: 'black', color: 'white' }}
					size="small"
					type="button"
					onClick={onRemove}
					variant="contained"
				>
					Eliminar
				</Button>
			</Box>
		</div>
	);
}

const defaultState = {
	nombresSeguroVida: '',
	apellidosSeguroVida: '',
	emailSeguroVida: '',
	parentescoSeguroVida: ''
};

const FormEditOportunity = ({ valueContributionSystem }) => {
	const [ amountHeader, setAmountHeader ] = useState(0);
	const [ parentescoState, setParentescoState ] = useState('');
	//const [beneficiarioAsistencia, setBeneficiarioAsistencia] = useState(bae?.apellido !== undefined ? bae.apellido : '' );
	const [ initState, setinitState ] = useState({});
	const dispatch = useDispatch();
	const history = useHistory();
	const [ rows, setRows ] = useState([ defaultState ]);

	const { enqueueSnackbar } = useSnackbar();
	const [ cantNs, setCantNs ] = useState(0);
	const identification = useSelector((state) => state.cliente.StepCharge.numero_identificacion);

	const { cliente } = useSelector((state) => state.cliente.FondoAporteEditar);
	const { bsv } = useSelector((state) => state.cliente.FondoAporteEditar);
	const { bae } = useSelector((state) => state.cliente.FondoAporteEditar);
	const { ConsultarData: cliente } = useSelector((state) => state.cliente);

	const history = useHistory();
	const dispatch = useDispatch();

	let { idCliente } = useParams();

	useEffect(() => {
		if (idCliente && idCliente != cliente.id) {
			dispatch(getClienteById(idCliente));
		}
	}, []);

	const valueIni = {
		aporteMensual: cliente && cliente.monto_aporte ? cliente.monto_aporte.toString() : '0',
		nombresExequial: bae ? bae.nombre : '',
		apellidosExequial: bae ? bae.apellido : '',
		parentescoExequial: bae ? getTipoParentesco(bae.parentesco_id) : '01',
		emailExequial: bae ? bae.email : '',
		seguroVidaValues: bsv ? bsv : []
	};

	const handleOnChange = (index, name, value) => {
		const copyRows = [ ...rows ];
		copyRows[index] = {
			...copyRows[index],
			[name]: value
		};
		setRows(copyRows);
	};

	const handleOnAdd = () => {
		if (cantNs < 3) {
			setRows(rows.concat(defaultState));
			setCantNs(cantNs + 1);
		} else {
			enqueueSnackbar('No puede agregar más de 4 beneficiarios', {
				variant: 'error'
			});
		}
	};

	const handleOnRemove = (index) => {
		const copyRows = [ ...rows ];
		copyRows.splice(index, 1);
		setCantNs(cantNs - 1);
		setRows(copyRows);
	};

	const SendValues = (values) => {
		var body = {
			idAporteCliente: cliente.id,
			numero_identificacion: identification,
			aporteMensual: values.aporteMensual,
			primaMensualSeguro: values.primaMensualSeguro,
			asistenciaExequialExtendida: values.asistenciaExequialExtendida,
			soluciona: values.soluciona,
			seguroItp: values.seguroItp,
			otrosBeneficios: values.otrosBeneficios,
			seguroVidaValues: values.seguroVidaValues,
			nombresExequial: values.nombresExequial,
			apellidosExequial: values.apellidosExequial,
			parentescoExequial: values.parentescoExequial,
			emailExequial: values.emailExequial,
			cod_fondo_largo_plazo: '000001'
			//cod_sistema_aportes_catalogos:valueContributionSystem.cod_sistema_aportes_catalogos
		};
		console.log(body);
		
		/**guarda datos */
		dispatch(getFondoAporteUpdate(body));
		/**busca datos para mostrar al redireccionar */
		///dispatch(getFondoAporteList(identification));
		/**redirecciona */
		history.push('/afp/crm/oportunidad/ver/mantenimientoOportunidad');
	};

	return (
		<React.Fragment>
			<HeaderFondo amountHeader={amountHeader} />
			<Formik
				enableReinitialize
				initialValues={valueIni}
				//initialValues={initState}
				validationSchema={Yup.object().shape({
					aporteMensual: Yup.string()
						.matches(/^\d*\.{1}\d+[0-9]+$/gm, 'Solo se admiten cantidades con 2 decimales')
						.required('Se requiere llenar este campo'),
					//tipo_parentesco: Yup.number().required('Se debe elegir una opción'),
					parentescoExequial: Yup.string().required('Se debe elegir una opción'),
					//parentescoSeguroVida: Yup.number().required('Se debe elegir una opción'),
					// primaMensualSeguro: Yup.string().required('Required'),
					// asistenciaExequialExtendida: Yup.string().required('Required'),
					// soluciona: Yup.string().required('Required'),
					// seguroItp: Yup.string().required('Required'),
					// otrosBeneficios: Yup.string().required('Required'),
					//nombresSeguroVida: Yup.string().matches(/^[A-Z-a-z]+$/gm, 'Solo se admiten letras').min(2, 'Debe de tener al menos 2 caracteres').required('Se requiere llenar este campo'),
					//apellidosSeguroVida: Yup.string().matches(/^[A-Z-a-z]+$/gm, 'Solo se admiten letras').min(2, 'Debe de tener al menos 2 caracteres').required('Se requiere llenar este campo'),
					//emailSeguroVida: Yup.string().email(),
					seguroVidaValues: Yup.array()
						.of(
							Yup.object().shape({
								nombre: Yup.string()
									.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
									.min(2, 'Debe de tener al menos 2 caracteres')
									.required('Se requiere llenar este campo'),
								apellido: Yup.string()
									.matches(/^[a-zA-Z-ÑÁÉÍÓÚÄËÏÖÜñáéíóúäëïöü ]+$/gm, 'Solo se admiten letras')
									.min(2, 'Debe de tener al menos 2 caracteres')
									.required('Se requiere llenar este campo'),
								parentesco_id: Yup.number().required('Se debe elegir una opción')
							})
						)
						.required(),
					nombresExequial: Yup.string()
						.matches(/^[A-Z-a-z]+$/gm, 'Solo se admiten letras')
						.min(2, 'Debe de tener al menos 2 caracteres')
						.required('Se requiere llenar este campo'),
					apellidosExequial: Yup.string()
						.matches(/^[A-Z-a-z]+$/gm, 'Solo se admiten letras')
						.min(2, 'Debe de tener al menos 2 caracteres')
						.required('Se requiere llenar este campo'),
					emailExequial: Yup.string().email()
				})}
				onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
					try {
						// NOTE: Make API request
						//await wait(1000);
						SendValues(values);
						resetForm();
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
				{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
					<form onSubmit={handleSubmit}>
						<Box m={3}>
							<Card>
								<CardHeader title="Valor a Pagar" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<TextField
												error={Boolean(touched.aporteMensual && errors.aporteMensual)}
												fullWidth
												helperText={touched.aporteMensual && errors.aporteMensual}
												label="Aporte mensual"
												name="aporteMensual"
												onBlur={handleBlur}
												id="aporteMensual"
												onChange={handleChange}
												value={values.aporteMensual}
												variant="outlined"
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<TextField
												error={Boolean(touched.primaMensualSeguro && errors.primaMensualSeguro)}
												fullWidth
												disabled
												helperText={touched.primaMensualSeguro && errors.primaMensualSeguro}
												label="Prima mensual del seguro "
												name="primaMensualSeguro"
												//onBlur={handleBlur}
												//onChange={handleChange}
												value={values.aporteMensual}
												variant="outlined"
											/>
										</Grid>
									</Grid>
									<Box mt={2}>
										<Grid container spacing={2}>
											<Grid item md={6} xs={12}>
												<TextField
													error={Boolean(
														touched.asistenciaExequialExtendida &&
															errors.asistenciaExequialExtendida
													)}
													fullWidth
													disabled
													helperText={
														touched.asistenciaExequialExtendida &&
														errors.asistenciaExequialExtendida
													}
													label="Asistencia exequial extendida"
													name="asistenciaExequialExtendida"
													onBlur={handleBlur}
													onChange={handleChange}
													value={values.aporteMensual}
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													error={Boolean(touched.soluciona && errors.soluciona)}
													fullWidth
													disabled
													helperText={touched.soluciona && errors.soluciona}
													label="Soluciona"
													name="soluciona"
													onBlur={handleBlur}
													//onChange={handleChange}
													value={values.aporteMensual}
													variant="outlined"
												/>
											</Grid>
										</Grid>
									</Box>

									<Box mt={2}>
										<Grid container spacing={2}>
											<Grid item md={6} xs={12}>
												<TextField
													error={Boolean(touched.seguroItp && errors.seguroItp)}
													fullWidth
													disabled
													helperText={touched.seguroItp && errors.seguroItp}
													label="Seguro ITP"
													name="seguroItp"
													onBlur={handleBlur}
													//onChange={handleChange}
													value={values.aporteMensual}
													variant="outlined"
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													error={Boolean(touched.otrosBeneficios && errors.otrosBeneficios)}
													fullWidth
													disabled
													helperText={touched.otrosBeneficios && errors.otrosBeneficios}
													label="Otros beneficios"
													name="otrosBeneficios"
													onBlur={handleBlur}
													//onChange={handleChange}
													value={values.aporteMensual}
													variant="outlined"
												/>
											</Grid>
										</Grid>
									</Box>

									{Boolean(touched.policy && errors.policy) && (
										<FormHelperText error>{errors.policy}</FormHelperText>
									)}
								</CardContent>
							</Card>
						</Box>

						<Box m={3}>
							<Card>
								<CardHeader title="Beneficiario del seguro de vida" />
								<Divider />
								<CardContent>
									<div className="App">
										<FieldArray
											name="seguroVidaValues"
											validateOnChange={false}
											render={(arrayHelpers) => (
												<div>
													{values.seguroVidaValues.map((seguroVidaValue, index) => (
														<div key={index}>
															<Row
																{...seguroVidaValue}
																handleChange={handleChange}
																onRemove={() => arrayHelpers.remove(index)}
																index={index}
																errors={errors}
																touched={touched}
															/>
															{values.seguroVidaValues.length == index + 1 &&
															values.seguroVidaValues.length <= 3 && (
																<Box mt={2}>
																	<Button
																		style={{
																			background: 'black',
																			color: 'white'
																		}}
																		size="large"
																		type="button"
																		onClick={() => arrayHelpers.push(index, '')}
																		variant="contained"
																	>
																		Nuevo beneficiario
																	</Button>
																</Box>
															)}
														</div>
													))}
												</div>
											)}
										/>
									</div>
									{/* <Grid
                  container
                  spacing={2}
                >

                </Box> */}

									{Boolean(touched.policy && errors.policy) && (
										<FormHelperText error>{errors.policy}</FormHelperText>
									)}

									{/* <Box mt={2}>
                  <Button
                    style={{background:'black', color:'white'}}
                    disabled={isSubmitting}
                    size="large"
                    type="button"
                    // onClick={handleAdd}
                    variant="contained"
                  >
                    Nuevo beneficiario
                  </Button>
                </Box> */}
								</CardContent>
							</Card>
						</Box>

						<Box m={3}>
							<Card>
								<CardHeader title="Beneficiario sólo Asistencia Exequial" />
								<Divider />
								<CardContent>
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<TextField
												error={Boolean(touched.nombresExequial && errors.nombresExequial)}
												fullWidth
												helperText={touched.nombresExequial && errors.nombresExequial}
												label="Nombre"
												name="nombresExequial"
												id="nombresExequial"
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.nombresExequial}
												variant="outlined"
											/>
										</Grid>
										<Grid item md={6} xs={12}>
											<TextField
												error={Boolean(touched.apellidosExequial && errors.apellidosExequial)}
												fullWidth
												helperText={touched.apellidosExequial && errors.apellidosExequial}
												label="Apellidos"
												name="apellidosExequial"
												id="apellidosExequial"
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.apellidosExequial}
												variant="outlined"
												//contentEditable = {true}
											/>
										</Grid>
									</Grid>

									<Box mt={2}>
										<Grid container spacing={2}>
											<Grid item md={6} xs={12}>
												{/* <TextField
                          name="parentesco"
                          error={Boolean(touched.parentescoExequial && errors.parentescoExequial)}
                          fullWidth
                          select
                          label="Parentesco"
                          value={parentesco.codigo}
                          defaultValue={'parentescoDefault'}
                          onChange={handleChange}
                          helperText={touched.parentescoExequial && errors.parentescoExequial}
                          variant="outlined"
                        >
                          {parentesco.map((option) => (
                            <MenuItem key={option.codigo} value={option.codigo}>
                              {option.tipo_parentesco}
                            </MenuItem>
                          ))}
                        </TextField> */}

												<Field
													error={Boolean(
														touched.parentescoExequial && errors.parentescoExequial
													)}
													fullWidth
													helperText={touched.parentescoExequial && errors.parentescoExequial}
													component={Select}
													name="parentescoExequial"
													id="parentescoExequial"
													label="Parentesco"
													fullWidth
													variant="outlined"
													onChange={handleChange}
													defaultValue={values.parentescoExequial}
												>
													{parentesco.map((option) => (
														<MenuItem key={option.codigo} value={option.codigo}>
															{option.tipo_parentesco}
														</MenuItem>
													))}
												</Field>
											</Grid>
											<Grid item md={6} xs={12}>
												<TextField
													error={Boolean(touched.emailExequial && errors.emailExequial)}
													fullWidth
													helperText={touched.emailExequial && errors.emailExequial}
													label="Email"
													name="emailExequial"
													//onBlur={handleBlur}
													onChange={handleChange}
													value={values.emailExequial}
													variant="outlined"
												/>
											</Grid>
										</Grid>
									</Box>

									{Boolean(touched.policy && errors.policy) && (
										<FormHelperText error>{errors.policy}</FormHelperText>
									)}
								</CardContent>
							</Card>
						</Box>
						<Box m={3}>
							<Button
								style={{ background: 'black', color: 'white' }}
								disabled={isSubmitting}
								fullWidth
								size="large"
								type="submit"
								variant="contained"
							>
								Actualizar
							</Button>
						</Box>
					</form>
				)}
			</Formik>
		</React.Fragment>
	);
};

export default FormEditOportunity;

const HeaderFondo = ({ amountHeader }) => {
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
						FONDO DE INVERSIONES A LARGO PLAZO - ${amountHeader}
					</Typography>
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

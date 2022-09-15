import React from 'react';

import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import { FieldArray, Field } from 'formik';

import { useSnackbar } from 'notistack';
import renderTextField from 'src/components/FormElements/InputText';
import renderDateTimePicker from 'src/components/FormElements/InputDate';
import renderSelectField from 'src/components/FormElements/InputSelect';
import usesStyles from 'src/views/afp_cliente/ClienteCreateAndEditarView/usesStyles';
import { Fragment } from 'react';

const defaultState = {
	nombre: '',
	apellido: '',
	numero_identificacion: '',
	fecha_expiracion: null,
	pais_nacimiento: '',
	nacionalidad: '',
	nacionalidad2: null,
	nacionalidad3: null,
	parentesco: ''
};

function Beneficiarios({
	values,
	touched,
	errors,
	handleBlur,
	handleChange,
	setFieldValue,
	paises,
	nacionalidades,
	parentescos,
	max = 1
}) {
	const { enqueueSnackbar } = useSnackbar();

	const classes = usesStyles();

	const handleAdd = (arrayHelpers, beneficiarios) => {
		if (beneficiarios.length < max) {
			arrayHelpers.push(defaultState);
		} else {
			enqueueSnackbar('No puede agregar más de ' + max + ' beneficiario(s)', {
				variant: 'error'
			});
		}
	};

	const handleRemove = (arrayHelpers, beneficiarios, index) => {
		if (beneficiarios.length > 0) {
			arrayHelpers.remove(index);
		}
	};

	return (
		<Card>
			<CardHeader title="Beneficiarios" />
			<Divider />
			<CardContent>
				<FieldArray
					validateOnChange={false}
					name="beneficiariosValues"
					render={(arrayHelpers) => (
						<div className="App">
							{values.beneficiariosValues &&
								values.beneficiariosValues.map((beneficiario, index) => {
									return (
										<Box key={index}>
											<Grid container spacing={2}>
												<Grid item md={6} xs={12}>
													{beneficiario.id && <input type="hidden" value={beneficiario.id} />}
													<Field
														name={`beneficiariosValues.${index}.nombre`}
														id={`beneficiariosValues.${index}.nombre`}
														type="text"
														label="Nombres"
														fullWidth
														variant="outlined"
														value={beneficiario.nombre}
														error={Boolean(
															touched &&
																touched.beneficiariosValues &&
																touched.beneficiariosValues[index] &&
																touched.beneficiariosValues[index]['nombre'] &&
																errors &&
																errors.beneficiariosValues &&
																errors.beneficiariosValues[index] &&
																errors.beneficiariosValues[index]['nombre']
														)}
														helperText={
															touched &&
															touched.beneficiariosValues &&
															touched.beneficiariosValues[index] &&
															touched.beneficiariosValues[index]['nombre'] &&
															errors &&
															errors.beneficiariosValues &&
															errors.beneficiariosValues[index] &&
															errors.beneficiariosValues[index]['nombre']
														}
														onBlur={handleBlur}
														onChange={handleChange}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={6} xs={12}>
													<Field
														name={`beneficiariosValues.${index}.apellido`}
														id={`beneficiariosValues.${index}.apellido`}
														type="text"
														label="Apellidos"
														fullWidth
														variant="outlined"
														value={beneficiario.apellido}
														error={Boolean(
															touched &&
																touched.beneficiariosValues &&
																touched.beneficiariosValues[index] &&
																touched.beneficiariosValues[index]['apellido'] &&
																errors &&
																errors.beneficiariosValues &&
																errors.beneficiariosValues[index] &&
																errors.beneficiariosValues[index]['apellido']
														)}
														helperText={
															touched &&
															touched.beneficiariosValues &&
															touched.beneficiariosValues[index] &&
															touched.beneficiariosValues[index]['apellido'] &&
															errors &&
															errors.beneficiariosValues &&
															errors.beneficiariosValues[index] &&
															errors.beneficiariosValues[index]['apellido']
														}
														onBlur={handleBlur}
														onChange={handleChange}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={3} xs={6}>
													<Field
														name={`beneficiariosValues.${index}.numero_identificacion`}
														id={`beneficiariosValues.${index}.numero_identificacion`}
														type="text"
														label="Número de identificación"
														fullWidth
														variant="outlined"
														value={beneficiario.numero_identificacion}
														error={Boolean(
															touched &&
																touched.beneficiariosValues &&
																touched.beneficiariosValues[index] &&
																touched.beneficiariosValues[index][
																	'numero_identificacion'
																] &&
																errors &&
																errors.beneficiariosValues &&
																errors.beneficiariosValues[index] &&
																errors.beneficiariosValues[index][
																	'numero_identificacion'
																]
														)}
														helperText={
															touched &&
															touched.beneficiariosValues &&
															touched.beneficiariosValues[index] &&
															touched.beneficiariosValues[index][
																'numero_identificacion'
															] &&
															errors &&
															errors.beneficiariosValues &&
															errors.beneficiariosValues[index] &&
															errors.beneficiariosValues[index]['numero_identificacion']
														}
														onBlur={handleBlur}
														onChange={handleChange}
														component={renderTextField}
													/>
												</Grid>
												<Grid item md={3} xs={6}>
													<Field
														name={`beneficiariosValues.${index}.fecha_expiracion`}
														id={`beneficiariosValues.${index}.fecha_expiracion`}
														label="Fecha Expiración"
														fullWidth
														variant="outlined"
														value={beneficiario.fecha_expiracion}
														error={Boolean(
															touched &&
																touched.beneficiariosValues &&
																touched.beneficiariosValues[index] &&
																touched.beneficiariosValues[index][
																	'fecha_expiracion'
																] &&
																errors &&
																errors.beneficiariosValues &&
																errors.beneficiariosValues[index] &&
																errors.beneficiariosValues[index]['fecha_expiracion']
														)}
														helperText={
															touched &&
															touched.beneficiariosValues &&
															touched.beneficiariosValues[index] &&
															touched.beneficiariosValues[index]['fecha_expiracion'] &&
															errors &&
															errors.beneficiariosValues &&
															errors.beneficiariosValues[index] &&
															errors.beneficiariosValues[index]['fecha_expiracion']
														}
														onBlur={handleBlur}
														onChange={(date) =>
															setFieldValue(
																`beneficiariosValues.${index}.fecha_expiracion`,
																date
															)}
														component={renderDateTimePicker}
													/>
												</Grid>
												<Grid item md={3} xs={6}>
													<Field
														name={`beneficiariosValues.${index}.pais_nacimiento`}
														id={`beneficiariosValues.${index}.pais_nacimiento`}
														label="País de nacimiento"
														fullWidth
														variant="outlined"
														value={beneficiario.pais_nacimiento || ''}
														error={Boolean(
															touched &&
																touched.beneficiariosValues &&
																touched.beneficiariosValues[index] &&
																touched.beneficiariosValues[index]['pais_nacimiento'] &&
																errors &&
																errors.beneficiariosValues &&
																errors.beneficiariosValues[index] &&
																errors.beneficiariosValues[index]['pais_nacimiento']
														)}
														helperText={
															touched &&
															touched.beneficiariosValues &&
															touched.beneficiariosValues[index] &&
															touched.beneficiariosValues[index]['pais_nacimiento'] &&
															errors &&
															errors.beneficiariosValues &&
															errors.beneficiariosValues[index] &&
															errors.beneficiariosValues[index]['pais_nacimiento']
														}
														onBlur={handleBlur}
														onChange={handleChange}
														data={paises}
														component={renderSelectField}
													/>
												</Grid>
												<Grid item md={3} xs={6}>
													<Field
														name={`beneficiariosValues.${index}.parentesco`}
														id={`beneficiariosValues.${index}.parentesco`}
														label="Parentesco"
														fullWidth
														variant="outlined"
														value={beneficiario.parentesco || ''}
														error={Boolean(
															touched &&
																touched.beneficiariosValues &&
																touched.beneficiariosValues[index] &&
																touched.beneficiariosValues[index]['parentesco'] &&
																errors &&
																errors.beneficiariosValues &&
																errors.beneficiariosValues[index] &&
																errors.beneficiariosValues[index]['parentesco']
														)}
														helperText={
															touched &&
															touched.beneficiariosValues &&
															touched.beneficiariosValues[index] &&
															touched.beneficiariosValues[index]['parentesco'] &&
															errors &&
															errors.beneficiariosValues &&
															errors.beneficiariosValues[index] &&
															errors.beneficiariosValues[index]['parentesco']
														}
														onBlur={handleBlur}
														onChange={handleChange}
														data={parentescos}
														component={renderSelectField}
													/>
												</Grid>
												<Grid item md={6} xs={8}>
													<Field
														name={`beneficiariosValues.${index}.nacionalidad`}
														id={`beneficiariosValues.${index}.nacionalidad`}
														label="Nacionalidad"
														fullWidth
														variant="outlined"
														value={beneficiario.nacionalidad || ''}
														error={Boolean(
															touched &&
																touched.beneficiariosValues &&
																touched.beneficiariosValues[index] &&
																touched.beneficiariosValues[index]['nacionalidad'] &&
																errors &&
																errors.beneficiariosValues &&
																errors.beneficiariosValues[index] &&
																errors.beneficiariosValues[index]['nacionalidad']
														)}
														helperText={
															touched &&
															touched.beneficiariosValues &&
															touched.beneficiariosValues[index] &&
															touched.beneficiariosValues[index]['nacionalidad'] &&
															errors &&
															errors.beneficiariosValues &&
															errors.beneficiariosValues[index] &&
															errors.beneficiariosValues[index]['nacionalidad']
														}
														onBlur={handleBlur}
														onChange={handleChange}
														data={nacionalidades}
														component={renderSelectField}
													/>
												</Grid>
												<Grid item md={6} xs={4}>
													<Box m={2}>
														<Button
															className={classes.ButtonBlack}
															size="small"
															type="button"
															onClick={() => {
																if (
																	beneficiario.nacionalidad2 == null ||
																	beneficiario.nacionalidad2 == undefined
																) {
																	setFieldValue(
																		`beneficiariosValues.${index}.nacionalidad2`,
																		''
																	);
																} else if (
																	beneficiario.nacionalidad3 == null ||
																	beneficiario.nacionalidad3 == undefined
																) {
																	setFieldValue(
																		`beneficiariosValues.${index}.nacionalidad3`,
																		''
																	);
																}
															}}
															variant="contained"
														>
															Agregar Nacionalidad
														</Button>
													</Box>
												</Grid>
												{/* NACIONALIDAD 2 */}
												{beneficiario.nacionalidad2 != null &&
												beneficiario.nacionalidad2 != undefined && (
													<Fragment>
														<Grid item md={6} xs={8}>
															<Field
																name={`beneficiariosValues.${index}.nacionalidad2`}
																id={`beneficiariosValues.${index}.nacionalidad2`}
																label="Nacionalidad 2"
																fullWidth
																variant="outlined"
																value={beneficiario.nacionalidad2 || ''}
																error={Boolean(
																	touched &&
																		touched.beneficiariosValues &&
																		touched.beneficiariosValues[index] &&
																		touched.beneficiariosValues[index][
																			'nacionalidad2'
																		] &&
																		errors &&
																		errors.beneficiariosValues &&
																		errors.beneficiariosValues[index] &&
																		errors.beneficiariosValues[index][
																			'nacionalidad2'
																		]
																)}
																helperText={
																	touched &&
																	touched.beneficiariosValues &&
																	touched.beneficiariosValues[index] &&
																	touched.beneficiariosValues[index][
																		'nacionalidad2'
																	] &&
																	errors &&
																	errors.beneficiariosValues &&
																	errors.beneficiariosValues[index] &&
																	errors.beneficiariosValues[index]['nacionalidad2']
																}
																onBlur={handleBlur}
																onChange={handleChange}
																data={nacionalidades}
																component={renderSelectField}
															/>
														</Grid>
														<Grid item md={6} xs={4}>
															<Box m={2}>
																<Button
																	className={classes.ButtonBlack}
																	size="small"
																	type="button"
																	onClick={() => {
																		if (
																			beneficiario.nacionalidad3 != null ||
																			beneficiario.nacionalidad3 != undefined
																		) {
																			setFieldValue(
																				`beneficiariosValues.${index}.nacionalidad2`,
																				beneficiario.nacionalidad3
																			);
																			setFieldValue(
																				`beneficiariosValues.${index}.nacionalidad3`,
																				null
																			);
																		} else {
																			setFieldValue(
																				`beneficiariosValues.${index}.nacionalidad2`,
																				null
																			);
																		}
																	}}
																	variant="contained"
																>
																	Eliminar Nacionalidad
																</Button>
															</Box>
														</Grid>
													</Fragment>
												)}

												{/* NACIONALIDAD 3 */}
												{beneficiario.nacionalidad3 != null &&
												beneficiario.nacionalidad3 != undefined && (
													<Fragment>
														<Grid item md={6} xs={8}>
															<Field
																name={`beneficiariosValues.${index}.nacionalidad3`}
																id={`beneficiariosValues.${index}.nacionalidad3`}
																label="Nacionalidad 3"
																fullWidth
																variant="outlined"
																value={beneficiario.nacionalidad3 || ''}
																error={Boolean(
																	touched &&
																		touched.beneficiariosValues &&
																		touched.beneficiariosValues[index] &&
																		touched.beneficiariosValues[index][
																			'nacionalidad3'
																		] &&
																		errors &&
																		errors.beneficiariosValues &&
																		errors.beneficiariosValues[index] &&
																		errors.beneficiariosValues[index][
																			'nacionalidad3'
																		]
																)}
																helperText={
																	touched &&
																	touched.beneficiariosValues &&
																	touched.beneficiariosValues[index] &&
																	touched.beneficiariosValues[index][
																		'nacionalidad3'
																	] &&
																	errors &&
																	errors.beneficiariosValues &&
																	errors.beneficiariosValues[index] &&
																	errors.beneficiariosValues[index]['nacionalidad3']
																}
																onBlur={handleBlur}
																onChange={handleChange}
																data={nacionalidades}
																component={renderSelectField}
															/>
														</Grid>
														<Grid item md={6} xs={4}>
															<Box m={2}>
																<Button
																	className={classes.ButtonBlack}
																	size="small"
																	type="button"
																	onClick={() => {
																		setFieldValue(
																			`beneficiariosValues.${index}.nacionalidad3`,
																			null
																		);
																	}}
																	variant="contained"
																>
																	Eliminar Nacionalidad
																</Button>
															</Box>
														</Grid>
													</Fragment>
												)}
											</Grid>											
											<Box m={2}>
												<Button
													color="default"
													style={{
														background: 'black',
														color: 'white'
													}}
													size="small"
													type="button"
													onClick={() =>
														handleRemove(
															arrayHelpers,
															values.beneficiariosValues,
															index
														)}
													variant="contained"
													// disabled={
													// 	values.beneficiariosValues.length === 1 ? true : false
													// }
												>
													Eliminar
												</Button>
											</Box>
											{values.beneficiariosValues.length > 1 &&
											index != values.beneficiariosValues.length - 1 && (
												<Box marginY={2}>
													<Divider />
												</Box>
											)}
										</Box>
									);
								})}
							{values.beneficiariosValues.length < max && (
								<Box mt={2}>
									<Button
										style={{ background: 'black', color: 'white', marginRight: '.5rem' }}
										size="large"
										type="button"
										onClick={() => {
											handleAdd(arrayHelpers, values.beneficiariosValues);
										}}
										variant="contained"
									>
										Nuevo beneficiario
									</Button>
									<Typography display="inline" variant="h4">
										Máximo {max} beneficiarios
									</Typography>
								</Box>
							)}
						</div>
					)}
				/>
			</CardContent>
		</Card>
	);
}

export default Beneficiarios;

import React, { useEffect, useState } from 'react';

import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	FormControl,
	FormHelperText,
	Grid,
	TextField,
	Typography
} from '@material-ui/core';
import { Formik, validateYupSchema, FieldArray, Form, Field } from 'formik';

import Select from 'src/components/FormElements/InputSelect';
import InputText from 'src/components/FormElements/InputText';
import { useSnackbar } from 'notistack';
import { getCatalogoTipoCuenta } from 'src/slices/catalogos';
import { Autocomplete } from '@material-ui/lab';

import _ from 'lodash';

const defaultState = {
	entidad_bancaria: '',
	tipo_cuenta: '',
	antiguedad_anios: '',
	antiguedad_meses: '',
	numero_cuenta: '',
	saldos_creditos: ''
};

function Referencias({
	values,
	touched,
	errors,
	handleBlur,
	handleChange,
	bancos,
	setFieldValue,
	// tipoCuentas,
	max = 1
}) {
	const [ tipoCuentas, setTipoCuentas ] = useState([]);

	const { enqueueSnackbar } = useSnackbar();

	useEffect(
		() => {
			if (values.referenciasValue.length > 0) {
				values.referenciasValue.forEach((item, index) => {
					_getCatalogoTipoCuenta(item.entidad_bancaria, index);
				});
			}
		},
		[ values.referenciasValue ]
	);

	const _getCatalogoTipoCuenta = async (banco_id, index) => {
		if (!banco_id || banco_id == '') {
			return;
		}

		let response = await getCatalogoTipoCuenta(banco_id);

		if (response.status == 200) {
			tipoCuentas[index] = response.data;

			setTipoCuentas([ ...tipoCuentas ]);
		}
	};

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
		if (beneficiarios.length - 1 > 0) {
			arrayHelpers.remove(index);
		}
	};

	return (
		<Card>
			<CardHeader title="Referencias" />
			<Divider />
			<CardContent>
				<FieldArray
					validateOnChange={false}
					name="referenciasValue"
					render={(arrayHelpers) => (
						<div className="App">
							{values.referenciasValue &&
								values.referenciasValue.map((referencia, index) => {
									let banco =
										referencia.entidad_bancaria &&
										_.filter(bancos, { codigo: referencia.entidad_bancaria });
									banco = banco[0] || {};

									return (
										<Box key={index}>
											<Grid container spacing={2}>
												<Grid item md={6} xs={12}>
													{referencia.id && <input type="hidden" value={referencia.id} />}
													{bancos && (
														<FormControl
															variant="outlined"
															fullWidth
															error={Boolean(errors.entidad_bancaria)}
														>
															<Autocomplete
																id={`referenciasValue.${index}.entidad_bancaria`}
																name={`referenciasValue.${index}.entidad_bancaria`}
																value={banco}
																options={bancos}
																error={Boolean(
																	touched &&
																		touched.referenciasValue &&
																		touched.referenciasValue[index] &&
																		touched.referenciasValue[index][
																			'entidad_bancaria'
																		] &&
																		errors &&
																		errors.referenciasValue &&
																		errors.referenciasValue[index] &&
																		errors.referenciasValue[index][
																			'entidad_bancaria'
																		]
																)}
																helperText={
																	touched &&
																	touched.referenciasValue &&
																	touched.referenciasValue[index] &&
																	touched.referenciasValue[index][
																		'entidad_bancaria'
																	] &&
																	errors &&
																	errors.referenciasValue &&
																	errors.referenciasValue[index] &&
																	errors.referenciasValue[index]['entidad_bancaria']
																}
																getOptionLabel={(option) => option.contenido}
																onBlur={handleBlur}
																// onChange={handleChange}
																onChange={(event, newValue) => {
																	setFieldValue(
																		`referenciasValue.${index}.entidad_bancaria`,
																		newValue ? newValue.codigo : null
																	);
																	handleChange(event);
																	_getCatalogoTipoCuenta(event.target.value, index);
																}}
																renderInput={(params) => (
																	<TextField
																		{...params}
																		onBlur={handleBlur}
																		label="Entidad bancaria"
																		variant="outlined"
																	/>
																)}
															/>
															{Boolean(
																touched.entidad_bancaria && errors.entidad_bancaria
															) && (
																<FormHelperText>
																	{errors.entidad_bancaria}
																</FormHelperText>
															)}
														</FormControl>
													)}
												</Grid>

												{/* <Grid item md={3} xs={12}>
													{referencia.id && <input type="hidden" value={referencia.id} />}
													<Select
														name={`referenciasValue.${index}.entidad_bancaria`}
														id={`referenciasValue.${index}.entidad_bancaria`}
														type="text"
														label="Entidad bancaria"
														fullWidth
														variant="outlined"
														value={referencia.entidad_bancaria}
														error={Boolean(
															touched &&
																touched.referenciasValue &&
																touched.referenciasValue[index] &&
																touched.referenciasValue[index]['entidad_bancaria'] &&
																errors &&
																errors.referenciasValue &&
																errors.referenciasValue[index] &&
																errors.referenciasValue[index]['entidad_bancaria']
														)}
														helperText={
															touched &&
															touched.referenciasValue &&
															touched.referenciasValue[index] &&
															touched.referenciasValue[index]['entidad_bancaria'] &&
															errors &&
															errors.referenciasValue &&
															errors.referenciasValue[index] &&
															errors.referenciasValue[index]['entidad_bancaria']
														}
														onBlur={handleBlur}
														onChange={(e) => {
															handleChange(e);
															_getCatalogoTipoCuenta(e.target.value, index);
														}}
														data={bancos}
													/>
												</Grid> */}
												<Grid item md={3} xs={12}>
													<Select
														name={`referenciasValue.${index}.tipo_cuenta`}
														id={`referenciasValue.${index}.tipo_cuenta`}
														type="text"
														label="Tipo de cuenta"
														fullWidth
														variant="outlined"
														value={referencia.tipo_cuenta}
														error={Boolean(
															touched &&
																touched.referenciasValue &&
																touched.referenciasValue[index] &&
																touched.referenciasValue[index]['tipo_cuenta'] &&
																errors &&
																errors.referenciasValue &&
																errors.referenciasValue[index] &&
																errors.referenciasValue[index]['tipo_cuenta']
														)}
														helperText={
															touched &&
															touched.referenciasValue &&
															touched.referenciasValue[index] &&
															touched.referenciasValue[index]['tipo_cuenta'] &&
															errors &&
															errors.referenciasValue &&
															errors.referenciasValue[index] &&
															errors.referenciasValue[index]['tipo_cuenta']
														}
														onBlur={handleBlur}
														onChange={handleChange}
														data={tipoCuentas[index]}
													/>
												</Grid>
												<Grid item md={3} xs={12}>
													<InputText
														name={`referenciasValue.${index}.numero_cuenta`}
														id={`referenciasValue.${index}.numero_cuenta`}
														type="text"
														label="Número de cuenta"
														fullWidth
														variant="outlined"
														value={referencia.numero_cuenta}
														error={Boolean(
															touched &&
																touched.referenciasValue &&
																touched.referenciasValue[index] &&
																touched.referenciasValue[index]['numero_cuenta'] &&
																errors &&
																errors.referenciasValue &&
																errors.referenciasValue[index] &&
																errors.referenciasValue[index]['numero_cuenta']
														)}
														helperText={
															touched &&
															touched.referenciasValue &&
															touched.referenciasValue[index] &&
															touched.referenciasValue[index]['numero_cuenta'] &&
															errors &&
															errors.referenciasValue &&
															errors.referenciasValue[index] &&
															errors.referenciasValue[index]['numero_cuenta']
														}
														onBlur={handleBlur}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item md={3} xs={12}>
													<InputText
														name={`referenciasValue.${index}.saldos_creditos`}
														id={`referenciasValue.${index}.saldos_creditos`}
														type="text"
														label="Saldos Créditos"
														fullWidth
														variant="outlined"
														value={referencia.saldos_creditos}
														error={Boolean(
															touched &&
																touched.referenciasValue &&
																touched.referenciasValue[index] &&
																touched.referenciasValue[index]['saldos_creditos'] &&
																errors &&
																errors.referenciasValue &&
																errors.referenciasValue[index] &&
																errors.referenciasValue[index]['saldos_creditos']
														)}
														helperText={
															touched &&
															touched.referenciasValue &&
															touched.referenciasValue[index] &&
															touched.referenciasValue[index]['saldos_creditos'] &&
															errors &&
															errors.referenciasValue &&
															errors.referenciasValue[index] &&
															errors.referenciasValue[index]['saldos_creditos']
														}
														onBlur={handleBlur}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item md={3} xs={12} direction="row">
													<Grid container spacing={2} justify="flex-end" alignItems="center">
														<Grid item xs={4}>
															<Typography variant="h5">Antigüedad</Typography>
														</Grid>
														<Grid item xs={4}>
															<InputText
																name={`referenciasValue.${index}.antiguedad_anios`}
																id={`referenciasValue.${index}.antiguedad_anios`}
																type="text"
																label="Años"
																fullWidth
																variant="outlined"
																value={referencia.antiguedad_anios}
																error={Boolean(
																	touched &&
																		touched.referenciasValue &&
																		touched.referenciasValue[index] &&
																		touched.referenciasValue[index][
																			'antiguedad_anios'
																		] &&
																		errors &&
																		errors.referenciasValue &&
																		errors.referenciasValue[index] &&
																		errors.referenciasValue[index][
																			'antiguedad_anios'
																		]
																)}
																helperText={
																	touched &&
																	touched.referenciasValue &&
																	touched.referenciasValue[index] &&
																	touched.referenciasValue[index][
																		'antiguedad_anios'
																	] &&
																	errors &&
																	errors.referenciasValue &&
																	errors.referenciasValue[index] &&
																	errors.referenciasValue[index]['antiguedad_anios']
																}
																onBlur={handleBlur}
																onChange={handleChange}
															/>
														</Grid>
														<Grid item xs={4}>
															<InputText
																name={`referenciasValue.${index}.antiguedad_meses`}
																id={`referenciasValue.${index}.antiguedad_meses`}
																type="text"
																label="Meses"
																fullWidth
																variant="outlined"
																value={referencia.antiguedad_meses}
																error={Boolean(
																	touched &&
																		touched.referenciasValue &&
																		touched.referenciasValue[index] &&
																		touched.referenciasValue[index][
																			'antiguedad_meses'
																		] &&
																		errors &&
																		errors.referenciasValue &&
																		errors.referenciasValue[index] &&
																		errors.referenciasValue[index][
																			'antiguedad_meses'
																		]
																)}
																helperText={
																	touched &&
																	touched.referenciasValue &&
																	touched.referenciasValue[index] &&
																	touched.referenciasValue[index][
																		'antiguedad_meses'
																	] &&
																	errors &&
																	errors.referenciasValue &&
																	errors.referenciasValue[index] &&
																	errors.referenciasValue[index]['antiguedad_meses']
																}
																onBlur={handleBlur}
																onChange={handleChange}
															/>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
											{values.referenciasValue.length > 1 && (
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
															handleRemove(arrayHelpers, values.referenciasValue, index)}
														variant="contained"
														disabled={values.referenciasValue.length === 1 ? true : false}
													>
														Eliminar
													</Button>
												</Box>
											)}
											{values.referenciasValue.length > 1 &&
											index != values.referenciasValue.length - 1 && (
												<Box marginY={2}>
													<Divider />
												</Box>
											)}
										</Box>
									);
								})}
							{values.referenciasValue.length < max && (
								<Box mt={2}>
									<Button
										style={{ background: 'black', color: 'white', marginRight: '.5rem' }}
										size="large"
										type="button"
										onClick={() => {
											handleAdd(arrayHelpers, values.referenciasValue);
										}}
										variant="contained"
									>
										Nueva referencia
									</Button>
									<Typography display="inline" variant="h4">
										Máximo {max} referencias
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

export default Referencias;

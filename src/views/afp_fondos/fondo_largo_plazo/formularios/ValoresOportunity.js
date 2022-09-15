import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	FormHelperText,
	Grid,
	// Link,
	TextField,
	InputAdornment,
	Switch
} from '@material-ui/core';
import renderTextField from 'src/components/FormElements/InputText';

function ValoresOportunity({
	values,
	touched,
	errors,
	handleBlur,
	handleChange,
	errorPrima,
	mensajesBeneficiosAdicionales,
	onBlurAporte,
	// onChangeAporte,
	setFieldValue,
	aporte = {}
	// calculateTotal,
	// setTotal
}) {
	let { estado_aplicacion_soluciona, estado_aplicacion_itp, estado_aplicacion_aee } = values;

	return (
		<div>
			<Card>
				<CardHeader title="Valor a Pagar" />
				<Divider />
				<CardContent>
					<Grid container spacing={2}>
						<Grid item md={6} xs={12}>
							<TextField
								error={Boolean(touched.monto_aporte && errors.monto_aporte)}
								fullWidth
								id="monto_aporte"
								helperText={touched.monto_aporte && errors.monto_aporte}
								label="Aporte mensual"
								name="monto_aporte"
								step={0.5}

								onBlur={(e) => {
									let value = e.target.value;

									handleBlur(e);
									onBlurAporte(value, setFieldValue);
								}}
								onChange={(e) => {
									let value = e.target.value;

									handleChange(e);
									// onChangeAporte(value);
									// setTotal();
								}}
								value={values.monto_aporte}
								variant="outlined"
								type="text"
							

							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<TextField
								error={Boolean(errorPrima)}
								fullWidth
								disabled
								helperText={errorPrima}
								label="Prima mensual del seguro"
								name="monto_prima"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.monto_prima}
								variant="outlined"
							/>
						</Grid>
					</Grid>
					<Box mt={2}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={12}>
								<Field
									error={Boolean(mensajesBeneficiosAdicionales.mensajeAee)}
									fullWidth
									disabled
									helperText={mensajesBeneficiosAdicionales.mensajeAee}
									label="Asistencia exequial extendida"
									name="monto_aee"
									onBlur={handleBlur}
									onChange={handleChange}
									variant="outlined"
									value={values.checkedAee ? values.monto_aee : '0'}
									endAdornment={
										<InputAdornment position="end">
											<Switch
												checked={values.checkedAee || false}
												onBlur={handleBlur}
												onChange={(e) => {
													setFieldValue('checkedAee', e.target.checked);
													handleChange(e);
													// calculateTotal({ ...values, checkedAee: e.target.checked });
												}}
												value={values.checkedAee || false}
												color="primary"
												name="checkedAee"
												disabled={estado_aplicacion_aee != 1}
											/>
										</InputAdornment>
									}
									component={renderTextField}
								/>
							</Grid>
							<Grid item md={6} xs={12}>
								<Field
									error={Boolean(mensajesBeneficiosAdicionales.mensajeSoluciona)}
									fullWidth
									disabled
									helperText={mensajesBeneficiosAdicionales.mensajeSoluciona}
									label="Soluciona"
									name="monto_soluciona"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.monto_soluciona}
									variant="outlined"
									value={values.checkedSoluciona ? values.monto_soluciona : '0'}
									endAdornment={
										<InputAdornment position="end">
											<Switch
												checked={values.checkedSoluciona || false}
												onBlur={handleBlur}
												onChange={(e) => {
													setFieldValue('checkedSoluciona', e.target.checked);
													handleChange(e);
													// calculateTotal({ ...values, checkedSoluciona: e.target.checked });
												}}
												value={values.checkedSoluciona || false}
												color="primary"
												name="checkedSoluciona"
												disabled={estado_aplicacion_soluciona != 1}
											/>
										</InputAdornment>
									}
									component={renderTextField}
								/>
							</Grid>
						</Grid>
					</Box>

					<Box mt={2}>
						<Grid container spacing={2}>
							<Grid item md={6} xs={12}>
								<Field
									error={Boolean(mensajesBeneficiosAdicionales.mensajeItp)}
									fullWidth
									disabled
									helperText={mensajesBeneficiosAdicionales.mensajeItp}
									label="Seguro ITP"
									name="monto_itp"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.monto_itp}
									variant="outlined"
									value={values.checkedItp ? values.monto_itp : '0'}
									endAdornment={
										<InputAdornment position="end">
											<Switch
												checked={values.checkedItp || false}
												onBlur={handleBlur}
												onChange={(e) => {
													setFieldValue('checkedItp', e.target.value);
													handleChange(e);
													// calculateTotal({ ...values, checkedItp: e.target.checked });
												}}
												value={values.checkedItp || false}
												color="primary"
												name="checkedItp"
												disabled={estado_aplicacion_itp != 1}
											/>
										</InputAdornment>
									}
									component={renderTextField}
								/>
							</Grid>
						</Grid>
					</Box>

					{Boolean(touched.policy && errors.policy) && <FormHelperText error>{errors.policy}</FormHelperText>}
				</CardContent>
			</Card>
		</div>
	);
}

ValoresOportunity.propTypes = {};

export default ValoresOportunity;

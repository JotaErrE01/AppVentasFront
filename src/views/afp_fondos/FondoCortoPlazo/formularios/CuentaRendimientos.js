import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import usesStyles from 'src/views/afp_cliente/ClienteCreateAndEditarView/usesStyles';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	FormHelperText,
	Grid,
	TextField,
	FormControl,
	Typography,
	InputAdornment,
	CircularProgress,
	Chip
} from '@material-ui/core';
import { Field } from 'formik';
import { Alert, Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import { getCatalogoDigitosCuenta, getCatalogoTipoCuenta } from 'src/slices/catalogos';
import renderSelectField from 'src/components/FormElements/InputSelect';
import renderTextField from 'src/components/FormElements/InputText';
import InputRadio from 'src/components/FormElements/InputRadio';
import { Fragment } from 'react';

function CuentaRendimientos({
	title,
	description,
	values,
	touched,
	errors,
	handleBlur,
	handleChange,
	catalogoBancos,
	catalogoFrecuencias,
	catalogoTipoIdentificacion,
	tipoCuentasAcreditacion,
	setFieldValue
}) {
	const classes = usesStyles();
	// const [ tipoCuentas, setTipoCuentas ] = useState([]);
	const [ loadingDigitos, setLoadingDigitos ] = useState(false);

	// useEffect(
	// 	() => {
	// 		if (tipoCuentas.length == 0 && values.entidad_bancaria) {
	// 			_getCatalogoTipoCuenta(values.entidad_bancaria);
	// 		}

	// 		if (!values.digitos_cuenta && values.entidad_bancaria && values.tipo_cuenta) {
	// 			_getCatalogoDigitosCuenta(values.entidad_bancaria, values.tipo_cuenta);
	// 		}
	// 	},
	// 	[ values ]
	// );

	// const _getCatalogoTipoCuenta = async (banco_id) => {
	// 	if (!banco_id || banco_id == '') {
	// 		return;
	// 	}

	// 	let response = await getCatalogoTipoCuenta(banco_id);

	// 	if (response.status == 200) {
	// 		let _tipoCuentas = response.data;

	// 		setTipoCuentas([ ..._tipoCuentas ]);

	// 		// setFieldValue();
	// 	}
	// };

	// const _getCatalogoDigitosCuenta = async (banco_id, tipo_cuenta) => {
	// 	setLoadingDigitos(true);

	// 	if (!banco_id || banco_id == '') {
	// 		return;
	// 	}

	// 	if (!tipo_cuenta || tipo_cuenta == '') {
	// 		return;
	// 	}

	// 	let response = await getCatalogoDigitosCuenta(banco_id, tipo_cuenta);

	// 	if (response.status == 200) {
	// 		if (response.data[0]) {
	// 			let { contenido } = response.data[0];

	// 			setFieldValue('digitos_cuenta', +contenido);
	// 		}
	// 	}

	// 	setLoadingDigitos(false);
	// };

	const { entidad_bancaria } = values;

	let banco = entidad_bancaria && _.filter(catalogoBancos, { codigo: entidad_bancaria });
	banco = banco && banco[0] ? banco[0] : {};

	return (
		<Card>
			<CardHeader title={title} />
			<Divider />
			<CardContent>
				<Grid container spacing={2}>
					<Grid item md={8} xs={12}>
						{description && (
							<Alert icon={false} style={{ backgroundColor: 'rgb(246 246 246)' }}>
								{description}
							</Alert>
						)}
					</Grid>

					<Grid item md={2} xs={12}>
						<Field
							error={Boolean(touched.acredita_rend && errors.acredita_rend)}
							fullWidth
							helperText={touched.acredita_rend && errors.acredita_rend}
							name="acredita_rend"
							id="acredita_rend"
							onBlur={handleBlur}
							onChange={(e) => {
								setFieldValue('acredita_rend', e.target.value);
								handleChange(e);
							}}
							value={values.acredita_rend || 'S'}
							variant="outlined"
							data={[ { codigo: 'S', contenido: 'SÍ' }, { codigo: 'N', contenido: 'NO' } ]}
							component={InputRadio}
						/>
					</Grid>
					{values.acredita_rend == 'S' && (
						<Fragment>
							<Grid item md={6} xs={12}>
								<Typography className={classes.SeparateText} variant="body1" color="textPrimary">
									Frecuencia de acreditación
								</Typography>
							</Grid>
							<Grid item md={6} xs={12}>
								<Field
									error={Boolean(touched.forma_abono && errors.forma_abono)}
									fullWidth
									helperText={touched.forma_abono && errors.forma_abono}
									name="forma_abono"
									id="forma_abono"
									onBlur={handleBlur}
									onChange={(e) => {
										setFieldValue('forma_abono', e.target.value);
										handleChange(e);
									}}
									value={values.forma_abono || ''}
									variant="outlined"
									data={catalogoFrecuencias}
									component={InputRadio}
								/>
							</Grid>

							<Grid item md={6} xs={12}>
								{catalogoBancos && (
									<FormControl
										variant="outlined"
										fullWidth
										error={Boolean(touched.entidad_bancaria && errors.entidad_bancaria)}
									>
										<Autocomplete
											id="entidad_bancaria"
											name="entidad_bancaria"
											value={banco}
											options={catalogoBancos}
											getOptionLabel={(option) => option.contenido || ''}
											onBlur={handleBlur}
											// onChange={handleChange}
											onChange={(event, newValue) => {
												setFieldValue('entidad_bancaria', newValue ? newValue.codigo : null);
												handleChange(event);
												// if (newValue) {
												// 	_getCatalogoTipoCuenta(newValue.codigo);
												// 	setFieldValue('tipo_cuenta', null);
												// 	setFieldValue('numero_cuenta', '');
												// 	setFieldValue('digitos_cuenta', null);
												// }
											}}
											renderInput={(params) => (
												<TextField
													{...params}
													onBlur={handleBlur}
													label="Entidad bancaria"
													variant="outlined"
													error={Boolean(touched.entidad_bancaria && errors.entidad_bancaria)}
													helperText={touched.entidad_bancaria && errors.entidad_bancaria}
												/>
											)}
										/>
									</FormControl>
								)}
							</Grid>

							<Grid item md={3} xs={6}>
								<Field
									fullWidth
									error={Boolean(touched.tipo_cuenta && errors.tipo_cuenta)}
									helperText={touched.tipo_cuenta && errors.tipo_cuenta}
									label="Tipo de cuenta"
									name="tipo_cuenta"
									id="tipo_cuenta"
									onBlur={handleBlur}
									// onChange={handleChange}
									onChange={(event) => {
										setFieldValue('tipo_cuenta', event.target.value);
										handleChange(event);
										// if (event.target.value) {
										// 	_getCatalogoDigitosCuenta(values.entidad_bancaria, event.target.value);
										// 	setFieldValue('numero_cuenta', '');
										// 	setFieldValue('digitos_cuenta', null);
										// }
									}}
									value={values.tipo_cuenta || ''}
									variant="outlined"
									data={tipoCuentasAcreditacion}
									component={renderSelectField}
								/>
							</Grid>
							<Grid item md={3} xs={6}>
								<Field
									fullWidth
									error={Boolean(touched.numero_cuenta && errors.numero_cuenta)}
									helperText={touched.numero_cuenta && errors.numero_cuenta}
									label="Número de cuenta"
									id="numero_cuenta"
									name="numero_cuenta"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.numero_cuenta || ''}
									variant="outlined"
									component={renderTextField}
									// endAdornment={
									// 	<InputAdornment position="end">
									// 		{loadingDigitos ? (
									// 			<CircularProgress size={20} />
									// 		) : (
									// 			<Chip
									// 				label={`${values.numero_cuenta.length}/${values.digitos_cuenta || 0}`}
									// 				variant="outlined"
									// 			/>
									// 		)}
									// 	</InputAdornment>
									// }
								/>
							</Grid>

							<Grid item md={6} xs={12}>
								<Field
									error={Boolean(touched.nombre_cuenta && errors.nombre_cuenta)}
									fullWidth
									helperText={touched.nombre_cuenta && errors.nombre_cuenta}
									label="Nombre del titular"
									id="nombre_cuenta"
									name="nombre_cuenta"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.nombre_cuenta || ''}
									variant="outlined"
									component={renderTextField}
								/>
							</Grid>

							<Grid item md={3} xs={6}>
								<Field
									error={Boolean(touched.tipo_ident_cuenta && errors.tipo_ident_cuenta)}
									fullWidth
									helperText={touched.tipo_ident_cuenta && errors.tipo_ident_cuenta}
									label="Tipo de identificación del titular"
									name="tipo_ident_cuenta"
									id="tipo_ident_cuenta"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.tipo_ident_cuenta || ''}
									variant="outlined"
									data={catalogoTipoIdentificacion}
									component={renderSelectField}
								/>
							</Grid>
							<Grid item md={3} xs={12}>
								<Field
									error={Boolean(touched.identificacion_cuenta && errors.identificacion_cuenta)}
									fullWidth
									helperText={touched.identificacion_cuenta && errors.identificacion_cuenta}
									label="Cédula del titular"
									id="identificacion_cuenta"
									name="identificacion_cuenta"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.identificacion_cuenta || ''}
									variant="outlined"
									component={renderTextField}
								/>
							</Grid>
						</Fragment>
					)}
				</Grid>
			</CardContent>
		</Card>
	);
}

CuentaRendimientos.propTypes = {};

export default CuentaRendimientos;

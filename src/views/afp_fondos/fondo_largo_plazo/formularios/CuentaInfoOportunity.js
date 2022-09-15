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
	InputAdornment,
	Chip,
	CircularProgress
} from '@material-ui/core';
import { Field } from 'formik';
import { Alert, Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import { getCatalogoDigitosCuenta, getCatalogoTipoCuenta } from 'src/slices/catalogos';
import renderSelectField from 'src/components/FormElements/InputSelect';
import renderTextField from 'src/components/FormElements/InputText';

const periodosOptions = [
	{
		label: 'MENSUAL',
		codigo: 'MENSUAL'
	},
	{
		label: 'TRIMESTRAL',
		codigo: 'TRIMESTRAL'
	},
	{
		label: 'SEMESTRAL',
		codigo: 'SEMESTRAL'
	}
];

function CuentaInfoOportunity({
	title,
	description,
	values,
	touched,
	errors,
	handleBlur,
	handleChange,
	esCuentaTerceros,
	catalogoBancos,
	setFieldValue,
	codSistemaAporte
}) {
	const classes = usesStyles();
	const [ periodo, setPeriodo ] = useState(values.forma_abono || '01');
	const [ tipoCuentas, setTipoCuentas ] = useState([]);
	const [ loadingDigitos, setLoadingDigitos ] = useState(false);

	useEffect(
		() => {
			if (tipoCuentas.length == 0 && values.entidad_bancaria) {
				_getCatalogoTipoCuenta(values.entidad_bancaria);
			}

			if (!values.digitos_cuenta && values.entidad_bancaria && values.tipo_cuenta) {
				_getCatalogoDigitosCuenta(values.entidad_bancaria, values.tipo_cuenta);
			}
		},
		[ values ]
	);

	const handleChangePeriodo = (newValue) => {
		setPeriodo(newValue);
		values.forma_abono = newValue;
	};

	const _getCatalogoTipoCuenta = async (banco_id) => {
		if (!banco_id || banco_id == '') {
			return;
		}

		let response = await getCatalogoTipoCuenta(banco_id);

		if (response.status == 200) {
			let _tipoCuentas = response.data;

			if (codSistemaAporte == 1) {
				_tipoCuentas = _tipoCuentas.filter((tipo) => tipo.codigo == '02');

				if (_tipoCuentas.length > 0) {
					setFieldValue('tipo_cuenta', _tipoCuentas[0].codigo);

					_getCatalogoDigitosCuenta(values.entidad_bancaria, _tipoCuentas[0].codigo);
				}
			} else if (codSistemaAporte == 4) {
				_tipoCuentas = _tipoCuentas.filter((tipo) => tipo.codigo != '02');

				if (_tipoCuentas.length == 1) {
					setFieldValue('tipo_cuenta', _tipoCuentas[0].codigo);

					_getCatalogoDigitosCuenta(values.entidad_bancaria, _tipoCuentas[0].codigo);
				}
			}

			setTipoCuentas([ ..._tipoCuentas ]);

			// setFieldValue();
		}
	};

	const _getCatalogoDigitosCuenta = async (banco_id, tipo_cuenta) => {
		setLoadingDigitos(true);

		if (!banco_id || banco_id == '') {
			return;
		}

		if (!tipo_cuenta || tipo_cuenta == '') {
			return;
		}

		let response = await getCatalogoDigitosCuenta(banco_id, tipo_cuenta);

		if (response.status == 200) {
			if (response.data[0]) {
				let { contenido } = response.data[0];

				setFieldValue('digitos_cuenta', +contenido);
			}
		}

		setLoadingDigitos(false);
	};

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
					{values.forma_abono && (
						<Grid container spacing={2} justify="center" alignItems="center">
							{periodosOptions.map((itemPeriodo) => (
								<Grid key={itemPeriodo.codigo} item md={3} xs={12}>
									<Button
										className={
											classes[
												periodo === itemPeriodo.codigo
													? 'ColorButtonOnSelect'
													: 'ColorButtonOffSelect'
											]
										}
										onClick={() => handleChangePeriodo(itemPeriodo.codigo)}
										id={itemPeriodo.codigo}
										name={itemPeriodo.codigo}
										fullWidth
										size="large"
										variant="contained"
									>
										{itemPeriodo.label}
									</Button>
								</Grid>
							))}
						</Grid>
					)}
					<Grid item md={6} xs={12}>
						{catalogoBancos && (
							<FormControl variant="outlined" fullWidth error={Boolean(errors.entidad_bancaria)}>
								<Autocomplete
									id="entidad_bancaria"
									name="entidad_bancaria"
									value={banco}
									options={catalogoBancos}
									error={touched.entidad_bancaria && errors.entidad_bancaria}
									helperText={
										touched.entidad_bancaria && errors.entidad_bancaria ? (
											errors.entidad_bancaria
										) : (
											''
										)
									}
									getOptionLabel={(option) => option.contenido || ''}
									onBlur={handleBlur}
									// onChange={handleChange}
									onChange={(event, newValue) => {
										setFieldValue('entidad_bancaria', newValue ? newValue.codigo : null);
										// handleChange(event);
										if (newValue) {
											_getCatalogoTipoCuenta(newValue.codigo);
											setFieldValue('tipo_cuenta', null);
											setFieldValue('numero_cuenta', '');
											setFieldValue('digitos_cuenta', null);
										}
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
								{Boolean(touched.entidad_bancaria && errors.entidad_bancaria) && (
									<FormHelperText>{errors.entidad_bancaria}</FormHelperText>
								)}
							</FormControl>
						)}
					</Grid>

					<Grid item md={3} xs={6}>
						<Field
							error={Boolean(touched.tipo_cuenta && errors.tipo_cuenta)}
							fullWidth
							helperText={touched.tipo_cuenta && errors.tipo_cuenta}
							label="Tipo de cuenta"
							name="tipo_cuenta"
							id="tipo_cuenta"
							onBlur={handleBlur}
							// onChange={handleChange}
							onChange={(event) => {
								
								setFieldValue('tipo_cuenta', event.target.value);
								handleChange(event);
								if (event.target.value) {
									_getCatalogoDigitosCuenta(values.entidad_bancaria, event.target.value);
									setFieldValue('numero_cuenta', '');
									setFieldValue('digitos_cuenta', null);
								}
							}}
							value={values.tipo_cuenta || ''}
							variant="outlined"
							data={tipoCuentas}
							component={renderSelectField}
						/>
					</Grid>
					<Grid item md={3} xs={6}>
						<Field
							error={Boolean(touched.numero_cuenta && errors.numero_cuenta)}
							fullWidth
							helperText={touched.numero_cuenta && errors.numero_cuenta}
							label="Número de cuenta"
							id="numero_cuenta"
							name="numero_cuenta"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.numero_cuenta || ''}
							variant="outlined"
							component={renderTextField}
							endAdornment={
								<InputAdornment position="end">
									{loadingDigitos ? (
										<CircularProgress size={20} />
									) : (
										<Chip
											label={`${values.numero_cuenta.length}/${values.digitos_cuenta || 0}`}
											variant="outlined"
										/>
									)}
								</InputAdornment>
							}
						/>
					</Grid>
				</Grid>
				<Box mt={2}>
					<Grid container spacing={2}>
						<Grid item md={6} xs={12}>
							<Field
								error={Boolean(touched.nombre_cuenta && errors.nombre_cuenta)}
								fullWidth
								disabled={!Boolean(esCuentaTerceros)}
								helperText={touched.nombre_cuenta && errors.nombre_cuenta}
								label="Nombre de titular de cuenta"
								id="nombre_cuenta"
								name="nombre_cuenta"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.nombre_cuenta || ''}
								variant="outlined"
								component={renderTextField}
							/>
						</Grid>
						<Grid item md={6} xs={12}>
							<Field
								error={Boolean(touched.identificacion_cuenta && errors.identificacion_cuenta)}
								fullWidth
								disabled={!Boolean(esCuentaTerceros)}
								helperText={touched.identificacion_cuenta && errors.identificacion_cuenta}
								label="Cédula de titular cuenta"
								id="identificacion_cuenta"
								name="identificacion_cuenta"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.identificacion_cuenta || ''}
								variant="outlined"
								component={renderTextField}
							/>
						</Grid>
					</Grid>
				</Box>
			</CardContent>
		</Card>
	);
}

CuentaInfoOportunity.propTypes = {};

export default CuentaInfoOportunity;

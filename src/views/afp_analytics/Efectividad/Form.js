import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import InputDate from 'src/components/FormElements/InputDate';
import InputSelect from 'src/components/FormElements/InputSelect';

import { XCircle as ErrorIcon, CheckCircle as SuccessIcon, Circle as DefaultIcon } from 'react-feather';

function Form({ estados, fe_inicio, fe_fin, onChangeDates }) {
	const [ estadoSelected, setEstadoSelected ] = useState({ id: 7, codigo: 'success', contenido: 'alta' });
	const [ showSelect, setShowSelect ] = useState(false);

	let _estados = [ ...estados ].filter((estado) => estado.descripcion).sort((a, b) => {
		return +a.orden_estricto - +b.orden_estricto;
	});

	return (
		<Formik
			initialValues={{ fe_inicio, fe_fin }}
			enableReinitialize={true}
			validationSchema={Yup.object().shape({
				fe_inicio: Yup.date().required('Se debe elegir una fecha'),
				fe_fin: Yup.date().required('Se debe elegir una fecha'),
				estado: Yup.string()
			})}
			onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				onChangeDates({
					fe_inicio: dayjs(values.fe_inicio).format('YYYY-MM-DD'),
					fe_fin: dayjs(values.fe_fin).format('YYYY-MM-DD'),
					estado: estadoSelected.id
				});
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
				<form onSubmit={handleSubmit}>
					<Grid container direction="row-reverse" spacing={2}>
						<Grid item>
							<Button type="submit" size="small" color="primary">
								Filtrar
							</Button>
						</Grid>
						<Grid item>
							<Field
								name="fe_fin"
								id="fe_fin"
								label="Fecha fin"
								fullWidth
								variant="outlined"
								value={values.fe_fin}
								error={Boolean(touched && touched.fe_fin && errors && errors.fe_fin)}
								helperText={touched && touched.fe_fin && errors && errors.fe_fin}
								onBlur={handleBlur}
								onChange={(date) => setFieldValue('fe_fin', date)}
								component={InputDate}
							/>
						</Grid>
						<Grid item>
							<Field
								name="fe_inicio"
								id="fe_inicio"
								label="Fecha inicio"
								fullWidth
								variant="outlined"
								value={values.fe_inicio}
								error={Boolean(touched && touched.fe_inicio && errors && errors.fe_inicio)}
								helperText={touched && touched.fe_inicio && errors && errors.fe_inicio}
								onBlur={handleBlur}
								onChange={(date) => setFieldValue('fe_inicio', date)}
								component={InputDate}
							/>
						</Grid>
						<Grid item>
							<Grid container>
								{showSelect ? (
									<Grid item>
										<Field
											error={Boolean(touched.estado && errors.estado)}
											helperText={touched.estado && errors.estado}
											onBlur={handleBlur}
											onChange={(e) => {
												handleChange(e);
												setShowSelect(false);
												let id = e.target.value;

												setEstadoSelected(estados.find((item) => item.id == id));
											}}
											value={values.estado}
											label="Estado"
											name="estado"
											id="estado"
											data={_estados.map((item) => {
												return { codigo: item.id, contenido: item.descripcion };
											})}
											component={InputSelect}
										/>
									</Grid>
								) : (
									<Grid item>
										<IconButton
											onClick={() => {
												setShowSelect(true);

												setTimeout(() => {
													document.getElementById('estado').focus();
												}, 1000);
											}}
											variant="contained"
											style={{
												color:
													estadoSelected.codigo == ''
														? '#fafafa'
														: estadoSelected.codigo == 'default'
															? '#263238'
															: estadoSelected.codigo == 'success'
																? '#20c997'
																: estadoSelected.codigo == 'error' && '#d63384'
											}}
										>
											{estadoSelected.codigo === 'error' ? (
												<ErrorIcon />
											) : estadoSelected.codigo == 'success' ? (
												<SuccessIcon />
											) : (
												<DefaultIcon />
											)}
										</IconButton>
										<Typography align="center" variant="subtitle2" display="block" gutterBottom>
											{estadoSelected.contenido}
										</Typography>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	);
}

Form.propTypes = {};

export default Form;

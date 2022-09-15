import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import InputDate from 'src/components/FormElements/InputDate';
import InputSelect from 'src/components/FormElements/InputSelect';

import { XCircle as ErrorIcon, CheckCircle as SuccessIcon, Circle as DefaultIcon } from 'react-feather';

function Form({ fe_inicio, fe_fin, onChangeDates }) {
	return (
		<Formik
			initialValues={{ fe_inicio, fe_fin }}
			enableReinitialize={true}
			validationSchema={Yup.object().shape({
				fe_inicio: Yup.date().required('Se debe elegir una fecha'),
				fe_fin: Yup.date().required('Se debe elegir una fecha')
			})}
			onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				onChangeDates({
					fe_inicio: dayjs(values.fe_inicio).format('YYYY-MM-DD'),
					fe_fin: dayjs(values.fe_fin).format('YYYY-MM-DD')
				});
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
				<form onSubmit={handleSubmit}>
					<Grid container direction="row" spacing={2} alignItems="center" justify="flex-end">
						<Grid item xs={12} md={3}>
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
								size="small"
							/>
						</Grid>
						<Grid item xs={12} md={3}>
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
								size="small"

							/>
						</Grid>


						<Grid item xs={12} md={1}>
							<Button
								type="submit"
								size="small"
								color="primary"
								fullWidth
							// disabled={buildingSala}
							// onClick={buildingSala ? () => {} : () => handleBuildsala(user.numero_identificacion)}
							// startIcon={buildingSala ? <CircularProgress size={18} /> : false}
							>
								Filtrar
							</Button>
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	);
}

Form.propTypes = {};

export default Form;

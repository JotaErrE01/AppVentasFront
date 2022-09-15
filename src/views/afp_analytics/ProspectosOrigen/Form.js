import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@material-ui/core';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import InputDate from 'src/components/FormElements/InputDate';

function Form({ fe_inicio, fe_fin, onChangeDates }) {
	return (
		<Formik
			initialValues={{ fe_inicio, fe_fin }}
			enableReinitialize={true}
			validationSchema={Yup.object().shape({
				fe_inicio: Yup.date().required('Ingrese una fecha de inicio'),
				fe_fin: Yup.date().required('Ingrese una fecha de fin')
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
					<Grid container direction="row-reverse" spacing={2}>
						<Grid item>
							<Button
								type="submit"
								size="small"
								color="primary"
								// disabled={buildingSala}
								// onClick={buildingSala ? () => {} : () => handleBuildsala(user.numero_identificacion)}
								// startIcon={buildingSala ? <CircularProgress size={18} /> : false}
							>
								Filtrar
							</Button>
						</Grid>
						<Grid item>
							<Field
								name="fe_fin"
								id="fe_fin"
								label="Fecha de fin"
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
								label="Fecha de inicio"
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
					</Grid>
				</form>
			)}
		</Formik>
	);
}

Form.propTypes = {};

export default Form;

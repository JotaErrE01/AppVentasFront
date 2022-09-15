import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormControl, Grid, IconButton, InputLabel, Select, Typography } from '@material-ui/core';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import InputDate from 'src/components/FormElements/InputDate';
import { parseISO } from 'date-fns';

import { XCircle as ErrorIcon, CheckCircle as SuccessIcon, Circle as DefaultIcon } from 'react-feather';
import JSONTree from 'react-json-tree';

function Form({onChangeDates, options, payload, setPayload}) {

	return (

		<Box m={1} display="flex" justifyContent="flex-end" alignItems="center" bgcolor="background.paper">

			<Formik
				initialValues={payload}
				enableReinitialize={true}
				validationSchema={Yup.object().shape({
					date_a: Yup.date().required('Se debe elegir una fecha'),
					date_b: Yup.date().required('Se debe elegir una fecha'),
				})}
				onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
				
					setPayload({
						...values,
						date_a:values.date_a,
						date_b: values.date_b
					});

					onChangeDates({
						...values,
						date_a:values.date_a,
						date_b:values.date_b
					});
				}}
			>
				{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
					<form onSubmit={handleSubmit}>
						<Grid container direction="row-reverse" spacing={2} alignItems="center">
							<Grid item>
								<Button type="submit" color="primary">
									Actualizar
								</Button>
							</Grid>
							<Grid item>
								<Field
									name="date_b"
									id="date_b"
									label="Fecha fin"
									fullWidth
									variant="outlined"
									value={parseISO(values.date_b)}
									error={Boolean(touched && touched.date_b && errors && errors.date_b)}
									helperText={touched && touched.date_b && errors && errors.date_b}
									onBlur={handleBlur}
									onChange={(date) => setFieldValue(
										'date_b', 
										dayjs(date).format('YYYY-MM-DD')
									)}
									component={InputDate}
								/>
							</Grid>
							<Grid item>
								<Field
									name="date_a"
									id="date_a"
									label="Fecha inicio"
									fullWidth
									variant="outlined"
									value={parseISO(values.date_a)}
									error={Boolean(touched && touched.date_a && errors && errors.date_a)}
									helperText={touched && touched.date_a && errors && errors.date_a}
									onBlur={handleBlur}
									onChange={(date) => setFieldValue(
										'date_a', 
										dayjs(date).format('YYYY-MM-DD')
									)}
									component={InputDate}
								/>
							</Grid>

							<Grid item >
								<FormControl variant="outlined" fullWidth>
									<InputLabel htmlFor="outlined-age-native-simple">
										Fecha de
                           			</InputLabel>
									<Select
										fullWidth
										native
										value={values.on}
										onChange={(e) => setFieldValue('on', e.target.value)}
										label="pick_motivo"
									>
										<option aria-label="None" value="" />
										{
											options.map(item => (
												<option value={item}>{item}</option>
											))
										}
									</Select>
								</FormControl>
							</Grid>




						</Grid>
					</form>
				)}
			</Formik>

		</Box>

	);
}

Form.propTypes = {};

export default Form;

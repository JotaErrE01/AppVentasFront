import React, { Fragment, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { CircularProgress, Link, Button, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'src/store';
import { Alert as Alerta } from '@material-ui/lab';
import { envioCedParaSteps } from 'src/slices/clientes';
import { getClientesSearch } from 'src/slices/clientes';

import renderTextField from '../../../components/FormElements/InputText';
import { useSnackbar } from 'notistack';
import LoadSpinner from 'src/components/LoadSpinner';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(6)
		}
	},
	button: {
		fontSize: 16,
		marginBottom: theme.spacing(2),
		marginRight: theme.spacing(1)
	},
	form: {
		marginBottom: theme.spacing(6)
	}
}));
const FormConsultarCedula = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const { fondoSeleccionado, cliente } = useSelector((state) => state.cliente);
	const data = useSelector((state) => state.cliente.ConsultarData);
	const name = useSelector((state) => state.cliente.ConsultarData.primer_nombre);
	const lastName = useSelector((state) => state.cliente.ConsultarData.primer_apellido);
	const identification = useSelector((state) => state.cliente.ConsultarData.numero_identificacion);
	const step = useSelector((state) => state.cliente.ConsultarData.step);
	const Alert = useSelector((state) => state.cliente.Alert);
	const comunicacionAfp = useSelector((state) => state.cliente.comunicacionAfp);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(
		() => {
			if (!comunicacionAfp) {
				enqueueSnackbar('Error al comunicarse con la base de datos', {
					variant: 'error'
				});
			}
		},
		[ comunicacionAfp ]
	);

	const createClient = (ced) => {
		dispatch(envioCedParaSteps(ced));
	};

	return (
		<Formik
			enableReinitialize
			initialValues={{
				numero_identificacion: '',
				submit: null
			}}
			validationSchema={Yup.object().shape({
				numero_identificacion: Yup.string()
					.matches(/^[0-9]+$/gm, 'Solo se admiten números!')
					.min(8, 'Debe de tener al menos 8 dígitos')
					.required('Se requiere llenar este campo')
			})}
			onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
				try {
					setSubmitting(true);
					dispatch(getClientesSearch(values.numero_identificacion));
					setStatus({ success: true });
				} catch (err) {
					console.error(err);
					setStatus({ success: false });
					setErrors({ submit: err.message });
					setSubmitting(false);
				}
			}}
		>
			{({ errors, handleChange, handleBlur, handleSubmit, isSubmitting, touched, values }) => (
				<form onSubmit={handleSubmit}>
					<Box mt={3}>
						<Grid container direction="row" className={classes.root}>
							<Field
								error={Boolean(touched.numero_identificacion && errors.numero_identificacion)}
								helperText={touched.numero_identificacion && errors.numero_identificacion}
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.numero_identificacion}
								label="Numero de Identificación"
								name="numero_identificacion"
								id="numero_identificacion"
								component={renderTextField}
							/>
						</Grid>
						<LoadSpinner />
						<Grid container direction="row" alignItems="center" justify="center">
							{Alert && (
								<Link exact to="/afp/clientes/crear" component={RouterLink}>
									<Button
										onClick={() => createClient(values.numero_identificacion)}
										variant="contained"
										style={{ background: 'white', color: 'black' }}
										className={classes.button}
										startIcon={<PersonAddIcon />}
									>
										CREAR CLIENTE
									</Button>
								</Link>
							)}
							<Button
								variant="contained"
								style={{ background: 'black', color: 'white' }}
								className={classes.button}
								disabled={isSubmitting}
								type="submit"
								startIcon={<SearchIcon />}
							>
								BUSCAR CLIENTE
							</Button>
						</Grid>
					</Box>
				</form>
			)}
		</Formik>
	);
};

export default FormConsultarCedula;

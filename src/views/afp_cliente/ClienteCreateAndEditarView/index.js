import React, { useState, useEffect, Fragment } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Container, Grid, Link, Typography, makeStyles, LinearProgress } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Page from 'src/components/Page';
import { useDispatch, useSelector } from 'src/store';
import { useHistory } from 'react-router-dom';
import { postSearchEmpresa, setEmpresa } from 'src/slices/empresas';

import ClienteCreateAndEditarViewStepOne from './Step1/Index';
import ClienteCreateAndEditarViewStepTwo from './Step2/Index';
import ClienteCreateAndEditarViewStepThree from './Step3/Index';
import { useSnackbar } from 'notistack';
import { getClienteById } from 'src/slices/clientes';

import LoadingScreen from 'src/components/LoadingScreen';
import { getCatalogosCliente, getCatalogoTiposDocumento, getGeoCatalogos } from 'src/slices/catalogos';

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: '#F2F2F2',
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	},
	separate: {
		marginTop: '1.5em'
	},
	separateButton: {
		marginTop: '1.5em',
		paddingLeft: '1.5em',
		paddingRight: '1.5em'
	}
}));

const ClienteCreateAndEditarView = () => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const history = useHistory();
	const { ConsultarData, loadingCliente } = useSelector((state) => state.cliente);
	const { empresa } = useSelector((state) => state.empresa);
	const CedStep = ConsultarData.numero_identificacion;
	const { enqueueSnackbar } = useSnackbar();

	let [ currentPage, setCurrentPage ] = useState(1);
	const [ actionType, setActionType ] = useState(1);

	const { idCliente, paso } = useParams();

	useEffect(() => {
		dispatch(getCatalogosCliente());
		dispatch(getCatalogoTiposDocumento());

		if (idCliente && idCliente != ConsultarData.id) {
			dispatch(
				getClienteById(idCliente, (cliente) => {
					let { empresa } = cliente;

					empresa && empresa.id && dispatch(setEmpresa(empresa));

					dispatch(getGeoCatalogos(cliente));
				})
			);
		} else {
			let { empresa } = ConsultarData;

			empresa && empresa.id && dispatch(setEmpresa(empresa));

			dispatch(getGeoCatalogos(ConsultarData));
		}
	}, []);

	if (paso) {
		currentPage = +paso;
	}

	const setPage = (page) => {
		setCurrentPage(page);
	};

	const mensajeAlert = (typeAlert, actionType, message = '') => {
		if (typeAlert == 1 && actionType == 1) {
			enqueueSnackbar('Los datos del cliente fueron registrados con éxito', {
				variant: 'success'
			});
		} else if (typeAlert == 0 && actionType == 1) {
			enqueueSnackbar('Error al registrar los datos intentelo nuevamente' + message, {
				variant: 'error'
			});
		} else if (typeAlert == 1 && actionType == 0) {
			enqueueSnackbar('Los datos del cliente fueron registrados con éxito', {
				variant: 'success'
			});
		} else if (typeAlert == 0 && actionType == 0) {
			enqueueSnackbar('Error al registrar los datos intentelo nuevamente' + message, {
				variant: 'error'
			});
		}
	};

	// const previusPage = () => {
	// 	setCurrentPage(currentPage - 1);
	// };

	const crateOrEdit = (actionType) => {
		switch (actionType) {
			case 0:
				return (
					<Fragment>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
								{' '}
								Ventas{' '}
							</Link>
							<Typography variant="body1" color="textPrimary">
								{' '}
								Mantenimiento de Clientes{' '}
							</Typography>
						</Breadcrumbs>
						<Typography variant="h3" color="textPrimary">
							{' '}
							Editar Cliente {ConsultarData.primer_nombre} {ConsultarData.primer_apellido}
						</Typography>
					</Fragment>
				);
			case 1:
				return (
					<Fragment>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
								{' '}
								Ventas{' '}
							</Link>
							<Typography variant="body1" color="textPrimary">
								{' '}
								Creación de Clientes{' '}
							</Typography>
						</Breadcrumbs>
					</Fragment>
				);
			default:
				return null;
		}
	};

	const RenderStep = ({ currentPage }) => {
		switch (currentPage) {
			case 1:
				return (
					<ClienteCreateAndEditarViewStepOne
						dataCliente={ConsultarData}
						cedulaCli={CedStep}
						actionType={actionType}
						setPage={setPage}
						mensajeAlert={mensajeAlert}
						reloadCatalogos={() => {
							dispatch(getCatalogosCliente());
							dispatch(getCatalogoTiposDocumento());
							dispatch(getGeoCatalogos(ConsultarData));
						}}
					/>
				);
			case 2:
				return (
					<ClienteCreateAndEditarViewStepTwo
						dataCliente={ConsultarData}
						cedulaCli={CedStep}
						actionType={actionType}
						setPage={setPage}
						// nextPage={nextPage}
						// previusPage={previusPage}
						mensajeAlert={mensajeAlert}
					/>
				);
			case 3:
				return (
					<ClienteCreateAndEditarViewStepThree
						dataCliente={ConsultarData}
						cedulaCli={CedStep}
						actionType={actionType}
						setPage={setPage}
						// nextPage={nextPage}
						// previusPage={previusPage}
						empresa={empresa}
						mensajeAlert={mensajeAlert}
					/>
				);
			default:
				return null;
		}
	};

	if (loadingCliente || !ConsultarData.id) {
		return <LoadingScreen />;
	}

	return (
		<Page className={classes.root} title="Clientes">
			<Container maxWidth="lg">
				{crateOrEdit(actionType)}
				<Box>
					<Grid container>
						<Grid item md={12} xs={12}>
							{ConsultarData.id && <RenderStep currentPage={currentPage} />}
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Page>
	);
};

export default ClienteCreateAndEditarView;

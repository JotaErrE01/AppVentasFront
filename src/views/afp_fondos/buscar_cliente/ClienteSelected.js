import React, { Fragment } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Link, Button, Divider, Grid, Box, Typography, Avatar, colors } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setOportunidad } from 'src/slices/clientes';
import getInitials from 'src/utils/getInitials';
import { envioAllParaSteps } from 'src/slices/clientes';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
	title: {
		fontFamily: 'Roboto',
		fontSize: '16px',
		fontStyle: 'normal',
		fontWeight: '500',
		lineHeight: '20px',
		letterSpacing: '-0.05000000074505806px',
		textAlign: 'left'
	},
	avatar: {
		backgroundColor: colors.red[500],
		color: colors.common.white
	},
	paper: {
		padding: theme.spacing(2),
		margin: 'auto',
		maxWidth: 637
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	list: {
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	flex: {
		flexGrow: 1
	},
	separateButtons: {
		paddingTop: theme.spacing(2)
	},
	alert: {
		marginBottom: theme.spacing(2)
	}
}));

const ClienteSelected = ({ cliente, fondoSeleccionado, handleNo }) => {
	const { TabOnCreateFondo, fondoCortoAndLargoPlazo } = useSelector((state) => state.fondo);
	const classes = useStyles();
	const dispatch = useDispatch();

	let { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, step } = cliente;
	const { intencionId } = useParams()

	// const sendFondoOportunidad = () => {
	// 	dispatch(getFondoAporteList(numero_identificacion, fondoSeleccionado));
	// 	dispatch(getObtenerDocumentosFondo(fondoSeleccionado.codigo));
	// };

	const completeCliente = (data) => {
		dispatch(envioAllParaSteps(data));
	};

	// const renderContinuar = () => {
	// 	if (TabOnCreateFondo === 'verOportunidad') {
	// 		return (
	// 			<Fragment>
	// 				<Link
	// 					component={RouterLink}
	// 					to={`/afp/crm/oportunidad/lista/oportunidades/${fondoCortoAndLargoPlazo}`}
	// 				>
	// 					<Button onClick={() => sendFondoOportunidad()} style={{ color: 'white', background: 'black' }}>
	// 						CONTINUAR
	// 					</Button>
	// 				</Link>
	// 			</Fragment>
	// 		);
	// 	} else if (TabOnCreateFondo === 'crearOportunidad') {
	// 		return (
	// 			<Fragment>
	// 				<Link component={RouterLink} to={`/afp/crm/oportunidad/mantenimientoOportunidad/largoPlazo`}>
	// 					<Button onClick={() => sendFondoOportunidad()} style={{ color: 'white', background: 'black' }}>
	// 						CONTINUAR
	// 					</Button>
	// 				</Link>
	// 			</Fragment>
	// 		);
	// 	}
	// };

	const canContinue = (() => {
		if (cliente && cliente.tipo_afiliacion) {
			let _canContinue = cliente.tipo_afiliacion.find(
				(tipo) => tipo.fondo_contenido == fondoSeleccionado.contenido && tipo.status == 'error'
			);

			if (!_canContinue) return true;
		}

		return false;
	})();

	return (
		<Fragment>
			<Grid item xs>
				<Box>
					{cliente &&
						cliente.tipo_afiliacion.map((item) => (
							<Alert className={classes.alert} severity={item.status}>
								<strong>{item.fondo_contenido}</strong>— {item.contenido}
							</Alert>
						))}
				</Box>
				<Box mb={6} mt={6} ml={4}>
					<Grid xs team container direction="row">
						<Box>
							<Avatar className={classes.avatar}>
								{getInitials(primer_nombre, 1)}
								{getInitials(primer_apellido, 1)}
							</Avatar>
						</Box>
						<Box ml={2}>
							<Typography>
								{primer_nombre} {segundo_nombre} {primer_apellido} {segundo_apellido}
							</Typography>
							<Typography color="textSecondary" gutterBottom>
								{numero_identificacion}
							</Typography>
						</Box>
					</Grid>
				</Box>
				<Divider />
				<Grid item xs container className={classes.separateButtons} direction="row" justify="flex-end">
					<Link component={RouterLink}>
						<Button onClick={handleNo} style={{ color: 'black', background: 'white' }}>
							NO
						</Button>
					</Link>
					{step ? (
						<Link
							component={RouterLink}
							exact
							to={'/afp/clientes/crear?codigoFondo=' + fondoSeleccionado.codigo}
						>
							<Button
								onClick={() => completeCliente(cliente)}
								style={{ color: 'white', background: 'black' }}
							>
								TERMINAR DE CREAR
							</Button>
						</Link>
					) : canContinue ? (
						<Link
							component={RouterLink}
							to={
								`/afp/crm/oportunidad/mantenimientoOportunidad/${cliente.id}
								/crear/${fondoSeleccionado.codigo}`
							}
						
							
						>
							<Button
								onClick={() => dispatch(setOportunidad({}))}
								style={{ color: 'white', background: 'black' }}
								disabled={!canContinue}
							>
								CONTINUAR
							</Button>
						</Link>
					) : (
						<Button disabled color="default">
							CONTINUAR
						</Button>
					)}
				</Grid>
			</Grid>
		</Fragment>
	);
};

export default ClienteSelected;

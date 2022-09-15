import React, { useEffect, useState } from 'react';

import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Divider,
	Link,
	Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/styles';
import { Alert } from '@material-ui/lab';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getEfectividad, getProspectos } from 'src/slices/analytics';
import { useDispatch, useSelector } from 'react-redux';
import TableDetalles from './TableDetalles';
import Chart from './Chart';
import Form from './Form';
import dayjs from 'dayjs';
import { getOportunidadEstados } from 'src/slices/oportunidad';
import { getSalasCore } from 'src/slices/coreSala';
import { useSnackbar } from 'notistack';
import ChartSalasUsuarios from './ChartSalasUsuarios';
import useAuth from 'src/contextapi/hooks/useAuth';

function EfectividadView() {
	const { user: userSession } = useAuth();

	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

	const dispatch = useDispatch();

	const [ feIni, setFeIni ] = useState();
	const [ feFin, setfeFin ] = useState();

	const { efectividadLabels, efectividadPayload, efectividadLoading } = useSelector((state) => state.analytics);
	const { loadingOportunidadEstados, oportunidadEstados } = useSelector((state) => state.oportunidad);
	const { coreSalaArr } = useSelector((state) => state.coreSala);

	useEffect(
		() => {
			let fe_fin = dayjs();
			let fe_inicio = dayjs().subtract(6, 'month');
			dispatch(getEfectividad(fe_inicio.format('YYYY-MM-DD'), fe_fin.format('YYYY-MM-DD')));

			setFeIni(fe_inicio.toDate());
			setfeFin(fe_fin.toDate());

			dispatch(getOportunidadEstados());

			dispatch(getSalasCore(enqueueSnackbar));
		},
		[ dispatch ]
	);

	let salas = (() =>
		coreSalaArr.filter(
			(sala) => userSession.subordinados.split('|').indexOf(sala.host.numero_identificacion) != -1
		))();

	return (
		<Page className={classes.root} title="Oportunidades">
			<Container maxWidth="xl">
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
					<Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
						Analítica
					</Link>
					<Link variant="body1" color="inherit" to="/afp/analytics" component={RouterLink}>
						Reportes
					</Link>
					<Typography variant="body1" color="textPrimary">
						Oportunidades por usuario
					</Typography>
				</Breadcrumbs>
				<Box mt={3}>
					<Card>
						<CardContent>
							<Form
								estados={oportunidadEstados}
								fe_inicio={feIni}
								fe_fin={feFin}
								onChangeDates={({ estado, fe_inicio, fe_fin }) => {
									return dispatch(getEfectividad(fe_inicio, fe_fin, estado));
								}}
							/>
						</CardContent>
					</Card>
				</Box>

				{salas.length > 0 && (
					<Box mt={3}>
						<Card>
							<CardHeader title="Oportunidades por salas" />
							<Divider />
							<CardContent>
								{!efectividadLoading && (
									<Box mt={2}>
										{(() => {
											let payload = salas.map((sala) => {
												let usuarios = sala.users.map((user) => user.user_id);

												let filtered = efectividadPayload.filter((item) => {
													let index = usuarios.indexOf(item.user_id);

													return index != -1;
												});

												let obj = { nombre: sala.descripcion_sala };
												efectividadLabels.forEach((lb) => {
													let sum = 0;
													filtered.forEach((item) => {
														sum += item[lb.split(' ').join('_')].monto;
													});

													obj[lb.split(' ').join('_')] = { monto: sum };
												});

												return obj;
											});

											return <Chart labels={efectividadLabels} payload={payload} />;
										})()}
									</Box>
								)}
							</CardContent>
						</Card>
					</Box>
				)}

				{salas.length > 0 && (
					<Box mt={3}>
						<Card>
							<CardHeader title="Oportunidades de usuarios por salas" />
							<Divider />
							<CardContent>
								{!efectividadLoading && (
									<Box mt={2}>
										<ChartSalasUsuarios
											salas={salas}
											efectividadLabels={efectividadLabels}
											efectividadPayload={efectividadPayload}
										/>
									</Box>
								)}
							</CardContent>
						</Card>
					</Box>
				)}

				<Box mt={3}>
					<Card>
						<CardHeader title="Oportunidades de usuarios" />
						<Divider />
						<CardContent>
							{/* <Typography gutterBottom variant="h5" component="h2">
								Oportunidades de usuarios
							</Typography> */}
							{!efectividadLoading && <Chart labels={efectividadLabels} payload={efectividadPayload} />}
						</CardContent>
					</Card>
				</Box>

				<Box mt={3}>
					<Card>
						<CardContent>
							<TableDetalles
								loading={efectividadLoading}
								labels={efectividadLabels}
								payload={efectividadPayload}
							/>
						</CardContent>
						{/* <CardActions>
							<Button
								size="small"
								color="primary"
								// disabled={buildingSala}
								// onClick={buildingSala ? () => {} : () => handleBuildsala(user.numero_identificacion)}
								// startIcon={buildingSala ? <CircularProgress size={18} /> : false}
							>
								Actualizando
							</Button>
						</CardActions> */}
					</Card>
				</Box>
			</Container>
		</Page>
	);
}

export default EfectividadView;

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
	},
	menu: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	}
}));

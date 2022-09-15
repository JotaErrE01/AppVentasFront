import React, { useEffect, useState } from 'react';

import {
	AppBar,
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Divider,
	Grid,
	Link,
	Tab,
	Tabs,
	Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/styles';
import { Alert } from '@material-ui/lab';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getEfectividad, getFirmaPersona, getFirmaTotales, getProspectos } from 'src/slices/analytics';
import { useDispatch, useSelector } from 'react-redux';
import TableDetalles from './TableDetalles';
import Chart from './Chart';
import Form from './Form';
import dayjs from 'dayjs';
import { getOportunidadEstados } from 'src/slices/oportunidad';
import ChartUsuarios from './ChartUsuarios';
import { useSnackbar } from 'notistack';
import { getSalasCore } from 'src/slices/coreSala';
import useAuth from 'src/contextapi/hooks/useAuth';

function EfectividadView() {
	const { user: userSession } = useAuth();

	const classes = useStyles();

	const dispatch = useDispatch();

	const { enqueueSnackbar } = useSnackbar();

	const [ feIni, setFeIni ] = useState();
	const [ feFin, setfeFin ] = useState();
	const [ value, setValue ] = React.useState(0);

	const {
		firmaTotalesLabels,
		firmaTotalesPayload,
		firmaTotalesLoading,

		firmaIntentosLabels,
		firmaIntentosPayload,
		firmaExitosLabels,
		firmaExitosPayload,
		firmaPersonaLoading
	} = useSelector((state) => state.analytics);
	const { coreSalaArr } = useSelector((state) => state.coreSala);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(
		() => {
			let fe_fin = dayjs();
			let fe_inicio = dayjs().subtract(6, 'month');

			dispatch(getFirmaTotales(fe_inicio.format('YYYY-MM-DD'), fe_fin.format('YYYY-MM-DD')));

			dispatch(getFirmaPersona(fe_inicio.format('YYYY-MM-DD'), fe_fin.format('YYYY-MM-DD')));

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
		<Page className={classes.root} title="Analiticas | Prospectos">
			<Container maxWidth="xl">
				<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
					<Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
						Analítica
					</Link>
					<Link variant="body1" color="inherit" to="/afp/analytics" component={RouterLink}>
						Reportes
					</Link>
					<Typography variant="body1" color="textPrimary">
						Firmas
					</Typography>
				</Breadcrumbs>
				<Box mt={3}>
					<Card>
						<CardContent>
							<Form
								fe_inicio={feIni}
								fe_fin={feFin}
								onChangeDates={({ fe_inicio, fe_fin }) => {
									dispatch(getFirmaTotales(fe_inicio, fe_fin));
									dispatch(getFirmaPersona(fe_inicio, fe_fin));
								}}
							/>
						</CardContent>
					</Card>
				</Box>
				<Box mt={3}>
					<Card>
						<CardHeader title="Envíos a firmar vs Firmas exitosas" />
						<Divider />
						<CardContent>
							{!firmaTotalesLoading && (
								<Chart labels={firmaIntentosLabels} payload={firmaTotalesPayload} />
							)}
						</CardContent>
					</Card>
				</Box>
				{salas.length > 0 && (
					<Box mt={3}>
						<Card>
							<CardHeader title="Envíos a firmar vs Firmas exitosas por salas" />
							<Divider />
							<CardContent>
								{!firmaPersonaLoading &&
									(() => {
										let intentosPayload = salas.map((sala) => {
											let usuarios = sala.users.map((user) => user.user_id);

											let _intentos = firmaIntentosPayload.filter((item) => {
												let index = usuarios.indexOf(item.user_id);

												return index != -1;
											});

											let obj = { nombre: sala.descripcion_sala };
											firmaIntentosLabels.forEach((lb) => {
												let sum = 0;
												_intentos.forEach((item) => {
													sum += item[lb.split(' ').join('_')];
												});

												obj[lb.split(' ').join('_')] = sum;
											});

											return obj;
										});

										let exitosPayload = salas.map((sala) => {
											let usuarios = sala.users.map((user) => user.user_id);

											let _exitos = firmaExitosPayload.filter((item) => {
												let index = usuarios.indexOf(item.user_id);

												return index != -1;
											});

											let obj = { nombre: sala.descripcion_sala };
											firmaExitosLabels.forEach((lb) => {
												let sum = 0;
												_exitos.forEach((item) => {
													sum += item[lb.split(' ').join('_')];
												});

												obj[lb.split(' ').join('_')] = sum;
											});

											return obj;
										});

										return (
											<ChartUsuarios
												firmaIntentosLabels={firmaIntentosLabels}
												firmaIntentosPayload={intentosPayload}
												firmaExitosLabels={firmaExitosLabels}
												firmaExitosPayload={exitosPayload}
											/>
										);
									})()}
							</CardContent>
						</Card>
					</Box>
				)}

				{salas.length > 0 && (
					<Box mt={3}>
						<Card>
							<CardHeader title="Envíos a firmar vs Firmas exitosas por salas y usuarios" />
							<Divider />
							<CardContent>
								{!firmaPersonaLoading && (
									<div className={classes.tabs}>
										<AppBar position="static" color="default">
											<Tabs
												value={value}
												onChange={handleChange}
												indicatorColor="primary"
												textColor="primary"
												variant="scrollable"
												scrollButtons="auto"
												aria-label="scrollable auto tabs example"
											>
												{salas.map((sala, index) => (
													<Tab label={sala.descripcion_sala} {...a11yProps(index)} />
												))}
											</Tabs>
										</AppBar>
										{salas.map((sala, index) => {
											return (
												<TabPanel value={value} index={index}>
													{(() => {
														let usuarios = sala.users.map((user) => user.user_id);

														let _exitos = firmaExitosPayload.filter((item) => {
															let index = usuarios.indexOf(item.user_id);

															return index != -1;
														});

														let _intentos = firmaIntentosPayload.filter((item) => {
															let index = usuarios.indexOf(item.user_id);

															return index != -1;
														});

														return (
															<ChartUsuarios
																firmaIntentosLabels={firmaIntentosLabels}
																firmaIntentosPayload={_intentos}
																firmaExitosLabels={firmaExitosLabels}
																firmaExitosPayload={_exitos}
															/>
														);
													})()}
												</TabPanel>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>
					</Box>
				)}

				<Box mt={3}>
					<Card>
						<CardHeader title="Envíos a firmar vs Firmas exitosas por usuarios" />
						<Divider />
						<CardContent>
							{!firmaPersonaLoading && (
								<ChartUsuarios
									firmaIntentosLabels={firmaIntentosLabels}
									firmaIntentosPayload={firmaIntentosPayload}
									firmaExitosLabels={firmaExitosLabels}
									firmaExitosPayload={firmaExitosPayload}
								/>
							)}
						</CardContent>
					</Card>
				</Box>

				<Box mt={3}>
					<Card>
						<CardContent>
							<TableDetalles
								loading={firmaPersonaLoading}
								labels={firmaExitosLabels}
								payload={firmaExitosPayload}
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
	},
	tabs: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper
	}
}));

function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`
	};
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

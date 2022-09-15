import React, { useState } from 'react';
import { Link, Link as RouterLink, useHistory, useParams } from 'react-router-dom';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Box, Grid, Card, CardContent, Typography, Radio, Divider, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import HeaderBreakcumbs from 'src/components/FormElements/headerBreakcumbs';
import { useDispatch, useSelector } from 'src/store';
import { useEffect } from 'react';
import { getClienteById } from 'src/slices/clientes';

const typeOptions = [
	{
		value: '1',
		title: 'Débito Cuenta Titular del Fondo',
		description: 'Cuenta corriente o de ahorros donde AFP Génesis tiene convenios',
		img: '/static/menus/1.svg',
		options: [
			{ title: 'Débito Cuenta Corriente Titular del Fondo', value: '1' },
			{ title: 'Débito Cuenta de ahorros Titular del Fondo', value: '4' }
		]
	},
	// {
	// 	value: '1',
	// 	title: 'Débito Cuenta Terceros',
	// 	description: 'Cuenta corriente o de ahorros donde AFP Génesis tiene convenios',
	// 	img: '/static/menus/1.svg',
	// 	options: [
	// 		{ title: 'Débito Cuenta Corriente Terceros', value: '1T' },
	// 		{ title: 'Débito Cuenta de Ahorros Terceros', value: '4T' }
	// 	]
	// },
	// {
	// 	value: '3',
	// 	title: 'Rol de Pagos',
	// 	description: 'Para aportes hechos por roles de pagos.Sólo bajo relación de dependencia',
	// 	img: '/static/menus/2.svg'
	// },
	{
		value: '5',
		title: 'Papeleta de depósito',
		description: 'Depositados unicamente en ventanillas de bancos registrados en papeletas. ',
		img: '/static/menus/3.svg'
	}
];

const ContributionSystem = ({}) => {
	const [ type, setType ] = useState([ typeOptions[1].value ]);

	const classesCard = useStylesCard();
	const classes = useStyles();

	const { primer_nombre, primer_apellido } = useSelector((state) => state.cliente.StepCharge);
	const { ConsultarData: cliente } = useSelector((state) => state.cliente);

	const history = useHistory();
	const dispatch = useDispatch();

	let { idCliente } = useParams();

	useEffect(() => {
		if (idCliente && idCliente != cliente.id) {
			dispatch(getClienteById(idCliente));
		}
	}, []);

	const handleSelection = (e, value) => {
		history.push('/afp/crm/oportunidad/crear/registroOportunidad/' + idCliente + '/largoPlazo/' + value);
	};

	return (
		<Page className={classes.root} title="Settings">
			<Box m={3}>
				<HeaderBreakcumbs
					onClickRoute1={() => history.goBack()}
					routename1="Mantenimiento de la oportunidad"
					routename2="Sistema de aportes"
					titlepageName={primer_nombre}
					titlepageLastName={primer_apellido}
				/>
			</Box>
			<Box m={3}>
				<Box mt={3}>
					<Grid container>
						<Grid item xs={12} md={12}>
							<Card>
								{typeOptions.map((data, index) => (
									<Box m={3}>
										<Card className={classesCard.card}>
											<img className={classesCard.figure} src={data.img} />
											<div className={classesCard.details}>
												<CardContent className={classesCard.content}>
													<FormControl component="fieldset">
														<RadioGroup
															aria-label="cod_sistema_aportes_catalogos"
															name="cod_sistema_aportes_catalogos"
														>
															{data.options ? (
																data.options.map((op) => (
																	<FormControlLabel
																		value={op.value}
																		control={
																			<Radio
																				checked={type === op.value}
																				onClick={(e) =>
																					handleSelection(e, op.value)}
																			/>
																		}
																		label={op.title}
																	/>
																))
															) : (
																<FormControlLabel
																	value={data.value}
																	control={
																		<Radio
																			checked={type === data.value}
																			onClick={(e) =>
																				handleSelection(e, data.value)}
																		/>
																	}
																	label={data.title}
																/>
															)}
														</RadioGroup>
													</FormControl>

													<Typography variant="subtitle1" color="textSecondary">
														<h4>{data.description}</h4>
													</Typography>
												</CardContent>
											</div>
										</Card>
										<Divider />
									</Box>
								))}
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Page>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	}
}));

const useStylesCard = makeStyles((theme) => ({
	card: {
		display: 'flex',
		borderRadius: '2pt',
		alignItems: 'center'
	},
	details: {
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	figure: {
		width: 120,
		height: 120,
		objectFit: 'cover',
		borderRadius: '2pt'
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	playIcon: {
		height: 38,
		width: 38
	}
}));

export default ContributionSystem;

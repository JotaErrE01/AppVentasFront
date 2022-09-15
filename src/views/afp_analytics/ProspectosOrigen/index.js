import React, { useEffect, useState } from 'react';

import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Link,
	Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/styles';
import { Alert } from '@material-ui/lab';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getProspectos } from 'src/slices/analytics';
import { useDispatch, useSelector } from 'react-redux';
import TableDetalles from './TableDetalles';
import Chart from './Chart';
import Form from './Form';
import dayjs from 'dayjs';

function PropestoOrigenView() {
	const classes = useStyles();

	const dispatch = useDispatch();

	const [ feIni, setFeIni ] = useState();
	const [ feFin, setfeFin ] = useState();

	const { prospectosLabels, prospectosPayload, prospectosLoading } = useSelector((state) => state.analytics);

	useEffect(
		() => {
			let fe_fin = dayjs();
			let fe_inicio = dayjs().subtract(6, 'month');
			dispatch(getProspectos(fe_inicio.format('YYYY-MM-DD'), fe_fin.format('YYYY-MM-DD')));

			setFeIni(fe_inicio.toDate());
			setfeFin(fe_fin.toDate());
		},
		[ dispatch ]
	);

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
						Prospectos por origen
					</Typography>
				</Breadcrumbs>
				<Box mt={3}>
					<Card>
						<CardContent>
							<Form
								fe_inicio={feIni}
								fe_fin={feFin}
								onChangeDates={({ fe_inicio, fe_fin }) => dispatch(getProspectos(fe_inicio, fe_fin))}
							/>
						</CardContent>
					</Card>
				</Box>

				<Box mt={3}>
					<Card>
						<CardContent>
							{!prospectosLoading && <Chart labels={prospectosLabels} payload={prospectosPayload} />}
						</CardContent>
					</Card>
				</Box>

				<Box mt={3}>
					<Card>
						<CardContent>
							<TableDetalles
								loading={prospectosLoading}
								labels={prospectosLabels}
								payload={prospectosPayload}
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

export default PropestoOrigenView;

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

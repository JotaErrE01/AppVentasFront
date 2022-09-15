import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs, Container, makeStyles, Typography, Link, Grid } from '@material-ui/core';
import Page from 'src/components/Page';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useSnackbar } from 'notistack';

import { useDispatch, useSelector } from 'src/store';
import { getNotifications, setAllNotiRead, setNotiRead } from 'src/slices/notification';
import NotiList from './NotiList';

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const BandejanotificationsView = () => {
	const { loading, notifications } = useSelector((state) => state.notifications);

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();
	const classes = useStyles();

	let query = useQuery();
	let idNotificacion = query.get('noti');

	

	useEffect(
		() => {
			dispatch(getNotifications());

			// if(idNotificacion) {

			// }
		},
		[ dispatch ]
	);

	return (
		<Page className={classes.root} title="notifications">
			<Container className={classes.bar} maxWidth="lg">
				<Grid container spacing={3} justify="space-between">
					<Grid item>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Link variant="body1" color="inherit" to="/app" component={RouterLink}>
								Notificaciones
							</Link>
							<Typography variant="body1" color="textPrimary">
								Bandeja de notificaciones
							</Typography>
						</Breadcrumbs>
					</Grid>
				</Grid>
			</Container>
			<Container className={classes.tableContainer} maxWidth="lg">
				<Grid container spacing={3} justify="space-between">
					<Grid item xs="12" md="4">
						<Typography variant="h3" color="textPrimary">
							Bandeja de notificaciones
						</Typography>
					</Grid>
					<Grid item xs="12" md="8">
						<NotiList
							loading={loading}
							notificaciones={notifications}
							selected={idNotificacion}
							onRead={(noti) => dispatch(setNotiRead(noti))}
							onAllRead={() => dispatch(setAllNotiRead())}
						/>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: 100
	},
	bar: {
		backgroundColor: 'white',
		paddingTop: '1rem',
		paddingBottom: '1rem'
	},
	addButton: {
		backgroundColor: '#000000',
		color: '#FFFFFF',
		paddingLeft: '1rem',
		paddingRight: '1rem',
		'&:hover': {
			backgroundColor: '#4a4a4a',
			color: '#FFFFFF'
		}
	},
	tableContainer: {
		padding: '2rem'
	}
}));

export default BandejanotificationsView;

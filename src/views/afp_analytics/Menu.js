import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ButtonBase, Card, CardContent, Link, makeStyles, SvgIcon, Typography } from '@material-ui/core';
import { useDispatch } from 'src/store';
import { actionRenderTabOnCreate } from 'src/slices/fondos';
import { getListarOportunidades, setCreateOportunity } from 'src/slices/clientes';
import useAuth from 'src/contextapi/hooks/useAuth';

import { getDeleteInformationWithRefuse, setOportunidad } from 'src/slices/clientes';

import { BarChart as BarChartIcon } from 'react-feather';
import ViewCarouselRoundedIcon from '@material-ui/icons/ViewCarouselRounded';


const Menu = () => {
	const dispatch = useDispatch();
	const classes = useStyles();

	var options = [
	
		{
			title: 'Contratos.',
			desription: 'Listado de contratos.',
			icon: 'oportunidad',
			route: '/afp/analytics/oportunidades',
			codigo: 'verOportunidad'
		},

		{
			title: 'Contratos firmados.',
			desription: 'Cuántos contratos han sido firmados.',
			icon: 'sharepoint',
			route: '/afp/analytics/firma',
			codigo: ''
		},
		{
			title: 'Embudo de ventas.',
			desription: '',
			icon: 'oportunidad',
			route: '/afp/analytics/inteciones',
			codigo: 'verOportunidad'
		},
		
		
		{
			title: 'Uso del registro civil.',
			desription: 'Detalle  y contabilización del uso de los servicios del registro civil.',
			icon: 'sharepoint',
			route: '/afp/analytics/registrocivil',
			codigo: ''
		},
	
		{
			title: 'Prospectos',
			desription: 'Mira el reporte de los prospectos por orígenes',
			icon: 'sharepoint',
			route: '/afp/analytics/prospectos',
			codigo: ''
		}
	];

	return options.map((item) => {
		return (
			<Card component={RouterLink} to={item.route} className={classes.card}>
				<MapIcon icon={item.icon} iconClass={classes.icon} />

				<div className={classes.details}>
					<CardContent className={classes.content}>
						<Typography component="h4" variant="h4">
							{item.title}
						</Typography>

						<Typography variant="subtitle1" color="textSecondary">
							{item.desription}
						</Typography>
					</CardContent>
				</div>
			</Card>
		);
	});
};

const MapIcon = ({ icon, iconClass }) => {
	switch (icon) {
		case 'users':
		// 	return <Users className={iconClass} size={72} />;
		// case 'oportunidad':
		// 	return <DollarSign className={iconClass} size={72} />;
		// case 'actividad':
		// 	return <UserCheck className={iconClass} size={72} />;
		// case 'sharepoint':
		// 	return <ViewCarouselRoundedIcon className={iconClass} style={{ fontSize: 90, margin: '.1em' }} />;

		default:
			return <BarChartIcon className={iconClass} size={72} />;
	}
};

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'flex',
		margin: '.9em 0',
		// borderRadius: '9pt',
		alignItems: 'center',
		pading: '.3em',
		display: 'flex',
		alignItems: 'center',
		textDecoration: 'none'
	},

	details: {
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	figure: {
		height: 120,
		objectFit: 'cover',
		borderRadius: '2pt'
	},
	icon: {
		margin: '.9em'
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


export default Menu;

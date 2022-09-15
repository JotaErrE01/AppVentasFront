import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { useDispatch } from 'src/store';
import { actionRenderTabOnCreate } from 'src/slices/fondos';
import { getListarOportunidades, setCreateOportunity } from 'src/slices/clientes';
import useAuth from 'src/contextapi/hooks/useAuth';

import { setOportunidad } from 'src/slices/clientes';

import { Users, Calendar, PhoneOutgoing } from 'react-feather'

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'flex',
		margin: '.6em 0',
		borderRadius: '9pt',
		alignItems: 'center',
        textDecoration:'none'
	},
	details: {
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	figure: {
		height: 24,
		objectFit: 'cover',
		borderRadius: '2pt'
	},
	icon: {
		margin:'.9em',
        color:theme.palette.primary.main
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},

}));

const ActividadOptions = ({option, setOption}) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const { user } = useAuth();

	useEffect(() => {
		dispatch(setOportunidad({}));
		// dispatch(getDeleteInformationWithRefuse({}));
	}, []);

	var options = [
			{
			title: 'Nuevo prospecto',
			desription: 'Registre un cliente',
			icon: 'persona',
			route: '/afp/prospecto/crear',
		},
        {
			title: 'Marcado rápido',
			desription: 'Atajo para llamar a un contacto',
			icon: 'speedDial',
			route: '/afp/actividad/crear/speeddial',
			codigo: ''
		},
	
		{
			title: 'Agendar',
			desription: 'Agendar una actividad',
			icon: 'agendar',
			route: '/afp/actividad/crear',
		},

	
	
	];

	const actionSelect = (option) => {
		dispatch(actionRenderTabOnCreate(option));
		dispatch(setCreateOportunity(true));
		if (option === 'verOportunidad') {
			dispatch(getListarOportunidades());
		}
	};



	return options.map((item) => {


		return (
			<Card
				component={RouterLink}
				to={item.route}
				onClick={() => actionSelect(item.codigo)}
				className={classes.card}
			>

				<MapIcon icon={item.icon} iconClass={classes.icon}/>


				<div className={classes.details}>
					<CardContent className={classes.content}>

						<Typography component="h5" variant="h5">
							{item.title}
						</Typography>

						<Typography variant="subtitle1" color="textSecondary">
							{item.desription}
						</Typography>
					</CardContent>
				</div>
			</Card>
		)

	}



	);
};


const MapIcon =({icon, iconClass})=> {
	switch(icon){
		case "agendar":  return  <Calendar className={iconClass} size={30}/>
		case "speedDial": return <PhoneOutgoing className={iconClass} size={30}/>
		case "persona": return <Users className={iconClass} size={30}/>

		default: return <Users className={iconClass} size={30}/>
	}
	
}

export default ActividadOptions;

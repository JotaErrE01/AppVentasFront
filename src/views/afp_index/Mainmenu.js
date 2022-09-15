import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ButtonBase, Card, CardContent, Link, makeStyles, SvgIcon, Typography } from '@material-ui/core';
import { useDispatch } from 'src/store';
import { actionRenderTabOnCreate } from 'src/slices/fondos';
import { getListarOportunidades, setCreateOportunity } from 'src/slices/clientes';
import useAuth from 'src/contextapi/hooks/useAuth';

import {  setOportunidad } from 'src/slices/clientes';


import { MapIcon, menuList } from 'src/layouts/SimpleLayout/IndexLateral';


const Mainmenu = () => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const { user } = useAuth();

	useEffect(() => {
		dispatch(setOportunidad({}));
		// dispatch(getDeleteInformationWithRefuse({}));
	}, []);



	const guards = user.permisos && user.permisos.map(item => item.guard);
	const guarded = 
	menuList
	.filter(item => item.icon !="home")
	.filter(item => guards.includes(item.guard));





	const actionSelect = (option) => {
		dispatch(actionRenderTabOnCreate(option));
		dispatch(setCreateOportunity(true));
		if (option === 'verOportunidad') {
			dispatch(getListarOportunidades());
		}
	};


	return (
		<div className={classes.listView}>
			{
				guarded.map((item) => {
					return (
						<ButtonBase
							key={item.id}
							component={RouterLink}
							to={item.route}
							onClick={() => actionSelect(item.codigo)}
							className={classes.card}
						>
							
							<div className={classes.iconView}>
								<MapIcon icon={item.icon} className={classes.icon} />
							</div>
							<CardContent className={classes.textView}>
								<Typography component="h4" variant="h4" className={classes.title}>
									{item.title}
								</Typography>
								{
									item.description &&
									<Typography variant="subtitle1" color="textSecondary" className={classes.subtitle}>
										{item.description}
									</Typography>
								}
							</CardContent>
						</ButtonBase>
					)
				}
				)
			}
		</div>
	)



};


const useStyles = makeStyles((theme) => ({
	listView: {
		display: 'flex',
		flexDirection: 'column',
		gap:'1em'
	},
	card: {
		textDecoration: 'none',
		boxShadow: 'none',
		display: 'flex',
		alignItems: 'center',
		borderRadius:"9pt",
		backgroundColor: theme.palette.bgs.light,
	},
	iconView: {
		flex:1,
		height:'6em',
		width:'100%',
		display:'flex',
		justifyContent:'center',
		alignItems:'center',
	},

	textView: {
		flex:9,
		width: '100%',
		height:'6em',
		display:'flex',
		flexDirection:'column',
		justifyContent:'center',
	},

	
	icon: {
		fontSize: '2.5em',
	},
}));


export default Mainmenu;

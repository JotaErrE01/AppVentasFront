import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
	Avatar,
	Checkbox,
	FormControlLabel,
	Grid,
	InputAdornment,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	Radio,
	SvgIcon,
	Typography
} from '@material-ui/core';
import Chart from './Chart';
import InputText from 'src/components/FormElements/InputText';
import { Filter as FilterIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		// maxWidth: '100%',
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
		overflow: 'auto',
		height: '60vh'
	},
	listSection: {
		backgroundColor: 'inherit'
	},
	ul: {
		backgroundColor: 'inherit',
		padding: 0
	}
}));

function ChartSalasUsuarios({ salas, efectividadLabels, efectividadPayload }) {
	const [ filter, setFilter ] = useState('');
	const [ salaSelected, setSalaSelected ] = useState();

	const classes = useStyles();
	// const usuarios = firmaExitosPayload.map((item) => item.nombre);

	return (
		<Grid container spacing={2}>
			<Grid item xs="12" md="4">
				<List className={classes.root} subheader={<li />}>
					<li key={`section-1`} className={classes.listSection}>
						<ul className={classes.ul}>
							<ListSubheader>
								<InputText
									type="text"
									label="Filtrar"
									fullWidth
									variant="standard"
									value={filter}
									onChange={(e) => setFilter(e.target.value)}
									endAdornment={
										<InputAdornment position="end">
											<SvgIcon fontSize="small" color="action">
												<FilterIcon />
											</SvgIcon>
										</InputAdornment>
									}
								/>
							</ListSubheader>
							{salas
								.filter(
									(sala) => sala.descripcion_sala.toUpperCase().indexOf(filter.toUpperCase()) != -1
								)
								.map((sala, index) => {
									return (
										<ListItem key={`item-1-${index}`} button>
											<ListItemAvatar>
												<Avatar>{sala.descripcion_sala[0]}</Avatar>
											</ListItemAvatar>
											<ListItemText id={index} primary={sala.descripcion_sala} />
											<ListItemSecondaryAction>
												<FormControlLabel
													// value={usuarioSelected == usuarios}
													onClick={() => setSalaSelected(sala.descripcion_sala)}
													checked={salaSelected == sala.descripcion_sala}
													control={<Radio color="primary" />}
													inputProps={{ 'aria-label': sala.descripcion_sala }}
													// label={sexo.contenido}
												/>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})}
						</ul>
					</li>
				</List>
			</Grid>
			<Grid item xs="12" md="8">
				{!salaSelected ? (
					<div style={{ display: 'flex', height: '100%' }}>
						<Typography style={{ margin: 'auto' }} align="center" gutterBottom variant="h6" component="h3">
							Selecciona una sala
						</Typography>
					</div>
				) : (
					salas.map((sala) => {
						let _efectividadPayload = efectividadPayload.filter((item) => {
							let usuarios = sala.users.map((user) => user.user_id);

							let index = usuarios.indexOf(item.user_id);

							return index != -1;
						});

						

						return salaSelected == sala.descripcion_sala ? (
							<Fragment>
								<Typography align="center" gutterBottom variant="h6" component="h3">
									{sala.descripcion_sala}
								</Typography>
								<Chart labels={efectividadLabels} payload={_efectividadPayload} />
							</Fragment>
						) : null;
					})
					// null
				)}
			</Grid>
		</Grid>
	);
}

ChartSalasUsuarios.propTypes = {};

export default ChartSalasUsuarios;

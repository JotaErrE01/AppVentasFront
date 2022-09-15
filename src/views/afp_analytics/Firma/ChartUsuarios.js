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

function ChartUsuarios({ firmaIntentosLabels, firmaIntentosPayload, firmaExitosLabels, firmaExitosPayload }) {
	const [ filter, setFilter ] = useState('');
	const [ usuarioSelected, setUsuarioSelected ] = useState();

	const classes = useStyles();
	const usuarios = firmaExitosPayload.map((item) => item.nombre);

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
							{usuarios
								.filter((usuario) => usuario.toUpperCase().indexOf(filter.toUpperCase()) != -1)
								.map((usuario, index) => {
									return (
										<ListItem key={`item-1-${index}`} button>
											<ListItemAvatar>
												<Avatar>{usuario[0]}</Avatar>
											</ListItemAvatar>
											<ListItemText id={index} primary={usuario} />
											<ListItemSecondaryAction>
												<FormControlLabel
													// value={usuarioSelected == usuarios}
													onClick={() => setUsuarioSelected(usuario)}
													checked={usuarioSelected == usuario}
													control={<Radio color="primary" />}
													inputProps={{ 'aria-label': usuario }}
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
				{!usuarioSelected ? (
					<div style={{ display: 'flex', height: '100%' }}>
						<Typography style={{ margin: 'auto' }} align="center" gutterBottom variant="h6" component="h3">
							Selecciona un usuario
						</Typography>
					</div>
				) : (
					usuarios.map((usuario) => {
						let _intento = firmaIntentosPayload.find((intento) => intento.nombre == usuario);
						_intento = { ..._intento, nombre: 'Envíos a firmar' };

						let _exito = firmaExitosPayload.find((exito) => exito.nombre == usuario);
						_exito = { ..._exito, nombre: 'Firmas exitosas' };

						let payload = [ _exito, _intento ];

						return usuarioSelected == usuario ? (
							<Fragment>
								<Typography align="center" gutterBottom variant="h6" component="h3">
									{usuario}
								</Typography>
								<Chart labels={firmaIntentosLabels} payload={payload} />
							</Fragment>
						) : null;
					})
				)}
			</Grid>
		</Grid>
	);
}

ChartUsuarios.propTypes = {};

export default ChartUsuarios;

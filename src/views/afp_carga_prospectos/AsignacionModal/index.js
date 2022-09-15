import React, { useState, useRef } from 'react';

import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	colors,
	TextField,
	withStyles,
	ListItemSecondaryAction,
	List,
	Grid,
	Divider
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { Autocomplete } from '@material-ui/lab';

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});



const AsignacionModal = ({ loading, subordinados, open, onClose, onAssign,

	fnAleatorio,
	fnManual
}) => {
	const classes = useStyles();

	const [usuarioSelected, setUsuarioSelected] = useState();


	let options = subordinados.map((item) => {
		return { text: item.name, value: item.id };
	});

	return (


		<Dialog
			fullWidth
			maxWidth="sm"
			open={open}
			onClose={onClose}
			scroll="paper"
			aria-labelledby="customized-dialog-title"
		// style={{ width: '80%', height: '80%', minHeight: '400px', margin: 'auto' }}
		>
			<DialogTitle id="customized-dialog-title" onClose={onClose}>
				Asignación de carga
			</DialogTitle>




			<DialogContent>

				<List>
					{/* <ListItem>
						<ListItemText >
							{fnAleatorio().title}
						</ListItemText>
						<ListItemSecondaryAction>
							<Button color="primary" onClick={() => fnAleatorio().trigger()}>
								{fnAleatorio().buttonText}
							</Button>
						</ListItemSecondaryAction>
					</ListItem>
					<Divider variant="inset" component="li" /> */}
					<ListItem>
						<ListItemText >
							{fnManual().title}
						</ListItemText>
					</ListItem>


					<ListItem>

						<Grid
							container
							direction="row"
							justify="space-around"
							alignItems="center"
							spacing={3}
						>
							<Grid item xs={8}>
								<Autocomplete
									value={usuarioSelected}
									getOptionLabel={(option) => option.text}
									options={options}
									onChange={(event, newValue) => {
										if (newValue) setUsuarioSelected(newValue.value);
									}}
									renderInput={(params) => (
										<TextField fullWidth label="Usuario" name="usuario" variant="outlined" {...params} />
									)}
								/>
							</Grid>
							<Grid item xs={4}>
								<Button
									disabled={!usuarioSelected}
									variant="contained"
									color="default"
									className={classes.button}
									disabled={loading}
									startIcon={<CloudUploadOutlined />}
									onClick={() => fnManual().trigger(usuarioSelected)}
								>
									Asignar
								</Button>
							</Grid>


						</Grid>

					</ListItem>




				</List>



				<br />
			</DialogContent>
			{loading && (
				<DialogActions>
					<CircularProgress size={30} />
				</DialogActions>
			)}
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(2),
		// textAlign: 'center',
		color: theme.palette.text.secondary
	},
	modalTitle: {
		display: 'flex',
		justifyContent: 'space-around',
		// alignItems: 'center'
	}
}));

export default AsignacionModal;

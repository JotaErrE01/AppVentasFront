import React from 'react';
import PropTypes from 'prop-types';
import {
	Box,
	Button,
	Dialog,
	Typography,
	makeStyles,
	Divider,
	DialogActions,
	DialogContent,
	CircularProgress,
	DialogTitle
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3)
	},
	helperText: {
		textAlign: 'right',
		marginRight: 0
	}
}));

const DeleteModal = ({ catalogo, className, onClose, open, onDelete, loading, ...rest }) => {
	const classes = useStyles();
	// const { enqueueSnackbar } = useSnackbar();

	return (
		<Dialog maxWidth="sm" fullWidth onClose={onClose} open={open} aria-labelledby="delete-catalogo-modal">
			<DialogTitle id="delete-catalogo-modal" onClose={onClose}>
				¿Estás seguro de eliminar el catálogo?
			</DialogTitle>
			<DialogContent dividers>
				<Box>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>CAT_ID:</strong> {catalogo.cat_id}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>CATÁLOGO:</strong> {catalogo.cat_descripcion}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>CÓDIGO:</strong> {catalogo.codigo}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>CONTENIDO:</strong> {catalogo.contenido}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>CONTENIDO_2:</strong> {catalogo.contenido_2}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>CONTENIDO_3:</strong> {catalogo.contenido_3}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>ORDEN:</strong> {catalogo.orden_estricto}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>ESTADO:</strong> {catalogo.estado}
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions>
				{!loading ? (
					<>
						<Button onClick={onClose}>No</Button>
						<Button
							variant="contained"
							autoFocus
							className={className.addButton}
							onClick={() => onDelete(catalogo.id)}
						>
							Estoy seguro
						</Button>
					</>
				) : (
					<CircularProgress />
				)}
			</DialogActions>
		</Dialog>
	);
};

DeleteModal.propTypes = {
	catalogo: PropTypes.bool,
	className: PropTypes.object,
	onClose: PropTypes.func,
	open: PropTypes.bool,
	onDelete: PropTypes.func,
	loading: PropTypes.bool
};

DeleteModal.defaultProps = {
	catalogo: {},
	onClose: () => {},
	open: false,
	onDelete: () => {},
	loading: false
};

export default DeleteModal;

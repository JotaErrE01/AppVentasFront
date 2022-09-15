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

const DeleteModal = ({ fase, className, onClose, open, onDelete, loading, ...rest }) => {
	const classes = useStyles();
	// const { enqueueSnackbar } = useSnackbar();

	return (
		<Dialog maxWidth="sm" fullWidth onClose={onClose} open={open} aria-labelledby="delete-fase-modal">
			<DialogTitle id="delete-fase-modal" onClose={onClose}>
				¿Estás seguro de eliminar la fase?
			</DialogTitle>
			<DialogContent dividers>
				<Box>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>CAT_ID:</strong> {fase.cat_id}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>NOMBRE:</strong> {fase.contenido}
					</Typography>
				</Box>
				<Divider />
				<Box mt={3}>
					<Typography variant="subtitle2" color="textSecondary">
						<strong>COLOR:</strong>
						&nbsp;
						<span style={{ color: fase.contenido_2 }}>{fase.contenido_2}</span>
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions>
				{!loading ? (
					<React.Fragment>
						<Button onClick={onClose}>No</Button>
						<Button
							variant="contained"
							autoFocus
							className={className.addButton}
							onClick={() => onDelete(fase.id)}
						>
							Estoy seguro
						</Button>
					</React.Fragment>
				) : (
					<CircularProgress />
				)}
			</DialogActions>
		</Dialog>
	);
};

DeleteModal.propTypes = {
	fase: PropTypes.bool,
	className: PropTypes.object,
	onClose: PropTypes.func,
	open: PropTypes.bool,
	onDelete: PropTypes.func,
	loading: PropTypes.bool
};

DeleteModal.defaultProps = {
	fase: {},
	onClose: () => {},
	open: false,
	onDelete: () => {},
	loading: false
};

export default DeleteModal;

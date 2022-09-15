import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Container, makeStyles, Typography, Link, Grid, Button, SvgIcon } from '@material-ui/core';
import Page from 'src/components/Page';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Plus as PlusIcon } from 'react-feather';
import { useSnackbar } from 'notistack';

import { useDispatch, useSelector } from 'src/store';
import CatalogoMaestroTable from './CatalogoMaestroTable';
import DeleteModal from './DeleteModal';
import {
	getCatalogosMaestros,
	createCatalogo,
	updateCatalogo,
	deleteCatalogo,
	setIsEditingForm,
	setEditingId,
	setDeletingId
} from 'src/slices/catalogosMaestros';

const CatalogoMaestroView = () => {
	const { catalogos, isEditingForm, loadingForm, loadingDelete, editingId, deletingId } = useSelector(
		(state) => state.catalogoMaestro
	);

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	useEffect(
		() => {
			try {
				dispatch(getCatalogosMaestros());
			} catch (err) {
				console.error(err);
			}
		},
		[ dispatch ]
	);

	const handlesSubmitCatalogo = (catalogo) => {
		if (!catalogo.id) {
			//CREAR
			dispatch(createCatalogo(catalogo, enqueueSnackbar));
		} else {
			//EDITAR
			dispatch(updateCatalogo(catalogo, enqueueSnackbar));
		}
	};

	const classes = useStyles();

	return (
		<Page className={classes.root} title="Catálogos Maestros">
			<Container className={classes.bar} maxWidth="lg">
				<Grid container spacing={3} justify="space-between">
					<Grid item>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Link variant="body1" color="inherit" to="/app" component={RouterLink}>
								Ventas
							</Link>
							<Typography variant="body1" color="textPrimary">
								Catálogos
							</Typography>
						</Breadcrumbs>
						<Typography variant="h3" color="textPrimary">
							Mantenimiento de catálogo maestros
						</Typography>
					</Grid>
					<Grid item>
						<Button
							className={classes.addButton}
							onClick={() => dispatch(setIsEditingForm(true))}
							endIcon={
								<SvgIcon fontSize="small">
									<PlusIcon />
								</SvgIcon>
							}
						>
							Añadir registro
						</Button>
					</Grid>
				</Grid>
			</Container>
			<Container className={classes.tableContainer} maxWidth="lg">
				<CatalogoMaestroTable
					catalogos={catalogos}
					onSubmit={handlesSubmitCatalogo}
					editing={isEditingForm}
					onCancelEditing={() => dispatch(setIsEditingForm(false))}
					isLoading={loadingForm}
					editingId={editingId}
					onSelectRowToEdit={(id) => dispatch(setEditingId(id))}
					onSelectRowToDelete={(id) => dispatch(setDeletingId(id))}
				/>
			</Container>
			{deletingId && (
				<DeleteModal
					catalogo={catalogos.find((cat) => cat.id == deletingId)}
					onClose={() => dispatch(setDeletingId(null))}
					open={Boolean(deletingId)}
					className={classes}
					onDelete={(id) => dispatch(deleteCatalogo(id, enqueueSnackbar))}
					loading={loadingDelete}
				/>
			)}
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

export default CatalogoMaestroView;

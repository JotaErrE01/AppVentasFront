import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Container, makeStyles, Typography, Link, Grid, Button, SvgIcon } from '@material-ui/core';
import Page from 'src/components/Page';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Plus as PlusIcon } from 'react-feather';
import { useSnackbar } from 'notistack';

import { useDispatch, useSelector } from 'src/store';
import MotivoTable from './Motivos/MotivoTable';
import DeleteModal from './DeleteModal';
import {
	getMotivosCatalogo,
	createMotivosCatalogo,
	updateMotivosCatalogo,
	deleteMotivosCatalogo,
	setIsEditingForm as setIsEditingMotivo,
	setEditingId as setEditingMotivoId,
	setDeletingId as setDeletingMotivoId
} from 'src/slices/motivos';

import {
	getActividadesCatalogo,
	createActividadesCatalogo,
	updateActividadesCatalogo,
	deleteActividadesCatalogo,
	setIsEditingForm as setIsEditingActividad,
	setEditingId as setEditingActividadId,
	setDeletingId as setDeletingActividadId
} from 'src/slices/actividades';
import ActividadTable from './Actividades/ActividadTable';

const CatalogoMaestroView = () => {
	const {
		motivos,
		isEditingForm: isEditingMotivoForm,
		loadingForm: loadingMotivoForm,
		loadingDelete: loadingMotivoDelete,
		editingId: editingMotivoId,
		deletingId: deletingMotivoId
	} = useSelector((state) => state.motivos);

	const {
		actividades,
		isEditingForm: isEditingActividadForm,
		loadingForm: loadingActividadForm,
		loadingDelete: loadingActividadDelete,
		editingId: editingActividadId,
		deletingId: deletingActividadId
	} = useSelector((state) => state.actividades);

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	useEffect(
		() => {
			try {
				dispatch(getMotivosCatalogo());
				dispatch(getActividadesCatalogo());
			} catch (err) {
				console.error(err);
			}
		},
		[ dispatch ]
	);

	const handlesSubmitMotivo = (motivo) => {
		if (!motivo.id) {
			//CREAR
			dispatch(createMotivosCatalogo(motivo, enqueueSnackbar));
		} else {
			//EDITAR
			dispatch(updateMotivosCatalogo(motivo, enqueueSnackbar));
		}
	};

	const handlesSubmitActividad = (actividad) => {
		if (!actividad.id) {
			//CREAR
			dispatch(createActividadesCatalogo(actividad, enqueueSnackbar));
		} else {
			//EDITAR
			dispatch(updateActividadesCatalogo(actividad, enqueueSnackbar));
		}
	};

	const classes = useStyles();

	return (
		<Page className={classes.root} title="Catálogos">
			<Container className={classes.bar} maxWidth="lg">
				<Grid container spacing={3} justify="space-between">
					<Grid item>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Link variant="body1" color="inherit" to="/app" component={RouterLink}>
								Ventas
							</Link>
							<Typography variant="body1" color="textPrimary">
								Configuración
							</Typography>
						</Breadcrumbs>
						<Typography variant="h3" color="textPrimary">
							Mantenimiento de motivos y acciones
						</Typography>
					</Grid>
				</Grid>
			</Container>
			<Container className={classes.tableContainer} maxWidth="lg">
				<Container className={classes.apartado}>
					<Grid container spacing={3} justify="space-between">
						<Grid item>
							<Typography variant="h2" color="textPrimary">
								Motivos
							</Typography>
						</Grid>
						<Grid item>
							<Button
								className={classes.addButton}
								onClick={() => dispatch(setIsEditingMotivo(true))}
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
				<MotivoTable
					motivos={motivos}
					onSubmit={handlesSubmitMotivo}
					editing={isEditingMotivoForm}
					onCancelEditing={() => dispatch(setIsEditingMotivo(false))}
					isLoading={loadingMotivoForm}
					editingId={editingMotivoId}
					onSelectRowToEdit={(id) => dispatch(setEditingMotivoId(id))}
					onSelectRowToDelete={(id) => dispatch(setDeletingMotivoId(id))}
				/>
			</Container>
			<Container className={classes.tableContainer} maxWidth="lg">
				<Container className={classes.apartado}>
					<Grid container spacing={3} justify="space-between">
						<Grid item>
							<Typography variant="h2" color="textPrimary">
								Actividades
							</Typography>
						</Grid>
						<Grid item>
							<Button
								className={classes.addButton}
								onClick={() => dispatch(setIsEditingActividad(true))}
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
				<ActividadTable
					actividades={actividades}
					onSubmit={handlesSubmitActividad}
					editing={isEditingActividadForm}
					onCancelEditing={() => dispatch(setIsEditingMotivo(false))}
					isLoading={loadingActividadForm}
					editingId={editingActividadId}
					onSelectRowToEdit={(id) => dispatch(setEditingActividadId(id))}
					onSelectRowToDelete={(id) => dispatch(setDeletingActividadId(id))}
				/>
			</Container>
			{deletingMotivoId && (
				<DeleteModal
					catalogo={motivos.find((cat) => cat.id == deletingMotivoId)}
					onClose={() => dispatch(setDeletingMotivoId(null))}
					open={Boolean(deletingMotivoId)}
					className={classes}
					onDelete={(id) => dispatch(deleteMotivosCatalogo(id, enqueueSnackbar))}
					loading={loadingMotivoDelete}
				/>
			)}
			{deletingActividadId && (
				<DeleteModal
					catalogo={actividades.find((cat) => cat.id == deletingActividadId)}
					onClose={() => dispatch(setDeletingActividadId(null))}
					open={Boolean(deletingActividadId)}
					className={classes}
					onDelete={(id) => dispatch(deleteActividadesCatalogo(id, enqueueSnackbar))}
					loading={loadingActividadDelete}
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
	apartado: {
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

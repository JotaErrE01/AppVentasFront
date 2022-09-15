import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
	Breadcrumbs,
	Container,
	makeStyles,
	Typography,
	Link,
	Grid,
	Button,
	SvgIcon,
	Card,
	CardHeader,
	IconButton,
	TextField,
	Menu,
	MenuItem
} from '@material-ui/core';
import Page from 'src/components/Page';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Plus as PlusIcon, MoreVertical as MoreIcon, Check as CheckIcon, X as CloseIcon } from 'react-feather';
import { useSnackbar } from 'notistack';

import { useDispatch, useSelector } from 'src/store';
// import CatalogoMaestroTable from './CatalogoMaestroTable';
// import DeleteModal from './DeleteModal';
import { SketchPicker } from 'react-color';
import {
	// getCatalogosMaestros,
	createFaseCatalogo,
	updateFaseCatalogo,
	getFases,
	deleteFaseCatalogo,
	setIsEditingForm,
	setEditingId,
	setDeletingId
} from 'src/slices/faseEmbudo';
import EditForm from './EditForm';
import DeleteModal from './DeleteModal';

const EmbudoVentasView = () => {
	const [ idSelectedMenu, setIdeSelectedMenu ] = useState(null);
	const [ anchorEl, setAnchorEl ] = useState(null);
	const { fases, isEditingForm, loadingForm, loadingDelete, editingId, deletingId } = useSelector(
		(state) => state.fasesEmbudo
	);

	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	useEffect(
		() => {
			try {
				dispatch(getFases());
			} catch (err) {
				console.error(err);
			}
		},
		[ dispatch ]
	);

	const handleSubmitFase = (fase) => {
		if (!fase.id) {
			//CREAR
			dispatch(createFaseCatalogo(fase, enqueueSnackbar));
		} else {
			//EDITAR
			dispatch(updateFaseCatalogo(fase, enqueueSnackbar, setIdeSelectedMenu));
		}
	};

	const handleClick = (event, id) => {
		setIdeSelectedMenu(id);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
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
							Catálogo de fases del embudo de ventas
						</Typography>
					</Grid>
				</Grid>
			</Container>
			<Container className={classes.tableContainer} maxWidth="lg">
				<Grid container spacing={3}>
					{isEditingForm && (
						<Grid item>
							<EditForm
								classes={classes}
								onCancelEditing={() => dispatch(setIsEditingForm(false))}
								onSubmit={handleSubmitFase}
								isLoading={loadingForm}
							/>
						</Grid>
					)}
					<Grid item>
						<Card className={classes.cardFase}>
							<CardHeader
								className={classes.cardFaseHeader}
								style={{ borderTop: '5px solid #3D4852' }}
								action={
									<IconButton aria-label="settings">
										<PlusIcon />
									</IconButton>
								}
								title="Nueva fase"
								onClick={() => dispatch(setIsEditingForm(true))}
							/>
						</Card>
					</Grid>
					<Grid container item xs={isEditingForm ? 6 : 9} spacing={3}>
						{fases.map((fase) => {
							let isEditingRow = fase.id == editingId;

							if (isEditingRow) {
								return (
									<Grid key={fase.id} item>
										<EditForm
											classes={classes}
											initData={fase}
											onCancelEditing={() => {
												setIdeSelectedMenu(null);
												dispatch(setEditingId(null));
											}}
											onSubmit={handleSubmitFase}
											isLoading={loadingForm}
										/>
									</Grid>
								);
							} else {
								return (
									<Grid key={fase.id} item>
										<Card className={classes.cardFase}>
											<CardHeader
												className={classes.cardFaseHeader}
												style={{ borderTop: '5px solid ' + fase.contenido_2 }}
												action={
													<div>
														<IconButton
															aria-label="settings"
															aria-controls="simple-menu"
															aria-haspopup="true"
															onClick={(event) => handleClick(event, fase.id)}
														>
															<MoreIcon />
														</IconButton>
														{idSelectedMenu == fase.id && (
															<Menu
																id="simple-menu"
																anchorEl={anchorEl}
																keepMounted
																open={Boolean(anchorEl)}
																onClose={handleClose}
															>
																<MenuItem
																	onClick={() => dispatch(setEditingId(fase.id))}
																>
																	Editar
																</MenuItem>
																<MenuItem
																	onClick={() => dispatch(setDeletingId(fase.id))}
																>
																	Eliminar
																</MenuItem>
															</Menu>
														)}
													</div>
												}
												title={fase.contenido}
												// onClick={() => dispatch(setIsEditingForm(true))}
											/>
										</Card>
									</Grid>
								);
							}
						})}
					</Grid>
				</Grid>
			</Container>
			{deletingId && (
				<DeleteModal
					fase={fases.find((fase) => fase.id == deletingId)}
					onClose={() => dispatch(setDeletingId(null))}
					open={Boolean(deletingId)}
					className={classes}
					onDelete={(id) => dispatch(deleteFaseCatalogo(id, enqueueSnackbar))}
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
	tableContainer: {
		padding: '1.5rem'
	},
	cardFase: {
		width: '15rem',
		MozBorderRadius: '0px',
		WebkitBorderRadius: '10px 10px 0px 0px',
		borderRadius: '10px 10px 0px 0px'
	},
	cardFaseHeader: {
		padding: '10px'
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
	}
}));

export default EmbudoVentasView;

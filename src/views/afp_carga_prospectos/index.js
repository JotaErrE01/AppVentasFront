import React, { useEffect, useState } from 'react';

import {
	Container, Breadcrumbs, Button, Grid, Link, Typography, makeStyles, Paper, Box
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Page from 'src/components/Page';

import Buttons from 'src/components/common/Buttons';

import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import UploadModal from './UploadModal';
import useAuth from 'src/contextapi/hooks/useAuth';
import { getProspectosCarga, storeAsignacionSuffle, updateProspectoField, uploadProspectosFile } from 'src/slices/prospecto';
import ProspectosCargaGrid from './ProspectosCargaGrid';
import AsignacionModal from './AsignacionModal';
import { getSubordinados } from 'src/slices/usuario';

import dayjs from 'dayjs';
import Nowloading from 'src/components/common/Nowloading';
import { DeleteRounded, PersonPinRounded } from '@material-ui/icons';
import { getCatalogosByMaestro } from 'src/slices/catalogos';


const CargaProspectosView = () => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const { user } = useAuth();
	const [openModal, setOpenModal] = useState(false);


	//:: INIT FETCH
	useEffect(
		() => {
			const { tipo_venta_asesor } = user;

			const maestro =
				tipo_venta_asesor == 1 ? '_OPH'
					: tipo_venta_asesor == 2 ? '_OPI'
						: tipo_venta_asesor == 0 && '_OPI';
			dispatch(getCatalogosByMaestro(maestro));
			dispatch(getProspectosCarga());
		},
		[dispatch]
	);

	const dispatch = useDispatch();





	const splitToChunks = (array, parts) => {
		let result = [];
		for (let i = parts; i > 0; i--) {
			result.push(array.splice(0, Math.ceil(array.length / i)));
		}
		return result;
	}
	function shuffle(array) {
		var currentIndex = array.length, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}

		return array;
	}




	//:: EDIT POSPECTO FIELD
	const onEditCellChangeCommitted = (event, target) => {
		const { id, field, props } = event;
		const { value } = props;
		const payload = {
			idProspecto: id,
			[field]: value
		};
		dispatch(updateProspectoField(payload));
	}

	//STORE
	const { uploadingCarga, loadingCarga, cargaArr, updatingProspectoField, updatingProspectoFieldResult } = useSelector((state) => state.prospecto);

	const { catalogos: origenes } = useSelector((state) => state.catalogo);



	const uploadFile = (fileToSend) => {
		const onSuccess = (data) => {
			setOpenModal(false);
			enqueueSnackbar(data.mensaje, { variant: 'success' });
			dispatch(getProspectosCarga());
		};
		const onError = () => { };
		dispatch(uploadProspectosFile(fileToSend, onSuccess, onError));
	};




	return (
		<>
			<Page className={classes.root} title="Prospectos | Carga">
				{openModal && (
					<UploadModal
						origenes={origenes}

						loading={uploadingCarga}
						open={openModal}
						onClose={() => setOpenModal(false)}
						uploadFile={uploadFile}
					/>
				)}



				<>


					<Container maxWidth="xl">
						<Grid container spacing={3} justify="space-between" >
							<Grid item>
								<Typography variant="h3" color="textPrimary">
									Prospectos
								</Typography>
								<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
									<Link variant="body1" color="inherit" to="/afp/ventas" component={RouterLink}>
										Ventas
									</Link>
									<Link variant="body1" color="inherit" to="/afp/prospecto" component={RouterLink}>
										Carga de prospectos
									</Link>
								</Breadcrumbs>
							</Grid>

							<Grid item>
								<Grid container spacing={2}>
									<Grid item>
										<Button color="secondary" variant="contained" onClick={() => setOpenModal(true)}>
											Subir archivo
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Container>



					{
						loadingCarga ? <Nowloading /> :
							cargaArr.map(item => {


								const { prospectos, id } = item;


								const {
									carga_count,
									updated_count,
									created_count,
									bloqueos_count,
									intenciones_count,
									bloqueos,
								} = item || [];







								const created_at = dayjs(item.created_at).format('YYYY/MM/DD - HH:mm');
								return (


									<Box mt={3} key={id}>


										<Paper className={classes.paper}>
											<ProspectosCargaGrid
												title={created_at}
												data={prospectos}
												onEditCellChangeCommitted={onEditCellChangeCommitted}
												log={{carga_count,
													updated_count,
													created_count,
													bloqueos_count,
													intenciones_count,
													bloqueos}}
											/>




										</Paper>

									</Box>
								)
							}
							)
					}


				</>
			</Page>



		</>
	);
};

export default CargaProspectosView;

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.dark,
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3)
	},

	paper: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3)
	},
	editButtons: {
		height: '1.8em'
	}
}));
